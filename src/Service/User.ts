
export const ListUsersForTicket = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/fortickets')
    const data = await res.json()
    return data
}

export const ListAllUsers = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/users')
    const data = await res.json()
    return data
}

export const SearchUser = async (values: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/search/' + values)
    const data = await res.json()
    return data
}

export const SearchDriver = async (values: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/driver/' + values)
    const data = await res.json()
    return data
}

// @ts-ignore
export const UpdateStatusUsers = async (USR_ID: any, res: any) => {
    const response = await fetch(import.meta.env.VITE_APP_API + '/user/' + USR_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({ "USR_STATUS": res })
    })
    return response
}

export const validateUser = async (nombre: string) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/validateUser', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ "USR_USER": nombre })
    })
    return res.json()
}

export const createUser = async (vals: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/user/', requestOptions)
    const data = await res.json()
    return data
}

export const createUserRol = async (vals: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/user_rol/', requestOptions)
    const data = await res.json()
    return data
}

export const createCountClient = async (vals: any) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(vals)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/user_rol/count/client', requestOptions)
    const data = await res.json()
    return data
}