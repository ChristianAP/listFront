export const getCategories = async () => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category')
    return res.json()
}

export const getCategoryById = async (id: number) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category/' + id)
    return res.json()
}

export const editeCategory = async ({ formData, CAT_ID }: { formData: FormData, CAT_ID: number }) => {

    return await fetch(import.meta.env.VITE_APP_API + '/category/' + CAT_ID, {

        method: "PATCH",
        body: formData

    })
}

// @ts-ignore
export const deleteCategory = async (CAT_ID) => {
    const res = await fetch(import.meta.env.VITE_APP_API + '/category/' + CAT_ID, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
    }).then(
        res => res.json()
    )
    return await res;
}

export const createCategory = async (formData: FormData) => {
    for (let property of formData.entries()) {
    }
    return await fetch(import.meta.env.VITE_APP_API + '/category/', {

        method: "POST",
        body: formData

    })
}
