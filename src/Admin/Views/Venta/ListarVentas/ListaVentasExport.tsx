import React from 'react'

import * as fs from 'file-saver';


import Excel, { Workbook } from 'exceljs';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';
import { useQuery } from 'react-query';

export const ListaVentasExport = ({ isLoading, data, fechas }: { isLoading: any, data: any, fechas: any }) => {

    async function getVentas({ fechaIni, fechaFin, tienda }: { fechaIni: string, fechaFin: string, tienda: number }) {
        const res = await fetch(import.meta.env.VITE_APP_API + `/document/descDetail/${fechaIni + '/' + fechaFin + '/' + tienda}`);
        return res.json();
    }

    const { isLoading: isLoadingDetail, isError, data: dataDetail, error, isFetching, refetch } = useQuery(["ventasDetalladas", fechas], () => getVentas(fechas), {
        refetchOnWindowFocus: false,
    });
    console.log(dataDetail);

    if (isLoading || isLoadingDetail) return (
        <>
            <Button
                bg={"#3e49f9"}
                isLoading={isLoading}
                leftIcon={<BsDownload />}>
                Export
            </Button>

            <Button
                bg={"#3e49f9"}
                isLoading={isLoading}
                leftIcon={<BsDownload />}>
                Export Detallado
            </Button>
        </>)

    return <ExportCSV csvData={data} csvDataDetail={dataDetail} />
}

const ExportCSV = ({ csvData, csvDataDetail }: any) => {
    console.log(csvData, csvDataDetail);

    // let data = !(csvData.status == 200) ? csvData.map((val: any, idx: number) => {
    //     return {
    //         "Fecha": val.DOC_DATE2
    //         , "ID Cliente": val.DOC_ID_CLIENT
    //         , "Nombre": val.DOC_BUSINESS_NAME
    //         , "Documento": val.DCT_NAME
    //         , "Comprobante": val.COMPROBANTE
    //         , "Tipo de Pago": val.PMT_NAME
    //         , "Monto": val.DOC_NETO
    //         , "Estado": val.DOC_ESTADO == "1" ? "Pagado" : "Emitido"
    //     }
    // }) : [];

    // const exportToCSV = (csvData: any, fileName: any) => {

    //     const ws = XLSX.utils.json_to_sheet(csvData);

    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    //     const data = new Blob([excelBuffer], { type: fileType });

    //     FileSaver.saveAs(data, fileName + fileExtension);

    // }

    function excel(detalle: boolean) {
        var data = detalle ? csvDataDetail : csvData
        console.log('DATA ...', data);

        const workbook = new Excel.Workbook()

        let worksheet = workbook.addWorksheet("VENTAS REALIZADAS")

        worksheet.mergeCells("B2", detalle ? "P2" : "M2")
        let titulo = worksheet.getCell("B2");
        titulo.value = 'VENTAS REALIZADAS'
        titulo.font = { name: 'Courier New', family: 4, size: 9, bold: true }
        titulo.alignment = { vertical: 'middle', horizontal: 'center' }

        worksheet.mergeCells("B3", detalle ? "P3" : "M3")
        worksheet.mergeCells("B4", detalle ? "P4" : "M4")
        let cabecera = worksheet.addRow("")
        cabecera.getCell(2).value = 'N°'
        cabecera.getCell(3).value = 'FECHA'
        cabecera.getCell(4).value = 'DNI/RUC'
        cabecera.getCell(5).value = 'NOMBRES Y APELLIDOS/RAZON SOCIAL'
        cabecera.getCell(6).value = 'TIPO DE COMPROBANTE'
        cabecera.getCell(7).value = 'NRO. COMPROBANTE'
        cabecera.getCell(8).value = 'TIPO DE PAGO'
        cabecera.getCell(9).value = 'MÉTODO DE PAGO'
        cabecera.getCell(10).value = 'MONTO DE PAGO'
        cabecera.getCell(11).value = 'ESTADO DE VENTA'
        cabecera.getCell(12).value = 'ESTADO SUNAT'
        cabecera.getCell(13).value = 'PUNTO DE VENTA'
        if (detalle) {
            cabecera.getCell(14).value = 'PRODUCTOS'
            cabecera.getCell(15).value = 'CANTIDAD'
            cabecera.getCell(16).value = 'PRECIOS'
        }

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

        let i = 1
        data && data.forEach((element: any) => {
            let row = worksheet.addRow("")
            row.getCell(2).value = i
            row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(3).value = element.DOC_DATE2
            row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(4).value = element.DOC_ID_CLIENT

            row.getCell(5).value = element.DOC_BUSINESS_NAME

            row.getCell(6).value = element.DCT_NAME
            row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(7).value = element.COMPROBANTE
            row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(8).value = element.PMT_NAME
            row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(9).value = element.DOC_METODO_PAGO
            row.getCell(9).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(10).value = element.DOC_NETO
            row.getCell(10).numFmt = element.DOC_NETO < 999 ? '0.00' : '0,000.00'
            row.getCell(10).alignment = { vertical: 'middle', horizontal: 'right' }

            row.getCell(11).value = element.DOC_ESTADO == "1" ? "Pagado" : "Emitido"
            row.getCell(11).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(12).value = element.DOC_STATUS
            row.getCell(12).alignment = { vertical: 'middle', horizontal: 'center' }

            row.getCell(13).value = element.POS_NAME
            row.getCell(13).alignment = { vertical: 'middle', horizontal: 'center' }

            if (detalle) {
                row.getCell(14).value = element.productos
                row.getCell(14).alignment = { vertical: 'middle', horizontal: 'left' }
                row.getCell(15).value = element.SDT_AMOUNT
                row.getCell(15).alignment = { vertical: 'middle', horizontal: 'left' }
                row.getCell(16).value = element.SDT_SUBTOTAL
                row.getCell(16).alignment = { vertical: 'middle', horizontal: 'left' }
            }

            row.font = { family: 4, size: 9 }
            i++
        });

        // COLUMNAS

        worksheet.getColumn(3).width = 20
        worksheet.getColumn(4).width = 20
        worksheet.getColumn(5).width = 34
        worksheet.getColumn(6).width = 20
        worksheet.getColumn(7).width = 20
        worksheet.getColumn(8).width = 20
        worksheet.getColumn(9).width = 20
        worksheet.getColumn(10).width = 20
        worksheet.getColumn(11).width = 20
        worksheet.getColumn(12).width = 20
        worksheet.getColumn(13).width = 34
        if (detalle) {
            worksheet.getColumn(14).width = 40
            worksheet.getColumn(15).width = 20
            worksheet.getColumn(16).width = 20
        }

        workbook.xlsx.writeBuffer().then((xls: any) => {
            workbook.removeWorksheet(worksheet.id);
            let blob = new Blob([xls], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `LISTA DE VENTAS.xlsx`);
        });

    }


    return (<>
        <Button
            bg={"#0080ff"}
            color={"white"}
            _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }}
            leftIcon={<BsDownload />}
            onClick={(e) => excel(false)}>Export</Button>

        <Button
            bg={"#0080ff"}
            color={"white"}
            _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }}
            leftIcon={<BsDownload />}
            onClick={(e) => excel(true)}>Export Detallado</Button>
    </>
    )

}       