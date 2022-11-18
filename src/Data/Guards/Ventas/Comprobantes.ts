import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"
const comprobantesGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'No tiene acceso a esta ruta'
    },
]

export const ComprobantesGuard = generateGuard(comprobantesGuards, '/admin/ventas')