import { Box, Text } from "@chakra-ui/react";
import { Clasificacion, Grupo, PersonType } from "../../../../Model/Clientes";

import api from "../../Venta/RealizarVenta/ApiVentas";
import {
    ListClasificacion,
    ListGrupo,
    ListTipo,
    searchPersonByDocument,
} from "../../../../Service/PersonService";

import { CreatePerson } from "../../../../Model/Person";
import { createCliente } from "../../../../Model/Clientes";

import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Link,
    Divider,
    InputGroup,
    InputRightElement,
    Flex,
    Spacer,
    FormControl,
    FormLabel,
    HStack,
    Center,
    useDisclosure,
    Select,
    Spinner,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSaleByPOS } from "../../../../Service/PoaintSaleService";
import { MyContain } from "../../../UI/Components/MyContain";
import { FindProductPOD } from "./FindProductPOS";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { useRecoilState } from "recoil";
import { Formik } from "formik";
import { ProviderSearchSelect } from "../../../../GlobalUI/Forms/ProviderSearchSelect";
import { AddCliente } from "../../Venta/ListarClientes/AddCliente";
import { BsPersonPlusFill } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { EditarRemissionDetail } from "../../../../Service/RemisionAdminService";
import { ListMetodoPago } from "../../../../Service/MetodoPagoService";
export const VentaPosInfo = (
    {
        POS_ID,
        array,
        setArray,
        listProd,
        setListProd,
        cambio,
        vuelto,
        descuento,
        total,
        subtotalGeneral,
        descuentoGeneral,
        totalMontoInafecto,
        totalIGVInafecto,
        totalIGV,
        totalGravada,
        totalSubTotal,
        SetCambio,
        SetVuelto,
        SetDescuento,
        SetTotal,
        SetSubtotalGeneral,
        SetDescuentoGeneral,
        SetTotalMontoInafecto,
        SetTotalIGVInafecto,
        SetTotalIGV,
        SetTotalGravada,
        SetTotalSubTotal,
        formDetalle,
        SetFormDetalle,
        numeros,
        price,
        setPrice,
        handleButton,
        handleDelete,
        categoria,
        setCategoria,
        productos,
        setProductos,
    }
        :
        {
            POS_ID: any,
            array: any,
            setArray: any,
            listProd: any,
            setListProd: any
            cambio: any,
            vuelto: any,
            descuento: any,
            total: any,
            subtotalGeneral: any,
            descuentoGeneral: any,
            totalMontoInafecto: any,
            totalIGVInafecto: any,
            totalIGV: any,
            totalGravada: any,
            totalSubTotal: any,
            SetCambio: any,
            SetVuelto: any,
            SetDescuento: any,
            SetTotal: any,
            SetSubtotalGeneral: any,
            SetDescuentoGeneral: any,
            SetTotalMontoInafecto: any,
            SetTotalIGVInafecto: any,
            SetTotalIGV: any,
            SetTotalGravada: any,
            SetTotalSubTotal: any,
            formDetalle: any,
            SetFormDetalle: any,
            numeros: any,
            price: any,
            setPrice: any,
            handleButton: any,
            handleDelete: any,
            categoria: any,
            setCategoria: any,
            productos: any,
            setProductos: any,
        }
) => {

    const updateTotal = () => {
        const valores = listProd.map((prod: any) => {
            return {
                // @ts-ignore
                total: prod.total,
                // @ts-ignore
                decuento: prod.descuento,
                // @ts-ignore
                inafec: prod.inafecta,
            };
        });
        let totalTotal = 0;
        let totalDescuento = 0;
        let totalInafect = 0;
        let totalIGVInafect = 0;
        let totaIGV = 0;
        let gravada = 0;
        let subTotal = 0;
        valores.map((e: any) => {
            subTotal = subTotal + (e.total / 1.18);
            gravada = gravada + (e.inafec == 1 ? 0 : e.total);
            totalTotal = totalTotal + (e.inafec == 1 ? e.total / 1.18 : e.total);
            totaIGV = totaIGV + (e.inafec == 1 ? 0 : (e.total / 1.18) * 0.18);
            totalDescuento = totalDescuento + e.decuento;
            if (e.inafec == "1") {
                totalInafect = totalInafect + (e.total / 1.18);
                totalIGVInafect = totalIGVInafect + ((e.total / 1.18) * 0.18);
            }
        });

        SetTotalMontoInafecto(totalInafect);
        SetTotalIGVInafecto(totalIGVInafect);
        SetSubtotalGeneral(totalTotal);
        SetTotal(totalTotal - descuentoGeneral);
        SetDescuento(totalDescuento);
        SetTotalIGV(totaIGV);
        SetTotalGravada(gravada);
        SetTotalSubTotal(subTotal - descuentoGeneral)
    };

    const cambioVuelto = () => {
        let cambioVuelto: number = cambio - total;
        cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
        SetVuelto(cambioVuelto);

    }
    const handleChangeCambio = (e: any) => {

        SetCambio(e.target.value);
        let cambioVuelto: number = parseFloat(e.target.value) - total;
        cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
        SetVuelto(cambioVuelto);

    }

    useEffect(() => {
        updateTotal()
        cambioVuelto()
    }, [listProd])

    return (
        <Box w={{ base: '100%', md: '40%' }}>
            <Box boxShadow="md"
                p={3}
                bg={'white'}
                borderRadius="md"
                alignItems="start"
                justifyContent="center">
                <Box p={"15px"}>

                    {array && array.length > 0 ?
                        <FindProductPOD
                            array={array}
                            setListProd={setListProd}
                            setArray={setArray}
                            numeros={numeros}
                            price={price}
                            setPrice={setPrice}
                            handleButton={handleButton}
                            handleDelete={handleDelete}
                            categoria={categoria}
                            setCategoria={setCategoria}
                            productos={productos}
                            setProductos={setProductos} />
                        :
                        <Text>Por favor Seleccione un Punto de Venta</Text>
                    }
                </Box>
                <Box p={"15px"}>
                    <InfoVenta
                        vistaDescripcion={listProd}
                        total={total}
                        totalMontoInafecto={totalMontoInafecto}
                        totalIGVInafecto={totalIGVInafecto}
                        SetFormDetalle={SetFormDetalle}
                        subtotalGeneral={subtotalGeneral}
                        descuentoGeneral={descuentoGeneral}
                        descuento={descuento}
                        cambio={cambio}
                        vuelto={vuelto}
                        cambioVuelto={cambioVuelto}
                        SetCambio={SetCambio}
                        handleChangeCambio={handleChangeCambio}
                        formDetalle={formDetalle}
                        totalGravada={totalGravada}
                        totalSubTotal={totalSubTotal}
                    />
                </Box>
            </Box >
        </Box >
    )
}
const InfoVenta = (props: any) => {
    const messageToast = useToast();

    const { data: data_metodoPago, isFetching, isLoading: loadingMetodoPago, isFetched } = useQuery('metodo_pago', ListMetodoPago,
    { refetchOnWindowFocus: false })

    const [searcher, setSearcher] = React.useState({ searcher: "" });
    const getFecha = () => {
        let hoy = new Date();
        return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
    };
    const defaultFormDetalle = () => {
        props.SetFormDetalle({
            ...props.formDetalle,
            idCliente: "00000000",
            razonSocial: "CLIENTES VARIOS",
            direccion: "",
        });
    };
    let [clienteEncontrado, SetClienteEncontrado] = React.useState(true);

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };
    const handleChange = (e: any) => {
        props.SetFormDetalle({
            ...props.formDetalle,
            [e.target.name]: e.target.value,
        });
    };

    // This function is for the search client and yes, is a async function and important
    const busquedaPersona = useQuery(
        ["personSearch", searcher],
        () => mutateAsync(searcher),
        { refetchOnWindowFocus: false }
    );

    function getDataSearch(event: any) {
        if (event != "") {
            setSearcher({ searcher: event });
        }
    }

    let [inputBuscarCliente, SetInputBuscarCliente] = React.useState("");
    const handleChangeBuscar = (e: any) => {
        SetInputBuscarCliente(e.target.value);
    };
    let [spinnerSearchClient, SetSpinnerSearchClient] = React.useState(false);
    const { mutateAsync, data = [], isLoading } = useMutation(searchPersonByDocument);

    // @ts-ignore
    const [persona, setPersona] = React.useState<CreatePerson>({});

    const [clienteForm, setClienteForm] = React.useState<createCliente>({
        CLA_ID: 1,
        PER_ID: 0,
    });

    const fnSetFormDetalle = (data: any) => {
        props.SetFormDetalle({
            ...props.formDetalle,
            PER_ID: data.PER_ID,
            idCliente:
                data.PER_RUC && data.PER_RUC !== "-" ? data.PER_RUC : data.PER_DNI,
            razonSocial: data.PER_TRADENAME
                ? data.PER_TRADENAME
                : data.PER_NAME + " " + data.PER_LASTNAME,
            direccion: data.PER_DIRECTION ? data.PER_DIRECTION : "",
            metodoPago: data.PMT_ID ? data.PMT_ID : 5,
            adicionalPago: data.PMT_PRICE ? data.PMT_PRICE : 0,
        });
    };

    const clientState = false;

    const buscarCliente = () => {
        SetClienteEncontrado(true);
        SetSpinnerSearchClient(false);
        const valor = inputBuscarCliente;
        props.SetFormDetalle({
            ...props.formDetalle,
            PER_ID: 0,
            idCliente: "00000000",
            razonSocial: "CLIENTES VARIOS",
            direccion: "",
        });
        if (valor == "00000000") {
            SetSpinnerSearchClient(true);
            defaultFormDetalle();
        } else {
            mutateAsync(valor)
                .then((data: any) => {
                    if (data.error) {
                        messageToast({
                            title: "Oops! Error, sin resultados",
                            description:
                                "No se encontro ninguna coincidencia en las bases de datos consultadas. Revise el valor ingresado.",
                            status: "error",
                            variant: "subtle",
                            duration: 5000,
                            isClosable: true,
                        });
                    } else if (data.PLATFORM === "sunat") {
                        delete data.PLATFORM;
                        setPersona({
                            ...persona,
                            ...data,
                        });
                        ActivarClient();
                    } else if (data.PLATFORM === "reniec") {
                        delete data.PLATFORM;
                        setPersona({
                            ...persona,
                            ...data,
                        });
                        props.SetFormDetalle({
                            ...props.formDetalle,
                            idCliente: data.PER_DNI,
                            razonSocial: data.PER_TRADENAME
                                ? data.PER_TRADENAME
                                : data.PER_NAME + " " + data.PER_LASTNAME,
                            direccion: data.PER_DIRECTION,
                        });
                        ActivarClient();
                    } else if (data.PLATFORM === "own") {
                        props.SetFormDetalle({
                            ...props.formDetalle,
                            PER_ID: data.PER_ID,
                            idCliente: data.PER_RUC === "-" ? data.PER_DNI : data.PER_RUC,
                            razonSocial: data.PER_TRADENAME
                                ? data.PER_TRADENAME
                                : data.PER_NAME + " " + data.PER_LASTNAME,
                            direccion: data.PER_DIRECTION,
                            metodoPago: data.PMT_ID ? data.PMT_ID : 5,
                            adicionalPago: data.PMT_PRICE ? data.PMT_PRICE : 0,
                        });
                    }
                    throw data;
                })
                .catch((error: any) => {
                    if (error.status) {
                        messageToast({
                            title: "Error " + error.status + ", Oops!",
                            description: error.message,
                            status: "warning",
                            variant: "subtle",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                });
        }
    };

    const ChangePersonaHook = () => {
        const valor = inputBuscarCliente;
        let tipocliente = 0;
        let r_dni = "";
        let r_ruc = "";
        if (valor.length == 8) {
            tipocliente = 1;
            r_dni = valor;
        } else {
            if (valor.length == 11) {
                tipocliente = 7;
                r_ruc = valor;
            }
        }
        setPersona({
            ...persona,
            PER_DNI: r_dni,
            PER_RUC: r_ruc,
            PET_ID: tipocliente,
        });
    };
    const ActivarClient = () => {
        const valor = inputBuscarCliente;
        SetClienteEncontrado(false);
        SetSpinnerSearchClient(true);
        props.SetFormDetalle({
            ...props.formDetalle,
            idCliente: valor,
            razonSocial: "",
            direccion: "",
        });
        ChangePersonaHook();
    };
    const addCancelar = () => {
        defaultFormDetalle();
        SetClienteEncontrado(true);
        SetInputBuscarCliente("");
    };
    const Recarga = () => {
        const valor = inputBuscarCliente;
        let r_razonSocial = "";
        if (valor.length == 8) {
            r_razonSocial = persona.PER_NAME + " " + persona.PER_LASTNAME;
        } else {
            if (valor.length == 11) {
                r_razonSocial = persona.PER_TRADENAME;
            }
        }
        props.SetFormDetalle({
            ...props.formDetalle,
            idCliente: valor,
            razonSocial: r_razonSocial,
            direccion: persona.PER_DIRECTION,
        });
        SetClienteEncontrado(true);
    };
    const ModalConf = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        let [loadSend, SetLoadSend] = React.useState(true);
        let [messageOfSended, SetMessageOfSended] = React.useState({
            message: "cargando información",
            status: 100,
            lastId: 0,
        });

        let [comprobanteCodigo, SetComprobanteCodigo] = React.useState("");
        const getProductosTabla = () => {
            let productosTabla: any[] = [];
            props.vistaDescripcion.map((producto: any) => {

                productosTabla.push({
                    DOC_ID: 0,
                    PRO_ID: producto.PRO_ID, //ID DEL PRODUCTO
                    DIS_ID: producto.DIS_ID ? producto.DIS_ID : null, //ID DEL DESCUENTO sv_discount, PUEDE SER NULO
                    SDT_CODE: producto.RDT_CODEBAR, //CODIGO DEL PRODUCTO
                    SDT_AMOUNT: producto.cantidad, //CANTIDAD VENDIDA
                    SDT_DESCRIPTION: producto.PRO_NAME, //DESCRIPCION DEL PRODUCTO
                    SDT_PRICE: (producto.inafecta == "1" ? (producto.precio / 1.18) : producto.precio).toFixed(2), //PRECIO DEL PRODUCTO
                    SDT_SUBTOTAL: (producto.inafecta == "1" ? (producto.subtotal / 1.18) : producto.subtotal).toFixed(2), //CANTIDAD * PRECIO
                    SDT_DISCOUNT: producto.descuento.toFixed(2), //DESCUENTO DEL PRODUCTO
                    SDT_TOTAL: (producto.inafecta == "1" ? (producto.total / 1.18) : producto.total).toFixed(2), //SUBTOTAL - DESCUENTO
                    SDS_DAYS_TO_SEND: getFecha(), //FECHA DE CREACIÓN
                    SDT_DATE: getFecha(),
                    //SE MANTIENE POR DEFAULT
                    SDS_STATUS: "1", //SIEMPRE 1
                });
            });
            return productosTabla;
        };
        const getStockChange = () => {
            let changeStock: any[] = [];
            props.vistaDescripcion.map((producto: any) => {
                changeStock.push({
                    STK_ID: producto.STK_ID,
                    SDT_AMOUNT: producto.cantidad, //CANTIDAD VENDIDA
                });
            });
            return changeStock;
        };

        const saveDataVenta = () => {
            SetLoadSend(true);

            let dataVenta = {
                //MODELO DEL JSON QUE DEBE TOMAR LA VARIABLE doc ||||||||| NO MODIFICAR ESTA VARIABLE
                document: {
                    //ESTO SE DEJA POR DEFAULT EN PAGO AL CONTADO
                    PMT_ID: props.formDetalle.metodoPago, // METODO DE PAGO DE LA TABLA sv_payment_method

                    //VALOR CAMBIA
                    DCT_ID: comprobanteSeleccionado.DCT_ID, //TIPO DE DOCUMENTO DE LA TABLA sv_document_type [FACTURA, BOLETA]
                    //default
                    SLT_ID: 5, //TIPO DE VENTA DE LA TABLA sv_sales_type [VENTA FISICA, VENTA ONLINE]

                    //ESTO SE DEJA EN DEFAULT
                    XCR_ID: 5, //NO SE QUE VAINA ES, SOLO PONLE 5
                    BUS_ID: 5, //DATOS DEL NEGOCIO CON EL QUE SE ESTÁ VENDIENDO

                    //CAMBIA - DATOS CLIENTE
                    PER_ID:
                        props.formDetalle.PER_ID == 0 ? null : props.formDetalle.PER_ID, //dato del cliente
                    DOC_ID_CLIENT: props.formDetalle.idCliente, //EL ID DEL CLIENTE YA SEA DNI O RUC
                    DOC_BUSINESS_NAME: props.formDetalle.razonSocial, //NOMBRE DEL CLIENTE O SU RAZON SOCIAL
                    DOC_DIRECTION_CLIENT: props.formDetalle.direccion, //DIRECCION DEL CLIENTE
                    //CAMBIA - DATOS DOCUMENTO
                    DOC_DOC_TYPE: comprobanteSeleccionado.DCT_NAME, //SI ES FACTURA, BOLETA O NOTA DE CREDITO
                    DOC_SERIE: comprobanteSeleccionado.DCT_SERIE, //CODIGO SERIE DEL COMPROBANTE
                    DOC_NUMBER: comprobanteSeleccionado.DCT_SEQUENCE, //NUMERO QUE ACOMPAÑA A LA SERIE, ES EL CORRELATIVO
                    //CAMBIA - DATOS DOCUMENTO - TOTAL
                    DOC_SUB_SUBTOTAL:
                        (props.totalSubTotal + props.descuentoGeneral + props.descuento), // OPERACION GRAVADA + TOTAL IGV INAFECETA
                    DOC_SUB_DISCOUNT: props.descuento,
                    DOC_SUBTOTAL: props.total + props.descuentoGeneral + props.descuento, //EL TOTAL DEL SUBTOTAL SIN IGV SIN EL DESCUENTO
                    DOC_DISCOUNT: props.descuentoGeneral, //EL TOTAL DEL DESCUENTO
                    DOC_TAXED:
                        ((props.totalGravada + props.descuento) / 1.18), //TOTAL DEL SUBTOTAL SIN IGV CON DESCUENTO - TOTAL MONTO INAFECETA
                    //SE DEJA EN 0.00
                    DOC_INAFECT: Number(props.totalMontoInafecto.toFixed(2)), //TOTAL DE INAFECTO // TOTAL MONTO INAFECETA + TOTAL IGV INAFECETA = total precio de productos inafectos
                    DOC_RELEASED: 0.0, //TOTAL QUE EXONERA IGV

                    //CAMBIA
                    DOC_IGV:
                        (((props.totalGravada + props.descuento) / 1.18) * 0.18), //IGV DEL DOC_TAXED - TOTAL IGV INAFECETA
                    DOC_NETO: props.total.toFixed(2), //DOC_TAXED + DOC_IGV
                    //CAMBIA - ESTADO DOCUMENTO
                    DOC_STATUS: "CREADO", //HAY 2 ESTADO [CREADO,ACEPTADO ]
                    DOC_DATE: getFecha(),
                    DOC_METODO_PAGO: props.formDetalle.cuentaPago // COLUMNA AGREGADA
                },
                sales_description: getProductosTabla(),
                stock: getStockChange(),
            };
            // onOpen();

            // validar productos
            if (getProductosTabla().length == 0) {
                messageToast({
                    title: "Datos faltantes",
                    description: "No hay productos por vender",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                onOpen();
                api.ventas.addDocument(dataVenta).then(async (result) => {
                    if (result.status == 200) {
                        for (let i = 0; i < props.vistaDescripcion.length; i++) {
                            const element = props.vistaDescripcion[i];
                            await EditarRemissionDetail({
                                id: element.RDT_ID, remission: {
                                    RDT_VENDIDO: 1
                                }
                            })
                        }

                        SetLoadSend(false);
                        SetMessageOfSended({
                            ...messageOfSended,
                            message: result.message,
                            status: result.status,
                            lastId: result.lastId,
                        });
                    } else {
                        if (result.status == 500) {
                            SetMessageOfSended({
                                ...messageOfSended,
                                message: "error interno [500]",

                                status: result.status,
                            });
                        } else {
                            if (result.status == 404) {
                                SetMessageOfSended({
                                    ...messageOfSended,
                                    message: "Dirección no encontrada [404]",
                                    status: result.status,
                                });
                            } else {
                                SetMessageOfSended({
                                    ...messageOfSended,
                                    message: "error interno",
                                    status: result.status,
                                });
                            }
                        }
                    }
                });
            }
        };
        async function getConfiguracionImpresion() {
            const res = await fetch(import.meta.env.VITE_APP_API + "/config"); //falta
            return res.json();
        }
        function AbrirVentana() {
            getConfiguracionImpresion().then((result: any) => {
                let ruta = import.meta.env.VITE_APP_API_SUNAT_2 + "/impresion/";
                if (result[0].TEM_ID == 5) {
                    ruta = ruta + "ventas/" + messageOfSended.lastId;
                } else if (result[0].TEM_ID == 15) {
                    ruta = ruta + "ventasticket/" + messageOfSended.lastId;
                }
                let titulo = "Ventar";
                let opciones =
                    "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=400,height=screen.height,top=0,left=0";

                window.open(ruta, titulo, opciones);
            });
        }
        let [correo, SetCorreo] = React.useState("");
        function EnviarCorreo() {
            let emailRegex =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (emailRegex.test(correo)) {
                messageToast({
                    title: "Estamos enviando el correo",
                    description: "El comprobante se está enviando al correo",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
                api.ventas.sendCorreo(messageOfSended.lastId, correo).then((result) => {
                    if (result.message == "Mail send") {
                        messageToast({
                            title: "Correo enviado",
                            description:
                                "El comprobante fue enviado a " +
                                correo +
                                " satisfactoriamente",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                    } else {
                        messageToast({
                            title: "Correo no enviado",
                            description: "hubo algún error al enviar el correo",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                });
            } else {
                messageToast({
                    title: "Correo no válido",
                    description: "Ingrese un correo electrónico",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        return (
            <>
                <Button
                    onClick={
                        comprobanteSeleccionado.DCT_NAME.trim() == "FACTURA"
                            ? props.formDetalle.idCliente.length == 11
                                ? saveDataVenta
                                : () => {
                                    messageToast({
                                        title: "ID o RUC incorrecto",
                                        description: "cambie el RUC ingresado",
                                        status: "warning",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                }
                            : saveDataVenta
                    }

                    w="100%"
                    bg={"#0080ff"}
                    color={"white"}
                    _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }}
                >
                    Generar
                </Button>

                <Modal
                    isOpen={isOpen}
                    onClose={() => { }}
                    closeOnOverlayClick={false}
                    isCentered={true}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Confirmación del comprobante</ModalHeader>
                        <ModalCloseButton onClick={() => {
                            location.reload()
                        }} />
                        <ModalBody>
                            <Box display={loadSend ? "none" : "block"}>
                                <Box display={messageOfSended.status == 200 ? "block" : "none"}>
                                    <h3>
                                        Comprobante {serie} -{numeracion}, HA SIDO <b>CREADA</b>
                                    </h3>
                                    <InputGroup size="md">
                                        <Input
                                            pr="4.5rem"
                                            type="gmail"
                                            placeholder="Ingrese Correo"
                                            value={correo}
                                            onChange={(e: any) => {
                                                SetCorreo(e.target.value);
                                            }}
                                        />
                                        <InputRightElement width="6rem">
                                            <Button h="1.75rem" size="sm" onClick={EnviarCorreo}>
                                                Enviar Correo
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </Box>
                                <Box display={messageOfSended.status != 200 ? "block" : "none"}>
                                    <Alert status="error">
                                        <AlertIcon />
                                        <AlertDescription>
                                            {messageOfSended.message}
                                        </AlertDescription>
                                    </Alert>
                                </Box>
                            </Box>
                            <Box display={loadSend ? "block" : "none"}>
                                <Center>
                                    <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="green.500"
                                        size="xl"
                                    />
                                    <Text>Creando Venta...</Text>
                                </Center>
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Box display={loadSend ? "none" : "block"}>
                                <Box display={messageOfSended.status == 200 ? "block" : "none"}>
                                    <Link href="/admin/ventas/listar-venta">
                                        <Button bg={"#2321fd"}
                                            color={"white"}
                                            _hover={{ bg: "rgb(237 242 247)", color: "#2321fd" }} mr={3}>
                                            Ver Listado
                                        </Button>
                                    </Link>
                                    <Link href="/admin/ventas/realizar-venta">
                                        <Button bg={"#2321fd"}
                                            color={"white"}
                                            _hover={{ bg: "rgb(237 242 247)", color: "#2321fd" }} mr={3}>
                                            Nueva Venta
                                        </Button>
                                    </Link>

                                    <Button marginTop="10px" bg={"#2321fd"}
                                        onClick={AbrirVentana}
                                        color={"white"}
                                        _hover={{ bg: "rgb(237 242 247)", color: "#2321fd" }} mr={3}>
                                        Imprimir
                                    </Button>
                                </Box>
                                <Box display={messageOfSended.status != 200 ? "block" : "none"}>
                                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                                        Cerrar
                                    </Button>
                                </Box>
                            </Box>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    };
    const [personType, setType] = React.useState<PersonType[]>([]);

    const [grupo, setGrupo] = React.useState<Grupo[]>([]);

    const [clasificacion, setClasificacion] = React.useState<Clasificacion[]>([]);

    React.useEffect(() => {
        ListTipo().then((data) => {
            setType(data);
        });
        ListGrupo().then((data) => {
            setGrupo(data);
        });
        ListClasificacion().then((data) => {
            setClasificacion(data);
        });
        GetComprobantes();
        GetPayMethod();
    }, []);

    const actionCloseDraw = () => {
        props.SetFormDetalle({
            ...props.formDetalle,
            PER_ID: 0,
            idCliente: "00000000",
            razonSocial: "CLIENTES VARIOS",
            direccion: "",
        });
    };

    //==parte comprobante
    const [tipoComprobante, SetTipoComprobante] = React.useState([]);
    const [metodoPago, SetMetodoPago] = React.useState([]);
    let [comprobanteSeleccionado, SetcomprobanteSeleccionado] = React.useState({
        DCT_ESTADO: "1",
        DCT_ID: 5,
        DCT_NAME: "",
        DCT_SEQUENCE: "",
        DCT_SERIE: "",
    });
    function convertDateFormat(string: string) {
        var info = string.split('-');
        return info[2] + '/' + info[1] + '/' + info[0];
    }
    const [serie, SetSerie] = React.useState("");
    const [numeracion, SetNumeracion] = React.useState(0);
    function asignarSerieNumeracion(ide: any) {
        let seleccion = tipoComprobante.filter(
            (val: any) => val.DCT_ID == parseInt(ide)
        );
        //@ts-ignore
        SetSerie(seleccion[0].DCT_SERIE);
        //@ts-ignore
        SetNumeracion(seleccion[0].DCT_SEQUENCE);
        SetcomprobanteSeleccionado(seleccion[0]);
    }
    function GetComprobantes() {
        api.ventas.getTipoComprobantes().then((result: any) => {
            result.forEach((element: any) => {
                element.DCT_SEQUENCE = parseInt(element.DCT_SEQUENCE) + 1;
            });
            const ticket = result.find((e: any) => e.DCT_ID == '77');
            SetTipoComprobante(result);
            SetSerie(ticket.DCT_SERIE);
            SetNumeracion(ticket.DCT_SEQUENCE);
            SetcomprobanteSeleccionado(ticket);
        });
    }
    function GetPayMethod() {
        api.ventas.getPayMethod().then((result: any) => {

            SetMetodoPago(result);
        });
    }
    ///====║
    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Box
                    border="1px"
                    borderColor="gray.100"
                    w="100%"
                    p={3}
                    mb={2}
                    borderRadius="md"
                >
                    <FormControl id="comprobante" mb={2}>
                        <FormLabel>Tipo de Comprobante</FormLabel>
                        <Select
                            size="sm"
                            name="tipoComprobante"
                            value={props.formDetalle.tipoComprobante}
                            onChange={(e: any) => {
                                handleChange(e);
                                let ide = e.target.value;
                                asignarSerieNumeracion(ide);
                            }}
                        >
                            {tipoComprobante.map((dato: any) => {
                                if (dato.DCT_VISIBLE == 1) {
                                    return (
                                        <option key={dato.DCT_ID} value={dato.DCT_ID}>
                                            {dato.DCT_NAME}: {dato.DCT_SERIE} - {dato.DCT_ID}
                                        </option>
                                    );
                                }
                            })}
                        </Select>
                    </FormControl>

                    <FormControl id="metodoPago">
                        <FormLabel>Tipo Pago</FormLabel>
                        <Select
                            size="sm"
                            name="metodoPago"
                            onChange={handleChange}
                            // @ts-ignore
                            value={props.formDetalle.metodoPago}
                        >
                            {metodoPago.map((dato: any, idx: number) => {
                                return (
                                    <option key={idx} value={dato.PMT_ID}>
                                        {dato.PMT_NAME}
                                    </option>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl id="tipoMoneda">
                        <FormLabel>Tipo de moneda</FormLabel>
                        <Select
                            size="sm"
                            value={props.formDetalle.tipoMoneda}
                            name="tipoMoneda"
                            onChange={handleChange}
                        >
                            <option value="1">Soles</option>
                        </Select>
                    </FormControl>
                    <FormControl id="metodo_pago">
                        <FormLabel>Método de Pago</FormLabel>
                        <Select
                            size="sm"
                            value={props.formDetalle.cuentaPago}
                            name="cuentaPago"
                            onChange={handleChange}
                        >
                            {data_metodoPago && data_metodoPago.map((e: any) => {
                                // if (e.MPG_STATUS !== '0') {
                                    return <option value={e.MPG_NAME}>{e.MPG_NAME}</option>

                                // }
                            })}
                        </Select>
                    </FormControl>
                </Box>
                <Box
                    border="1px"
                    borderColor="gray.100"
                    w="100%"
                    p={3}
                    mt={4}
                    mb={4}
                    borderRadius="md"
                >
                    <FormControl id="buscarCliente" mt="2">
                        <Tabs align="end" variant="enclosed">
                            <TabList>
                                <FormLabel>Buscar Cliente</FormLabel>
                                <Spacer />
                                <Tab>Nombres</Tab>
                                <Tab>DNI ó RUC</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Formik initialValues={{}} onSubmit={() => undefined}>
                                        <ProviderSearchSelect
                                            loading={isLoading}
                                            data={data}
                                            label="Cliente"
                                            getdata={getDataSearch}
                                            // @ts-ignore
                                            itemClick={(option, func) => {
                                                let {
                                                    PER_ID,
                                                    PMT_ID,
                                                    PER_DNI,
                                                    PER_RUC,
                                                    PER_NAME,
                                                    PMT_PRICE,
                                                    PER_LASTNAME,
                                                    PER_TRADENAME,
                                                    PER_DIRECTION,
                                                } = option;
                                                fnSetFormDetalle(option);
                                            }}
                                            placeholder="Buscar Cliente"
                                            name="search"
                                            id="search"
                                        />
                                    </Formik>
                                </TabPanel>
                                <TabPanel>
                                    <InputGroup size="md">
                                        <Input
                                            pr="4.5rem"
                                            type="number"
                                            placeholder="Ingrese DNI ó RUC"
                                            value={inputBuscarCliente}
                                            onChange={handleChangeBuscar}
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    /* handleClick() */
                                                    buscarCliente()
                                                }
                                            }}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Box width={20} justifyContent="flex-start">
                                                <Flex>
                                                    <Tooltip label='Buscar'>
                                                        <Button
                                                            h="1.75rem"
                                                            size="sm"
                                                            onClick={buscarCliente}
                                                            isDisabled={isLoading}
                                                            isLoading={isLoading}
                                                        >
                                                            <BiSearchAlt />
                                                        </Button>
                                                    </Tooltip>
                                                    <Spacer />
                                                    <Box display={clienteEncontrado ? "none" : "block"}>
                                                        <AddCliente
                                                            isWorker={false}
                                                            icon={<BsPersonPlusFill />}
                                                            sizeButton="xs"
                                                            reload={Recarga}
                                                            personType={personType}
                                                            grupo={grupo}
                                                            clasificacion={clasificacion}
                                                            persona={persona}
                                                            setPersona={setPersona}
                                                            clientState={clientState}
                                                            clienteForm={clienteForm}
                                                            setClienteForm={setClienteForm}
                                                            actionCloseDraw={actionCloseDraw}
                                                        />
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        </InputRightElement>
                                    </InputGroup>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </FormControl>
                    <FormControl id="idCliente" mt="2">
                        <HStack>
                            <FormLabel>ID-Cliente</FormLabel>
                            <Spinner
                                color="red.500"
                                display={!spinnerSearchClient ? "none" : "block"}
                            />
                        </HStack>
                        <Text fontSize="sm">{props.formDetalle.idCliente}</Text>
                        <Input
                            type="hidden"
                            size="sm"
                            isDisabled={clienteEncontrado}
                            value={props.formDetalle.idCliente}
                            name="idCliente"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="Cliente" mt="2">
                        <FormLabel>Cliente</FormLabel>
                        <Text fontSize="sm">{props.formDetalle.razonSocial}</Text>

                        <Input
                            type="hidden"
                            size="sm"
                            isDisabled={clienteEncontrado}
                            value={props.formDetalle.razonSocial}
                            name="razonSocial"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="Direccion" mt="2">
                        <FormLabel>Dirección</FormLabel>
                        <Text fontSize="sm">{props.formDetalle.direccion}</Text>
                        <Input
                            type="hidden"
                            size="sm"
                            isDisabled={clienteEncontrado}
                            value={props.formDetalle.direccion}
                            name="direccion"
                            onChange={handleChange}
                        />
                    </FormControl>
                </Box>
                {/* <Box
                    border="1px"
                    borderColor="gray.100"
                    w="100%"
                    p={3}
                    mb={2}
                    borderRadius="md"
                >
                    <FormControl id="CambioTotal">
                        <FormLabel>CambioTotal</FormLabel>
                        <Input
                            size="sm"
                            value={props.cambio}
                            name="cambio"
                            onChange={props.handleChangeCambio}
                        />
                        <Text>
                            <b>Vuelto:</b> {props.vuelto}
                        </Text>
                    </FormControl>
                </Box> */}
                <HStack p={"3"}>
                    <ModalConf />
                </HStack>
            </form>
        </Box >
    );
};