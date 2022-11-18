export const getProviders = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/provider')
    return res.json()
}

//@ts-ignore
export const getDatosSunat = async (ruc:any) => {
    // const res = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1lbmlhbm5hdmFycm9AdXBldS5lZHUucGUifQ.zJdd4hUAcGuqxSqbH2Xp_qWkqOmBX3eGK98AmzJayos`)
    // return res.json()
    if (!isNaN(ruc) && ruc.length === 11) {
        return await fetch(`${import.meta.env.VITE_APP_API}/external/sunat/ruc/${ruc}`).then(res => res.json())
    }else{
        return Promise.reject({
            status: 406,
            message: 'Tu busqueda no es valida, ingresa un valor valido'
        })
    }
}