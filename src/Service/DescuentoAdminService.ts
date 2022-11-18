// @ts-ignore
export const getProductWithCategoryOrProduct = async (searcher) => {
    console.log(searcher);

    const res = searcher.where == "cat" ? await fetch(import.meta.env.VITE_APP_API + '/discount_detail/searchcat/' + searcher.searcher + '/' + (searcher.online ? "1" : "0")) :
        await fetch(import.meta.env.VITE_APP_API + '/discount_detail/searchpro/' + searcher.searcher + '/' + (searcher.online ? "1" : "0"))
    console.log(res);
    return res.json()
}
// @ts-ignore
export const getDiscountHeader = async (online: boolean) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/discounts/online/' + (online ? "1" : "0"))
    return res.json()
}
// @ts-ignore
export const getDiscountDetail = async (DIS_ID) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/discount_detail/product/' + DIS_ID)
    return res.json()
}
// @ts-ignore
export const editeDiscount = async ({ DIS_ID, ...res }) => {

    return await fetch(import.meta.env.VITE_APP_API + '/discounts/' + DIS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
// @ts-ignore
export const deleteDiscountDetail = async (DSP_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/discount_detail/' + DSP_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}
// @ts-ignore
export const deleteDiscount = async (DIS_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/discounts/' + DIS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}
export const createDiscount = async (vals: any) => {
    //await fetch(import.meta.env.VITE_APP_API + '/discount_detail/desableddiscount/'+DIS_ID)
    return await fetch(import.meta.env.VITE_APP_API + '/discounts/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ ...vals })

    })
}