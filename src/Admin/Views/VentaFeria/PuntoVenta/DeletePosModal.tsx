import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, useDisclosure } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useMutation } from "react-query";
import { deletePointSale } from "../../../../Service/PoaintSaleService";

export const DeletePosModal = ({ pointSale, children }: { pointSale: any, children: ReactNode }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutateAsync, isLoading } = useMutation(deletePointSale)

    async function handleChange() {
        mutateAsync(pointSale.POS_ID)
    }
    return (
        <>
            <Box onClick={onOpen}>
                {children}
            </Box>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={{}}
                onClose={onClose}
                closeOnOverlayClick={false}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Punto de Venta
                        </AlertDialogHeader>
                        <AlertDialogBody>¿Está seguro?</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                onClick={onClose}
                                isDisabled={isLoading}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={() => handleChange()}
                                isLoading={isLoading}>
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}