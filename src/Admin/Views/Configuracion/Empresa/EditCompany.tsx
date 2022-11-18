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
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { Form, Formik } from "formik";
import {
  MyImageInput,
  MyTextInput,
} from "../../../../GlobalUI/Forms/MyInputs";
import { UpdateCompany } from "../../../../Service/CompanyService";
import { useMutation, useQueryClient } from "react-query";
import { editeProduct } from "../../../../Service/ProductAdminService";

export const EditCompanyModal = ({
  children,
  company,
}: {
  children: ReactNode;
  company: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [image, setImage] = useState(company.COM_ORGANIZATION_LOGO || 'https://ayjoe.engrave.site/img/default.jpg')
  const [file, setFile] = useState([])
  const [isLoading, setisLoading] = useState(false);
  const queryClient=useQueryClient()
  const {mutateAsync : productMutation} = useMutation(editeProduct)
  async function SubirLogo(image: any) {
    try {
      let formdata = new FormData();
      formdata.append("IMAGE", image)
      const requestOptions = {
        method: "POST",
        body: formdata,
      };
      const res = await fetch(
        import.meta.env.VITE_APP_API + "/company/uploadIcon",
        requestOptions
      ); //falta
      const data = await res.json();
      return data;
    } catch (Error) {
      return Error;
    }
  }

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Datos de empresa</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={company}
            onSubmit={async (values: any) => {
              const formData = new FormData()
              if (file.length > 0) {
                const path = await SubirLogo(file[0])
                values = { ...values, COM_ORGANIZATION_LOGO: path.url }
              }
              await UpdateCompany(values)

              formData.append('PRO_PRICE' , values.COM_DELIVERY_PRICE)
              await productMutation({formData, PRO_ID : 27})
              queryClient.invalidateQueries("company")

              onClose()
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
                <MyTextInput
                  label="Precio del Delivery"
                  name="COM_DELIVERY_PRICE"
                  type="text"
                  placeholder="8"
                />
                <MyImageInput image={image} setFile={setFile} setImage={setImage} />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  colorScheme="blue"
                  mr={3}>
                  Actualizar
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

export const EditRepresentativeModal = ({
  children,
  company,
}: {
  children: ReactNode;
  company: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setisLoading] = useState(false);

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Persona de Contacto</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={company}
            onSubmit={async (values: any) => {
              await UpdateCompany(values)
              onClose()
            }}>
            <Form>
              <ModalBody pb={6}>
                <MyTextInput
                  label="Nombre"
                  name="COM_REPRESENTATIVE_LEGAL"
                  type="text"
                  placeholder="Nombres y apellidos"
                />
                <MyTextInput
                  label="Telefono de contacto"
                  name="COM_REPRESENTATIVE_PHONE"
                  placeholder="+51 XXX XXX XXX"
                  type="number"
                />
                <MyTextInput
                  label="Correo electronico"
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
                  colorScheme="blue"
                  mr={3}>
                  Actualizar
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
