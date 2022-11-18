export const getPointSales = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale')
    return res.json()
}

export const getPointSaleById = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + id)
    return res.json()
}

export const getSaleByPOS = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale/VentaByPOS/' + id)
    return res.json()
}

export const editePointSale = async ({ objSale, POS_ID }: { objSale: any, POS_ID: number }) => {

    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + POS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(objSale)

    })
}

// @ts-ignore
export const deletePointSale = async (POS_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/' + POS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createPointSale = async (objectSale: any) => {

    return await fetch(import.meta.env.VITE_APP_API + '/point_sale/', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objectSale)

    })
}
