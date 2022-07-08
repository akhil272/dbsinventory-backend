import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserQuoteDto } from 'src/user-quote/dto/update-user-quote.dto';
import { SendQuotationDto } from './dto/send-quotation.dto';
import { ManageQuotationsService } from './manage-quotations.service';
import { Response } from 'express';
import RequestWithUser from 'src/auth/request-with-user.interface';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { GetOverviewDto } from './dto/get-overview.dto';

@Controller('manage-quotations')
@UseGuards(JwtAuthenticationGuard)
export class ManageQuotationsController {
  constructor(
    private readonly manageQuotationsService: ManageQuotationsService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserQuoteDto: UpdateUserQuoteDto,
  ) {
    return this.manageQuotationsService.updateQuotationPriceWithUserQuote(
      +id,
      updateUserQuoteDto,
    );
  }

  @Get('download/pdf/:id')
  async sendPDFQuotation(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Res() res: Response,
  ) {
    const buffer = await this.manageQuotationsService.getPDF(+id, request);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=DBS_Quotation_#${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
  @Post('send')
  sendQuotation(@Body() sendQuotationDto: SendQuotationDto) {
    return this.manageQuotationsService.sendQuotation(sendQuotationDto);
  }

  @Post('admin/overview')
  adminOverview(@Body() getOverviewDto: GetOverviewDto) {
    return this.manageQuotationsService.adminOverview(getOverviewDto);
  }
}
