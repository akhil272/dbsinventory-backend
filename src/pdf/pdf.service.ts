import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Quotation } from 'src/quotations/entities/quotation.entity';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class PDFService {
  async generatePDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      this.generateHeader(doc);
      // this.generateCustomerInformation(doc, quotationModel);
      // this.generateInvoiceTable(doc, quotationModel);
      // this.generateFooter(doc);

      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  async generatePDFWithQuotationAndUser(
    user: User,
    quotation: Quotation,
  ): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
      });

      this.generateHeader(doc);
      this.generateCustomerInformation(doc, user, quotation);
      this.generateInvoiceTable(doc, quotation);
      this.generateFooter(doc, quotation);

      doc.end();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  generateCustomerInformation(doc, user: User, quotation: Quotation) {
    doc.fillColor('#444444').fontSize(20).text('Quotation', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Quotation Number:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(quotation.id, 150, customerInformationTop)
      .font('Helvetica')
      .text('Quotation Date:', 50, customerInformationTop + 15)
      .text(this.formatDate(new Date()), 150, customerInformationTop + 15)
      .text('Total Amount', 50, customerInformationTop + 30)
      .text(`Rs. ${quotation.price}`, 150, customerInformationTop + 30)

      .font('Helvetica-Bold')
      .text(`${user.firstName} ${user.lastName}`, 300, customerInformationTop)
      .font('Helvetica')
      .text(user.phoneNumber, 300, customerInformationTop + 15)
      .text(user?.email, 300, customerInformationTop + 30)
      .moveDown();

    this.generateHr(doc, 252);
  }

  generateHeader(doc) {
    doc
      .image('./assets/images/logo.png', 50, 45, { width: 75 })
      .fillColor('#444444')
      .fontSize(20)
      .text('DBS Tyres', 200, 45, { align: 'right' })
      .fontSize(10)
      .text('34/138 H, NH Bye Pass', 200, 65, { align: 'right' })
      .text('Edappally, Kochi, Kerala 682024', 200, 80, { align: 'right' })
      .moveDown();
  }

  generateFooter(doc, quotation: Quotation) {
    doc
      .fontSize(10)
      .text(
        `Quotation is valid only for ${quotation.validity} days. Thank you for your business.`,
        50,
        750,
        { align: 'center', width: 500 },
      );
  }

  generateInvoiceTable(doc, quotation: Quotation) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Item',
      'Description',
      'Unit Cost',
      'Quantity',
      'Line Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    const { userQuotes } = quotation;
    for (i = 0; i < userQuotes.length; i++) {
      const item = userQuotes[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        i + 1,
        `${item.brandName} ${item.patternName} ${item.tyreSizeValue}`,
        (item.quotePrice / item.quantity).toFixed(2),
        item.quantity,
        item.quotePrice,
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Subtotal',
      '',
      `Rs. ${quotation.price}`,
    );
  }

  generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateHr(doc, y) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  formatCurrency(cents) {
    return 'Rs' + (cents / 100).toFixed(2);
  }
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + '/' + month + '/' + day;
  }
}
