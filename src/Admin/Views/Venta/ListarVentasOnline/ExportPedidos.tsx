import React from 'react'

import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';
import { ExportOrders } from '../../../../Service/Sales';


import * as fs from 'file-saver';
import Excel, { Workbook } from 'exceljs';
import { wordBreak } from 'html2canvas/dist/types/css/property-descriptors/word-break';

export const DescargarPedidos = ({ fechas }: { fechas: { fechaIni: string, fechaFin: string } }) => {
    const { isLoading, data } = useQuery(
        ["exportDetailOrder", fechas],
        () => ExportOrders(fechas),
        { refetchOnWindowFocus: false }
    );
    return <ExportCSV isLoading={isLoading} csvData={data} fileName="Pedidos Online" />
}

const ExportCSV = ({ csvData, fileName, isLoading }: any) => {



    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';



    const exportToCSV = (csvData: any, fileName: any) => {

        console.log("veamos ", csvData);
        console.log("veamos ", csvData[0].Productos);
        
        let dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']

        // const dataExport = csvData.map((val: any) => {
        //     return {
        //         "NOMBRE/RAZON SOCIAL": val.PER_TRADENAME.length > 1 ? val.PER_TRADENAME : val.PER_NAME + " " + val.PER_LASTNAME,
        //         "DIRECCIÓN": val.PER_DISTRIC + " " + val.PER_DIRECTION,
        //         "PRODUCTOS": val.Productos,
        //         "TOTAL A PAGAR": val.totalPrecio,
        //     }
        // })
        // const ws = XLSX.utils.json_to_sheet(dataExport); 

        // const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        // const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // const data = new Blob([excelBuffer], { type: fileType });

        // FileSaver.saveAs(data, fileName + fileExtension);

        let fecha = new Date()
        let dia = fecha.getDate()
        let month = fecha.getMonth() + 1
        let anio = fecha.getFullYear()
        let fechaHOY = (dia >= 10 ? dia : '0'+dia) + '/' + (month >= 10 ? month : '0' + month) + '/' + anio

        const workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet()
        
        
        worksheet.mergeCells("B2", "C2")
        worksheet.getCell("B2").value = 'FECHA : '
        worksheet.getCell("B2").font = { name: 'Courier New', family: 4, size: 9, bold: true }
        worksheet.getCell("B2").alignment = { vertical: 'middle', horizontal: 'center' }

        worksheet.mergeCells("D2", "F2")
        worksheet.getCell("D2").value = fechaHOY
        worksheet.getCell("D2").font = { name: 'Courier New', family: 4, size: 9, bold: true }
        worksheet.getCell("D2").alignment = { vertical: 'middle', horizontal: 'center' }

        worksheet.mergeCells("B3","F3")
        worksheet.getCell("B3").value = dias[fecha.getDay()]
        worksheet.getCell("B3").font = { name: 'Courier New', family: 4, size: 22, bold: true }
        worksheet.getCell("B3").alignment = { vertical: 'middle', horizontal: 'center' }
        worksheet.getRow(3).height = 50

        

        worksheet.mergeCells("B4", "F4")
        worksheet.mergeCells("B5", "F5")

        let titulo = worksheet.getCell("B5")
        titulo.value = "REGISTRO DE PEDIDOS ONLINE"
        titulo.font = { name: 'Courier New', family: 4, size: 9, bold: true }
        titulo.alignment = { vertical: 'middle', horizontal: 'center' }

        worksheet.mergeCells("B6", "F6")
        worksheet.mergeCells("B7", "F7")

        let cabecera = worksheet.addRow("")
        cabecera.getCell(2).value = "N°"
        cabecera.getCell(3).value = "NOMBRE/RAZÓN SOCIAL"
        cabecera.getCell(4).value = "DIRECCIÓN"
        cabecera.getCell(5).value = "PRODUCTOS"
        cabecera.getCell(6).value = "TOTAL A PAGAR"

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
        for (let obj of csvData) {
            i++
            let row = worksheet.addRow("")
            row.getCell(2).value = i
            row.getCell(2).alignment = {vertical : 'middle', horizontal : 'center'}

            row.getCell(3).value = obj.PER_TRADENAME.length > 1 ? obj.PER_TRADENAME : obj.PER_NAME + " " + obj.PER_LASTNAME
            row.getCell(3).alignment = {vertical : 'middle', horizontal : 'right'}

            row.getCell(4).value = obj.PER_DISTRIC + " " + obj.PER_DIRECTION
            row.getCell(4).alignment = {vertical : 'middle', horizontal : 'right'}

            row.getCell(5).value = obj.Productos
            row.getCell(5).alignment = {vertical : 'middle', horizontal : 'right', wrapText : true }

            row.getCell(6).value = obj.totalPrecio
            row.getCell(6).numFmt = Number(obj.totalPrecio ) < 999 ? '0.00' : '0,000.00';
            row.getCell(6).alignment = {vertical : 'middle', horizontal : 'center'}

            row.font = { family: 4, size: 9, bold: false }

        }

        worksheet.getColumn(2).width = 10
        worksheet.getColumn(3).width = 40
        worksheet.getColumn(4).width = 50
        worksheet.getColumn(5).width = 80
        worksheet.getColumn(6).width = 20

        workbook.xlsx.writeBuffer().then((data: any) => {
            workbook.removeWorksheet(worksheet.id);
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `PEDIDOS ONLINE.xlsx`);
        });
    }



    return (

        <Button isLoading={isLoading} bg={"#2321fd"}
            color={"white"}
            _hover={{ bg: "rgb(237 242 247)", color: "#2321fd" }} leftIcon={<BsDownload />} onClick={(e) => exportToCSV(csvData, fileName)}>Export</Button>

    )

}