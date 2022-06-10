import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Transport } from 'src/transport/entities/transport.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Location } from 'src/location/entities/location.entity';
import { TyreDetail } from 'src/tyre-detail/entities/tyre-detail.entity';
import { LoadIndex } from 'src/load-index/entities/load-index.entity';
import { SpeedRating } from 'src/speed-rating/entities/speed-rating.entity';
@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_line: string;

  @Column()
  dom: string;

  @Column()
  purchase_date: Date;

  @Column()
  purchased_quantity: number;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @ManyToOne(() => SpeedRating, (speedRating) => speedRating.stocks)
  speed_rating: SpeedRating;

  @ManyToOne(() => LoadIndex, (loadIndex) => loadIndex.stocks)
  load_index: LoadIndex;

  @Column('boolean', { default: false })
  sold_out: boolean;

  @ManyToOne(() => TyreDetail, (tyreDetail) => tyreDetail.stocks)
  tyreDetail: TyreDetail;

  @ManyToOne((_type) => Transport, (transport) => transport.stocks)
  transport: Transport;

  @ManyToOne((_type) => Vendor, (vendor) => vendor.stocks)
  vendor: Vendor;

  @ManyToOne((_type) => Location, (location) => location.stocks)
  location: Location;

  @ManyToOne((_type) => User, (user) => user.stocks, { eager: false })
  user: User;

  @OneToMany((_type) => Order, (order) => order.stock)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;
}
