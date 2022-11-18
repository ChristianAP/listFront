import { CreatePerson } from "../Model/Person"

// import Cookies from "universal-cookie";
// const cookies = new Cookies();
// const token = cookies.get('token');

export const ListGrupo = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/group/IND')
    const data = await res.json()
    return data
}

export const GetPersonUserOne = async (userId: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + `/person/user/${userId}`)
    const data = await res.json()
    return data
}

export const GetPersonByID = async (PER_ID: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + `/person/${PER_ID}`)
    const data = await res.json()
    return data
}

export const GetUserOne = async (userId: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + `/user/${userId}`)
    const data = await res.json()
    return data
}

export const ListClasificacion = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/clasification/IND')
    const data = await res.json()
    return data
}
export const ListFormaPago = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/payment_method')
    const data = await res.json()
    return data
}

export const ListTipo = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/person_type/IND')
    const data = await res.json()
    return data
}

export const CreatePersona = async (persona: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(persona)
    };
    return await fetch(import.meta.env.VITE_APP_API + '/person/create', requestOptions).then(response => response.json())
    // return await fetch(import.meta.env.VITE_APP_API + '/person/', requestOptions).then(response => response.json())
}

export const CreateProveedor= async (persona: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(persona)
    };
    // return await fetch(import.meta.env.VITE_APP_API + '/person/create', requestOptions).then(response => response.json())
    return await fetch(import.meta.env.VITE_APP_API + '/person/', requestOptions).then(response => response.json())
}

export const DeletePerson = async (idCliente: number) => {
    const res = await  fetch(import.meta.env.VITE_APP_API + '/person/'+idCliente, { method: 'DELETE' })
    const data = await res.json()
    return data
}

export const DeleteProveedor = async (idCliente: number) => {
    const res = await  fetch(import.meta.env.VITE_APP_API + '/person/deleteProveedor/'+idCliente, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify({})

    })
    const data = await res.json()
    return data
}

export const ListForTicket = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/person/fortickets/')
    const data = await res.json()
    return data
}

export const ListForDocument = async (idCliente: any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/person/fordocument/'+idCliente)
    const data = await res.json()
    return data
}

export const EditPersona =async (idPerson:number , persona:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(persona)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/person/adduser/'+idPerson, requestOptions);
    const data = await res.json();
    return data
}

export const searchPersonByDocument = async (search_data: any) => {
    if (!isNaN(search_data) && search_data.length === 8) {
        return await fetch(`${import.meta.env.VITE_APP_API}/person/findbydni/${search_data}`).then(res => res.json())
    } else if (!isNaN(search_data) && search_data.length === 11) {
        return await fetch(`${import.meta.env.VITE_APP_API}/person/findbyruc/${search_data}`).then(res => res.json())
    }else if(!isNaN(search_data) === false){
        let send_data = search_data.searcher ? search_data.searcher : 'no'
        return await fetch(`${import.meta.env.VITE_APP_API}/person/findbyname/${send_data}`).then(res => res.json())
    } else {
        return Promise.reject({
            status: 406,
            message: 'Tu busqueda no es valida, ingresa un valor valido'
        })
    }
}

export const getConductor = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/person/conductor')
    const data = await res.json()
    return data
}

export const AddPlaLice =async (persona:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(persona)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/person/PlaLice/', requestOptions);
    const data = await res.json();
    return data
}

export const DeleteRolConductor =async (obj:any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json', 
            // authorization: 'bearer=' + token 
        },
        body: JSON.stringify(obj)
    };
    const res = await  fetch(import.meta.env.VITE_APP_API + '/person/DeleteCond/', requestOptions);
    const data = await res.json();
    return data
}

export const createRolConductor = async (PER_ID : number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/person/RolCondu/'+ PER_ID)
    const data = await res.json()
    return data
}