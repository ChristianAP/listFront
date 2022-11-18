export const getProducts = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product')
    return res.json()
}

export const getProductsByFather = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/father/' + id)
    return res.json()
}

export const getProductsStocks = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/buy/productstock')
    return res.json()
}

export const editeProduct = async ({ formData, PRO_ID }: { formData: FormData, PRO_ID: number }) => {
    formData.delete('TDK_NAME');
    formData.delete('CAT_NAME');
    return await fetch(import.meta.env.VITE_APP_API + '/product/' + PRO_ID, {

        method: "PATCH",
        body: formData

    })
}
// @ts-ignore
export const deleteProduct = async (PRO_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/product/' + PRO_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createProduct = async (formData: FormData) => {
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/', requestOptions)
    const data = await res.json()
    return data
}

export const createProductChildren = async (product: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/', requestOptions)
    const data = await res.json()
    return data
}
export const createStock = async (vals: any) => {
    //await fetch(import.meta.env.VITE_APP_API + '/discount_detail/desableddiscount/'+DIS_ID)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/stock/', requestOptions)
    const data = await res.json()
    return data
}

export const createProductByDocumentAndStock = async (products: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/document/fromaddproduct/', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
    });
    return res.json()
}

export const getProductswithTDandCat = async (online: any) => {
    const res = await fetch(
        import.meta.env.VITE_APP_API + '/product/withCatAndTrade/' + (online ? 1 : 0)
    )
    return res.json()
}

export const getBuys = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/document/buys');
    return res.json()
}

export const getBuyDetail = async (page: string) => {

    const res = await fetch(import.meta.env.VITE_APP_API + '/sales_description/bybuy/' + page);
    return res.json()
}


export const getUnitMean = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/product/unitMean')
    return res.json()
}