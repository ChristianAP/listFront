// @ts-ignore
export const editeProductDetail = async ({ PRO_ID, ...res }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/product_details/' + PRO_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
// @ts-ignore
export const deleteProductDetail = async (PRO_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/product_details/' + PRO_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createProductDetail = async (vals: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/product_details', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(vals)
    })
}
