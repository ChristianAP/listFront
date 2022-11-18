import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const listarClientesGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'No tiene acceso a esta ruta'
    },
]

export const ListarClientesGuard = generateGuard(listarClientesGuards, '/admin/ventas')