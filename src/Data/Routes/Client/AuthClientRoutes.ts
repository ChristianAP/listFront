import {
    Perfil,
    MetodoPago,
    Pedidos,
    Soporte
} from "../../../Client/Private";
import { PedidosDetalle } from "../../../Client/Private/PedidosDetalle/PedidosDetalle";
import { IClientRoutes } from "../../../Model/Routing";

export const AuthClientRoutes: IClientRoutes[] = [
    {
        path: '/metodo-pago',
        component: MetodoPago,
        isPrivate: true,
    },
    {
        path: '/perfil',
        component: Perfil,
        isPrivate: true
    },
    {
        path: '/pedidos',
        component: Pedidos,
        isPrivate: true
    },
    // NUEVA RUTA
    {
        path: '/pedidos/detalle/:id',
        component: PedidosDetalle,
        isPrivate: true
    },
    {
        path: '/soporte',
        component: Soporte,
        isPrivate: true
    },
]