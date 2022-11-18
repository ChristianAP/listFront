import { Box, Button, Skeleton, Stack, Switch, Text } from "@chakra-ui/react";
import React from "react";
import { TbFileExport } from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { editStatusCompra, listExternalProducts } from "../../../../Service/ExternalProductsService";

import * as fs from 'file-saver';


import Excel, { Workbook } from 'exceljs';

export const TableExternal = () => {

  const { data, isError, isLoading, isFetched, isFetching } = useQuery('externalProducts', listExternalProducts)

  const columns = [
    {
      Header: "FECHA DE EMISIÓN",
      Footer: "FECHA DE EMISIÓN",
      accessor: "ETP_BUY_DATE",
    },
    {
      Header: "PROVEEDOR",
      Footer: "PROVEEDOR",
      accessor: "PER_TRADENAME",
    },
    {
      Header: "PRODUCTO",
      Footer: "PRODUCTO",
      accessor: "ETP_NAME",
    },
    {
      Header: "TIPO DE COMPRA",
      Footer: "TIPO DE COMPRA",
      accessor: "tipo_pago",
    },
    {
      Header: "TOTAL COMPRA",
      Footer: "TOTAL COMPRA",
      accessor: "ETP_TOTAL",
    },
    {
      Header: "ESTADO DE PAGO",
      Footer: "ESTADO DE PAGO",
      accessor: "ESTADO",
    },
    {
      Header: "Acciones",
      Footer: "Acciones",
      // @ts-ignore
      Cell: ({ row }) => <ActionCell prov={row.original} />,
    },
  ];

  const ActionCell = ({ prov }: { prov: any }) => {
    const { mutateAsync } = useMutation(editStatusCompra)
    const queryClient = useQueryClient()
    // console.log(prov);

    return (
      <>
        <Box display={prov.ESTADO == 'CANCELADO' ? 'none' : 'block'}>
          <Switch checked={prov.ESTADO == 'CANCELADO' ? true : false} size='lg' onChange={async (e: any) => {
            let state = e.target.checked
            await mutateAsync({ ETP_ID: prov.ETP_ID, ETP_STATUS: state == false ? '0' : '1' })
            await queryClient.invalidateQueries('externalProducts')
          }} />
        </Box>
      </>
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

  return (
    <>
      <Box w={'100%'} textAlign='right'>
        <ExportComprasExternas info={data} />
      </Box>
      <MyReactTable data={data} columns={columns} hasFilters isPaginated />
    </>
  )

}


export const ExportComprasExternas = ({info} : {info : any}) => {

  function exportExcel(){
      const workbook = new Excel.Workbook()

      let worksheet = workbook.addWorksheet("COMPRAS EXTERNAS")

      
      worksheet.addRow("")
      worksheet.mergeCells('B2', 'H2')
      let titulo = worksheet.getCell('B2')
      titulo.value = 'REPORTE DE COMPRAS EXTERNAS'
      titulo.alignment = { vertical: 'middle', horizontal: 'center' }
      titulo.font = { name: 'Courier New', family: 4, size: 9, bold: true }

      let cabecera = worksheet.addRow('')

      cabecera.getCell(2).value = 'N°'
      cabecera.getCell(3).value = 'FECHA DE EMISIÓN'
      cabecera.getCell(4).value = 'PROVEEDOR'
      cabecera.getCell(5).value = 'PRODUCTO ADQUIRIDO'
      cabecera.getCell(6).value = 'TIPO DE COMPRA'
      cabecera.getCell(7).value = 'TOTAL DE COMPRA'
      cabecera.getCell(8).value = 'ESTADO DE PAGO'

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
        
      let i  = 0

      for(let e of info){
        i++

        let detalle = worksheet.addRow('')

        detalle.getCell(2).value = i
        detalle.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' }

        detalle.getCell(3).value = e.ETP_BUY_DATE

        detalle.getCell(4).value = e.PER_TRADENAME

        detalle.getCell(5).value = e.ETP_NAME

        detalle.getCell(6).value = e.tipo_pago
        detalle.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' }

        detalle.getCell(7).value = e.ETP_TOTAL
        detalle.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }

        detalle.getCell(8).value = e.ESTADO
        detalle.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' }

        detalle.font = { name: 'Courier New', family: 4, size: 9, bold: false }
      }

      worksheet.getColumn(2).width = 20
      worksheet.getColumn(3).width = 20
      worksheet.getColumn(4).width = 35
      worksheet.getColumn(5).width = 35
      worksheet.getColumn(6).width = 20
      worksheet.getColumn(7).width = 20
      worksheet.getColumn(8).width = 20

      workbook.xlsx.writeBuffer().then((xls: any) => {
        workbook.removeWorksheet(worksheet.id);
        let blob = new Blob([xls], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, `REGISTRO COMPRAS EXTERNAS.xlsx`);
    });

  }

  return (
    <>
        <Button leftIcon={<TbFileExport />} colorScheme='orange'
        onClick={exportExcel}
        >EXPORTAR COMPRA EXTERNAS</Button>
    </>
  )
}