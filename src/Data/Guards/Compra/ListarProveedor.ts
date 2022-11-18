import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const listarProveedorGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no tiene acceso'
    },
]

export const ListarProveedorGuard = generateGuard(listarProveedorGuards, '/admin/compra')