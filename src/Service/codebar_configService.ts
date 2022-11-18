export const getCodebars = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/codebar_config/')
    return res.json()
}

export const getTypeDocument = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/document_type/')
    return res.json()
}

export const editConfigCodebar =async (array:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(array)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/codebar_config/'+array.CDC_ID, requestOptions);
    const data = await res.json();
    return data
}

export const updateOtherCodebars =async (array:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(array)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/codebar_config/otherCodebars/' + array.CDC_ID, requestOptions);
    const data = await res.json();
    return data
}