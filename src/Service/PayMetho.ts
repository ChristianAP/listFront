
/* payment_method */
const ListTipoPago = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/payment_method')
    return res.json()
}


const CreateTipoPago = async ({ ...res }: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/payment_method/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(res)

    })
}

const EditTipoPago = async ({ PMT_ID, ...res }: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/payment_method/' + PMT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(res)
    })
}

const DeleteTipoPago = async (MPG_ID: string) => {
    return await fetch(import.meta.env.VITE_APP_API + '/payment_method/' + MPG_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export {
    ListTipoPago,
    CreateTipoPago,
    EditTipoPago,
    DeleteTipoPago
}