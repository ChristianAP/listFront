import { atom } from "recoil";

export const ClientState = atom({
    key: 'ClientState',
    default: {
        auth: false,
        user: '',
        roles: [],
        iu:0,
        accesos: []
    }
})

export const ClientModelState = atom({
    key: 'ClientModelState',
    default: {
        id:1,
        nombre:'',
    }
})

export const GrupoState = atom({
    key: 'GrupoState',
    default: true
})

export const TipoState = atom({
    key: 'TipoState',
    default: true
})

export const ClasificacionState = atom({
    key: 'ClasificacionState',
    default: true
})

export const NavClient = atom({
    key: 'NacClientState',
    default: false
})
export const HeaderClient = atom({
    key: 'HeaderClientState',
    default: true
})