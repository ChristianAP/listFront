import { useRecoilValue } from "recoil"
import { IGuardConf } from "../../../Model/Routing"
import { generateGuard } from "../../../Utils/GenerateGuard"
import { promiseGetRecoil } from "../../../Utils/RecoilOutside/RecoilOutside"
import { AdminState } from "../../Atoms/Admin"


const ventasGuards: IGuardConf[] = [
    {
        guard: async () => {
            const admin = await promiseGetRecoil(AdminState)
        },
        message: 'Ud no es vendedor'
    },
]

export const VentasGuard = generateGuard(ventasGuards, '/admin')