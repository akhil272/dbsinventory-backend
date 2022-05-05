import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Tyre } from 'src/tyre/entities/tyre.entity';
import { Pattern } from 'src/pattern/entities/pattern.entity';
import { Transport } from 'src/transport/entities/transport.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Location } from 'src/location/entities/location.entity';
@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_line: string;

  @ManyToOne((_type) => Pattern, (pattern) => pattern.stocks)
  pattern: Pattern;

  @ManyToOne((_type) => Tyre, (tyre) => tyre.stocks)
  tyre_size: Tyre;

  @Column()
  dom: string;

  @Column()
  purchase_date: Date;

  @ManyToOne((_type) => Transport, (transport) => transport.stocks)
  transport: Transport;

  @ManyToOne((_type) => Vendor, (vendor) => vendor.stocks)
  vendor: Vendor;

  @ManyToOne((_type) => Location, (location) => location.stocks)
  location: Location;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column('boolean', { default: false })
  sold_out: boolean;

  @ManyToOne((_type) => User, (user) => user.stocks, { eager: false })
  user: User;

  @OneToMany((_type) => Order, (order) => order.stock)
  orders: Order[];
}
