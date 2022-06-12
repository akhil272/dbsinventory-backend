import { Stock } from '../entities/stock.entity';

export class StocksWithMetaDto {
  stocks: Stock[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
