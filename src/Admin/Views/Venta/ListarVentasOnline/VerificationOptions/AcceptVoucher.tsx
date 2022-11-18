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
import { AiOutlineCheckCircle } from "react-icons/ai";
import "./VerificationOptions.css";

export const AcceptVoucher = ({ confirmar }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      <Box className="options option-1" onClick={onOpen}>
        <Center>
          <AiOutlineCheckCircle className="icon" size={"70"} />
        </Center>
        <Center>
          <Text fontWeight={"bold"} fontSize="lg">
            Aceptar Voucher
          </Text>
        </Center>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Aceptar Voucher</ModalHeader>
          <ModalBody>
            <Box>
              <Text fontWeight={"semibold"} fontSize="md">
                ¿Está seguro?
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta aceptando el voucher brindado por el cliente.
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta acción registrara la orden como una venta aceptada y se
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
              colorScheme="green"
              onClick={() => {
                confirmar();
                setIsLoading(!isLoading);
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
