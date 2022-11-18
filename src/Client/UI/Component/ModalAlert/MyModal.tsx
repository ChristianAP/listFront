import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const MyModalAlert = ({ message }: { message: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={true}
        onClose={onClose}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Center>
              <strong>
                {" "}
                <h1> {message} </h1>{" "}
              </strong>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const MyViewStatus = ({
  status,
  tooltip,
}: {
  status: any;
  tooltip: any;
}) => {
  let color;
  let text;
  if (status == "NUEVO") {
    color = "#FFB648";
    text = "N";
  } else if (status == "ABIERTO") {
    color = "#E34F32";
    text = "A";
  } else if (status == "PENDIENTE") {
    color = "#3091EC";
    text = "P";
  } else if (status == "CERRADO") {
    color = "#87929D";
    text = "C";
  }
  return (
    <>
      <Tooltip hasArrow label={tooltip} bg={color}>
        <Box
          w="50%"
          bg={color}
          color="white"
          marginLeft={1}
          paddingLeft={1}
          paddingRight={1}
          borderRadius={5}
          textAlign="center">
          {text}
        </Box>
      </Tooltip>
    </>
  );
};

export const ModalAlertMessage = ({
  message,
  icon,
  status,
  type,
  buttons
}: {
  message: any;
  icon?: React.ReactElement;
  status?: any;
  type?: any;
  buttons?: React.ReactElement;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Modal
        closeOnOverlayClick={true}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <Alert
            status={status}
            variant="top-accent"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px">
            {icon}
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {message}
            </AlertTitle>
            <HStack spacing="24px" marginTop="10px">
             {buttons}
            </HStack>
          </Alert>
        </ModalContent>
      </Modal>
    </>
  );
};
