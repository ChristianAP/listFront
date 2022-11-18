import { atom } from "recoil";

export const ContactState = atom({
    key: 'ContactState',
    default: {
        phone: import.meta.env.VITE_APP_PHONE,
        mail: import.meta.env.VITE_APP_MAIL
    }
})