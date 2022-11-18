import React, { ReactNode } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from 'react-query';
import { deleteDiscount } from '../../../../Service/DescuentoAdminService';

export const DeleteDescDialog = ({ children, discountId }: { children: ReactNode, discountId: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const cancelRef = useRef()
    const useQuery = useQueryClient()
    const { mutateAsync, isLoading } = useMutation(deleteDiscount,{
        onSuccess:()=>{
            useQuery.invalidateQueries('discounts')
        }
    })

    const onClose = () => setIsOpen(false)

    async function handleDelete() {
        // @ts-ignore
        await mutateAsync(discountId);
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
                            Eliminar Categoría
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