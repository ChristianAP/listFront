import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import "./VerificationOptions.css";

export const CancelledOrder = ({ cancelled }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      <Box className="options option-3" onClick={onOpen}>
        <Center>
          <MdOutlineRemoveShoppingCart size={"70"} />
        </Center>
        <Center>
          <Text fontWeight={"bold"} fontSize="lg">
            Cancelar Pedido
          </Text>
        </Center>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Cancelar Pedido</ModalHeader>
          <ModalBody>
            <Box>
              <Text fontWeight={"semibold"} fontSize="md">
                ¿Está seguro?
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta <b>Cancelando la Orden</b> del cliente.
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta acción registrara la orden como <b>Orden Cancelada</b> y se
                enviara un email.
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              disabled={isLoading}
            >
              Cerrar
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => {
                cancelled();
                setIsLoading(!isLoading);
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Cancelar Pedido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
