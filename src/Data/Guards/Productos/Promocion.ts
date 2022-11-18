import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const promocionGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no es vendedor'
    },
]

export const PromocionGuard = generateGuard(promocionGuards, '/admin/productos')