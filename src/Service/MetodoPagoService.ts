
/* metodo_pago */
const ListMetodoPago = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/metodo_pago')
    return res.json()
}

const GetOneMetodoPago = async (idTicket: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/getone/' + idTicket)
}

const CreateMetodoPago = async ({formData}: {formData : FormData}) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/', {

        method: "POST",
        body: formData

    })
}

const EditMetodoPago = async ({ formData, MPG_ID }: { formData: FormData, MPG_ID: number }) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/' + MPG_ID, {

        method: "PATCH",
        body: formData

    })
}

// const EditStatus = async (MPG_ID: number, array : any) => {
//     return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/statePago/' + MPG_ID, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         method: "PATCH",
//         body: array
//     })
// }

export const EditStatus =async (array:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(array)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/metodo_pago/statePago/'+array.MPG_ID, requestOptions);
    const data = await res.json();
    return data
}
const DeleteMetodoPago = async (MPG_ID: string) => {
    return await fetch(import.meta.env.VITE_APP_API + '/metodo_pago/' + MPG_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    })
}

export {
    ListMetodoPago,
    GetOneMetodoPago,
    CreateMetodoPago,
    EditMetodoPago,
    DeleteMetodoPago
}