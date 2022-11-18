export const getUsPointSales = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/us_point')
    return res.json()
}

export const getUsPointSalesByUserId = async (USR_ID: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/us_point/readPOSByUserId/' + USR_ID)
    return res.json()
}

export const getUsPointSaleById = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/us_point/' + id)
    return res.json()
}

export const getExport = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale/expRem/ult/' + id)
    return res.json()
}

export const exportExcel = async (id: number, fecha : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/point_sale/expRem/' + id+'/'+fecha.fechaIni + '/' + fecha.fechaFin)
    return res.json()
}

export const selectPOSID = async (USR_ID: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/us_point/selectPointSale/' + USR_ID)
    return res.json()
}

export const editeUsPointSale = async ({ objSale, UPS_ID }: { objSale: any, UPS_ID: number }) => {

    return await fetch(import.meta.env.VITE_APP_API + '/us_point/' + UPS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(objSale)

    })
}

// @ts-ignore
export const deleteUsPointSale = async (UPS_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/us_point/' + UPS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

// @ts-ignore
export const deleteByUserUsPointSale = async (UPS_ID) => {
    return await fetch(import.meta.env.VITE_APP_API + '/us_point/deleteUserId/' + UPS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export const createUsPointSale = async (objectSale: any) => {

    return await fetch(import.meta.env.VITE_APP_API + '/us_point/', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objectSale)

    })
}
