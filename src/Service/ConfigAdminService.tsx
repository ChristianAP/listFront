export const getConfigs = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/config')
    return res.json()
}

export const getConfigTienda = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/company')
    return res.json()
}

// @ts-ignore
export const editeConfig = async ({ CAT_ID, ...res }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/config/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}

// @ts-ignore
export const deleteConfig = async (CAT_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/config/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createConfig = async (vals: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/config/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(vals)
    })
}

// @ts-ignore
export const updateConfigTemplate = async (TEM_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/config/template/' + TEM_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({ "TEM_ID": TEM_ID })
    })
}