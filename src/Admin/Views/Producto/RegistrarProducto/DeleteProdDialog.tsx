import React, { ReactNode } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useToast } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from 'react-query';
import { deleteProduct } from '../../../../Service/ProductAdminService';

export const DeleteProdDialog = ({ children, proId }: { children: ReactNode, proId: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const toast = useToast();
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation(deleteProduct,
        {
            onSuccess: async (data) => {
                const validate = await data.json();
                if (validate.code) {
                    toast({
                        title: "Acción no valida",
                        description: "No se puede elimar este producto, por que se encuentra en uso",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                    });
                }
                if (validate.message == "Producto ha sido eliminado con éxito.") {
                    queryClient.invalidateQueries("products")
                }
            },
        })

    const onClose = () => setIsOpen(false)

    async function handleDelete() {
        // @ts-ignore
        await mutateAsync(proId);
        onClose()
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Producto
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={handleDelete}
                                isLoading={isLoading}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}