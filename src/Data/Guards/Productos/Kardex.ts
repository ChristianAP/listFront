import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const kardexGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no es vendedor'
    },
]

export const KardexGuard = generateGuard(kardexGuards, '/admin/productos')