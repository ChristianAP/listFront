export const getTrademarks = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/trademark')
    return res.json()
}

// @ts-ignore
export const editeTrademark = async ({ TDK_ID, ...res }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/trademark/' + TDK_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
// @ts-ignore
export const deleteTrademark = async (TDK_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/trademark/' + TDK_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createTrademark = async (vals: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/trademark/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(vals)
    })
}