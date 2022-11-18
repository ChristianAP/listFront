import { atom,selector } from "recoil";
export const CostoCompraState = atom({
    key: 'Carrito',
    default: {subtotal:0,
        descuento:0,
        total:0}
})

export const IdOderState = atom({
    key: 'idOrder',
    default:0
})

export const CarritoState = atom({
    key: 'carritoState',
    default: JSON.parse(localStorage.getItem('cart') || '[]')
})

export const filteredTodoListState = selector({
    key: 'filteredTodoListState',
    get: ({get}) => {
      const carrito = get(CarritoState);
        return carrito.length;
    },
  });