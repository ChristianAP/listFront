import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const ImpresionGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'No tiene acceso a esta ruta'
    },
]

export const ImpresionGuard = generateGuard(ImpresionGuards, '/admin')