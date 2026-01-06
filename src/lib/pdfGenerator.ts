import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BillData {
    invoiceNo: string;
    date: string;
    customerName?: string;
    customerPhone?: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    totalAmount: number;
    paymentMode: string;
}

interface ShopData {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}

export const generateInvoicePDF = (bill: BillData, shop: ShopData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(shop.name, pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let yPos = 28;
    if (shop.address) {
        doc.text(shop.address, pageWidth / 2, yPos, { align: "center" });
        yPos += 5;
    }
    if (shop.phone) {
        doc.text(`Phone: ${shop.phone}`, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
    }

    // --- Line Divider ---
    doc.setLineWidth(0.5);
    doc.line(10, yPos, pageWidth - 10, yPos);
    yPos += 10;

    // --- Bill Details ---
    doc.setFontSize(12);
    doc.text("INVOICE", 14, yPos);

    doc.setFontSize(10);
    doc.text(`Bill No: ${bill.invoiceNo}`, 14, yPos + 6);
    doc.text(`Date: ${bill.date}`, 14, yPos + 11);

    // Customer Details (Right Aligned)
    if (bill.customerName || bill.customerPhone) {
        doc.text("Bill To:", pageWidth - 14, yPos, { align: "right" });
        if (bill.customerName) doc.text(bill.customerName, pageWidth - 14, yPos + 6, { align: "right" });
        if (bill.customerPhone) doc.text(bill.customerPhone, pageWidth - 14, yPos + 11, { align: "right" });
    }

    yPos += 20;

    // --- Items Table ---
    // Prepare table data
    const tableBody = bill.items.map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${item.total.toFixed(2)}`
    ]);

    autoTable(doc, {
        head: [['Item', 'Qty', 'Price', 'Total']],
        body: tableBody,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Item Name
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 30, halign: 'right' }, // Price
            3: { cellWidth: 30, halign: 'right' }  // Total
        }
    });

    // --- Grand Total ---
    // Get final Y position after table
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: Rs. ${bill.totalAmount.toFixed(2)}`, pageWidth - 14, finalY, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Mode: ${bill.paymentMode.toUpperCase()}`, pageWidth - 14, finalY + 6, { align: "right" });

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 20, { align: "center" });

    // Save
    doc.save(`Invoice_${bill.invoiceNo}.pdf`);
};
