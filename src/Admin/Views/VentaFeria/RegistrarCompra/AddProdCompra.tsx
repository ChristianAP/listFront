import { Button, IconButton } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Divider, Flex, Spacer, Text } from "@chakra-ui/layout";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/number-input";
import { Skeleton } from "@chakra-ui/skeleton";
import React, { useEffect, useState } from "react";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import {
  getProductsStocks,
} from "../../../../Service/ProductAdminService";
import { Select, useToast } from "@chakra-ui/react";
import { getPointSaleById } from "../../../../Service/PoaintSaleService";

import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AgregarRemission, AgregarRemissionDetail, DocumentRemission, ProductByCode, updateDocumentSequence } from "../../../../Service/RemisionAdminService";
import { SelectPOS } from "../VentaPOS/selectPOS";
import { getConductor } from "../../../../Service/PersonService";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import { getCodebars } from "../../../../Service/codebar_configService";
/* interface RemissionsDetail {
  REM_CODEBAR: string;
  REM_WEIGHT: string;
  REM_DUEDATE: string;
  REM_PRICE: number;
  REM_OUT: string;
  PRO_ID: number;
  PRO_NAME: string;
} */
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
export const AddProdCompra = ({
  ref,
  idProducto,

}: {
  ref: any
  idProducto: any,

}) => {
  const getFecha = () => {
    let hoy = new Date();
    let dia = hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let anio = hoy.getFullYear();
    return anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
    //return hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear(); 
    // return zfill((hoy.getMonth() + 1) + "-" + hoy.getDate() + "-" + hoy.getFullYear()
  };
  const [admin, setAdmin] = useRecoilState(AdminState);

  const [producto, setProducto] = useState("")
  const [productoFind, setProductoFind] = useState([])
  const queryClient = useQueryClient();
  const { mutateAsync: CrateRemission } = useMutation(AgregarRemission)
  const { mutateAsync: UpdateDocumentSequence } = useMutation(updateDocumentSequence)
  const { mutateAsync: CrateRemissionDetail } = useMutation(AgregarRemissionDetail)
  async function getEmpresa() {
    // const res = await fetch(import.meta.env.VITE_APP_API + "/sales/saleswithclient/"+idventa); //falta
    const res = await fetch(import.meta.env.VITE_APP_API + "/company/");
    return res.json();
  }
  const { isLoading: loadingEmpresa, data: dataEmpresa, error } = useQuery("empresa", getEmpresa, {
    refetchOnWindowFocus: false,
  });
  /* const { data, isLoading, isError, isFetching, refetch } = useQuery(
    "producstStock",
    getProductsStocks,
    { refetchOnWindowFocus: false }
    ); */
  const [POS_ID, setPOS_ID] = useState(0)
  const [pointSale, setPointSale] = useState<any>()
  const [conductor, setConductor] = useState<any>()

  const { data: dataConductor, isLoading: loadingConductor } = useQuery('conductor_as', getConductor,
    { refetchOnWindowFocus: false })

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
  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    "documentoRemisionData",
    DocumentRemission,
    { refetchOnWindowFocus: false }
  );

  const [form, setForm] = useState({
    cantidad: 0.0,
    precio: 0.0,
    dudedate: "",
    codebar: ""
  });

  const [total, setTotal] = useState(0);

  const [prods, setProds] = useState<RemissionsDetail[]>([]);

  const { data: dataCodebar, isLoading: loadingCodebar, isFetched: fetchedCodebar, isError: isErrorCodebar, error: errorCodebar } = useQuery('codebarConf', getCodebars,
  { refetchOnWindowFocus: false })
  const toast = useToast();
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

  async function handleClick() {
    //@ts-ignore
    document.getElementById("codebar").value = ""
    console.log(prods);
    let codigo = (dataCodebar[0].CDC_DISTANCE).split(',')
    let pesoEntero = (dataCodebar[1].CDC_DISTANCE).split(',')
    let pesoDecimal = (dataCodebar[2].CDC_DISTANCE).split(',')
    console.log('ESTE ES EL CODIGO ENCONTRADO ...' ,producto.substring(Number(codigo[0]), Number(codigo[1])));

    let productoEncontrado = await ProductByCode(dataCodebar ? producto.substring(Number(codigo[0]), Number(codigo[1])) : '0')

    //// ANTERIOR
    // let productoEncontrado = await ProductByCode(producto.substring(1, 6))
    console.log(productoEncontrado);

    if (productoEncontrado.message) {
      toast({
        title: 'CODIGO DE BARRAS INCORRECTO',
        description: "No se encontró un producto con el código de barras ingresado ...",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }else{

      let peso = (codigo[0] == '0' && codigo[1] == dataCodebar[0].CDC_LENGTH) ?
                  Number(productoEncontrado[0].PRO_WEIGHT)
                  :
                  Number(producto.substring(pesoEntero[0], pesoEntero[1]) + "." + producto.substring(pesoDecimal[0], pesoDecimal[1]))
      /// ANTERIOR
      // let peso = Number(producto.substring(6, 8) + "." + producto.substring(8, 11))
  
      // console.log('LO QUE SE DEBE DE ENVIAR ...' ,
      //   {
      //     PRO_ID: productoEncontrado[0].PRO_ID,
      //     RDT_AMOUNT: peso,
      //     RDT_CODEBAR: producto,
      //     RDT_DUEDATE: form.dudedate,
      //     RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * peso).toFixed(2)),
      //     RDT_STATUS: "1",
      //     //@ts-ignore
      //     nameproduct: productoEncontrado[0].PRO_NAME,
      //   }
      // );
      
      setProds([
        ...prods,
        {
          //@ts-ignore
          PRO_ID: productoEncontrado[0].PRO_ID,
          RDT_AMOUNT: peso,
          RDT_CODEBAR: producto,
          RDT_DUEDATE: form.dudedate,
          RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * peso).toFixed(2)),
          RDT_STATUS: "1",
          //@ts-ignore
          nameproduct: productoEncontrado[0].PRO_NAME,
  
  
  
          //// ANTERIOR ...
  
          //@ts-ignore
          //  PRO_ID: productoEncontrado[0].PRO_ID,
          //  RDT_AMOUNT: Number(producto.substring(6, 8) + "." + producto.substring(8, 11)),
          //  RDT_CODEBAR: producto,
          //  RDT_DUEDATE: form.dudedate,
          //  RDT_PRICE: Number((productoEncontrado[0].PRD_UNIT_PRICE * Number(producto.substring(6, 8) + "." + producto.substring(8, 11))).toFixed(2)),
          //  RDT_STATUS: "1",
          //  //@ts-ignore
          //  nameproduct: productoEncontrado[0].PRO_NAME,
        },
      ]);
    }

  }
  async function handleAgregar() {
    let date = new Date()

    let dia = date.getDate()
    let mes = date.getMonth() + 1
    let anio = date.getFullYear()
    console.log(prods);
    console.log('ESTA ES LA DATA DISQUE', data);
    const cretedRemission = await CrateRemission({
      REM_ADDRESSEE: "Por Llenar",
      REM_CARRIER: conductor.PER_NAME + ' ' + conductor.PER_LASTNAME,
      // REM_CODE: "GR" +""+String((parseInt(data.DCT_SEQUENCE) + 1)),
      REM_CODE: `GR${zfill((parseInt(data.DCT_SEQUENCE) + 1), 5)}`,
      REM_DATECREATED: getFecha(),
      REM_INPOINT: pointSale.POS_DIRECTION,
      REM_LICENSE: conductor.PER_LICENSE,
      REM_OUT: "0",
      REM_STATUS: "0",
      REM_OUTPOINT: dataEmpresa[0].COM_ORGANIZATION_DIRECTION,
      POS_ID: pointSale.POS_ID,
      REM_PLATE: conductor.PER_PLATE,
      REM_UPDATEOUT: "Por Llenar"
    })
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
    setProds([])
    refetch()
  }

  useEffect(() => {
    let suma = 0.0;
    // @ts-ignore
    prods.map((val) => {
      suma = Number(val.RDT_PRICE) + suma;
    });
    setTotal(suma);
    if (ref) ref.current.focus();
  }, [prods]);

  if (isLoading || isFetching) return <Skeleton />;

  return (
    <>
      <Box w="100%">
        <SelectPOS setPOS_ID={setPOS_ID} width={"100%"} admin={admin} />
        <br />
        {loadingConductor ? <Skeleton height="70px" /> : <Select placeholder='Eliga un conductor' onChange={(e) => {
          console.log(e);
          console.log(JSON.parse(e.target.value));

          setConductor(JSON.parse(e.target.value))
        }}>
          {!dataConductor.message && dataConductor.map((e: any) =>
            <option value={JSON.stringify(e)}>{e.PER_NAME + ' ' + e.PER_LASTNAME}</option>
          )}
        </Select>}
        <br />
        <Text fontSize="lg" fontWeight="bold">
          Agregar producto
        </Text>
        <Flex borderRadius="5px" borderWidth="2px" p="5px" alignItems={"end"}>
          <Spacer />
          <Box w="80%" >
            <label htmlFor="codebar">{idProducto && idProducto.PRO_NAME}</label>
            <Input
              ref={ref}
              name="PRO_CODEBAR"
              type="text"
              id="codebar"
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  handleClick()
                }
                console.log(e.target.value);
              }}
              onKeyUp={(e: any) => {
                if ((e.target.value as string).length >= Number((dataCodebar[0].CDC_DISTANCE).split(',')[1])) {
                  setProducto(e.target.value)
                  console.log(form)
                }
                console.log(e.target.value);
              }} />
          </Box>
          <Spacer />
          <Box>
            <br />
            <Button
              colorScheme="green"
              //type="submit"
              onClick={handleClick}>
              Agregar Producto
            </Button>
          </Box>
        </Flex>
        <Divider />
        <CompraProdTable prods={prods} setProds={setProds} />
        <Flex flexDirection={{ base: "column", md: "row" }}>
          <Text float="right" mr="40%" fontWeight={500}>
            Total de la compra: s./ {total.toFixed(2)}
          </Text>
          <Button disabled={!(POS_ID > 0) || !(prods.length > 0)} onClick={handleAgregar}>
            Agregar
          </Button>
        </Flex>
      </Box>
    </>
  );
};

const CompraProdTable = ({
  prods,
  setProds,
}: {
  prods: any;
  setProds: any;
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  console.log(prods);

  const columns = [
    {
      Header: "Nombre",
      accessor: "nameproduct",
    },
    {
      Header: "Peso",
      accessor: "RDT_AMOUNT",
    },
    {
      Header: "Precio Total",
      accessor: "RDT_PRICE",
    },
    {
      Header: "",
      id: "remove_action",
      // @ts-ignore
      Cell: ({ row }) => {
        return (
          <IconButton
            colorScheme="red"
            aria-label="Search database"
            icon={<AiFillDelete />}
            onClick={() => updateMyData(row)}
          />
        );
      },
    },
  ];

  function updateMyData(row: any) {
    setSkipPageReset(true);
    console.log(row.index);

    // @ts-ignore
    setProds((old: any) => {
      // @ts-ignore
      return old.filter((val, idx) => idx !== row.index);
    });
  }

  useEffect(() => {
    setSkipPageReset(false);
  }, [prods]);

  return (
    <>
      <MyReactTable
        columns={columns}
        data={prods}
        skipPageReset={skipPageReset}
        updateMyData={updateMyData}
      />
    </>
  );
};
