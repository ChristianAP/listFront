import { atom, selector } from "recoil";

export const AdminState = atom({
    key: 'AdminState',
    default: {
        auth: false,
        iu: 0,
        user: '',
        roles: [],
        accesos: []
    }
})

export const AdminDevice = atom({
    key: 'AdminDevice',
    default: false
})

export const SideBarRoutes = selector({
    key: 'SideBarRoutes',
    get: ({get}) => {
        const adminRoutes = get(AdminState);
        // @ts-ignore
        const sideBarRoutes = adminRoutes.accesos.filter(val => val.Acceso !== "Opciones")
        return sideBarRoutes;
    } 
})

export const LoadingScreen = atom({
    key: 'loadingScreen',
    default: true
})