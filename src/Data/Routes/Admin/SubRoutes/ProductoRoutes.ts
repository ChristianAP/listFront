import { IRoute } from '../../../../Model/Routing';
import {
    RegistrarProductoGuard,
    CategoriaGuard,
    MarcaGuard,
    DescuentoGuard,
    PromocionGuard,
    KardexGuard,
    PriceListGuard
//@ts-ignore
} from '../../../Guards/Productos';
import {
    RegistrarProducto,
    Categoria,
    // Marca,
    Descuento,
    Promocion,
    PriceList,
    Kardex
} from '../../../../Admin/Views/Producto';

export const ProductoRoutes: IRoute[] = [
    // {
    //     name: 'Registrar Producto',
    //     guard: RegistrarProductoGuard,
    //     path: '/registrar-producto',
    //     component: RegistrarProducto,
    // },
    // {
    //     name: 'Categoría',
    //     guard: CategoriaGuard,
    //     path: '/categoria',
    //     component: Categoria,
    // },
    // {
    //     name: 'Marca',
    //     guard: MarcaGuard,
    //     path: '/marca',
    //     component: Marca,
    // },
    // {
    //     name: 'Descuento',
    //     guard: DescuentoGuard,
    //     path: '/descuento',
    //     component: Descuento,
    // },
    // {
    //     name: 'Lista de Precios',
    //     guard: PriceListGuard,
    //     path: '/lista-precios',
    //     component: PriceList,
    // },
    // {
    //     name: 'Promocion',
    //     guard: PromocionGuard,
    //     path: '/promocion',
    //     component: Promocion,
    // },
    // {
    //     name: 'Kardex Productos',
    //     guard: KardexGuard,
    //     path: '/kardex-productos',
    //     component: Kardex,
    // },
]