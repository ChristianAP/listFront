import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const registrarCompraGuards: IGuardConf[] = [
    {
        guard: (val:any,dos:any) => true,
        message: 'Ud no tiene acceso'
    },
]

export const RegistrarCompraGuard = generateGuard(registrarCompraGuards, '/admin/compra')