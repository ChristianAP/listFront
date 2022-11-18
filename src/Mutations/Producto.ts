import { useToast } from "@chakra-ui/react";
import { QueryClient } from "react-query"
import { v4 as uuidv4 } from 'uuid';
import { createProduct, deleteProduct, editeProduct } from "../Service/ProductAdminService";

const create = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('createProduct', {
        mutationFn: createProduct,
        onMutate: async (variables) => {
            /* await queryClient.cancelQueries('products')
            const optimisticPro = { PRO_ID: uuidv4(), ...variables }
            queryClient.setQueryData('products', (old: any) => [...old, optimisticPro])
            return { optimisticPro } */
        },
        onSuccess: (result, variables, context) => {
            /* queryClient.setQueryData('products', (old: any) =>
                old.map((pro: any) =>
                    //@ts-ignore
                    pro.PRO_ID === context.optimisticPro.PRO_ID ? { ...pro, PRO_ID: result.data } : pro
                )) */
            queryClient.invalidateQueries('products')
        },
        onError: (error, variables, context) => {
            // @ts-ignore
            queryClient.setQueryData('products', (old: any) => old.filter((todo: any) => todo.id !== context.optimisticTodo.PRO_ID))
        },
    })
}

const edite = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('editeProduct', {
        mutationFn: editeProduct,
        onMutate: async updatedProduct => {
            /* await queryClient.cancelQueries(['products', updatedProduct.PRO_ID])
            const previousProduct = queryClient.getQueryData(['products', updatedProduct.PRO_ID])
            return { previousProduct, updatedProduct } */
        },
        onSuccess: (result, request, context) => {
            queryClient.invalidateQueries('products')
            /* //@ts-ignore
            const updatedProduct = context.updatedProduct
            //@ts-ignore
            queryClient.setQueryData('products', (old: []) => old.map(pro => pro.PRO_ID === updatedProduct.PRO_ID ? updatedProduct : pro)) */
        },
        onError: (err, newProduct, context) => {
            //@ts-ignore
            queryClient.setQueryData(['products', context.products.PRO_ID], context.previousProduct)
        },
    })
}

const deletepro = (queryClient: QueryClient) => {
    queryClient.setMutationDefaults('deleteProduct', {
        mutationFn: deleteProduct,
        onMutate: async deletedId => {
            await queryClient.cancelQueries(['products', deletedId])
            const previousProduct = queryClient.getQueryData(['products', deletedId])
            return { previousProduct, deletedId }
        },
        onSuccess: async (result, request, context) => {
            const validate = await result.json();
            var deletedId = context.deletedId
            if (validate.code) {
                deletedId = 0
                alert("no permitido")
            }

            //@ts-ignore
            queryClient.setQueryData('products', (old: any) => old.filter((pro: any) => pro.PRO_ID !== deletedId))
        },
        // onError: (err, variables, context) => {
        //     //@ts-ignore
        //     queryClient.setQueryData('products', old => [...old, context.previousProduct])
        // }
    })
}

export const Product = (queryClient: QueryClient) => {
    create(queryClient)
    edite(queryClient)
    deletepro(queryClient)
}