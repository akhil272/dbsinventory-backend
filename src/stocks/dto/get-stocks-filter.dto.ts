import { StockStatus } from '../stock-status-enum';

export class GetStocksFilterDto {
  status?: StockStatus;
  brand?: string;
  size?: string;
  pattern?: string;
  vendor?: string;
  search?: string;
}
