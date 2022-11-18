export const getCompany = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/company/'+import.meta.env.VITE_APP_IDENTIFICATOR)
    return res.json()
}

export const createCompany = async (vals: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/company/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(vals)
    })
}

// @ts-ignore
export const UpdateCompany = async ({ COM_ID, ...res }) => {
    const response = await fetch(import.meta.env.VITE_APP_API + '/company/' + COM_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
export const accesstiendaonline = async (obj : any) => {
    const response = await fetch(import.meta.env.VITE_APP_API + '/access/tiendaCompartida/' + obj.nro, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(obj)
    })
}

export const deleteCompany = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/company/1')
    return res.json()
}
