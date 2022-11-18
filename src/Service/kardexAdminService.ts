export const getKardex = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/kardex')
    return res.json()
}

export const getKardexByProduct = async (idProduct:string) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/kardex/'+idProduct)
    return res.json()
}
