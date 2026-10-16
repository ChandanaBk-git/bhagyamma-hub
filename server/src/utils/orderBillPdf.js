const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

// =====================================================
// FORMAT CURRENCY
// =====================================================

const formatCurrency = (value) => {
    const amount = Number(value);

    return `Rs. ${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// =====================================================
// CLEAN TEXT
// =====================================================

const cleanText = (value, fallback = "—") => {
    if (value === undefined || value === null) {
        return fallback;
    }

    const text = String(value).trim();

    return text || fallback;
};

// =====================================================
// CREATE ORDER BILL PDF
// =====================================================

const createOrderBillPdf = async ({
    order,
    items = [],
} = {}) => {
    if (!order) {
        throw new Error(
            "Order data is required to generate the bill."
        );
    }

    const orderNumber = cleanText(
        order.orderNumber,
        String(order._id || "ORDER")
    );

    const delivery = order.deliveryDetails || {};

    const user =
        order.userId &&
        typeof order.userId === "object"
            ? order.userId
            : {};

    const customerName = cleanText(
        delivery.name ||
        order.customerName ||
        user.name
    );

    const customerMobile = cleanText(
        delivery.mobile ||
        order.customerMobile ||
        user.mobile
    );

    const addressParts = [
        delivery.address,
        delivery.city,
        delivery.state,
        delivery.pincode,
    ]
        .map((part) => String(part || "").trim())
        .filter(Boolean);

    const deliveryAddress = addressParts.length
        ? addressParts.join(", ")
        : "—";

    // =================================================
    // GENERATE QR CODE
    // =================================================

    const qrBuffer = await QRCode.toBuffer(
        JSON.stringify({
            type: "BHAGYAMMA_HUB_ORDER",
            orderNumber,
            orderId: String(order._id || ""),
        }),
        {
            type: "png",
            errorCorrectionLevel: "M",
            margin: 1,
            width: 240,
        }
    );

    // =================================================
    // CREATE PDF DOCUMENT
    // =================================================

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margins: {
                top: 42,
                right: 42,
                bottom: 48,
                left: 42,
            },
            info: {
                Title: `Bhagyamma Hub Order Bill ${orderNumber}`,
                Author: "Bhagyamma Hub",
                Subject: "Order bill for packaging and delivery",
            },
        });

        const chunks = [];

        doc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        doc.on("error", reject);

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        const pageWidth = doc.page.width;
        const left = doc.page.margins.left;
        const right = pageWidth - doc.page.margins.right;
        const contentWidth = right - left;

        // =============================================
        // CHECK AVAILABLE PAGE SPACE
        // =============================================

        const ensureSpace = (height = 70) => {
            if (
                doc.y + height >
                doc.page.height - doc.page.margins.bottom
            ) {
                doc.addPage();
            }
        };

        // =============================================
        // HEADER
        // =============================================

        doc.roundedRect(
            left,
            34,
            contentWidth,
            84,
            10
        ).fill("#f1f7ef");

        doc.fillColor("#245b35")
            .font("Helvetica-Bold")
            .fontSize(22)
            .text(
                "BHAGYAMMA HUB",
                left + 16,
                48,
                {
                    width: contentWidth - 130,
                }
            );

        doc.fillColor("#3d5543")
            .font("Helvetica")
            .fontSize(9)
            .text(
                "ORDER BILL  |  PACKAGING COPY",
                left + 17,
                78
            );

        doc.fillColor("#222222")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                `Order: ${orderNumber}`,
                left + 17,
                96,
                {
                    width: contentWidth - 150,
                }
            );

        doc.image(
            qrBuffer,
            right - 83,
            40,
            {
                width: 68,
                height: 68,
            }
        );

        doc.y = 135;

        // =============================================
        // ORDER INFORMATION
        // =============================================

        doc.fillColor("#245b35")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(
                "ORDER INFORMATION",
                left,
                doc.y
            );

        doc.moveDown(0.6);

        const infoY = doc.y;
        const half = contentWidth / 2;

        const label = (
            title,
            value,
            x,
            y,
            width = half - 12
        ) => {
            doc.fillColor("#666666")
                .font("Helvetica")
                .fontSize(9)
                .text(
                    title,
                    x,
                    y,
                    { width }
                );

            doc.fillColor("#222222")
                .font("Helvetica-Bold")
                .fontSize(10)
                .text(
                    cleanText(value),
                    x,
                    y + 13,
                    { width }
                );
        };

        label(
            "Order date",
            formatDate(order.placedAt || order.createdAt),
            left,
            infoY
        );

        label(
            "Order status",
            order.status,
            left + half,
            infoY
        );

        label(
            "Payment method",
            order.paymentMethod,
            left,
            infoY + 39
        );

        label(
            "Payment status",
            order.paymentStatus,
            left + half,
            infoY + 39
        );

        doc.y = infoY + 78;

        doc.moveTo(left, doc.y)
            .lineTo(right, doc.y)
            .strokeColor("#dddddd")
            .stroke();

        doc.moveDown(0.9);

        // =============================================
        // CUSTOMER AND DELIVERY INFORMATION
        // =============================================

        doc.fillColor("#245b35")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(
                "DELIVER TO",
                left,
                doc.y
            );

        doc.moveDown(0.5);

        doc.fillColor("#222222")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                customerName,
                left,
                doc.y,
                {
                    width: contentWidth,
                }
            );

        doc.moveDown(0.2);

        doc.font("Helvetica")
            .fontSize(9)
            .text(
                `Mobile: ${customerMobile}`,
                left,
                doc.y,
                {
                    width: contentWidth,
                }
            );

        doc.moveDown(0.2);

        doc.text(
            `Address: ${deliveryAddress}`,
            left,
            doc.y,
            {
                width: contentWidth,
                lineGap: 2,
            }
        );

        doc.moveDown(1);

        // =============================================
        // PRODUCT TABLE HEADER
        // =============================================

        const drawTableHeader = () => {
            ensureSpace(38);

            const y = doc.y;

            doc.rect(
                left,
                y,
                contentWidth,
                25
            ).fill("#245b35");

            doc.fillColor("#ffffff")
                .font("Helvetica-Bold")
                .fontSize(8.5);

            doc.text(
                "#",
                left + 7,
                y + 8,
                { width: 20 }
            );

            doc.text(
                "PRODUCT",
                left + 30,
                y + 8,
                {
                    width: contentWidth - 220,
                }
            );

            doc.text(
                "QTY",
                right - 178,
                y + 8,
                {
                    width: 35,
                    align: "right",
                }
            );

            doc.text(
                "UNIT PRICE",
                right - 132,
                y + 8,
                {
                    width: 62,
                    align: "right",
                }
            );

            doc.text(
                "TOTAL",
                right - 62,
                y + 8,
                {
                    width: 55,
                    align: "right",
                }
            );

            doc.y = y + 25;
        };

        // =============================================
        // ITEMS
        // =============================================

        doc.fillColor("#245b35")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(
                "ITEMS",
                left,
                doc.y
            );

        doc.moveDown(0.5);

        drawTableHeader();

        const safeItems = Array.isArray(items)
            ? items
            : [];

        if (!safeItems.length) {
            doc.fillColor("#555555")
                .font("Helvetica")
                .fontSize(9)
                .text(
                    "No order items found.",
                    left + 8,
                    doc.y + 9
                );

            doc.y += 30;
        } else {
            safeItems.forEach((item, index) => {
                const productName = cleanText(
                    item.productName ||
                    item.productId?.name ||
                    item.productId?.productName,
                    "Product"
                );

                const quantity =
                    Number(item.quantity) || 0;

                const unitPrice =
                    Number(item.price) || 0;

                const total = Number.isFinite(
                    Number(item.total)
                )
                    ? Number(item.total)
                    : quantity * unitPrice;

                const rowHeight = Math.max(
                    28,
                    doc.heightOfString(productName, {
                        width: contentWidth - 235,
                        font: "Helvetica",
                        fontSize: 9,
                    }) + 12
                );

                ensureSpace(rowHeight + 6);

                const y = doc.y;

                if (index % 2 === 0) {
                    doc.rect(
                        left,
                        y,
                        contentWidth,
                        rowHeight
                    ).fill("#f7f9f7");
                }

                doc.fillColor("#222222")
                    .font("Helvetica")
                    .fontSize(9);

                doc.text(
                    String(index + 1),
                    left + 7,
                    y + 8,
                    { width: 20 }
                );

                doc.text(
                    productName,
                    left + 30,
                    y + 7,
                    {
                        width: contentWidth - 235,
                        lineGap: 1,
                    }
                );

                doc.text(
                    String(quantity),
                    right - 178,
                    y + 8,
                    {
                        width: 35,
                        align: "right",
                    }
                );

                doc.text(
                    formatCurrency(unitPrice),
                    right - 132,
                    y + 8,
                    {
                        width: 62,
                        align: "right",
                    }
                );

                doc.text(
                    formatCurrency(total),
                    right - 62,
                    y + 8,
                    {
                        width: 55,
                        align: "right",
                    }
                );

                doc.y = y + rowHeight;

                doc.moveTo(left, doc.y)
                    .lineTo(right, doc.y)
                    .strokeColor("#e5e5e5")
                    .stroke();
            });
        }

        // =============================================
        // ORDER TOTALS
        // =============================================

        doc.moveDown(1);

        ensureSpace(145);

        const totalsX = right - 210;
        const totalsWidth = 210;

        const totalLine = (
            title,
            value,
            bold = false
        ) => {
            doc.fillColor(
                bold ? "#245b35" : "#444444"
            )
                .font(
                    bold
                        ? "Helvetica-Bold"
                        : "Helvetica"
                )
                .fontSize(bold ? 11 : 9)
                .text(
                    title,
                    totalsX,
                    doc.y,
                    { width: 115 }
                );

            doc.text(
                formatCurrency(value),
                totalsX + 115,
                doc.y,
                {
                    width: totalsWidth - 115,
                    align: "right",
                }
            );

            doc.moveDown(bold ? 0.65 : 0.45);
        };

        totalLine(
            "Subtotal",
            order.subtotal
        );

        totalLine(
            "Discount",
            -(Number(order.discount) || 0)
        );

        totalLine(
            "Wallet amount",
            -(Number(order.walletAmount) || 0)
        );

        totalLine(
            "Delivery charge",
            order.deliveryCharge
        );

        doc.moveTo(totalsX, doc.y)
            .lineTo(right, doc.y)
            .strokeColor("#245b35")
            .lineWidth(1)
            .stroke();

        doc.moveDown(0.55);

        totalLine(
            "FINAL AMOUNT",
            order.finalAmount,
            true
        );

        // =============================================
        // FOOTER
        // =============================================

        ensureSpace(55);

        doc.moveDown(1.2);

        doc.fillColor("#666666")
            .font("Helvetica")
            .fontSize(8)
            .text(
                "This document is an order bill for packaging and delivery reference. It is not a GST tax invoice.",
                left,
                doc.y,
                {
                    width: contentWidth,
                    align: "center",
                }
            );

        doc.moveDown(0.6);

        doc.fillColor("#245b35")
            .font("Helvetica-Bold")
            .fontSize(9)
            .text(
                "Thank you for choosing Bhagyamma Hub!",
                left,
                doc.y,
                {
                    width: contentWidth,
                    align: "center",
                }
            );

        // Finish PDF generation
        doc.end();
    });
};

// =====================================================
// EXPORT
// =====================================================

module.exports = createOrderBillPdf;
module.exports.createOrderBillPdf = createOrderBillPdf;