import {
  Button,
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import productsaved from "../assets/productsaved.gif";


export const ProductSavedSuccessfully = ({ isOpen, onClose }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent style={{ backgroundColor: "#f6f4f2" }}>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Image
              objectFit="cover"
              src={productsaved}
              alt="Product Saved Successfully"
              style={{
                objectFit: "contain",
                height: "264px",
                width: "270px",
              }}
            />
          </Center>
          <Center>
            <Text style={{ fontWeight: "bold" }} fontSize="md">
              Guardado Exitosamente
            </Text>
          </Center>
        </ModalBody>
        <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Nueva Compra
            </Button>
          <Link to="/carrito">
            <Button variant="ghost">Ir a Carrito</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
