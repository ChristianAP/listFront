import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const productosGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no no tiene permiso'
    },
]

export const ProductosGuard = generateGuard(productosGuards, '/admin')