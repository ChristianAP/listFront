import { createCliente } from "../Model/Clientes"

export const CreateClient = async (cliente: createCliente) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    };
    const res = await fetch(import.meta.env.VITE_APP_API + '/client/', requestOptions)
    const data = await res.json()
    return data
}

export const ListClientes = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/client/')
    const data = await res.json()
    return data
}
export const ListTrabajadores = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/client/worker/')
    const data = await res.json()
    return data
}

export const ListOneCliente = async (idClient:number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/client/oneclient/'+idClient)
    const data = await res.json()
    return data
}

// @ts-ignore
export const EditarCliente = async (CLI_ID:number , cliente:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/client/edit/'+CLI_ID, requestOptions)
    const data = await res.json()
    return data
}

export const DeleteCliente = async (idCliente: number) => {
    const res = await  fetch(import.meta.env.VITE_APP_API + '/client/'+idCliente, { method: 'DELETE' })
    const data = await res.json()
    return data
}
