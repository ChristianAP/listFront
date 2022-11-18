import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getBuyDetail, getBuys } from "../../../../Service/ProductAdminService";
import { MyContain } from "../../../UI/Components/MyContain";
import { TbFileExport } from 'react-icons/tb'


import * as fs from 'file-saver';


import Excel, { Workbook } from 'exceljs';


export const CompraTable = () => {
  const [page, setPage] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // @ts-ignore
  const { data, isLoading, isError } = useQuery("compras", getBuys, { refetchOnWindowFocus: false });

  const { data: detail, isLoading: detailLoading } = useQuery(["buyDetail", page], () => getBuyDetail(page), { refetchOnWindowFocus: false });

  console.log(data);

  const columns = [
    {
      Header: "Fecha Emisión",
      Footer: "Fecha Emisión",
      accessor: "DOC_DATE",
    },
    {
      Header: "Proveedor",
      Footer: "Proveedor",
      accessor: "DOC_BUSINESS_NAME",
    },
    {
      Header: "Número de comprobante",
      Footer: "Número de comprobante",
      accessor: "DOC_SERIE",
    },
    {
      Header: "Total compra",
      Footer: "Total compra",
      accessor: "DOC_SUBTOTAL",
    },
    {
      Header: "Acciones",
      Footer: "Acciones",
      // @ts-ignore
      Cell: ({ row }) => <ActionCell prov={row.original} />,
    },
  ];

  const detailColumn = [
    {
      Header: "Producto",
      Footer: "Producto",
      accessor: "SDT_DESCRIPTION",
    },
    {
      Header: "Total",
      Footer: "Total",
      accessor: "SDT_TOTAL",
    },
  ];

  const ActionCell = ({ prov }: { prov: any }) => {
    return (
      <Stack
        style={{ justifyContent: "center" }}
        direction={{ base: "column", md: "row" }}>
        <Button
          onClick={() => {
            onOpen();
            setPage(prov.DOC_ID);
          }}>
          Ver Detalle
        </Button>
      </Stack>
    );
  };

  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  if (data.message) return (
    <Stack>
      <Text>{data.message}</Text>
    </Stack>
  )
  // @ts-ignore
  return (
    <>
      <Box w={'100%'} textAlign={'right'}>
        <ExporCompraInterna info={data} />
      </Box>
      <MyReactTable
        columns={columns}
        data={data}
        isPaginated
        hasFilters
        pagesOptions={[5, 10, 15]}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalle de compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailLoading ? (
              <Skeleton />
            ) : detail.length < 0 ? (
              <h1>No hay compras registradas</h1>
            ) : (
              <>
                <MyReactTable columns={detailColumn} data={detail} />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const ExporCompraInterna = ({ info }: { info: any }) => {

  function exportProduct() {
    let workbook = new Excel.Workbook()

    let worksheet = workbook.addWorksheet("COMPRAS INTERNAS")

    worksheet.mergeCells("B2", "G2")

    let row = worksheet.getCell('B2')
    row.value = "REPORTE DE COMPRAS INTERNAS"

    row.alignment = { vertical: 'middle', horizontal: 'center' }

    row.font = { name: 'Courier New', family: 4, size: 11, bold: true }

    let cabecera = worksheet.addRow('')

    cabecera.getCell(2).value = 'N°'
    cabecera.getCell(3).value = 'FECHA DE EMISIÓN'
    cabecera.getCell(4).value = 'PROVEEDOR'
    cabecera.getCell(5).value = 'RUC'
    cabecera.getCell(6).value = 'DIRECCIÓN'
    cabecera.getCell(7).value = 'COMPROBANTE'
    cabecera.getCell(8).value = 'TOTAL DE COMPRA'

    cabecera.alignment = { vertical: 'middle', horizontal: 'center' }

    cabecera.font = { name: 'Courier New', family: 4, size: 9, bold: true }
    cabecera.eachCell((cell: any, number: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    let i = 0

    for (const value of info) {
      i++

      let detalle = worksheet.addRow('')

      detalle.getCell(2).value = i
      detalle.getCell(2).alignment = { vertical: 'middle', horizontal: 'center'}

      detalle.getCell(3).value = new Date(value.DOC_DATE).toISOString().split('T')[0]
      detalle.getCell(3).alignment = { vertical:'middle', horizontal: 'center'}

      detalle.getCell(4).value = value.DOC_BUSINESS_NAME
      detalle.getCell(4).alignment = { vertical:'middle', horizontal: 'right'}

      detalle.getCell(5).value = value.DOC_ID_CLIENT
      detalle.getCell(5).alignment = { vertical:'middle', horizontal: 'center'}

      detalle.getCell(6).value = value.DOC_DIRECTION_CLIENT
      detalle.getCell(6).alignment = { vertical:'middle', horizontal: 'right'}

      detalle.getCell(7).value = value.DOC_SERIE +' - ' + value.DOC_NUMBER
      detalle.getCell(7).alignment = { vertical:'middle', horizontal: 'center'}

      detalle.getCell(8).value = value.DOC_SUBTOTAL
      detalle.getCell(8).alignment = { vertical:'middle', horizontal: 'right'}

      detalle.font = { name: 'Courier New', family: 4, size: 9, bold: false }

    }


    worksheet.getColumn(2).width = 20
    worksheet.getColumn(3).width = 20
    worksheet.getColumn(4).width = 30
    worksheet.getColumn(5).width = 20
    worksheet.getColumn(6).width = 30
    worksheet.getColumn(7).width = 20
    worksheet.getColumn(8).width = 20

    workbook.xlsx.writeBuffer().then((xls: any) => {
      workbook.removeWorksheet(worksheet.id);
      let blob = new Blob([xls], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `REGISTRO COMPRAS INTERNAS.xlsx`);
  });

  }
  return (
    <>
      <Button leftIcon={<TbFileExport />} colorScheme='orange' color={'white'}
      onClick={exportProduct}>EXPORTAR COMPRAS INTERNAS</Button>
    </>
  )
}
