import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, useDisclosure } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useMutation, useQueries, useQueryClient } from "react-query";
import queryClient from "../../../../Mutations/Client";
import { DeleteRolConductor } from "../../../../Service/PersonService";

export const DeleteConductor = ({ array, children }: { array: any, children: ReactNode }) => {

    const { isOpen, onClose, onOpen } = useDisclosure()
    const { mutateAsync, isLoading } = useMutation(DeleteRolConductor);

    const queryClient = useQueryClient()

    async function handleChange() {
        await mutateAsync(array)
        console.log('asd');
        queryClient.invalidateQueries("conductor")
        onClose()
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
    );
}