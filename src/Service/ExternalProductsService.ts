// /* metodo_pago */
export const listAlertsType = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/external_products/alerts/')
    return res.json()
}

export const listExternalProducts = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/external_products/')
    return res.json()
}

export const listProductType = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/external_products/product_type/')
    return res.json()
}

export const listPaymenthMetod = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/external_products/paymenthmetod/')
    return res.json()
}

// const GetOneMetodoPago = async (idTicket: number) => {
//     const res = await fetch(import.meta.env.VITE_APP_API + '/getone/' + idTicket)
// }

export const createExternalProducts = async (obj : any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/external_products/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(obj)

    })
}

export const editStatusCompra = async (array : any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/external_products/stateCompra/' + array.ETP_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(array)
    })
}