
export const producstByCatId = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/categoryById/' + id)
    const dat = await res.json()
    return dat
}

export const stockByProId = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/stock/productId/' + id)
    const dat = await res.json()
    return dat
}

export const stockDetailByStockId = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/stock/stockId/' + id)
    const dat = await res.json()
    return dat
}

export const CreateStockDetail = async (stockDetail: { stkId: any, cantidad: any }) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify({ STK_ID: stockDetail.stkId, STD_INPUT: stockDetail.cantidad })
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/stock_details/', requestOptions)
    const data = await res.json()
    return data
}

// @ts-ignore
export const UpdateStock = async (Stock: { STK_ID: number, stock: any }) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Stock.stock)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/stock/' + Stock.STK_ID, requestOptions)
    const data = await res.json()
    return data
}