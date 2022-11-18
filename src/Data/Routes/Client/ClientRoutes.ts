import {
    Buscador,
    Carrito,
    Categoria,
    CategoriaName,
    ClientDashboard,
    Contactanos,
    Login,
    MediosDePago,
    Nosotros,
    Producto,
    Registrar,
    Ofert

} from "../../../Client/Public";
import { IClientRoutes } from "../../../Model/Routing";

export const ClientRoutes: IClientRoutes[] = [
    
    {
        path: '/',
        component: ClientDashboard,
        isPrivate: false,
        exact:false
    },
    {
        path: '/categoria',
        component: Categoria,
        isPrivate: false
    },
    {
        path: '/categoria/:name',
        component: CategoriaName,
        isPrivate: false
    },
    {
        path: '/nosotros',
        component: Nosotros,
        isPrivate: false
    },
    {
        path: '/buscador/:buscador',
        component: Buscador,
        isPrivate: false
    },
    {
        path: '/contactanos',
        component: Contactanos,
        isPrivate: false
    },
    {
        path: '/medios-de-pago',
        component: MediosDePago,
        isPrivate: false
    },
    {
        path: '/producto/:id',
        component: Producto,
        isPrivate: false
    },
    {
        path: '/login',
        component: Login,
        isPrivate: false
    },
    {
        path: '/registrar',
        component: Registrar,
        isPrivate: false
    },
    {
        path: '/carrito',
        component: Carrito,
        isPrivate: false
    },
    {
        path: '/ofert/:id',
        component: Ofert,
        isPrivate: false
    }
]