export const getOrdenSteps = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/pasos_online/activated/')
    return res.json()
}

export const getOrdenStepsAll = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/pasos_online/')
    return res.json()
}

export const getValidatedSteps = async (obj : any) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/pasos_online/validatedStep/' + obj)
    return res.json()
}

export const EditStep = async ( obj_step: any ) => {

    return await fetch(import.meta.env.VITE_APP_API + '/pasos_online/' + obj_step.ORS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(obj_step)

    })
}

export const EditStepStatus = async ( obj_step: any ) => {

    return await fetch(import.meta.env.VITE_APP_API + '/pasos_online/status/' + obj_step.ORS_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(obj_step)

    })
}

export const getProductDescritions = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/pasos_online/productsDescritions/')
    return res.json()
}

export const EditDescriptionProducts = async ( obj_step: any ) => {

    return await fetch(import.meta.env.VITE_APP_API + '/pasos_online/stateProductDescriptions/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(obj_step)

    })
}
