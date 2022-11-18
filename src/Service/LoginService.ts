import Cookies from "universal-cookie";
const cookies = new Cookies();
export const LoginAdmin = async (vals: any) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/singin', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ ...vals })
    })
    const data = await response.json();
    console.log(data);

        localStorage.setItem('token', cookies.get('clientToken'))
    
    return data;
}
export const getTokenAdmin = async (token: string) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/getToken', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            authorization: "bearer=" + token
        },
        method: "GET",
        credentials: 'include',
    })
    const data = await response.json();
    return data;
}
export const createCodigo = async (vals: any) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/createCode', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ ...vals })
    })
    const data = await response.json();
    return data;
}
export const verifyCodigo = async (usuario: any) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/login/validateCode', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({ ...usuario })
    })
    const data = await response.json();
    return data;
}
export const changePassword = async (usuario: any) => {
    let response = await fetch(import.meta.env.VITE_APP_API + '/user/forgot/password', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        credentials: 'include',
        body: JSON.stringify({ ...usuario })
    })
    const data = await response.json();
    return data;
}
