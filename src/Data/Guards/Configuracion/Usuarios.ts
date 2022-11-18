import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"

const usauriosGuards: IGuardConf[] = [
    {
        guard: true,
        message: 'Ud no tiene acceso'
    },
]

export const UsuariosGuard = generateGuard(usauriosGuards, '/admin/configuracion')