import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const ticketGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no tiene acceso'
    },
]

export const TicketGuard = generateGuard(ticketGuards, '/admin/soporte')