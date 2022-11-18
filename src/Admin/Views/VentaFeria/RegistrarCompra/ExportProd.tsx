import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsDownload, BsUpload } from "react-icons/bs";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { getPointSaleById } from "../../../../Service/PoaintSaleService";
import { DocumentRemission } from "../../../../Service/RemisionAdminService";
import { exportExcel, selectPOSID } from "../../../../Service/UsPointSale";
import { SelectPOS } from "../VentaPOS/selectPOS";
import { ExportModal } from "./exportModal";
import * as fs from 'file-saver';


import Excel from 'exceljs';

export const ExportProd = ({fechas} :{fechas : any}) => {
    const [cargando, setCargando] = useState(false)


    const [POS_ID, setPOS_ID] = useState(0)
    const [pointSale, setPointSale] = useState<any>()
    const [dataExcel, setDataExcel] = useState<any>()
    const [selectIDS, setSelectIDS] = useState([])
    const [admin, setAdmin] = useRecoilState(AdminState);

    const { isLoading: isLoadingPOS } = useQuery(
        ["remisionDataPlace", POS_ID],
        () => getPointSaleById(POS_ID),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setPointSale(data)
            }
        }
    );

    const { isLoading: isLoadingExcel } = useQuery(
        ["excel", POS_ID],
        () => exportExcel(POS_ID, fechas),
        {
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setDataExcel(data)
            }
        }
    );

    // const { isLoading :isloadingPointSaleIDs} = useQuery(
    //     ['pointID', admin.iu],
    //     () => selectPOSID(admin.iu),
    //     {
    //         refetchOnWindowFocus : false,
    //         onSuccess : (data) => {
    //             console.log("DATA PARA EL SELECT..." , data);
    //             // let ids = []
                
    //             if (!data.message) {
                    
    //                 data.forEach((element : any) => {
    //                     if (element.UPS_STATUS == '1') {
    //                         console.log(element.POS_ID);
    //                         // @ts-ignore
    //                         setSelectIDS([...selectIDS, element.POS_ID])
    //                     }
    //                 });
    //                 // setSelectIDS(...ids)

    //                 console.log("DATA DEL US STATE ..." , selectIDS);
                    
    //             }
    //         }
    //     }
    // )   

    function excel() {
        // console.log(admin);
        
        // console.log("SELECCIONADO...", pointSale);
        // console.log('DATA DEL EXCEL...', dataExcel);
        const workbook = new Excel.Workbook();

        let worksheet = workbook.addWorksheet('GUÍA DE REMISIÓN')

        worksheet.mergeCells('A1', 'E1');
        let titulo = worksheet.getCell('A1');
        titulo.value = `GUÍAS DE REMISIÓN - ${pointSale.POS_DIRECTION}`
        titulo.font = { name: 'Courier New', family: 4, size: 9, bold: true }
        titulo.alignment = { vertical: 'middle', horizontal: 'center' }

        worksheet.addRow('')
        worksheet.addRow('')
        let cabecera = worksheet.addRow('')
        cabecera.getCell(1).value = 'N°'
        cabecera.getCell(2).value = 'NÚMERO DE GUÍA '
        cabecera.getCell(3).value = 'NOMBRE DE PRODUCTO'
        cabecera.getCell(4).value = 'PRECIO'
        cabecera.getCell(5).value = 'ESTADO'
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

        let vendido = 0
        let novendido = 0

        if (!dataExcel.message) {
            
            dataExcel.forEach((element: any) => {
                let row = worksheet.addRow('')
                row.getCell(1).value = element.secuencia;
                row.getCell(2).value = element.REM_CODE;
                row.getCell(3).value = element.PRO_NAME;
                row.getCell(4).value = 'S/. ' + element.RDT_PRICE;
                row.getCell(4).numFmt = element.RDT_PRICE < 999 ? '0.00' : '0,000.00';
                row.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' }
                row.getCell(5).value = element.estado;
                row.font = { name: 'Courier New', family: 4, size: 9 }

                    
                    if (element.RDT_VENDIDO == '1') {
                        vendido += Number(element.RDT_PRICE)
                        
                    } else if (element.RDT_VENDIDO == '0') {
                         novendido += Number(element.RDT_PRICE)
                         
                    }
            });
        }else{
            let row = worksheet.addRow('')
            worksheet.mergeCells("A5", "E5")
            row.getCell(1).value = 'NO HAY REGISTROS PARA MOSTRAR ...'
            row.font = { name: 'Courier New', family: 4, size: 9, bold : true }
        }


        

        worksheet.addRow('');
        let totales = worksheet.addRow('')
        totales.getCell(1).value = 'TOTAL VENDIDOS : '
        totales.getCell(1).font = { color: { argb: "12775c" }, name: 'Courier New', family: 4, size: 9, bold: true }
        totales.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }

        totales.getCell(2).value = 'S/. ' + vendido.toFixed(2)
        totales.getCell(2).numFmt = vendido < 999 ? '0.00' : '0,000.00';
        totales.getCell(2).font = { color: { argb: "12775c" }, name: 'Courier New', family: 4, size: 9, bold: true }
        totales.getCell(2).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

        totales.getCell(4).value = 'TOTAL NO VENDIDOS : '
        totales.getCell(4).font = { color: { argb: "7d0013" }, name: 'Courier New', family: 4, size: 9, bold: true }
        totales.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }

        totales.getCell(5).value = 'S/. ' + novendido.toFixed(2)
        totales.getCell(5).numFmt = (novendido) < 999 ? '0.00' : '0,000.00';
        totales.getCell(5).font = { color: { argb: "7d0013" }, name: 'Courier New', family: 4, size: 9, bold: true }
        totales.getCell(5).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }


        worksheet.getColumn(1).width = 20;
        worksheet.getColumn(1).alignment = { vertical: 'middle', horizontal: 'center' }
        worksheet.getColumn(2).width = 20;
        worksheet.getColumn(2).alignment = { vertical: 'middle', horizontal: 'center' }
        worksheet.getColumn(3).width = 35;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 20;
        worksheet.getColumn(5).alignment = { vertical: 'middle', horizontal: 'center' }

        workbook.xlsx.writeBuffer().then((data: any) => {
            workbook.removeWorksheet(worksheet.id);
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `GUÍA DE REMISIÓN - ${pointSale.POS_DIRECTION}.xlsx`);
        });
    }

    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Button leftIcon={<BsDownload />} isLoading={cargando} mx={2} colorScheme="green">
                        <Text mx={2}>EXPORTAR</Text>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Exportar Guía de Remisión</PopoverHeader>
                    <PopoverBody display={"grid"}>
                        <SelectPOS setPOS_ID={setPOS_ID} width={"300px"} admin={admin} />
                        <br />
                        <Button colorScheme="green" onClick={() => {
                            excel();

                        }}>EXPORTAR</Button>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>

    )
}