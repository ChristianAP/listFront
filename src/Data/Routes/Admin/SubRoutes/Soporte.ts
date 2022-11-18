import {
    SoporteDashboard,
    TicketsNuevos,
    TicketSinResolver,
    TicketAbiertos,
    TicketPendiente
} from "../../../../Admin/Views/Soporte";
import { IRoute } from "../../../../Model/Routing";
import { SoporteGuard, TicketGuard } from "../../../Guards/Soporte";

export const SoporteRoutes: IRoute[] = [
    // {
    //     name: 'Informes',
    //     guard: TicketGuard,
    //     path: '/ticket',
    //     component: SoporteDashboard,
    // },
    // {
    //     name: 'Tickets Nuevos',
    //     guard: TicketGuard,
    //     path: '/nuevos',
    //     component: TicketsNuevos,
    // },
    // {
    //     name: 'Tickets Abiertos',
    //     guard: TicketGuard,
    //     path: '/abiertos',
    //     component: TicketAbiertos,
    // },
    // {
    //     name: 'Tickets pendientes',
    //     guard: TicketGuard,
    //     path: '/pendientes',
    //     component: TicketPendiente,
    // },
    // {
    //     name: 'Tickets sin resolver',
    //     guard: TicketGuard,
    //     path: '/sinresolver',
    //     component: TicketSinResolver,
    // },
]