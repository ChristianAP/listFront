import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  Divider,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { Form, Formik } from "formik";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";

export const CreateCompanyModal = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setisLoading] = useState(false);

  const valuesInitial = {
    COM_ID: "",
    COM_COMPANY_NAME: "",
    COM_ORGANIZATION_SECTOR: "",
    COM_ORGANIZATION_RUC: "",
    COM_ORGANIZATION_TYPE: "",
    COM_CONSTITUTION_YEAR: "",
    COM_ORGANIZATION_DIRECTION: "",
    COM_ORGANIZATION_WEB_PAGE: "",
    COM_ORGANIZATION_EMAIL: "",
    COM_ORGANIZATION_PHONE_ONE: "",
    COM_ORGANIZATION_PHONE_TWO: "",
    COM_ORGANIZATION_PHONE_THREE: "",
    COM_REPRESENTATIVE_LEGAL: "",
    COM_REPRESENTATIVE_EMAIL: "",
    COM_REPRESENTATIVE_PHONE: "",
    COM_REPRESENTATIVE_DIRECTION: "",
    COM_STATUS: "",
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir empresa</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={valuesInitial}
            onSubmit={async (values: any) => {
              onClose();
            }}>
            <Form>
              <ModalBody pb={6}>
                <MyTextInput
                  label="Nombre de empresa"
                  name="COM_COMPANY_NAME"
                  type="text"
                  placeholder="Nombre de empresa"
                />
                <MyTextInput
                  label="RUC"
                  name="COM_ORGANIZATION_RUC"
                  type="number"
                  placeholder="12345678911"
                />
                <MyTextInput
                  label="Sector de empresa"
                  name="COM_ORGANIZATION_SECTOR"
                  type="text"
                  placeholder="Tecnologia"
                />
                <MyTextInput
                  label="Tipo de empresa"
                  name="COM_ORGANIZATION_TYPE"
                  type="text"
                  placeholder="Industrial/Farmaceutico"
                />
                <MyTextInput
                  label="Año de constitución"
                  name="COM_CONSTITUTION_YEAR"
                  type="date"
                />
                <MyTextInput
                  label="Dirección fiscal"
                  name="COM_ORGANIZATION_DIRECTION"
                  type="text"
                  placeholder="Lima/Lima/Ñaña/Km19 San juan de lurigancho"
                />
                <MyTextInput
                  label="Web de empresa"
                  name="COM_ORGANIZATION_WEB_PAGE"
                  type="text"
                  placeholder="https://www.cudesi.com.pe"
                />
                <MyTextInput
                  label="Email de empresa"
                  name="COM_ORGANIZATION_EMAIL"
                  type="text"
                  placeholder="cudesi@cudesi.com.pe"
                />
                <MyTextInput
                  label="Teléfono 1"
                  name="COM_ORGANIZATION_PHONE_ONE"
                  type="text"
                  placeholder="+51 925 887 500"
                />
                <MyTextInput
                  label="Teléfono 2"
                  name="COM_ORGANIZATION_PHONE_TWO"
                  type="text"
                  placeholder="+51 925 887 500"
                />
                <MyTextInput
                  label="Teléfono 3"
                  name="COM_ORGANIZATION_PHONE_THREE"
                  type="text"
                  placeholder="+51 925 887 500"
                />
                <br />
                <Divider />
                <ModalHeader>Persona de contacto</ModalHeader>
                <br />
                <MyTextInput
                  label="Nombre"
                  name="COM_REPRESENTATIVE_LEGAL"
                  type="text"
                  placeholder="Nombres y apellidos"
                />
                <MyTextInput
                  label="Teléfono de contacto"
                  name="COM_REPRESENTATIVE_PHONE"
                  placeholder="+51 XXX XXX XXX"
                  type="number"
                />
                <MyTextInput
                  label="Correo electrónico"
                  name="COM_REPRESENTATIVE_EMAIL"
                  placeholder="+user@example.com"
                  type="email"
                />
                <MyTextInput
                  label="Dirección"
                  name="COM_REPRESENTATIVE_DIRECTION"
                  placeholder=" Lima/Lima/Ñaña/Km19 San juan de lurigancho"
                  type="text"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  colorScheme="green"
                  mr={3}>
                  Agregar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
