export const GetAllRol = async () => {
    return await fetch(import.meta.env.VITE_APP_API + '/rol/').then(res => res.json());
}

export const GetByRol = async (role_id: any) => {
    return await fetch(import.meta.env.VITE_APP_API + '/access/byrol/' + role_id).then(res => res.json());
    
}

export const AddRol = async (data: any) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    return await fetch(import.meta.env.VITE_APP_API + '/rol', requestOptions).then(res => res.json());
}

export const AddAccessesRol = async (data: any) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    return await fetch(import.meta.env.VITE_APP_API + '/access_rol/add', requestOptions).then(res => res.json());
}

export const UpdateEstatusAccessesRol = async (data: any) => {
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ARO_STATUS: data.estado == 1 ? 0 : 1
        })
    };
    return await fetch(import.meta.env.VITE_APP_API + '/access_rol/update/' + data.id, requestOptions).then(res => res.json());
}

export const DeleteAccessesRol = async (data: any) => {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    return await fetch(import.meta.env.VITE_APP_API + '/access_rol/delete/' + data.id, requestOptions).then(res => res.json());
}
