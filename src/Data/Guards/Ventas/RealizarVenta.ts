import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"
import { promiseGetRecoil } from "../../../Utils/RecoilOutside/RecoilOutside"
import { AdminState } from "../../Atoms/Admin"

const realizarVentaGuards: IGuardConf[] = [
    {
        guard: async() => {
            const admin = await promiseGetRecoil(AdminState)
        },
        message: 'No tiene acceso a esta ruta'
    },
]

export const RealizarVentaGuard = generateGuard(realizarVentaGuards, '/admin/ventas')