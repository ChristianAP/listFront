
/* order_type */
const ListFormaVenta = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/order_type')
    return res.json()
}

const CreateFormaVenta = async (formData: FormData) => {
    return await fetch(import.meta.env.VITE_APP_API + '/order_type/', {

        method: "POST",
        body: formData

    })
}

const EditFormaVenta = async ({ formData, MPG_ID }: { formData: FormData, MPG_ID: number }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/order_type/' + MPG_ID, {

        method: "PATCH",
        body: formData

    })
}

const DeleteFormaVenta = async (MPG_ID: string) => {
    return await fetch(import.meta.env.VITE_APP_API + '/order_type/' + MPG_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export {
    ListFormaVenta,
    CreateFormaVenta,
    EditFormaVenta,
    DeleteFormaVenta
}