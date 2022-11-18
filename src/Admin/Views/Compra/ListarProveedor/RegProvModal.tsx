import React, { ReactNode, useState } from "react";
import {
  useDisclosure,
  Button,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { CreatePersona, CreateProveedor } from "../../../../Service/PersonService";
import { getDatosSunat } from "../../../../Service/ProviderService";
import { ProviderSearchInput } from "../../../../GlobalUI/Inputs/ProviderSearchInput";
import { NewClientValues } from "../../Venta/RealizarVenta/InfoVenta";

export const RegProvModal = ({ children }: { children: ReactNode }) => {
  const messageToast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [values, setValues] = useState(NewClientValues);

  const { mutateAsync: CreatePerson, isLoading: loadingAddPerson } = useMutation(CreateProveedor);
  const { mutateAsync: SearchProvider, isLoading, } = useMutation(getDatosSunat);
  let [inputBuscarCliente, SetInputBuscarCliente] = React.useState("");
  const handleChangeBuscar = (e: any) => SetInputBuscarCliente(e.target.value);

  const queryClient = useQueryClient()

  const validate = yup.object().shape({
    PER_RUC: yup.string().required("Debe ingresar un numero de RUC"),
    PER_TRADENAME: yup.string().required("Debe ingresar el nombre comercial"),
    PER_COUNTRY: yup.string().required("Debe ingresar el pais del proveedor"),
    PER_DEPARTMENT: yup.string().required("Debe ingresar un departamento"),
    PER_PROVINCE: yup.string().required("Debe ingresar una provincia"),
    PER_DISTRIC: yup.string().required("Debe ingresar un distrito"),
    PER_DIRECTION: yup.string().required("Debe ingresar una direccion"),
    PER_N_PHONE: yup.string().required("Debe ingresar un numero de celular"),
    PER_EMAIL: yup.string().required("Debe ingresar un correo valido"),
    PER_CONDITION: yup.string().required("Debe ingresar Habido o No Habido"),
    PER_ACTIVE: yup.string().required("Debe ingresar Activo o No Activo"),
  });

  const SearchSunat = async () => {
    SearchProvider(inputBuscarCliente)
      .then((data: any) => {
        delete data.PLATFORM
        setValues({
          ...values,
          ...data
        });
      })
      .catch((err: any) => {
        messageToast({
          title: "Error " + err.status + ", Oops!",
          description: err.message,
          status: "warning",
          variant: "subtle",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent maxW="40%">
          <ModalHeader>Registrar Proveedor</ModalHeader>
          <ModalCloseButton />
          <Formik
            enableReinitialize={true}
            initialValues={values}
            validationSchema={validate}
            onSubmit={async (values: any) => {
              delete values.PET_ID;
              delete values.GRO_ID;
              delete values.CLA_ID;
              values.CLIENT = {
                CLA_ID: "1",
                GRO_ID: "1",
                CLI_TYPE: "1",
              };
              await CreatePerson(values);
              await queryClient.invalidateQueries('tempActive')
              onClose();
            }}
          >
            <Form>
              <ModalBody pb={6}>
                <Grid h="auto" templateColumns="repeat(6, 16.6%)" w="full">
                  <GridItem mx={2} colSpan={6} my={2}>
                    <Text fontSize="md">Buscar en sunat</Text>
                    <ProviderSearchInput
                      placeholder="Buscar en sunat"
                      type="number"
                      inputSearch={inputBuscarCliente}
                      handleChangeSearch={handleChangeBuscar}
                      searchData={SearchSunat}
                      loading={isLoading}
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Nombre"
                      name="PER_NAME"
                      placeholder="Nombre de proveedor"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Número documento"
                      name="PER_DNI"
                      placeholder="Ej. 58758.."
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Nombre comercial"
                      name="PER_TRADENAME"
                      placeholder="Nombre comercial"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="RUC"
                      name="PER_RUC"
                      placeholder="20131312955"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Condicion"
                      name="PER_CONDITION"
                      placeholder="Habido"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Estado"
                      name="PER_ACTIVE"
                      placeholder="Activo"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Teléfono"
                      name="PER_N_PHONE"
                      placeholder="+51 981..."
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Correo Electrónico"
                      name="PER_EMAIL"
                      placeholder="example@gmail.com"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Pais"
                      name="PER_COUNTRY"
                      placeholder="Nombre de Pais"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Departamento"
                      name="PER_DEPARTMENT"
                      placeholder="Nombre de Departamento"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Provincia"
                      name="PER_PROVINCE"
                      placeholder="Nombre de Provincia"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={3}>
                    <MyTextInput
                      label="Distrito"
                      name="PER_DISTRIC"
                      placeholder="Nombre de Distrito"
                    />
                  </GridItem>
                  <GridItem mx={2} colSpan={6}>
                    <MyTextInput
                      label="Dirección"
                      name="PER_DIRECTION"
                      placeholder="Escriba dirección"
                    />
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={loadingAddPerson}
                  isDisabled={loadingAddPerson}
                  colorScheme="green"
                  mr={3}
                >
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
