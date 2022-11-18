export const getAllAlerts = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/temporary/').then(res => res.json());
}
export const getAlertsHistory = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/temporary/history/').then(res => res.json());
}

export const getWarehouse = async () => {    
    return await fetch(import.meta.env.VITE_APP_API + '/product/warehouse/').then(res => res.json());
}

export const getTicketsOpenAlerts = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/ticket/alert/statusopen').then(res => res.json());
}

// @ts-ignore
export const changeStatusAlert = async (idAlert: any) => {
    const response = await fetch(import.meta.env.VITE_APP_API + '/temporary/' + idAlert, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH"
    })
    return response;
}
