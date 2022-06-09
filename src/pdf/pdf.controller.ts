import { Controller, Get, Res } from '@nestjs/common';
import { PDFService } from './pdf.service';
import { Response } from 'express';
@Controller('pdf')
export class PDFController {
  constructor(private pdfService: PDFService) {}

  @Get()
  async getPDF(@Res() res: Response): Promise<void> {
    const buffer = await this.pdfService.generatePDF();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=DBS_Quotation.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
