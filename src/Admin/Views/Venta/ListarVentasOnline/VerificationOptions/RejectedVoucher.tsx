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
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./VerificationOptions.css";

export const RejectedVoucher = ({ rechazar }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <>
      <Box className="options option-2" onClick={onOpen}>
        <Center>
          <AiOutlineCloseCircle size={"70"} />
        </Center>
        <Center>
          <Text fontWeight={"bold"} fontSize="lg">
            Rechazar Voucher
          </Text>
        </Center>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Rechazar Voucher</ModalHeader>
          <ModalBody>
            <Box>
              <Text fontWeight={"semibold"} fontSize="md">
                ¿Está seguro?
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta <b>Rechazando</b> el voucher brindado por el cliente.
              </Text>
              <Text fontWeight={"medium"} fontSize="md">
                Esta acción registrara la orden como <b>Voucher Rechazado</b> y
                se enviara un email.
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
              colorScheme="red"
              onClick={() => {
                rechazar();
                setIsLoading(!isLoading);
              }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Rechazar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
