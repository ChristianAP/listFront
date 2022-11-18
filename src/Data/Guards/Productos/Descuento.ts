import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const descuentoGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no es vendedor'
    },
]

export const DescuentoGuard = generateGuard(descuentoGuards, '/admin/productos')