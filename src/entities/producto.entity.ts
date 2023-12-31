import { Categoria } from 'src/entities/categoria.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: '' })
  codigo: string;

  @Column({ default: '' })
  descripcion: string;

  @Column()
  precio: number;

  @ManyToOne((type) => Categoria, (categoria) => categoria.producto)
  @JoinColumn()
  categoria: Categoria;

  @Column({ default: null })
  img_url: string;
}
