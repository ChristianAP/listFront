import { IRoute } from "../../../../Model/Routing";
import {
    Comprobantes,
    ListarClientes,
    ListarVentas,
    ListarVentasOnline,
    RealizarVenta,
    VentaDashboard,
    Impresion,
} from "../../../../Admin/Views/Venta";
import {
    VentasGuard,
    RealizarVentaGuard,
    ListarVentaGuard,
    ComprobantesGuard,
    ListarVentasOnlineGuard,
    ListarClientesGuard,
    ImpresionGuard,
//@ts-ignore
} from "../../../Guards/Ventas";

export const VentasRoutes: IRoute[] = [
    {
        name: 'Realizar Venta',
        guard: RealizarVentaGuard,
        path: '/realizar-venta',
        component: RealizarVenta,
    },
    {
        name: 'Listar Venta',
        guard: ListarVentaGuard,
        path: '/listar-venta',
        component: ListarVentas,
    },
    {
        name: 'Comprobantes Electrónicos',
        guard: ComprobantesGuard,
        path: '/comprobantes',
        component: Comprobantes,
    },
    {
        name: 'Listar Clientes',
        guard: ListarClientesGuard,
        path: '/listar-clientes',
        component: ListarClientes,
    },
    {
        name: 'Listar Ventas Online',
        guard: ListarVentasOnlineGuard,
        path: '/listar-ventas-online',
        component: ListarVentasOnline,
    },
    {
        name: 'Impresion',
        guard: ImpresionGuard,
        path: '/impresion',
        component: Impresion,
        isOnSideBar:true
    },
]