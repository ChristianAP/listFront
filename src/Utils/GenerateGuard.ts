
import { IGuard, IGuardConf } from '../Model/Routing';
import { sumBooleans } from './Generics/SumBooleans';

export const generateGuard = (guardConf: IGuardConf[], path: string): IGuard => {
    const canActiveArr = guardConf.map((guard) => guard.guard)
    const text = guardConf.map((guard) => guard.message)
    const canActive = sumBooleans(canActiveArr)
    return {
        canActive,
        path,
        text
    }
}

