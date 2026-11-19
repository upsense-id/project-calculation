/* =========================================================
   PDF generator client-side, tanpa library eksternal.
   Layout mengikuti template Project Estimation UPSENSE.
   ========================================================= */
(function () {
    'use strict';

    var PAGE_W = 595.28;
    var PAGE_H = 841.89;
    var MARGIN = 40.0;
    var CONTENT_RIGHT = 555.28;
    var CONTENT_WIDTH = 515.28;
    var COL_RESOURCE = 246.0;
    var COL_QTY = 307.0;
    var COL_DURATION = 368.0;
    var HEADER_HEIGHT = 22.4;
    var ROW_HEIGHT = 21.0;
    var FOOTER_BASELINE = 789.0;

    var HELVETICA = {
        ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556, '%': 889, '&': 667, "'": 191,
        '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
        '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556,
        '8': 556, '9': 556, ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556,
        '@': 1015, 'A': 667, 'B': 667, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
        'H': 722, 'I': 278, 'J': 500, 'K': 667, 'L': 556, 'M': 833, 'N': 722, 'O': 778,
        'P': 667, 'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944,
        'X': 667, 'Y': 667, 'Z': 611, '[': 278, '\\': 278, ']': 278, '^': 469, '_': 556,
        '`': 333, 'a': 556, 'b': 556, 'c': 500, 'd': 556, 'e': 556, 'f': 278, 'g': 556,
        'h': 556, 'i': 222, 'j': 222, 'k': 500, 'l': 222, 'm': 833, 'n': 556, 'o': 556,
        'p': 556, 'q': 556, 'r': 333, 's': 500, 't': 278, 'u': 556, 'v': 500, 'w': 722,
        'x': 500, 'y': 500, 'z': 500, '{': 334, '|': 260, '}': 334, '~': 584
    };

    var HELVETICA_BOLD = {
        ' ': 278, '!': 333, '"': 474, '#': 556, '$': 556, '%': 889, '&': 722, "'": 238,
        '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
        '0': 556, '1': 556, '2': 556, '3': 556, '4': 556, '5': 556, '6': 556, '7': 556,
        '8': 556, '9': 556, ':': 333, ';': 333, '<': 584, '=': 584, '>': 584, '?': 611,
        '@': 975, 'A': 722, 'B': 722, 'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
        'H': 722, 'I': 278, 'J': 556, 'K': 722, 'L': 611, 'M': 833, 'N': 722, 'O': 778,
        'P': 667, 'Q': 778, 'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667, 'W': 944,
        'X': 667, 'Y': 667, 'Z': 611, '[': 333, '\\': 278, ']': 333, '^': 584, '_': 556,
        '`': 333, 'a': 556, 'b': 611, 'c': 556, 'd': 611, 'e': 556, 'f': 333, 'g': 611,
        'h': 611, 'i': 278, 'j': 278, 'k': 556, 'l': 278, 'm': 889, 'n': 611, 'o': 611,
        'p': 611, 'q': 611, 'r': 389, 's': 556, 't': 333, 'u': 611, 'v': 556, 'w': 778,
        'x': 556, 'y': 556, 'z': 500, '{': 389, '|': 280, '}': 389, '~': 584
    };

    var WIN_ANSI_MAP = {
        '\u20ac': '\x80', '\u201a': '\x82', '\u0192': '\x83', '\u201e': '\x84',
        '\u2026': '\x85', '\u2020': '\x86', '\u2021': '\x87', '\u02c6': '\x88',
        '\u2030': '\x89', '\u0160': '\x8a', '\u2039': '\x8b', '\u0152': '\x8c',
        '\u017d': '\x8e', '\u2018': '\x91', '\u2019': '\x92', '\u201c': '\x93',
        '\u201d': '\x94', '\u2022': '\x95', '\u2013': '\x96', '\u2014': '\x97',
        '\u02dc': '\x98', '\u2122': '\x99', '\u0161': '\x9a', '\u203a': '\x9b',
        '\u0153': '\x9c', '\u017e': '\x9e', '\u0178': '\x9f'
    };

    function toWinAnsi(value) {
        var text = String(value === null || value === undefined ? '' : value);
        var result = '';
        var chars = Array.from(text);
        for (var i = 0; i < chars.length; i += 1) {
            var ch = chars[i];
            var code = ch.charCodeAt(0);
            if (code < 128 || (code >= 160 && code <= 255)) {
                result += ch;
            } else if (WIN_ANSI_MAP[ch] !== undefined) {
                result += WIN_ANSI_MAP[ch];
            } else {
                result += '?';
            }
        }
        return result;
    }

    function escapeText(value) {
        return toWinAnsi(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
            .replace(/\r/g, ' ').replace(/\n/g, ' ');
    }

    function widthOf(value, size, bold) {
        var text = toWinAnsi(value);
        var metrics = bold ? HELVETICA_BOLD : HELVETICA;
        var units = 0;
        for (var i = 0; i < text.length; i += 1) {
            units += metrics[text[i]] || 500;
        }
        return units * size / 1000;
    }

    function fitSize(value, maxWidth, startSize, minSize, bold) {
        var size = startSize;
        while (size > minSize && widthOf(value, size, bold) > maxWidth) {
            size -= 0.2;
        }
        return size;
    }

    function wrapText(value, maxWidth, size, bold) {
        var text = String(value === null || value === undefined ? '' : value).replace(/\s+/g, ' ').trim();
        if (text === '') {
            return [''];
        }
        if (widthOf(text, size, bold) <= maxWidth) {
            return [text];
        }

        var words = text.split(' ');
        var lines = [];
        var current = '';

        words.forEach(function (word) {
            var candidate = current === '' ? word : current + ' ' + word;
            if (widthOf(candidate, size, bold) <= maxWidth) {
                current = candidate;
                return;
            }

            if (current !== '') {
                lines.push(current);
                current = '';
            }

            if (widthOf(word, size, bold) > maxWidth) {
                lines.push(cutToWidth(word, maxWidth, size, bold));
            } else {
                current = word;
            }
        });

        if (current !== '') {
            lines.push(current);
        }

        return lines.length ? lines : [''];
    }

    function cutToWidth(value, maxWidth, size, bold) {
        var characters = Array.from(String(value));
        var result = '';
        for (var i = 0; i < characters.length; i += 1) {
            var candidate = result + characters[i];
            if (widthOf(candidate, size, bold) > maxWidth) {
                break;
            }
            result = candidate;
        }
        return result;
    }

    function truncateText(value, maxWidth, size, bold) {
        if (widthOf(value, size, bold) <= maxWidth) {
            return String(value);
        }
        var ellipsis = '...';
        var available = maxWidth - widthOf(ellipsis, size, bold);
        return cutToWidth(value, Math.max(0, available), size, bold) + ellipsis;
    }

    function formatRp(value) {
        var number = Number(value) || 0;
        try {
            return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(number));
        } catch (error) {
            return 'Rp ' + Math.round(number);
        }
    }

    function pdfNumber(value) {
        var formatted = (Number(value) || 0).toFixed(2);
        return formatted.replace(/0+$/, '').replace(/\.$/, '') || '0';
    }

    function durationLabel(value) {
        var number = Number(value) || 0;
        return pdfNumber(number) + ' ' + (number === 1 ? 'Day' : 'Days');
    }

    function itemDurationLabel(value) {
        return (Number(value) || 0) > 0 ? durationLabel(value) : '-';
    }

    function formatDateId(value) {
        var text = String(value || '');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            return text || '-';
        }
        var parts = text.split('-');
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function num(value) {
        var formatted = (Number(value) || 0).toFixed(2);
        return formatted.replace(/0+$/, '').replace(/\.$/, '') || '0';
    }

    function textBytes(value) {
        var encoded = toWinAnsi(value);
        var bytes = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i += 1) {
            bytes[i] = encoded.charCodeAt(i) & 0xff;
        }
        return bytes;
    }

    function rawBytes(value) {
        var text = String(value);
        var bytes = new Uint8Array(text.length);
        for (var i = 0; i < text.length; i += 1) {
            bytes[i] = text.charCodeAt(i) & 0xff;
        }
        return bytes;
    }

    function concatBytes(chunks) {
        var total = 0;
        chunks.forEach(function (chunk) {
            total += chunk.length;
        });
        var output = new Uint8Array(total);
        var offset = 0;
        chunks.forEach(function (chunk) {
            output.set(chunk, offset);
            offset += chunk.length;
        });
        return output;
    }

    function base64Bytes(base64) {
        var binary = window.atob(base64);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i += 1) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    function loadImage(source) {
        return new Promise(function (resolve, reject) {
            var image = new window.Image();
            image.onload = function () {
                resolve(image);
            };
            image.onerror = function () {
                reject(new Error('Logo tidak dapat dimuat: ' + source));
            };
            image.src = source;
        });
    }

    function calculateTotals(estimate, settings) {
        var subtotal = 0;
        var mandays = 0;
        var resource = 0;
        var longest = 0;
        var items = [];

        (estimate.items || []).forEach(function (item) {
            var qty = Math.max(0, Number(item.qty) || 0);
            var duration = Math.max(0, Number(item.duration) || 0);
            var rate = Math.max(0, Number(item.rate) || 0);
            var hasDuration = duration > 0;
            // Item tanpa durasi (lisensi/software/token) dihitung qty x rate.
            var itemTotal = Math.round(qty * rate * (hasDuration ? duration : 1));

            items.push({
                name: String(item.name || ''),
                qty: qty,
                duration: duration,
                rate: rate,
                subtotal: itemTotal
            });

            subtotal += itemTotal;
            if (hasDuration) {
                mandays += qty * duration;
                resource += qty;
                longest = Math.max(longest, duration);
            }
        });

        var discountPct = Math.max(0, Math.min(100, Number(estimate.discount_pct) || 0));
        var discount = Math.round(subtotal * discountPct / 100);
        var monthDays = Math.max(1, parseInt(settings.month_days, 10) || 22);

        return {
            items: items,
            subtotal: subtotal,
            discountPct: discountPct,
            discount: discount,
            grandTotal: subtotal - discount,
            mandays: mandays,
            resource: resource,
            longest: longest,
            month: longest / monthDays
        };
    }

    function PdfDoc(settings, estimate) {
        this.settings = settings || {};
        this.estimate = estimate || {};
        this.totals = calculateTotals(this.estimate, this.settings);
        this.pages = [];
        this.ops = '';
        this.y = 0;
        this.logoJpeg = null;
        this.logoPixelWidth = 0;
        this.logoPixelHeight = 0;
    }

    PdfDoc.prototype.loadLogo = async function () {
        var source = String(this.settings.logo || 'assets/logo.png');
        try {
            var image = await loadImage(source);
            var targetWidth = 240;
            var targetHeight = Math.max(1, Math.round(targetWidth * image.naturalHeight / Math.max(1, image.naturalWidth)));
            var canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            var context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, targetWidth, targetHeight);
            context.drawImage(image, 0, 0, targetWidth, targetHeight);
            var dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            this.logoJpeg = base64Bytes(dataUrl.split(',')[1]);
            this.logoPixelWidth = targetWidth;
            this.logoPixelHeight = targetHeight;
        } catch (error) {
            console.warn(error.message);
            this.logoJpeg = null;
        }
    };

    PdfDoc.prototype.render = function () {
        this.newPage(true);
        var tableTop = this.drawSubjectBlock();
        this.drawTable(tableTop);
        this.drawTotalsAndSignature();
        this.flushPage();
        this.appendFooters();
        return this.serialize();
    };

    PdfDoc.prototype.newPage = function (first) {
        if (this.ops !== '') {
            this.pages.push(this.ops);
            this.ops = '';
        }
        if (first) {
            this.drawFirstHeader();
        } else {
            this.drawContinuationHeader();
        }
    };

    PdfDoc.prototype.drawFirstHeader = function () {
        if (this.logoJpeg) {
            var displayWidth = 55.0;
            var displayHeight = displayWidth * this.logoPixelHeight / Math.max(1, this.logoPixelWidth);
            this.drawImage(MARGIN, 37.0, displayWidth, displayHeight);
        } else {
            this.fillRect(MARGIN, 38.0, 48.0, 48.0, '0.04 0.29 0.55');
            this.text(MARGIN + 15.0, 68.0, 'U', 25.0, true, '1 1 1');
        }

        var company = String(this.settings.company_name || '');
        var companySize = fitSize(company, 292.0, 12.6, 9.4, true);
        this.text(118.0, 51.5, company, companySize, true, '0 0 0');

        var addressLines = String(this.settings.company_address || '').split(/\r?\n/)
            .map(function (line) { return line.trim(); })
            .filter(function (line) { return line !== ''; });

        var contact = [];
        if (String(this.settings.company_phone || '').trim() !== '') {
            contact.push('Telpon: ' + String(this.settings.company_phone).trim());
        }
        if (String(this.settings.company_email || '').trim() !== '') {
            contact.push('Email: ' + String(this.settings.company_email).trim());
        }
        if (contact.length) {
            addressLines.push(contact.join(' | '));
        }

        var wrappedAddress = [];
        addressLines.forEach(function (line) {
            wrapText(line, 292.0, 7.8, false).forEach(function (wrapped) {
                wrappedAddress.push(wrapped);
            });
        });
        wrappedAddress = wrappedAddress.slice(0, 4);

        var addressBaseline = 62.0;
        wrappedAddress.forEach(function (line) {
            this.text(118.0, addressBaseline, line, 7.8, false, '0.12 0.12 0.12');
            addressBaseline += 9.2;
        }, this);

        var title = String(this.settings.document_title || 'PROJECT ESTIMATION');
        var titleSize = fitSize(title, 136.0, 11.0, 8.4, true);
        var metaRight = CONTENT_RIGHT - 13.0;
        this.textRight(metaRight, 50.0, title, titleSize, true, '0 0 0');
        this.textRight(metaRight, 64.0, 'Estimation Date: ' + formatDateId(this.estimate.date), 8.2, false, '0 0 0');
        this.textRight(metaRight, 75.0, 'No. Ref: ' + String(this.estimate.ref || '-'), 8.2, false, '0 0 0');

        this.line(MARGIN, 105.0, CONTENT_RIGHT, 105.0, 0.9, '0 0 0');
    };

    PdfDoc.prototype.drawContinuationHeader = function () {
        var company = String(this.settings.company_name || '');
        this.text(MARGIN, 42.0, truncateText(company, 340.0, 9.4, true), 9.4, true, '0 0 0');
        this.textRight(
            CONTENT_RIGHT,
            42.0,
            String(this.settings.document_title || 'PROJECT ESTIMATION') + ' (lanjutan)',
            8.6,
            true,
            '0 0 0'
        );
        this.line(MARGIN, 51.0, CONTENT_RIGHT, 51.0, 0.6, '0.45 0.45 0.45');
        this.y = 70.0;
    };

    PdfDoc.prototype.drawSubjectBlock = function () {
        var subject = 'Subject: ' + String(this.estimate.subject || '-');
        var subjectSize = 11.2;
        var subjectLines = wrapText(subject, CONTENT_WIDTH, subjectSize, true);
        if (subjectLines.length > 2) {
            subjectSize = 10.4;
            subjectLines = wrapText(subject, CONTENT_WIDTH, subjectSize, true);
        }
        if (subjectLines.length > 3) {
            subjectLines = subjectLines.slice(0, 3);
        }

        var baseline = 128.0;
        subjectLines.forEach(function (line, index) {
            this.text(MARGIN, baseline + index * 14.0, line, subjectSize, true, '0 0 0');
        }, this);
        var afterSubject = baseline + (Math.max(1, subjectLines.length) - 1) * 14.0;

        var client = 'To: ' + String(this.estimate.client_company || '-');
        var clientBaseline = Math.max(147.0, afterSubject + 17.5);
        var clientLines = wrapText(client, CONTENT_WIDTH, 10.3, true).slice(0, 2);
        clientLines.forEach(function (line, index) {
            this.text(MARGIN, clientBaseline + index * 13.0, line, 10.3, true, '0 0 0');
        }, this);

        var afterClient = clientBaseline + (Math.max(1, clientLines.length) - 1) * 13.0;
        var attn = String(this.estimate.client_attn || '').trim();
        if (attn !== '') {
            afterClient += 12.0;
            this.text(MARGIN, afterClient, truncateText('Attn: ' + attn, CONTENT_WIDTH, 8.8, false), 8.8, false, '0.2 0.2 0.2');
        }

        return Math.max(170.0, afterClient + 20.0);
    };

    PdfDoc.prototype.drawTable = function (top) {
        this.y = this.drawTableHeader(top);

        var items = this.totals.items;
        if (!items.length) {
            items = [{ name: 'Belum ada item', qty: 0, duration: 0, rate: 0, subtotal: 0 }];
        }

        items.forEach(function (item) {
            if (this.y + ROW_HEIGHT > 738.0) {
                this.newPage(false);
                this.y = this.drawTableHeader(67.0);
            }
            this.drawTableRow(item);
            this.y += ROW_HEIGHT;
        }, this);
    };

    PdfDoc.prototype.drawTableHeader = function (top) {
        this.fillRect(MARGIN, top, CONTENT_WIDTH, HEADER_HEIGHT, '0.475 0.475 0.475');
        var baseline = top + 15.2;

        this.textCenter((MARGIN + COL_RESOURCE) / 2, baseline, 'Resources', 9.1, true, '1 1 1');
        this.textCenter((COL_RESOURCE + COL_QTY) / 2, baseline, 'Qty', 9.1, true, '1 1 1');
        this.textCenter((COL_QTY + COL_DURATION) / 2, baseline, 'Duration', 9.1, true, '1 1 1');
        this.textCenter((COL_DURATION + CONTENT_RIGHT) / 2, baseline, 'Subtotal (IDR)', 9.1, true, '1 1 1');

        this.line(MARGIN, top, CONTENT_RIGHT, top, 0.55, '0.35 0.35 0.35');
        this.line(MARGIN, top + HEADER_HEIGHT, CONTENT_RIGHT, top + HEADER_HEIGHT, 0.55, '0.35 0.35 0.35');
        [MARGIN, COL_RESOURCE, COL_QTY, COL_DURATION, CONTENT_RIGHT].forEach(function (x) {
            this.line(x, top, x, top + HEADER_HEIGHT, 0.55, '0.35 0.35 0.35');
        }, this);

        return top + HEADER_HEIGHT;
    };

    PdfDoc.prototype.drawTableRow = function (item) {
        var top = this.y;
        var bottom = top + ROW_HEIGHT;
        var baseline = top + 14.2;

        this.text(MARGIN + 6.0, baseline, truncateText(String(item.name || ''), COL_RESOURCE - MARGIN - 14.0, 9.1, false), 9.1, false, '0 0 0');
        this.text(COL_RESOURCE + 9.0, baseline, pdfNumber(item.qty), 9.1, false, '0 0 0');
        this.text(COL_QTY + 10.0, baseline, itemDurationLabel(item.duration), 9.1, false, '0 0 0');
        this.textRight(CONTENT_RIGHT - 10.0, baseline, formatRp(item.subtotal), 9.1, true, '0 0 0');

        this.line(MARGIN, bottom, CONTENT_RIGHT, bottom, 0.5, '0.45 0.45 0.45');
        [MARGIN, COL_RESOURCE, COL_QTY, COL_DURATION, CONTENT_RIGHT].forEach(function (x) {
            this.line(x, top, x, bottom, 0.5, '0.45 0.45 0.45');
        }, this);
    };

    PdfDoc.prototype.drawTotalsAndSignature = function () {
        if (this.y + 235.0 > 760.0) {
            this.newPage(false);
            this.y = 88.0;
        }

        var baseline = this.y + 22.0;
        var labelX = MARGIN;
        var valueX = 155.0;
        var rightLabelX = 322.0;

        this.text(labelX, baseline, 'Total Mandays:', 9.0, false, '0 0 0');
        this.text(valueX, baseline, durationLabel(this.totals.mandays), 9.0, false, '0 0 0');

        this.text(labelX, baseline + 12.5, 'Est. Duration:', 9.0, false, '0 0 0');
        this.text(
            valueX,
            baseline + 12.5,
            durationLabel(this.totals.longest) + ' (+' + this.totals.month.toFixed(1) + ' Month)',
            9.0,
            false,
            '0 0 0'
        );

        this.text(labelX, baseline + 25.0, 'Total Resource:', 9.0, false, '0 0 0');
        this.text(valueX, baseline + 25.0, pdfNumber(this.totals.resource) + ' Manpower', 9.0, false, '0 0 0');

        this.text(rightLabelX, baseline, 'Subtotal:', 9.0, false, '0 0 0');
        this.textRight(CONTENT_RIGHT - 12.0, baseline, formatRp(this.totals.subtotal), 9.0, false, '0 0 0');

        var discount = Number(this.totals.discount) || 0;
        var discountColor = discount > 0 ? '0.71 0.15 0.12' : '0 0 0';
        this.text(rightLabelX, baseline + 12.5, 'Discount (' + pdfNumber(this.totals.discountPct) + '%):', 9.0, false, discountColor);
        this.textRight(CONTENT_RIGHT - 12.0, baseline + 12.5, (discount > 0 ? '- ' : '') + formatRp(discount), 9.0, false, discountColor);

        var ruleY = baseline + 26.0;
        this.line(rightLabelX, ruleY, CONTENT_RIGHT - 12.0, ruleY, 0.9, '0 0 0');

        var grandBaseline = baseline + 46.0;
        this.text(rightLabelX, grandBaseline, 'GRAND TOTAL', 12.2, true, '0 0 0');
        this.textRight(CONTENT_RIGHT - 12.0, grandBaseline, formatRp(this.totals.grandTotal), 12.2, true, '0 0 0');

        var signatureTop = Math.max(grandBaseline + 65.0, 350.0);
        this.textCenter(420.0, signatureTop, 'Dibuat Oleh,', 9.2, false, '0 0 0');
        this.textCenter(420.0, signatureTop + 78.0, String(this.settings.signer_title || ''), 9.2, false, '0 0 0');
    };

    PdfDoc.prototype.flushPage = function () {
        if (this.ops !== '') {
            this.pages.push(this.ops);
            this.ops = '';
        }
    };

    PdfDoc.prototype.appendFooters = function () {
        var total = this.pages.length;
        var footerText = String(this.settings.footer_text || 'Generated by UPSENSE Mandays Estimator');

        this.pages = this.pages.map(function (content, index) {
            return content
                + this.textOp(MARGIN, FOOTER_BASELINE, truncateText(footerText, 300.0, 7.4, false), 7.4, false, '0.12 0.12 0.12')
                + this.textCenterOp(PAGE_W / 2, FOOTER_BASELINE, 'Page ' + (index + 1) + ' of ' + total, 7.4, false, '0.12 0.12 0.12');
        }, this);
    };

    PdfDoc.prototype.serialize = function () {
        var objects = new Map();
        var nextId = 3;
        var fontRegular = nextId++;
        var fontBold = nextId++;
        var imageId = null;

        objects.set(fontRegular, [rawBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')]);
        objects.set(fontBold, [rawBytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')]);

        if (this.logoJpeg) {
            imageId = nextId++;
            objects.set(imageId, [
                rawBytes('<< /Type /XObject /Subtype /Image /Width ' + this.logoPixelWidth
                    + ' /Height ' + this.logoPixelHeight
                    + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + this.logoJpeg.length
                    + ' >>\nstream\n'),
                this.logoJpeg,
                rawBytes('\nendstream')
            ]);
        }

        var pageIds = [];
        this.pages.forEach(function (content) {
            var contentBytes = textBytes(content);
            var contentId = nextId++;
            objects.set(contentId, [
                rawBytes('<< /Length ' + contentBytes.length + ' >>\nstream\n'),
                contentBytes,
                rawBytes('\nendstream')
            ]);

            var resources = '/Font << /F1 ' + fontRegular + ' 0 R /F2 ' + fontBold + ' 0 R >>';
            if (imageId !== null) {
                resources += ' /XObject << /Im1 ' + imageId + ' 0 R >>';
            }

            var pageId = nextId++;
            objects.set(pageId, [rawBytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_W + ' ' + PAGE_H + ']'
                + ' /Resources << ' + resources + ' >> /Contents ' + contentId + ' 0 R >>')]);
            pageIds.push(pageId);
        });

        objects.set(1, [rawBytes('<< /Type /Catalog /Pages 2 0 R >>')]);
        objects.set(2, [rawBytes('<< /Type /Pages /Kids [' + pageIds.map(function (id) { return id + ' 0 R'; }).join(' ')
            + '] /Count ' + pageIds.length + ' >>')]);

        var infoId = nextId++;
        objects.set(infoId, [textBytes('<< /Title (' + escapeText('Estimasi ' + String(this.estimate.ref || ''))
            + ') /Author (' + escapeText(String(this.settings.company_name || ''))
            + ') /Creator (UPSENSE Estimator) /Producer (UPSENSE Estimator) >>')]);

        var ids = Array.from(objects.keys()).sort(function (a, b) { return a - b; });
        var maxId = ids[ids.length - 1];
        var chunks = [];
        var length = 0;
        var offsets = {};

        function push(bytes) {
            chunks.push(bytes);
            length += bytes.length;
        }

        push(rawBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'));
        ids.forEach(function (id) {
            offsets[id] = length;
            push(rawBytes(id + ' 0 obj\n'));
            objects.get(id).forEach(function (part) {
                push(part);
            });
            push(rawBytes('\nendobj\n'));
        });

        var xref = length;
        var xrefText = 'xref\n0 ' + (maxId + 1) + '\n0000000000 65535 f \n';
        for (var id = 1; id <= maxId; id += 1) {
            xrefText += String(offsets[id] || 0).padStart(10, '0') + ' 00000 n \n';
        }
        xrefText += 'trailer\n<< /Size ' + (maxId + 1) + ' /Root 1 0 R /Info ' + infoId + ' 0 R >>\n';
        xrefText += 'startxref\n' + xref + '\n%%EOF';
        push(rawBytes(xrefText));

        return concatBytes(chunks);
    };

    PdfDoc.prototype.drawImage = function (x, top, width, height) {
        var bottom = PAGE_H - (top + height);
        this.ops += 'q\n' + num(width) + ' 0 0 ' + num(height) + ' ' + num(x) + ' ' + num(bottom)
            + ' cm\n/Im1 Do\nQ\n';
    };

    PdfDoc.prototype.fillRect = function (x, top, width, height, color) {
        var bottom = PAGE_H - (top + height);
        this.ops += color + ' rg\n' + num(x) + ' ' + num(bottom) + ' '
            + num(width) + ' ' + num(height) + ' re f\n';
    };

    PdfDoc.prototype.line = function (x1, top1, x2, top2, width, color) {
        this.ops += color + ' RG\n' + num(width) + ' w\n'
            + num(x1) + ' ' + num(PAGE_H - top1) + ' m\n'
            + num(x2) + ' ' + num(PAGE_H - top2) + ' l S\n';
    };

    PdfDoc.prototype.text = function (x, baseline, value, size, bold, color) {
        this.ops += this.textOp(x, baseline, value, size, bold, color);
    };

    PdfDoc.prototype.textRight = function (right, baseline, value, size, bold, color) {
        this.ops += this.textRightOp(right, baseline, value, size, bold, color);
    };

    PdfDoc.prototype.textCenter = function (center, baseline, value, size, bold, color) {
        this.ops += this.textCenterOp(center, baseline, value, size, bold, color);
    };

    PdfDoc.prototype.textOp = function (x, baseline, value, size, bold, color) {
        var font = bold ? 'F2' : 'F1';
        return 'BT\n/' + font + ' ' + num(size) + ' Tf\n' + color + ' rg\n1 0 0 1 '
            + num(x) + ' ' + num(PAGE_H - baseline) + ' Tm\n(' + escapeText(value) + ') Tj\nET\n';
    };

    PdfDoc.prototype.textRightOp = function (right, baseline, value, size, bold, color) {
        return this.textOp(right - widthOf(value, size, bold), baseline, value, size, bold, color);
    };

    PdfDoc.prototype.textCenterOp = function (center, baseline, value, size, bold, color) {
        return this.textOp(center - widthOf(value, size, bold) / 2, baseline, value, size, bold, color);
    };

    window.EstimatorPdf = {
        generate: async function (payload) {
            var settings = payload && payload.settings ? payload.settings : {};
            var estimate = payload && payload.estimate ? payload.estimate : {};
            var doc = new PdfDoc(settings, estimate);
            await doc.loadLogo();
            return doc.render();
        }
    };
})();
