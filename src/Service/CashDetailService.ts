export const detalleCaja = async (obj: any) => {

    return await fetch(import.meta.env.VITE_APP_API + '/caja_detalle/', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(obj)

    })
}

export const updateMount =async (array:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(array)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/caja_detalle/update_monto/'+array.CJA_ID, requestOptions);
    const data = await res.json();
    return data
}