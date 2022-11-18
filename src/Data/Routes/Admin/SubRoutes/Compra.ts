import { IRoute } from "../../../../Model/Routing";
import {
    ListarProveedorGuard
} from "../../../Guards/Compra";
import {
    ListarProveedor
} from '../../../../Admin/Views/Compra';

export const CompraRoutes: IRoute[] = [
    {
        name: 'Listar Proveedor',
        guard: ListarProveedorGuard,
        path: '/listar-proveedor',
        component: ListarProveedor,
    },
]