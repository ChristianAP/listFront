// import Cookies from "universal-cookie";
// const cookies = new Cookies();
// const token = cookies.get('token');

export const ListSoporteNuevos = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/status/1')
    const dat = await res.json()
    return dat
}

export const ListSoportePendiente = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/status/3')
    const dat = await res.json()
    return dat
}

export const ListSoporteAbiertos = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/status/2')
    const dat = await res.json()
    return dat
}

export const ListSoporteSinResolver = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/status/5')
    const dat = await res.json()
    return dat
}

export const GetOneSoporte = async (idTicket: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/getone/' + idTicket)
}

export const CreateSoporte = async (ticket: string) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(ticket)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/', requestOptions)
    const data = await res.json()
    return data
}

export const EditSoporte = async (idTicket: any, consts: any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(consts)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/ticket/update/' + idTicket, requestOptions)
    return await res.json()
}

export const CreateEvidenceTicket = async (formData: FormData) => {
    const requestOptions = {
        method: 'POST',
        body: formData,
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/evidence/image/', requestOptions)
    const data = await res.json()
    return data
}

export const DeleteSoporte = async (estado: string) => {
    //// TO DO
}
