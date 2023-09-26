import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { CreateProductoDto } from 'src/DTOs/productos/create-producto.dto';
import { UpdateProductoDto } from 'src/DTOs/productos/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/modules/productos/entity/producto.entity';
import * as fs from 'fs';
import { itemsPerPage } from 'src/config';
import { ProductoDto } from 'src/DTOs/productos/producto.dto';

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(Producto)
        private productosRepo: Repository<Producto>,
    ) { }

    async create(
        createProductoDto: CreateProductoDto,
        img: Express.Multer.File,
    ): Promise<Producto | HttpException> {
        const newProducto = await this.productosRepo.create(createProductoDto);
        newProducto.img_url = `${img.destination}/${img.filename}`;
        return await this.productosRepo.save(newProducto);
    }

    async findAll(page: number = 0): Promise<ProductoDto> {
        const skip = page ? ((page - 1) * itemsPerPage) : 0;

        const builder = await this.productosRepo.createQueryBuilder('producto')

        const productos = await builder
            .innerJoinAndSelect('producto.categoria', 'categoria')
            .skip(skip)
            .take(itemsPerPage)
            .getMany(); // Cargar categoria

        const totalItems = await builder.getCount();

        const thereIsNextPage = parseInt((totalItems/itemsPerPage - skip).toFixed(0)) > 0;

        const productosServe: ProductoDto = {thereIsNextPage, totalItems, productos};
        
        return productosServe;
    }

    async findOne(id: number): Promise<Producto | HttpException> {
        try {
            const producto = await this.productosRepo.createQueryBuilder('producto')
                .innerJoinAndSelect('producto.categoria', 'categoria')
                .where('producto.id = :id', { id }).getOne();

            if (!producto)
                return new HttpException(
                    { error: 'producto no encontrado' },
                    HttpStatus.NOT_FOUND,
                );

            return producto;
        } catch (error) {
            return new HttpException(
                { error: error.driverError.detail },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(
        id: number,
        updateProductoDto: UpdateProductoDto,
    ): Promise<Producto> {
        const producto = await this.productosRepo.findOneBy({ id });
        Object.assign(producto, updateProductoDto);
        this.productosRepo.save(producto);
        return producto;
    }

    async remove(id: number): Promise<number> {
        return (await this.productosRepo.delete({ id })).affected;
    }
}