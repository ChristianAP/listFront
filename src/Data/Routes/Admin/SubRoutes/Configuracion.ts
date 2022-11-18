// @ts-ignore
import { Empresa, Usuarios, Impresora } from "../../../../Admin/Views/Configuracion";
import { IRoute } from "../../../../Model/Routing";
import {
    EmpresaGuard,
    UsuariosGuard
} from "../../../Guards/Configuracion";

export const ConfiguracionRoutes: IRoute[] = [
    {
        name: 'Usuarios',
        guard: UsuariosGuard,
        path: '/usuarios',
        component: Usuarios,
    },
    {
        name: 'Empresa',
        guard: EmpresaGuard,
        path: '/empresa',
        component: Empresa,
    },
    {
        name: 'Impresora',
        guard: EmpresaGuard,
        path: '/impresora',
        component: Impresora,
    },
]