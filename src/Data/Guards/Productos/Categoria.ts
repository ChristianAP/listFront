import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const categoriaGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no tiene acceso'
    },
]

export const CategoriaGuard = generateGuard(categoriaGuards, '/admin/productos')