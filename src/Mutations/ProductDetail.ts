import { QueryClient } from "react-query"
import { v4 as uuidv4 } from 'uuid';
import { createProductDetail, editeProductDetail, deleteProductDetail } from "../Service/ProductDetailService";

const create = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('createProductDetail', {

        // ? FUNCIÓN QUE RETORNA LA PROMESA
        mutationFn: createProductDetail,
        // * CUANDO EL BACKEND RESPONDE
        onSuccess: () => {

            /*
             * REEMPLAZAMOS EL REGISTRO GUARDADO EN EL CLIENTE
             * CON LA DATA Q NOS REGRESE EL BACKEND
             * EN ESTE CASO SOLO REEMPLAZAMOS EL ID
            */
            queryClient.invalidateQueries('ProductPriceList')
            queryClient.invalidateQueries('ProductOutPriceList')
        },

        // ! CUANDO HAY UN ERROR
        onError: (error, variables, context) => {
            // ! SI HAY UN ERROR, SE ELIMINA EL REGISTRO AGREGADO EN EL CLIENTE
            // @ts-ignore
            queryClient.setQueryData('ProductPriceList', (old: any) => old.filter((todo: any) => todo.id !== context.optimisticTodo.PRD_ID))
        },
    })
}

const edite = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('editeProductDetail', {

        // ? FUNCIÓN QUE RETORNA LA PROMESA
        mutationFn: editeProductDetail,

        // ? ANTES DE MANDAR AL BACKEND 
        onMutate: async updatedProductDetail => {
            /* 
            ! DETENEMOS EL QUERY EN CASO SE CONSULTE SOLO
            ! EN ESTA CASO CANCELAMOS EL ELEMENTO CON EL ID
            */
            await queryClient.cancelQueries(['ProductPriceList', updatedProductDetail.PRD_ID])

            /* 
            * GUARDAMOS EL REGISTRO ANTERIOR EN UNA VARIABLE
            ? ESTO SE HACE EN CASO DEBAMOS RECUPERAR LOS DATOS ANTERIORES
            */
            const previousCategory = queryClient.getQueryData(['ProductPriceList', updatedProductDetail.PRD_ID])

            // * GUARDAMOS EL REGISTRO ANTERIOR Y SU ACTUALIZACIÓN
            return { previousCategory, updatedProductDetail }
        },

        // * CUANDO EL BACKEND RESPONDE
        onSuccess: (result, request, context) => {

            // * GUARDAMOS LA ACTUALIZACIÓN EN UNA VARIABLE
            //@ts-ignore
            const updatedProductDetail = context.updatedProductDetail

            // * REEMPLAZAMOS LA NUEVA VARIABLE EN LA DATA DEL CLIENTE
            //@ts-ignore
            queryClient.setQueryData('ProductPriceList', (old: []) => old.map(proDeta => proDeta.PRD_ID === updatedProductDetail.PRD_ID ? updatedProductDetail : proDeta))

        },

        // ! CUANDO HAY UN ERROR
        onError: (err, newCategory, context) => {
            // ! ASEGURAMOS QUE EL DATO ANTERIOR NO HAYA SIDO MODIFICADO SOBREESCRIBIENDOLO
            //@ts-ignore
            queryClient.setQueryData(['ProductPriceList', context.proDetaegories.PRD_ID], context.previousCategory)
        },
    })
}

const deleteCat = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('deleteProductDetail', {

        mutationFn: deleteProductDetail,

        onMutate: async deletedId => {
            await queryClient.cancelQueries(['ProductPriceList', deletedId])

            const previousCategory = queryClient.getQueryData(['ProductPriceList', deletedId])

            return { previousCategory, deletedId }
        },

        onSuccess: (result, request, context) => {

            const deletedId = context.deletedId

            //@ts-ignore
            queryClient.setQueryData('ProductPriceList', (old: any) => old.filter((proDeta: any) => proDeta.PRD_ID !== deletedId))
            queryClient.invalidateQueries('ProductOutPriceList')
        },
        // onError: (err, variables, context) => {
        //     //@ts-ignore
        //     queryClient.setQueryData('proDetaegories', old => [...old, context.previousCategory])
        // }
    })
}

export const proDetaegory = (queryClient: QueryClient) => {
    create(queryClient)
    edite(queryClient)
    deleteCat(queryClient)
}