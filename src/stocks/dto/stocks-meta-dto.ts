import { Stock } from '../stock.entity';

export class StocksMetaDto {
  stocks: Stock[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}
