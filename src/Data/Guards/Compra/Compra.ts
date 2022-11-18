import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const compraGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no tiene acceso'
    },
]

export const CompraGuard = generateGuard(compraGuards, '/admin')