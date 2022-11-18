import React from 'react'

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { getDataToExport } from '../../../../Service/PriceListAdminService';
import { BsDownload } from 'react-icons/bs';

export const DescargarPriceList = ({level} : {level : any}) => {
    const { data, isLoading, isFetching } = useQuery(['pricelist', level], () => getDataToExport(level),{refetchOnWindowFocus:false});
    return <ExportCSV  isLoading={isLoading} csvData={data} fileName="Lista de Precios" />
}

const ExportCSV = ({ csvData, fileName,isLoading }: any) => {



    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';



    const exportToCSV = (csvData: any, fileName: any) => {

        const ws = XLSX.utils.json_to_sheet(csvData);

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);

    }



    return (

        <Button isLoading={isLoading} bg={"#3e49f9"} color="white" _hover={{}} leftIcon={<BsDownload />} onClick={(e) => exportToCSV(csvData, fileName)}>Exportar</Button>

    )

}