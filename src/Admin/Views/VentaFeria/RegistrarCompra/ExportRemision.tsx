import React, { useState } from 'react'

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import { Button, Stack, Skeleton, IconButton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';
import { ExportOrders } from '../../../../Service/Sales';
import { BiExport } from 'react-icons/bi';
import { exportRemission } from '../../../../Service/RemisionAdminService';

export const ExportRemision = ({ idexport }: { idexport: number }) => {


    return <ExportCSV idexport={idexport} fileName="Pedidos Online" />
}

const ExportCSV = ({ fileName, idexport }: any) => {

    const [isLoading, setIsLoading] = useState(false)

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';



    const exportToCSV = async () => {
        setIsLoading(true)
        const csvData: [any] = await exportRemission(idexport)

        const dataExport = csvData.map((val: any, idx: number) => {
            return {
                "Nº": idx + 1,
                "Insumo": val.INSUMO,
                "PRODUCTOS": val.PESO,
                "TOTAL A PAGAR": val.PRECIO,
            }
        })
        const ws = XLSX.utils.json_to_sheet(dataExport);

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);
        setIsLoading(false)
    }



    return (

        <IconButton
            colorScheme='green'
            aria-label='Call Segun'
            isLoading={isLoading}
            size='lg'
            icon={<BiExport />}
            onClick={(e) => { exportToCSV() }}
        />

    )

}