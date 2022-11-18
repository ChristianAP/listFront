import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const listarVentaGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'No tiene acceso a esta ruta'
    },
]

export const ListarVentaGuard = generateGuard(listarVentaGuards, '/admin/ventas')