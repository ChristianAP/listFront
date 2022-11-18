import React from 'react'

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import { Button, Stack, Skeleton } from '@chakra-ui/react';
import { BsDownload } from 'react-icons/bs';

export const ImportPlantilla = () => {
    return <ExportCSV isLoading={false} csvData={[]} fileName="Plantilla de Clientes" />
}

const ExportCSV = ({ csvData, fileName, isLoading }: any) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';

    const exportToCSV = (csvData: any, fileName: any) => {
        const dataExport = [{
            "Tipo de cliente": "1=Person Natural; 2=Sociedad Anonima (S.A.); 3=Sociedad Anónima cerrada (S.A.C.); 4=Sociedad Comercial de Responsabilidad Limitada (S.R.L.); 5=Empresario Individual de Responsabilidad Limitada (E.I.R.L.); 6=Sociedad Anónima Abierta (S.A.A.); 7=Persona Sin Definir; 8=Persona con Negocio ",
            "Forma de Pago": "5=AL CONTANDO; 15=7 DIAS; 16=15 DIAS; 17=30 Dias",
            "Clasificación de cliente": "1= Muy bueno; 2=Bueno; 3=Normal; 4=Mal; 5=Muy Malo",
            "Nombre comercial": "razon social, llenar si no es tipo persona",
            "RUC": "opcional RUC, si es tipo perosona",
            "Nombre": "Nombre del cliente, llenar si es tipo persona",
            "Apellido": "Apellido del clietne, llenar si es tipo persona",
            "Doc. Identidad": "DNI, llenar si es tipo persona",
            "N° de celular": "Numero de celular",
            "Correo electronico": "Correo del cliente",
            "Pais de origen": "pais del cliente",
            "Departamento": "departamento",
            "Provincia": "provincia",
            "Distrito": "distrito",
            "Dirección": "direccion y referencias",
        }]

        const ws = XLSX.utils.json_to_sheet(dataExport);

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);

    }



    return (

        <Button isLoading={isLoading} bg={"#3e49f9"} leftIcon={<BsDownload />} onClick={(e) => exportToCSV(csvData, fileName)}>Plantilla</Button>

    )

}