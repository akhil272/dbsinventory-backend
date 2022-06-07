import { Quotation } from '../entities/quotation.entity';

export class QuotationsResponseDto {
  quotations: Quotation[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
