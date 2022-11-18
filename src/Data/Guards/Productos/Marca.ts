import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const marcaGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no es vendedor'
    },
]

export const MarcaGuard = generateGuard(marcaGuards, '/admin/productos')