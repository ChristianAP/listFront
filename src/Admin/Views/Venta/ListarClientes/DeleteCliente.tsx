import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { ReactNode, useRef, useState } from "react";
import { DeleteCliente } from "../../../../Service/ClienteService";
import { DeletePerson } from "../../../../Service/PersonService";

export const ModalDeleteCliente = ({
  children,
  clientId,
  personId,
  refetch,
}: {
  children: ReactNode;
  clientId: string;
  personId: string;
  refetch: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const onClose = () => setIsOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const Loading = () => setIsLoading(!isLoading)

  async function handleChange() {
    Loading
    await DeleteCliente(Number(clientId));
    await DeletePerson(Number(personId));
    Loading
    onClose();
    refetch();

  }

  return (
    <>
      <div onClick={ () => setIsOpen(true) }>{ children }</div>
      <AlertDialog
        isOpen={ isOpen }
        //@ts-ignore
        leastDestructiveRef={ cancelRef }
        onClose={ onClose }
        closeOnOverlayClick={ false }>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Cliente
            </AlertDialogHeader>
            <AlertDialogBody>¿Está seguro?</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                // @ts-ignore
                ref={ cancelRef }
                onClick={ onClose }
                isDisabled={ isLoading }>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                ml={ 3 }
                onClick={ () => handleChange() }
                isLoading={ isLoading }>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
