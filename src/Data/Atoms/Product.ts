import { atom } from "recoil";

export const ProductState = atom({
    key: 'ProductState',
    default: false
})

export const SearcherState = atom({
    key: 'SearcherState',
    default: {
        where:false,
        key:''
    }
})