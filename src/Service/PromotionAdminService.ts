import { IPromocion } from "../Model/Promotion"

/* promotion */
const ListPromotion = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/promotion')
    return res.json()
}

const GetOnePromotion = async (idTicket: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/getone/' + idTicket)
}

const CreatePromotion = async (formData: FormData) => {
    return await fetch(import.meta.env.VITE_APP_API + '/promotion/', {

        method: "POST",
        body: formData

    })
}
// @ts-ignore
const EditPromotionStatus = async ({ PRT_ID, ...res }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/promotion/' + PRT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
const EditPromotion = async ({ formData, PRT_ID }: { formData: FormData, PRT_ID: number }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/promotion/' + PRT_ID, {

        method: "PATCH",
        body: formData

    })
}
const DeletePromotion = async (PRT_ID: string) => {
    return await fetch(import.meta.env.VITE_APP_API + '/promotion/' + PRT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export {
    ListPromotion,
    GetOnePromotion,
    CreatePromotion,
    EditPromotion,
    EditPromotionStatus,
    DeletePromotion
}