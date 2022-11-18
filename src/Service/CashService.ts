export const getCaja = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/caja')
    return res.json()
}

export const getCajaByUserID = async (USR_ID : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/caja/CashByUser/' + USR_ID)
    return res.json()
}

export const getUltimoCashByUserID = async (USR_ID : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/caja/UltimoByUserID/' + USR_ID)
    return res.json()
}

export const getSalesForCash = async (obj : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/caja/SaleForCash/' + obj.USR_ID, {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(obj)

    })
    return res.json()
}

export const aperturarCajaDay = async (obj: any) => {

    return await fetch(import.meta.env.VITE_APP_API + '/caja/', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(obj)

    })
}

export const CloseCash =async (array:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(array)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/caja/'+array.CJA_ID, requestOptions);
    const data = await res.json();
    return data
}