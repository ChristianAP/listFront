import React, { ReactNode, useState } from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, GridItem, Stack, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Form, Formik } from "formik";
import { useQuery } from "react-query";
import { MySelect, MyTextInput, ProviderSearchInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AddCompra } from "./AddCompra";
import { Skeleton, Switch, Tooltip, Flex } from "@chakra-ui/react";
import { getProviders } from '../../../../Service/ProviderService';
import moment from "moment";
import * as yup from "yup";
import { RegProvModal } from "../../Compra/ListarProveedor/RegProvModal";

async function GetTipoComprobante() {
  const response = await fetch(`${import.meta.env.VITE_APP_API}/document_type`);
  const data = await response.json();
  return data;
}

export const RegCompraModal = ({ children }: { children: ReactNode }) => {

  const [provPerson, setProvPerson] = useState<any>();

  const { data: proveedores, error: provError, isLoading: provLoading, refetch } = useQuery('providers', getProviders)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isLoading: docTypeLoad,
    error,
    data,
  } = useQuery("docTypeQuery", GetTipoComprobante);

  let [isActive, setIsActive] = useState(false);
  let [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const [allValues, setAllValues] = useState();
  const [completeAllValues, setCompleteAllValues] = useState(true);

  const values = {
    PMT_ID: 5,

    DCT_ID: "5",
    SLT_ID: 1,

    XCR_ID: 5,
    BUS_ID: 5,


    DOC_SERIE: "", // ! CODIGO SERIE DEL COMPROBANTE
    DOC_NUMBER: "", // ! NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO

    //CAMBIA - DATOS DOCUMENTO - TOTAL
    // DOC_DOC_SUBTOTAL: 0.0, // Se ingresa en la siguiente vista
    DOC_SUB_DISCOUNT: 0.0,
    // DOC_SUBTOTAL: 0.0, // Se ingresa en la siguiente vista
    DOC_DISCOUNT: 0.0,
    DOC_TAXED: 0.0,

    //SE DEJA EN 0.00
    DOC_INAFECT: 0.0,
    DOC_RELEASED: 0.0,

    //CAMBIA
    DOC_IGV: 0.0,
    // DOC_NETO:0.0, // Se ingresa en la siguiente vista
    DOC_STATUS: "CREADO",

    //FECHA
    DOC_DATE: moment().format("YYYY-MM-DD"),
    DOC_SALE_TYPE: "COMPRA",
    PROVIDER: ""
  };

  const validate = yup.object().shape({
    DCT_ID: yup.string().required("Debe ingresar un nombre"),
    PMT_ID: yup.string().required("Debe ingresar una descripción"),
    SLT_ID: yup.string().required("Debe ingresar un nombre secundario"),
    DOC_NUMBER: yup.string().required("Debe ingresar un código"),
    DOC_SERIE: yup.string().required("Debe scanear un código  de barras"),
    PROVIDER: yup.string().required("Debe buscar proveedor"),
  })

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl">
        <ModalOverlay />
        <ModalContent maxW="80%">
          <ModalHeader>Registrar compra</ModalHeader>
          <ModalCloseButton onClick={() => setCompleteAllValues(true)} />
          <Formik
            initialValues={values}
            validationSchema={validate}
            onSubmit={async (values: any) => {
              console.log(values)
              const { PROVIDER, ...rest } = values;
              setCompleteAllValues(false);
              setAllValues({ ...rest, ...provPerson });
            }}>
            <Form>
              <ModalBody pb={6}>
                <Stack direction="row" mb={3}>
                  <Tooltip label="Por el momento esta opción no es encuentra autorizada.">
                    <Box>
                      <Flex>
                        <Text> SIN COMPROBANTE</Text>

                        <Switch
                          isDisabled={true}
                          size="sm"
                          colorScheme="red"
                          defaultChecked={isActive}
                          onChange={() => setIsActive(!isActive)}
                        />
                      </Flex>
                    </Box>
                  </Tooltip>
                </Stack>
                <Grid
                  h="auto"
                  templateRows="repeat(5, auto)"
                  templateColumns="repeat(8, 12.5%)"
                  w="full">
                  <GridItem mx={2} colSpan={2}>
                    {docTypeLoad ? (
                      <Skeleton height="35%" borderRadius="5px" />
                    ) : (
                      <MySelect
                        label="Tipo de comprobante"
                        name="DCT_ID"
                        active={isActive}>
                        {
                          // @ts-ignore
                          data.map((val) => {
                            if (val.DCT_VISIBLE == 1) {
                              return (
                                <option key={val.DCT_ID} value={val.DCT_ID}>
                                  {val.DCT_NAME}
                                </option>
                              );
                            }
                          })
                        }
                      </MySelect>
                    )}
                  </GridItem>

                  {/* TO DO - Hacer consulta para traer los tipos de pago */}
                  <GridItem mx={2} colSpan={2}>
                    <MySelect
                      label="Tipo de pago"
                      name="PMT_ID"
                      active={isActive}>
                      <option key="pmt_id1" value="5">
                        Pago Contado
                      </option>
                      <option key="pmt_id2" value="15">
                        Pago a partes
                      </option>
                    </MySelect>
                  </GridItem>

                  <GridItem mx={2} colSpan={2}>
                    <MySelect
                      label="Tipo de Compra"
                      name="SLT_ID"
                      active={isActive}>
                      <option key="slt_id1" value="1">
                        Compra Fisica
                      </option>
                      <option key="slt_id2" value="2">
                        Compra Online
                      </option>
                    </MySelect>
                  </GridItem>

                  <GridItem mx={2} colSpan={2}>
                    <MyTextInput
                      active={isActive}
                      label="Correlativo del comprobante"
                      name="DOC_NUMBER"
                      type="text"
                      placeholder="Correlativo del comprobante"
                    />
                  </GridItem>

                  <GridItem mx={2} colSpan={2}>
                    <MyTextInput
                      active={isActive}
                      label="Serie del comprobante"
                      name="DOC_SERIE"
                      type="text"
                      placeholder="Serie del comprobante"
                    />
                  </GridItem>

                  <GridItem mx={2} colSpan={2}>
                    <ProviderSearchInput
                      loading={provLoading}
                      data={proveedores}
                      placeholder="Buscar Proveedor"
                      label="Proveedor"
                      name="PROVIDER"
                      // @ts-ignore
                      itemClick={(option, func) => {
                         option.P_NAME = option.PER_DNI == '' ? option.PER_RUC : option.PER_DNI
                        let { PER_ID, PER_RUC: DOC_ID_CLIENT, PER_TRADENAME: DOC_BUSINESS_NAME, PER_DIRECTION: DOC_DIRECTION_CLIENT, PER_NAME } = option
                        func(DOC_ID_CLIENT + " " + DOC_BUSINESS_NAME)
                        setProvPerson({
                          PER_ID,
                          DOC_ID_CLIENT,
                          DOC_BUSINESS_NAME,
                          DOC_DIRECTION_CLIENT
                        })
                      }}
                    />
                  </GridItem>
                  
                  <GridItem display="flex" mx={2} colSpan={2}>
                    <Box
                      alignSelf="flex-end"
                      w="full"
                    >
                      <RegProvModal>
                        <Button
                          w="75%"
                          colorScheme="green"
                        >
                          Nuevo
                        </Button>
                      </RegProvModal>
                    </Box>
                  </GridItem>
                  <GridItem mx={2} mt="15px" colSpan={8}>
                    <Box alignItems="flex-end" alignSelf="flex-end">
                      <Button
                        alignSelf="flex-end"
                        backgroundColor="blue.400"
                        color="white"
                        isLoading={esperandoRespuesta}
                        isDisabled={esperandoRespuesta}
                        type="submit">
                        Escoger Productos
                      </Button>
                    </Box>
                  </GridItem>
                  <GridItem mx={2} mt="15px" colSpan={8}>
                    <AddCompra
                      completeAllValues={completeAllValues}
                      sincomprobante={isActive}
                      datosDocumento={allValues}
                      esperandoRespuesta={esperandoRespuesta}
                      setEsperandoRespuesta={setEsperandoRespuesta}
                      closeModal={onClose}
                    />
                  </GridItem>
                </Grid>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => (onClose(), setCompleteAllValues(true))}
                  isDisabled={esperandoRespuesta}>
                  Cancelar
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
