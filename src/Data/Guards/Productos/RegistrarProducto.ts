import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const registrarProductoGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no es vendedor'
    },
]

export const RegistrarProductoGuard = generateGuard(registrarProductoGuards, '/admin/productos')