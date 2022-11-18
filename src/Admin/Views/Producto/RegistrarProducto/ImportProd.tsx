import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { getCategoryById } from "../../../../Service/CategoryAdminService";
import { createPriceList } from "../../../../Service/PriceListAdminService";
import { createStock } from "../../../../Service/ProductAdminService";
import { ProductByCode } from "../../../../Service/RemisionAdminService";
export const ImportProd = ({setCarganding} : {setCarganding : any}) => {
    const queryClient = useQueryClient();
    const toast = useToast()
    const { mutateAsync, isLoading } = useMutation('createProduct')
    const { mutateAsync: mutateStock, isLoading: loadingStock } = useMutation(createStock)
    const [idPriceList, setIdPriceList] = useState(0)
    const [cargando, setCargando] = useState(false)

    // const { isOpen, onClose, onOpen } = useDisclosure()

    //const { mutateAsync: createPriceListAsync } = useMutation(createPriceList)
    //const { mutateAsync, isLoading } = useMutation('createProductDetail')
    const handleFile = () => {
        // @ts-ignore
        file.current.click();
    };
    const file = useRef(null);
    //@ts-ignore
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                //@ts-ignore
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        setCargando(true)
        setCarganding(true)
        promise.then(async (d) => {
            let validated = false
            //const dataJson = await createPriceListAsync()
            //const data = await dataJson.json()
            //const idPriceList = data.data
            //@ts-ignore
            for (let i = 0; i < d.length; i++) {
                //@ts-ignore
                const val = d[i];
                console.log(val);
                try {
                    let productoEncontrado = await ProductByCode((val.codigo).toString().substring(1, 6));
                    console.log(productoEncontrado);

                    let categoriaEncontrada = await getCategoryById(productoEncontrado[0].CAT_ID);
                    let horaCreate = new Date().toLocaleTimeString().toLocaleString()
                    let datecreate = new Date().toLocaleDateString().toLocaleString();
                    let dateSplit = datecreate.split("/");
                    let dateexpere = Number(dateSplit[1]) + categoriaEncontrada.CAT_EXPIRATION_MONTH + "-" + dateSplit[0] + "-" + dateSplit[2] + " " + horaCreate;

                    console.log(datecreate, dateexpere);

                    console.log(productoEncontrado[0]);
                    console.log(categoriaEncontrada);
                    const values = {
                        "PRO_NAME": productoEncontrado[0].PRO_NAME,
                        "PRO_DESCRIPTION": productoEncontrado[0].PRO_DESCRIPTION,
                        "PRO_BRAND": (val.codigo).toString().substring(1, 6),
                        "PRO_CODE": (val.codigo).toString(),
                        "PRO_BARCODE": (val.codigo).toString(),
                        "PRO_CREATE_DATE": productoEncontrado[0].PRO_CREATE_DATE,
                        "CAT_ID": productoEncontrado[0].CAT_ID,
                        "PRO_PRICE": Number((productoEncontrado[0].PRD_UNIT_PRICE * Number((val.codigo).toString().substring(6, 8) + "." + (val.codigo).toString().substring(8, 11)))),
                        "PRO_WEIGHT": Number((val.codigo).toString().substring(6, 8) + "." + (val.codigo).toString().substring(8, 11)),
                        "PRO_EXPIRATION_DATE": dateexpere,
                        "PRO_IMAGE": productoEncontrado[0].PRO_IMAGE,
                        "PRO_INAFECT": productoEncontrado[0].PRO_INAFECT,
                        "PRO_REMISION": productoEncontrado[0].PRO_REMISION,
                        "PRO_FATHER": "0",
                        "PRO_ONLINE": "1",
                        "PRO_AGOTADO": "1",
                    }
                    console.log(values);
                    let formData = new FormData();
                    for (let value in values) {
                        //@ts-ignore
                        console.log(values[value]);
                        //@ts-ignore
                        formData.append(value, values[value]);
                    }
                    //@ts-ignore
                    let productoId = await mutateAsync(formData)

                    await mutateStock({
                        //@ts-ignore
                        PRO_ID: productoId.data,
                        STK_INITIAL_STOCK: values.PRO_WEIGHT,
                        STK_TODAY: values.PRO_WEIGHT,
                        STK_STATUS: 1,
                    })
                } catch (error) {
                    validated = true
                    console.log(error);
                    toast({
                        title: "Error de datos en el formato",
                        description: "Revisar archivo. Sugerencia revisar el titulo y códigos",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                    });
                }
                //const dataJson = await createProdListAsync()
            }
            if (!validated) {
    
                toast({
                    title: "Registro Terminado",
                    description: "Se a registrado correctamente todos los Productos deseados",
                    status: "success",
                    duration: 8000,
                    isClosable: true,
                });
            }
            setCarganding(false)
            setCargando(false)
            //queryClient.invalidateQueries('PriceList');
        });
    };

    return (

        <>
      



            <Button isLoading={cargando} onClick={handleFile} mx={2} leftIcon={<BsUpload />} colorScheme="green">
                <Text mx={2}>Import</Text>
                <input
                    ref={file}
                    hidden
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{ width: "150px" }}
                    type="file"
                    onChange={(e) => {
                        //@ts-ignore
                        const file = e.target.files[0];
                        readExcel(file);
                    }}
                />
            </Button>
        </>

    )
}