import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class LocalFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}

export default LocalFile;
