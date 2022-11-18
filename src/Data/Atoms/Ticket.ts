import { atom } from "recoil";
import { ListSoporteNuevos } from "../../Service/SoporteService";

export const listaTicketsState = atom({
    key: 'listaTicketsNuevos',
    default: ListSoporteNuevos()
})

export const listaTickets = atom({
    key: 'listaTicketsNuevosView',
    default: true
})