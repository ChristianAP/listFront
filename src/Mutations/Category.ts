import { QueryClient } from "react-query"
import { v4 as uuidv4 } from 'uuid';
import { createCategory, deleteCategory, editeCategory } from "../Service/CategoryAdminService";

const create = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('createCategory', {

        // ? FUNCIÓN QUE RETORNA LA PROMESA
        mutationFn: createCategory,

        // ? ANTES DE MANDAR AL BACKEND 
        onMutate: async (variables) => {

            // ! DETENEMOS EL QUERY EN CASO SE CONSULTE SOLO
            //await queryClient.cancelQueries('categories')
            /*
             * GUARDAMOS EL NUEVO REGISTRO EN UNA VARIABLE
             * CREAMOS UN ID TEMPORAL MIENTRAS SE ESPERA LA RESPUESTA DEL BACKEND
            */
            //const optimisticCat = { CAT_ID: uuidv4(), ...variables }

            // * AGREGAMOS EL NUEVO REGISTRO A LA DATA EN EL CLIENTE
            //queryClient.setQueryData('categories', (old: any) => [...old, optimisticCat])

            // * GUARDAMOS EL NUEVO REGISTRO EN LA VARIABLE CONTEXT DE REACT TABLE
            //return { optimisticCat }
        },

        // * CUANDO EL BACKEND RESPONDE
        onSuccess: (result, variables, context) => {

            /*
             * REEMPLAZAMOS EL REGISTRO GUARDADO EN EL CLIENTE
             * CON LA DATA Q NOS REGRESE EL BACKEND
             * EN ESTE CASO SOLO REEMPLAZAMOS EL ID
            */
            queryClient.invalidateQueries('categories')
            /* queryClient.setQueryData('categories', (old: any) =>
                old.map((cat: any) =>
                    //@ts-ignore
                    cat.CAT_ID === context.optimisticCat.CAT_ID ? { ...cat, CAT_ID: result.data } : cat
                )) */
        },

        // ! CUANDO HAY UN ERROR
        onError: (error, variables, context) => {
            // ! SI HAY UN ERROR, SE ELIMINA EL REGISTRO AGREGADO EN EL CLIENTE
            // @ts-ignore
            queryClient.setQueryData('categories', (old: any) => old.filter((todo: any) => todo.id !== context.optimisticTodo.CAT_ID))
        },
    })
}

const edite = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('editeCategory', {

        // ? FUNCIÓN QUE RETORNA LA PROMESA
        mutationFn: editeCategory,

        // ? ANTES DE MANDAR AL BACKEND 
        onMutate: async updatedCategory => {
            /* 
            ! DETENEMOS EL QUERY EN CASO SE CONSULTE SOLO
            ! EN ESTA CASO CANCELAMOS EL ELEMENTO CON EL ID
            */
            //await queryClient.cancelQueries(['categories', updatedCategory.CAT_ID])

            /* 
            * GUARDAMOS EL REGISTRO ANTERIOR EN UNA VARIABLE
            ? ESTO SE HACE EN CASO DEBAMOS RECUPERAR LOS DATOS ANTERIORES
            */
            //const previousCategory = queryClient.getQueryData(['categories', updatedCategory.CAT_ID])

            // * GUARDAMOS EL REGISTRO ANTERIOR Y SU ACTUALIZACIÓN
            //return { previousCategory, updatedCategory }
            //queryClient.invalidateQueries('categories')
        },

        // * CUANDO EL BACKEND RESPONDE
        onSuccess: (result, request, context) => {

            // * GUARDAMOS LA ACTUALIZACIÓN EN UNA VARIABLE
            //@ts-ignore
            queryClient.invalidateQueries('categories')
            // const updatedCategory = context.updatedCategory

            // * REEMPLAZAMOS LA NUEVA VARIABLE EN LA DATA DEL CLIENTE
            //@ts-ignore
            //queryClient.setQueryData('categories', (old: []) => old.map(cat => cat.CAT_ID === updatedCategory.CAT_ID ? updatedCategory : cat))

        },

        // ! CUANDO HAY UN ERROR
        onError: (err, newCategory, context) => {
            // ! ASEGURAMOS QUE EL DATO ANTERIOR NO HAYA SIDO MODIFICADO SOBREESCRIBIENDOLO
            //@ts-ignore
            queryClient.setQueryData(['categories', context.categories.CAT_ID], context.previousCategory)
        },
    })
}

const deleteCat = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('deleteCategory', {

        mutationFn: deleteCategory,

        onMutate: async deletedId => {
            await queryClient.cancelQueries(['categories', deletedId])

            const previousCategory = queryClient.getQueryData(['categories', deletedId])

            return { previousCategory, deletedId }
        },

        onSuccess: (result, request, context) => {

            const deletedId = context.deletedId

            //@ts-ignore
            queryClient.setQueryData('categories', (old: any) => old.filter((cat: any) => cat.CAT_ID !== deletedId))

        },
        // onError: (err, variables, context) => {
        //     //@ts-ignore
        //     queryClient.setQueryData('categories', old => [...old, context.previousCategory])
        // }
    })
}

export const category = (queryClient: QueryClient) => {
    create(queryClient)
    edite(queryClient)
    deleteCat(queryClient)
}