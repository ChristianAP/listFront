import { Button, IconButton } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Grid, GridItem } from '@chakra-ui/layout'
import { Box, Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { ReactNode, useEffect, useState } from "react";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import {
  getProductsStocks,
} from "../../../../Service/ProductAdminService";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure, useToast } from "@chakra-ui/react";

import { MySelect, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AgregarRemission, DocumentRemission, EditarRemission } from "../../../../Service/RemisionAdminService";
import { Form, Formik } from "formik";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
/* interface RemissionsDetail {
  REM_CODEBAR: string;
  REM_WEIGHT: string;
  REM_DUEDATE: string;
  REM_PRICE: number;
  REM_OUT: string;
  PRO_ID: number;
  PRO_NAME: string;
} */
interface RemissionsDetail {
  RDT_ID?: number;
  REM_ID?: number;
  PRO_ID: number;
  RDT_AMOUNT: number;
  RDT_CODEBAR: string;
  RDT_DUEDATE: string;
  RDT_PRICE: number;
  RDT_STATUS: string;
  nameproduct: string;
}
export const EditProdCompra = ({
  children,
  Producto,

}: {
  children: ReactNode,
  Producto: any,

}) => {
  const { mutateAsync: EditRemission } = useMutation(EditarRemission);

  const queryClient = useQueryClient();
  /* const { data, isLoading, isError, isFetching, refetch } = useQuery(
    "producstStock",
    getProductsStocks,
    { refetchOnWindowFocus: false }
  ); */
  const { isOpen, onOpen, onClose } = useDisclosure()

  function fecha() {
    let now = new Date()
    let dia = now.getDate()
    let mes = now.getMonth() + 1
    let anio = now.getFullYear()

    return anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
  }
  

  return (
    <>
      <Box w="100%">
        <div onClick={onOpen}>
          {children}
        </div>
        <Modal
          closeOnOverlayClick={false}
          closeOnEsc={false}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent maxW="40%">
            <ModalHeader>Editar Remision</ModalHeader>
            <ModalCloseButton />
            <Formik
              enableReinitialize={true}
              initialValues={{...Producto, REM_UPDATEOUT :  (Producto.REM_OUT == '0' ? fecha() : Producto.REM_UPDATEOUT )}}
              //validationSchema={validate}
              onSubmit={async (values: any) => {
                console.log(values);
                
                await EditRemission({ id: Producto.REM_ID, remission: values })
                queryClient.invalidateQueries("remision")
                onClose()
              }}
            >
              <Form>
                <ModalBody pb={6}>
                  <Grid
                    h="auto"
                    templateColumns="repeat(6, 16.6%)"
                    w="full"
                  >
                    {/* <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Direccion"
                        name="REM_ADDRESSEE"
                        placeholder="Ej. 58758.."
                      />
                    </GridItem> */}
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Nombre del Conductor"
                        name="REM_CARRIER"
                        placeholder="Nombre de proveedor"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Codigo Remision"
                        name="REM_CODE"
                        placeholder="Nombre comercial"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Fecha de Creacion"
                        name="REM_DATECREATED"
                        type="date"
                        placeholder="Nombre de Pais"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Lugar de Llegada"
                        name="REM_INPOINT"
                        placeholder="Nombre de Departamento"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Lugar de Partida"
                        name="REM_OUTPOINT"
                        placeholder="Escriba dirección"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Licencia del Conductor"
                        name="REM_LICENSE"
                        placeholder="Nombre de Provincia"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MySelect
                        label="Retirado"
                        name="REM_OUT"
                      >
                        <option value="0">EN ALMACEN</option>
                        <option value="1">RETIRADO</option>
                      </MySelect>
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MySelect
                        label="Estado"
                        name="REM_STATUS"
                      >
                        <option value="0">DESACTIVADO</option>
                        <option value="1">ACTIVADO</option>
                      </MySelect>

                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Placa del Vehiculo"
                        name="REM_PLATE"
                        placeholder="example@gmail.com"
                      />
                    </GridItem>
                    <GridItem mx={2} colSpan={3}>
                      <MyTextInput
                        label="Fecha de Salida"
                        name="REM_UPDATEOUT"
                        type="date"
                      />
                    </GridItem>
                  </Grid>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    // isLoading={isLoading}
                    // isDisabled={isLoading}
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

      </Box>
    </>
  );
};

const CompraProdTable = ({
  prods,
  setProds,
}: {
  prods: any;
  setProds: any;
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  console.log(prods);

  const columns = [
    {
      Header: "Nombre",
      accessor: "nameproduct",
    },
    {
      Header: "Peso",
      accessor: "RDT_AMOUNT",
    },
    {
      Header: "Precio Total",
      accessor: "RDT_PRICE",
    },
    {
      Header: "",
      id: "remove_action",
      // @ts-ignore
      Cell: ({ row }) => {
        return (
          <IconButton
            colorScheme="red"
            aria-label="Search database"
            icon={<AiFillDelete />}
            onClick={() => updateMyData(row)}
          />
        );
      },
    },
  ];

  function updateMyData(row: any) {
    setSkipPageReset(true);
    console.log(row.index);

    // @ts-ignore
    setProds((old: any) => {
      // @ts-ignore
      return old.filter((val, idx) => idx !== row.index);
    });
  }

  useEffect(() => {
    setSkipPageReset(false);
  }, [prods]);

  return (
    <>
      <MyReactTable
        columns={columns}
        data={prods}
        skipPageReset={skipPageReset}
        updateMyData={updateMyData}
      />
    </>
  );
};
