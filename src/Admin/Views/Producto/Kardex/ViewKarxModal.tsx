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
  Table,
  Tbody,
  Tr,
  Td,
  Center,
  Img,
  Skeleton,
  Stack,
  Flex,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getKardexByProduct } from "../../../../Service/kardexAdminService";
import { TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";
import { DonwloadKardexPDF } from "./DonwloadKardex";

export const ViewKarxModal = ({
  children,
  kardex,
}: {
  children: ReactNode;
  kardex: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div onClick={ onOpen }>{ children }</div>
      <Modal
        closeOnOverlayClick={ false }
        isOpen={ isOpen }
        onClose={ onClose }
        size={ "6xl" }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Center>
              <Table>
                <Tbody>
                  <Td>
                    <Img w="150px" src={ kardex.PRO_IMAGE } />
                  </Td>
                  <Td>
                    <Table variant={ "striped" } size="sm">
                      <Tbody>
                        <Tr>
                          <Td>Item: { kardex.PRO_NAME }</Td>
                          <Td>Categoria: { kardex.CAT_NAME }</Td>
                          <Td>Descripción de Item: { kardex.PRO_DESCRIPTION }</Td>
                        </Tr>
                        <Tr>
                          <Td>Marca: { kardex.TDK_NAME }</Td>
                          <Td>Código: { kardex.PRO_CODE }</Td>
                          <Td>Fecha de creación: { kardex.PRO_CREATE_DATE }</Td>
                        </Tr>
                        <Tr>
                          <Td>
                            Estado de Item:{ " " }
                            { kardex.PRO_STATUS == 0 ? "Inactivo" : "Activo" }
                          </Td>
                        </Tr>

                        <Tr>
                          <Td>Stock Inicial: { kardex.STK_INITIAL_STOCK }</Td>
                          <Td>Stock Actual: { kardex.STK_TODAY }</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Td>
                </Tbody>
              </Table>
            </Center>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={ 6 }>
            <TableKardexProduct
              idProducto={ String(kardex.PRO_ID) }
              infoProducto={ kardex }
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={ onClose }>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const TableKardexProduct = ({
  idProducto,
  infoProducto,
}: {
  idProducto: string;
  infoProducto: any;
}) => {
  const [isDonwload, setIsDonwload] = useState(false);
  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    "kardexProduct",
    () => getKardexByProduct(idProducto),
    { refetchOnWindowFocus: false }
  );

  const columns = [
    {
      Header: "Movimiento",
      accessor: "SDT_ACTION",
      disableFilters: true,
      //@ts-ignore
      Cell: ({ row }) => <ActionCell action={ row.original } />,
    },
    {
      Header: "Fecha",
      accessor: "SDT_DATE"
    },
    {
      Header: "Detalle",
      accessor: "SDT_DETAILS",
      //@ts-ignore
      Cell: ({ row }) => <DetailsCell action={ row.original } />,
    },
    {
      Header: "Cantidad",
      accessor: "SDT_AMOUNT",
      disableFilters: true
    },
    {
      Header: "Valor Unitario",
      accessor: "SDT_PRICE",
      disableFilters: true
    },
    {
      Header: "Valor Total",
      accessor: "SDT_TOTAL",
      disableFilters: true
    },
  ];

  if (isLoading || isFetching) return (<TableChargeListProduct />)

  // @ts-ignore
  if (isError) return (<h1> { error.message } { ":(" } </h1>);

  return (
    <>
      <Flex direction="row-reverse">
        <DonwloadKardexPDF
          isDonwloading={ isDonwload }
          infoProducto={ infoProducto }
          kardexListProducto={ data }
        />
      </Flex>
      <MyReactTable
        columns={ columns }
        data={ data }
        isPaginated
        hasFilters
        pagesOptions={ [15, 25, 50] }
      />
    </>
  );
};

const ActionCell = ({ action }: { action: any }) => {
  if (action.SDT_ACTION == "1") {
    action.SDT_ACTION = "ENTRADA";
  } else if (action.SDT_ACTION == null) {
    action.SDT_ACTION = "SALIDA"
  }
  return (
    <>{ action.SDT_ACTION }</>
  );
};


const DetailsCell = ({ action }: { action: any }) => {
  if (action.SDT_ACTION == "ENTRADA") {
    action.SDT_DETAILS = `Compra  ${action.SDT_DETAILS}`;
  } else if (action.SDT_ACTION == "SALIDA") {
    action.SDT_DETAILS = `Venta  ${action.SDT_DETAILS}`;
  }
  return (
    <>{ action.SDT_DETAILS }</>
  );

  // action.SDT_DETAILS = newdetail;
};