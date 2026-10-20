
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const createOrderBillPdf = async (order, orderItems = []) => {
  const PAGE_WIDTH = 841.89;
  const PAGE_HEIGHT = 1190.55;
  const MARGIN = 42;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

  const doc = new PDFDocument({
    size: "A3",
    margin: MARGIN,
    compress: true,
    bufferPages: true,
  });

  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const money = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

  const safe = (value, fallback = "-") =>
    value === undefined || value === null || value === ""
      ? fallback
      : String(value);

  const amount = (...keys) => {
    for (const key of keys) {
      const value = order[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        Number.isFinite(Number(value))
      ) {
        return Number(value);
      }
    }

    return undefined;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const customer =
    order.userId && typeof order.userId === "object"
      ? order.userId
      : order.user || order.customer || order.member || {};

  const shipping =
    order.deliveryDetails ||
    order.shippingAddress ||
    order.deliveryAddress ||
    order.address ||
    {};

  const customerName =
    shipping.name ||
    customer.name ||
    customer.fullName ||
    order.customerName ||
    "Customer";

  const customerMobile =
    shipping.mobile ||
    shipping.phone ||
    customer.mobile ||
    customer.phone ||
    order.mobile;

  const customerEmail =
    customer.email || shipping.email || order.email;

  const customerAddress =
    typeof shipping === "string"
      ? shipping
      : [
          shipping.addressLine1,
          shipping.addressLine2,
          shipping.address,
          shipping.street,
          shipping.landmark,
          shipping.city,
          shipping.district,
          shipping.state,
          shipping.pincode || shipping.postalCode,
        ]
          .filter(Boolean)
          .filter((value, index, array) => array.indexOf(value) === index)
          .join(", ");

  const orderNumber =
    order.orderNumber || order.orderId || order._id || "N/A";

  const orderDate = formatDate(
    order.createdAt || order.orderDate || order.date
  );

  const invoiceNumber = order.invoiceNumber || orderNumber;

  const invoiceDate = formatDate(
    order.invoiceDate || order.createdAt || order.orderDate
  );

  // Configure these fields with verified business details.
  const seller = order.sellerDetails || {};
  const sellerName = seller.name || "Bhagyamma Hub";
  const sellerAddress = seller.address || "";
  const sellerMobile = seller.mobile || "";
  const sellerEmail = seller.email || "";
  const sellerPAN = seller.pan || "";
  const sellerGSTIN = seller.gstin || "";

  const items = Array.isArray(orderItems) ? orderItems : [];

  const getProduct = (item) => {
    const product = item.productId || item.product || {};
    return typeof product === "object" ? product : {};
  };

  const getName = (item) => {
    const product = getProduct(item);

    return (
      product.name ||
      product.productName ||
      item.productName ||
      "Product"
    );
  };

  const getQty = (item) =>
    Number(item.quantity ?? item.qty ?? 1);

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      item.unitPrice ??
      item.price ??
      item.sellingPrice ??
      product.sellingPrice ??
      product.price ??
      0
    );
  };

  const getLineTotal = (item) => {
    const saved =
      item.totalPrice ??
      item.itemTotal ??
      item.subtotal ??
      item.lineTotal;

    return saved !== undefined && saved !== null
      ? Number(saved)
      : getPrice(item) * getQty(item);
  };

  const subtotal =
    amount("subtotal", "subTotal", "itemsTotal", "totalBeforeDiscount") ??
    items.reduce((sum, item) => sum + getLineTotal(item), 0);

  const discount = Math.abs(
    amount("discountAmount", "discount", "memberDiscount") ?? 0
  );

  const walletAmount = Math.max(
    0,
    amount("walletAmount") ?? 0
  );

  const deliveryCharge =
    amount("deliveryCharge", "shippingCharge", "deliveryFee") ?? 0;

  const total =
    amount(
      "finalAmount",
      "grandTotal",
      "payableAmount",
      "totalAmount",
      "total"
    ) ??
    Math.max(
      0,
      subtotal - discount - walletAmount + deliveryCharge
    );

  const paymentMethod = order.paymentMethod || "Not specified";
  const paymentStatus = order.paymentStatus || "Not specified";

  const qrBuffer = await QRCode.toBuffer(
    JSON.stringify({
      orderNumber: String(orderNumber),
      orderId: String(order._id || ""),
    }),
    {
      type: "png",
      width: 220,
      margin: 1,
      errorCorrectionLevel: "M",
    }
  );

  const green = "#245B35";
  const paleGreen = "#EAF1EB";
  const gray = "#888888";

  const drawLine = (x1, y1, x2, y2, color = gray) => {
    doc.moveTo(x1, y1)
      .lineTo(x2, y2)
      .lineWidth(0.7)
      .strokeColor(color)
      .stroke();
  };

  const drawText = (text, x, y, options = {}) => {
    doc.font(options.bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(options.size || 10)
      .fillColor(options.color || "#111111")
      .text(String(text ?? ""), x, y, {
        width: options.width,
        align: options.align || "left",
        lineGap: 1,
      });
  };

  const drawCell = (x, y, width, height, text, options = {}) => {
    doc.rect(x, y, width, height)
      .lineWidth(0.6)
      .strokeColor("#777777")
      .stroke();

    drawText(text, x + 5, y + 5, {
      bold: options.bold,
      size: options.size || 9,
      color: options.color || "#111111",
      width: width - 10,
      align: options.align || "left",
    });
  };

  const drawLabelValue = (label, value, x, y, width) => {
    drawText(label, x, y, {
      bold: true,
      size: 9,
      width: width * 0.43,
    });

    drawText(safe(value), x + width * 0.43, y, {
      size: 9,
      width: width * 0.57,
      align: "right",
    });
  };

  try {
    // ==============================================
    // HEADER
    // ==============================================

    doc.rect(0, 0, PAGE_WIDTH, 105).fill(paleGreen);

    drawText("BHAGYAMMA HUB", MARGIN, 25, {
      bold: true,
      size: 27,
      color: green,
      width: 350,
    });

    drawText("ORDER INVOICE / BILL OF SUPPLY", 400, 30, {
      bold: true,
      size: 15,
      width: PAGE_WIDTH - MARGIN - 400,
      align: "right",
    });

    drawText("Original for Recipient", 400, 53, {
      size: 10,
      width: PAGE_WIDTH - MARGIN - 400,
      align: "right",
    });

    drawLine(MARGIN, 105, PAGE_WIDTH - MARGIN, 105, green);

    // ==============================================
    // SELLER AND CUSTOMER DETAILS
    // ==============================================

    const panelY = 125;
    const gap = 20;
    const panelWidth = (CONTENT_WIDTH - gap) / 2;
    const leftX = MARGIN;
    const rightX = MARGIN + panelWidth + gap;

    const sellerLines = [
      sellerName,
      sellerAddress,
      sellerMobile ? `Phone: ${sellerMobile}` : "",
      sellerEmail ? `Email: ${sellerEmail}` : "",
      sellerPAN ? `PAN: ${sellerPAN}` : "",
      sellerGSTIN ? `GSTIN: ${sellerGSTIN}` : "",
    ].filter(Boolean);

    const customerLines = [
      customerName,
      customerAddress,
      customerMobile ? `Mobile: ${customerMobile}` : "",
      customerEmail ? `Email: ${customerEmail}` : "",
    ].filter(Boolean);

    const drawInfoPanel = (title, lines, x, y, width) => {
      doc.roundedRect(x, y, width, 145, 4)
        .lineWidth(0.7)
        .strokeColor("#999999")
        .stroke();

      drawText(title, x + 10, y + 10, {
        bold: true,
        size: 11,
        color: green,
        width: width - 20,
      });

      let lineY = y + 32;

      lines.forEach((text, index) => {
        const bold = index === 0;

        drawText(text, x + 10, lineY, {
          bold,
          size: index === 0 ? 10 : 9,
          width: width - 20,
        });

        const height = doc.heightOfString(String(text), {
          width: width - 20,
          font: bold ? "Helvetica-Bold" : "Helvetica",
          fontSize: index === 0 ? 10 : 9,
          lineGap: 1,
        });

        lineY += Math.max(15, height + 4);
      });
    };

    drawInfoPanel("SOLD BY", sellerLines, leftX, panelY, panelWidth);
    drawInfoPanel(
      "BILLING / SHIPPING ADDRESS",
      customerLines,
      rightX,
      panelY,
      panelWidth
    );

    // ==============================================
    // ORDER / INVOICE DETAILS AND QR
    // ==============================================

    const detailsY = panelY + 165;

    drawText(`Order Number: ${safe(orderNumber)}`, leftX, detailsY, {
      bold: true,
      size: 10,
      width: panelWidth,
    });

    drawText(`Order Date: ${orderDate}`, leftX, detailsY + 19, {
      bold: true,
      size: 10,
      width: panelWidth,
    });

    drawText(`Invoice Number: ${safe(invoiceNumber)}`, rightX, detailsY, {
      bold: true,
      size: 10,
      width: panelWidth,
      align: "right",
    });

    drawText(`Invoice Date: ${invoiceDate}`, rightX, detailsY + 19, {
      bold: true,
      size: 10,
      width: panelWidth,
      align: "right",
    });

    drawText(`Payment Method: ${paymentMethod}`, rightX, detailsY + 38, {
      size: 9,
      width: panelWidth,
      align: "right",
    });

    drawText(`Payment Status: ${paymentStatus}`, rightX, detailsY + 55, {
      size: 9,
      width: panelWidth,
      align: "right",
    });

    const tableY = detailsY + 83;

    // ==============================================
    // PRODUCT TABLE
    // ==============================================

    const columns = [
      { title: "Sl. No.", width: 42, align: "center" },
      { title: "Description", width: 250, align: "left" },
      { title: "Unit Price", width: 100, align: "right" },
      { title: "Qty", width: 55, align: "center" },
      { title: "Net Amount", width: 105, align: "right" },
      { title: "Tax", width: 90, align: "center" },
      { title: "Total Amount", width: 115, align: "right" },
    ];

    const originalTableWidth = columns.reduce(
      (sum, column) => sum + column.width,
      0
    );

    const scale = CONTENT_WIDTH / originalTableWidth;

    columns.forEach((column) => {
      column.width *= scale;
    });

    const headerHeight = 38;
    let x = MARGIN;

    columns.forEach((column) => {
      drawCell(
        x,
        tableY,
        column.width,
        headerHeight,
        column.title,
        {
          bold: true,
          size: 9,
          align: column.align,
          color: green,
        }
      );

      x += column.width;
    });

    let rowY = tableY + headerHeight;

    items.forEach((item, index) => {
      const name = getName(item);
      const qty = getQty(item);
      const unitPrice = getPrice(item);
      const lineTotal = getLineTotal(item);

      const descriptionHeight = doc.heightOfString(name, {
        width: columns[1].width - 10,
        font: "Helvetica",
        fontSize: 10,
        lineGap: 2,
      });

      const rowHeight = Math.max(40, descriptionHeight + 14);

      const taxRate =
        item.taxRate !== undefined && item.taxRate !== null
          ? `${item.taxRate}%`
          : "Included*";

      const values = [
        String(index + 1),
        name,
        money(unitPrice),
        String(qty),
        money(lineTotal),
        taxRate,
        money(lineTotal),
      ];

      let cellX = MARGIN;

      columns.forEach((column, columnIndex) => {
        drawCell(
          cellX,
          rowY,
          column.width,
          rowHeight,
          values[columnIndex],
          {
            size: columnIndex === 1 ? 10 : 9,
            align: column.align,
          }
        );

        cellX += column.width;
      });

      rowY += rowHeight;
    });

    if (items.length === 0) {
      drawCell(
        MARGIN,
        rowY,
        CONTENT_WIDTH,
        35,
        "No order items found.",
        { size: 10 }
      );

      rowY += 35;
    }

    // ==============================================
    // TOTALS
    // ==============================================

    const totalsX = PAGE_WIDTH - MARGIN - 280;
    const totalsValueX = totalsX + 140;
    let totalY = rowY + 20;

    const totalRow = (label, value, bold = false) => {
      drawText(label, totalsX, totalY, {
        bold,
        size: bold ? 12 : 10,
        color: bold ? green : "#222222",
        width: 135,
      });

      drawText(money(value), totalsValueX, totalY, {
        bold,
        size: bold ? 12 : 10,
        color: bold ? green : "#222222",
        width: 140,
        align: "right",
      });

      totalY += bold ? 25 : 20;
    };

    totalRow("Product Subtotal", subtotal);

    if (discount > 0) {
      totalRow("Member Discount", -discount);
    }

    if (walletAmount > 0) {
      totalRow("Wallet Amount Used", -walletAmount);
    }

    totalRow("Delivery Charge", deliveryCharge);

    drawLine(totalsX, totalY, PAGE_WIDTH - MARGIN, totalY, green);
    totalY += 12;

    doc.roundedRect(
      totalsX,
      totalY,
      PAGE_WIDTH - MARGIN - totalsX,
      42,
      4
    ).fill(paleGreen);

    drawText("TOTAL PAYABLE", totalsX + 10, totalY + 13, {
      bold: true,
      size: 12,
      color: green,
      width: 140,
    });

    drawText(money(total), totalsValueX, totalY + 12, {
      bold: true,
      size: 13,
      color: green,
      width: 140,
      align: "right",
    });

    totalY += 53;

    if (discount > 0) {
      drawText(
        `Member discount of ${money(discount)} applied.`,
        MARGIN,
        totalY,
        { size: 9, width: CONTENT_WIDTH }
      );

      totalY += 16;
    }

    drawText(
      "GST is included in displayed prices, where applicable. Tax is not separately itemized in this order bill.",
      MARGIN,
      totalY,
      { size: 9, width: CONTENT_WIDTH }
    );

    totalY += 25;

    // ==============================================
    // AMOUNT IN WORDS
    // ==============================================

    const amountInWords = (value) => {
      const ones = [
        "", "One", "Two", "Three", "Four", "Five",
        "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
      ];

      const tens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
      ];

      const underThousand = (n) => {
        let result = "";

        if (n >= 100) {
          result += `${ones[Math.floor(n / 100)]} Hundred `;
          n %= 100;
        }

        if (n >= 20) {
          result += `${tens[Math.floor(n / 10)]} `;
          n %= 10;
        }

        if (n > 0) result += `${ones[n]} `;

        return result.trim();
      };

      let n = Math.floor(Math.abs(value));

      if (n === 0) return "Zero Rupees Only";

      const parts = [];

      const crore = Math.floor(n / 10000000);
      n %= 10000000;

      const lakh = Math.floor(n / 100000);
      n %= 100000;

      const thousand = Math.floor(n / 1000);
      n %= 1000;

      if (crore) parts.push(`${underThousand(crore)} Crore`);
      if (lakh) parts.push(`${underThousand(lakh)} Lakh`);
      if (thousand) parts.push(`${underThousand(thousand)} Thousand`);
      if (n) parts.push(underThousand(n));

      return `${parts.join(" ")} Rupees Only`;
    };

    doc.rect(MARGIN, totalY, CONTENT_WIDTH, 45)
      .lineWidth(0.7)
      .strokeColor("#777777")
      .stroke();

    drawText("Amount in Words:", MARGIN + 8, totalY + 7, {
      bold: true,
      size: 10,
      width: CONTENT_WIDTH - 16,
    });

    drawText(amountInWords(total), MARGIN + 8, totalY + 24, {
      bold: true,
      size: 10,
      width: CONTENT_WIDTH - 16,
    });

    totalY += 58;

    // ==============================================
    // QR CODE AND AUTHORIZATION
    // ==============================================

    doc.rect(MARGIN, totalY, CONTENT_WIDTH, 105)
      .lineWidth(0.7)
      .strokeColor("#777777")
      .stroke();

    const qrSize = 72;

    doc.image(qrBuffer, MARGIN + 10, totalY + 10, {
      width: qrSize,
      height: qrSize,
    });

    drawText("Order QR Code", MARGIN + 90, totalY + 30, {
      bold: true,
      size: 10,
      width: 200,
    });

    drawText("Scan to identify this order.", MARGIN + 90, totalY + 49, {
      size: 9,
      width: 200,
    });

    drawText(`For ${sellerName}:`, PAGE_WIDTH - MARGIN - 240, totalY + 15, {
      bold: true,
      size: 11,
      width: 225,
      align: "right",
    });

    drawText(
      "Authorized Signatory",
      PAGE_WIDTH - MARGIN - 240,
      totalY + 77,
      {
        bold: true,
        size: 10,
        width: 225,
        align: "right",
      }
    );

    totalY += 116;

    drawText(
      "Thank you for choosing Bhagyamma Hub!",
      MARGIN,
      totalY,
      {
        bold: true,
        size: 10,
        color: green,
        width: CONTENT_WIDTH,
        align: "center",
      }
    );

    totalY += 17;

    drawText(
      "Order bill / packing reference — not a GST tax invoice.",
      MARGIN,
      totalY,
      {
        size: 8,
        color: "#555555",
        width: CONTENT_WIDTH,
        align: "center",
      }
    );

    // Keep the invoice on one A3 sheet.
    // Shrink the entire page content uniformly if necessary.
    const pages = doc.bufferedPageRange();

    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);

      drawText(
        `Page ${i + 1} of ${pages.count}`,
        MARGIN,
        PAGE_HEIGHT - 25,
        {
          size: 8,
          color: "#777777",
          width: CONTENT_WIDTH,
          align: "right",
        }
      );
    }

    doc.end();
    return await pdfPromise;
  } catch (error) {
    doc.destroy();
    throw error;
  }
};

module.exports = { createOrderBillPdf };
