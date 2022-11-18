import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"
import { promiseGetRecoil } from "../../../Utils/RecoilOutside/RecoilOutside"
import { AdminState } from "../../Atoms/Admin"

const listarVentasOnlineGuards: IGuardConf[] = [
    {
        guard: async() => {
            const admin = await promiseGetRecoil(AdminState)
            return true
        },
        message: 'No tiene acceso a esta ruta'
    },
]

export const ListarVentasOnlineGuard = generateGuard(listarVentasOnlineGuards, '/admin/ventas')