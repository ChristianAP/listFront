import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { createPriceList } from "../../../../Service/PriceListAdminService";
export const ImportPriceList = ({ level , setCarganding }: { level : any ,setCarganding: any }) => {
    const queryClient = useQueryClient();
    const [idPriceList, setIdPriceList] = useState(0)
    const { mutateAsync: createPriceListAsync, error: errorList, isLoading: loadingList } = useMutation(createPriceList)
    const { mutateAsync, isLoading, error, isError } = useMutation('createProductDetail')
    const handleFile = () => {
        // @ts-ignore
        file.current.click();
    };
    const toast = useToast()
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
        setCarganding(true)
        promise.then(async (d) => {
            const dataJson = await createPriceListAsync(level)
            console.log();

            const data = await dataJson.json()

            if (data.message) {
                const idPriceList = data.data
                //@ts-ignore
                d.map((val) => {
                    if (!error) {
                        let productDetail: any = { PRO_ID: 0, PRL_ID: 0, PRD_UNIT_PRICE: 0, PRD_PACKAGE_PRICE: 0 }
                        productDetail.PRO_ID = val.PRO_ID;
                        productDetail.PRL_ID = idPriceList;
                        productDetail.PRD_UNIT_PRICE = val.PRD_UNIT_PRICE;
                        productDetail.PRD_PACKAGE_PRICE =val.PRD_PACKAGE_PRICE && val.PRD_PACKAGE_PRICE > 0 ? val.PRD_PACKAGE_PRICE : val.PRD_UNIT_PRICE;
                        mutateAsync(productDetail);
                    } else {
                        console.log(error,"error 1")
                        toast({
                            title: "No se Generó la lista de precios",
                            description: "Surgió un problema al importar la lista de precios, revise el excel a importar.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                })
                setCarganding(false)
                queryClient.invalidateQueries('PriceList');
                if (!error) {
                    toast({
                        title: "Importación Culminada",
                        description: "Se a registrado correctamente la lista de precios",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                console.log(data,"error 2")
                toast({
                    title: "No se Generó la lista de precios",
                    description: "Surgió un problema al importar la lista de precios, revise el excel a importar.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        });
    };

    return (
        <Button onClick={handleFile} mx={2} leftIcon={<BsUpload />} _hover={{}} color={"white"} bg={"#0f1e49"} >
            <Text mx={2}>Importar</Text>
            <input
                ref={file}
                hidden
                style={{ width: "150px" }}
                type="file"
                onChange={(e) => {
                    //@ts-ignore
                    const file = e.target.files[0];
                    readExcel(file);
                }}
            />
        </Button>
    )
}