import React, { useState } from "react";
import {
  Box,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ProviderUploadImageInput } from "../../../../GlobalUI/Inputs/ProviderUploadImageInput";
import { useMutation } from "react-query";
import { OrederEdit } from "../../../../Service/TiendaOnlineService";

export const NewVoucherModal = ({id_order, voucher, isOpen, onClose, refetch}: any) => {
  let formData = new FormData();
  const [image, setImage] = useState(voucher);
  const [file, setFile] = useState([]);
  const { mutateAsync: UpdateOrder, isLoading } = useMutation(OrederEdit);


  async function changeVoucher() {
    formData.append("IMAGE", file[0]);
    let res =  await UpdateOrder({ formData: formData, idOrder: id_order });
    res.status === 200 ? (onClose(), refetch()) : (onClose(), refetch());
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir nuevo voucher</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Box>
                <ProviderUploadImageInput
                  image={image}
                  setImage={setImage}
                  setFile={setFile}
                  title_button="Subir Nuevo Voucher"
                />
              </Box>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              disabled={ file.length ? false : true}
              onClick={changeVoucher}
              isLoading={isLoading}
            >
              Enviar
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
