export const getTemplates = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/template')
    return res.json()
}

// @ts-ignore
export const editeTemplate = async ({ CAT_ID, ...res }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/template/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}
// @ts-ignore
export const deleteTemplate = async (CAT_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/template/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createTemplate = async (vals: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/template/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(vals)
    })
}