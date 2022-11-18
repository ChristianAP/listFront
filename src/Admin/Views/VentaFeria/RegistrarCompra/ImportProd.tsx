import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { async } from "regenerator-runtime";
import * as XLSX from "xlsx";
import { getCategoryById } from "../../../../Service/CategoryAdminService";
import { getPointSaleById } from "../../../../Service/PoaintSaleService";
import {  SelectPOS } from "../VentaPOS/selectPOS";
import { createPriceList } from "../../../../Service/PriceListAdminService";
import { createStock } from "../../../../Service/ProductAdminService";
import { AgregarRemission, AgregarRemissionDetail, DocumentRemission, ProductByCode, updateDocumentSequence } from "../../../../Service/RemisionAdminService";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import { MySelect } from "../../../../GlobalUI/Forms/MyInputs";
import { getConductor } from "../../../../Service/PersonService";
import { Conductores } from "../../Configuracion/Index";

interface RemissionsDetail {
    RDT_ID?: number;
    REM_ID?: number;
    PRO_ID: number;
    RDT_AMOUNT: number;
    RDT_CODEBAR: string;
    RDT_DUEDATE: string;
    RDT_PRICE: number;
    RDT_STATUS: string;
    nameproduct: string;
}

export const ImportProdRemision = ({setCarganding} : {setCarganding : any}) => {
    const queryClient = useQueryClient();
    const [admin, setAdmin] = useRecoilState(AdminState);
    const getFecha = () => {
        let hoy = new Date();
        return hoy.getFullYear() + "-" + ((hoy.getMonth() + 1) < 10 ? '0'+ (hoy.getMonth() + 1) : (hoy.getMonth() + 1)) + "-" + (hoy.getDate() < 10 ? '0'+ hoy.getDate() : hoy.getDate());
        
    };
    
    async function getEmpresa() {
        // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
        const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
        return res.json();
      }

    const { mutateAsync, isLoading } = useMutation('createProduct')
    const { mutateAsync: CrateRemission } = useMutation(AgregarRemission)
    const { mutateAsync: UpdateDocumentSequence } = useMutation(updateDocumentSequence)
    const { mutateAsync: CrateRemissionDetail } = useMutation(AgregarRemissionDetail)
    const [cargando, setCargando] = useState(false)
    const [conductor, setConductor]= useState("");
    const [licencia, setLicencia]= useState("");
    const [placa, setPlaca]= useState("");
    const { isLoading: loadingEmpresa, data: dataEmpresa, error } = useQuery("empresa", getEmpresa, {
        refetchOnWindowFocus: false,
      });

    const [POS_ID, setPOS_ID] = useState(0)
    const [pointSale, setPointSale] = useState<any>()

    const { data: dataConductor, isLoading: loadingConductor } = useQuery('conductor_as', getConductor,
    
    { refetchOnWindowFocus: false })

    var prods: RemissionsDetail[] = []

    function zfill(number: number, width: number) {
        var numberOutput = Math.abs(number); /* Valor absoluto del número */
        var length = number.toString().length; /* Largo del número */
        var zero = "0"; /* String de cero */

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }
        }
    }

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

    const { data, isLoading: isLoadingRemission, isError, isFetching, refetch } = useQuery(
        "documentoRemisionData",
        DocumentRemission,
        { refetchOnWindowFocus: false }
    );    
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

        promise.then(async (d) => {
            //const dataJson = await createPriceListAsync()
            //const data = await dataJson.json()
            //const idPriceList = data.data
            setCargando(true)
            setCarganding(true)
            //@ts-ignore
            for (let i = 0; i < d.length; i++) {
                //@ts-ignore
                const val = d[i];

                console.log(val);
                let productoEncontrado = await ProductByCode(String(val.codigo).substring(1, 6));

                console.log(productoEncontrado);
                if (!productoEncontrado.message) {
                    let categoriaEncontrada = await getCategoryById(productoEncontrado[0].CAT_ID);
                    console.log(categoriaEncontrada);
                    
                    
                    let horaCreate = new Date().toLocaleTimeString().toLocaleString()
                    let datecreate = new Date().toLocaleDateString().toLocaleString();
                    let dateSplit = datecreate.split("/");
                    let dateexpere = Number(dateSplit[1]) + categoriaEncontrada.CAT_EXPIRATION_MONTH + "-" + dateSplit[0] + "-" + dateSplit[2] + " " + horaCreate;
    
                    prods.push({
                        //@ts-ignore
                        PRO_ID: productoEncontrado[0].PRO_ID,
                        RDT_AMOUNT: Number((val.codigo).toString().substring(6, 8) + "." + (val.codigo).toString().substring(8, 11)),
                        RDT_CODEBAR: (val.codigo).toString(),
                        RDT_DUEDATE: dateexpere,
                        RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * Number((val.codigo).toString().substring(6, 8) + "." + (val.codigo).toString().substring(8, 11)))),
                        RDT_STATUS: "1",
                        //@ts-ignore
                        nameproduct: productoEncontrado[0].PRO_NAME,
                    })
                    console.log(prods);
                }


            }
            console.log(dataConductor);
            
            const cretedRemission = await CrateRemission({
                REM_ADDRESSEE: "AAA",
                REM_CARRIER: conductor,
                REM_CODE: "GR" + zfill(Number(data.DCT_SEQUENCE) + 1, 5),
                REM_DATECREATED: getFecha(),
                REM_INPOINT: pointSale.POS_DIRECTION,
                REM_LICENSE: licencia,
                REM_OUT: "0",
                REM_STATUS: "0",
                REM_OUTPOINT: dataEmpresa[0].COM_ORGANIZATION_DIRECTION,//TO-DO direccion de la empresa
                REM_PLATE: placa,
                REM_UPDATEOUT: "Por Llenar"
            })
            console.log(cretedRemission);
            await UpdateDocumentSequence({
                sequence: Number(parseInt(data.DCT_SEQUENCE) + 1),
                idDocument: 76
            })
            prods.map(async (remi, idx) => {
                await CrateRemissionDetail({
                    REM_ID: cretedRemission.data,
                    PRO_ID: remi.PRO_ID,
                    RDT_AMOUNT: remi.RDT_AMOUNT,
                    RDT_PRICE: remi.RDT_PRICE,
                    RDT_CODEBAR: remi.RDT_CODEBAR,
                    RDT_DUEDATE: remi.RDT_DUEDATE,
                    RDT_STATUS: remi.RDT_STATUS
                })
            })
            queryClient.invalidateQueries("remision")
            setCargando(false)
            setCarganding(false)
            //queryClient.invalidateQueries('PriceList');
        });
    };

    return (
        <>
            <Popover>
                <PopoverTrigger>
                    {/* @ts-ignore */}
                    <Button visibility={admin.roles.includes("CONDUCTOR") ? 'hidden' : 'visible'} isLoading={cargando || isLoadingRemission} mx={4} colorScheme="green" leftIcon={<BsUpload fontSize={'xl'}/>}>
                     Import
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />    
                    <PopoverCloseButton />
                    <PopoverHeader>Importar Guía de Remisión</PopoverHeader>
                    <PopoverBody display={"grid"}>
                        <SelectPOS setPOS_ID={setPOS_ID} width={"300px"} admin={admin} />
                        <PopoverHeader>Conductor</PopoverHeader>
                        <Select onChange={(e:any)=>{
                            const v = JSON.parse(e.target.value);
                            setConductor(v.PER_NAME+" "+ v.PER_LASTNAME)
                            setLicencia(v.PER_LICENSE)
                            setPlaca(v.PER_PLATE)
                        }} placeholder='seleccione conductor'>
                            {dataConductor && dataConductor.map((e:any)=>{
                                let nombre_completo= e.PER_NAME +" "+ e.PER_LASTNAME
                                return <option value={JSON.stringify(e)}>{nombre_completo}</option>
                            })}
                        </Select>
                        <br />
                        
                        <Button justifyContent={'center'} leftIcon={<BsUpload />} colorScheme="green" onClick={handleFile}>
                            <Text mx={2}>Confirmar</Text>
                        </Button>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
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
        </>
    )
}