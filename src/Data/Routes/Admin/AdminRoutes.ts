import { IRoute } from "../../../Model/Routing";
import { SubRoutes } from "../../../Routes/Admin/SubRoutes";
import {
    CompraRoutes,
    ConfiguracionRoutes,
    ProductoRoutes,
    SoporteRoutes,
    VentasRoutes
} from "./SubRoutes";
import {
    CompraGuard,
    ConfiguracionGuard,
    ProductosGuard,
    SoporteGuard,
    VentasGuard
} from "../../Guards";


export const AdminRoutes: IRoute[] = [
    // {
    //     name: 'Ventas',
    //     guard: VentasGuard,
    //     path: '/ventas',
    //     component: () => SubRoutes(VentasRoutes),
    //     child: VentasRoutes
    // },
    // {
    //     name: 'Producto',
    //     guard: ProductosGuard,
    //     path: '/producto',
    //     component: () => SubRoutes(ProductoRoutes),
    //     child: ProductoRoutes
    // },
    // {
    //     name: 'Compra',
    //     guard: CompraGuard,
    //     path: '/compra',
    //     component: () => SubRoutes(CompraRoutes),
    //     child: CompraRoutes
    // },
    // {
    //     name: 'Configuración',
    //     guard: ConfiguracionGuard,
    //     path: '/configuracion',
    //     component: () => SubRoutes(ConfiguracionRoutes),
    //     child: ConfiguracionRoutes
    // },
    // {
    //     name: 'Soporte',
    //     guard: SoporteGuard,
    //     path: '/soporte',
    //     component: () => SubRoutes(SoporteRoutes),
    //     child: SoporteRoutes
    // },
]