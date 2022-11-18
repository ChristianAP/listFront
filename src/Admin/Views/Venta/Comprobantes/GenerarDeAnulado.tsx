import { Box, Button, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react"
import { Buscador } from "../RealizarVenta/Buscador";
import { MyContain } from "../../../UI/Components/MyContain";
import api from "../RealizarVenta/ApiVentas";
import { CalculadorTotal } from "../RealizarVenta/CalculadoraTotal";
import { InfoVenta } from "../RealizarVenta/InfoVenta";
import { VentaTable } from "../RealizarVenta/VentaTable";
import "../RealizarVenta/InputSearch.css";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
export const GenerarDeAnulado = ({ venta }: { venta: any; }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    //======================= carga de datos
    async function getProductosByVenta() {
        const typeSale = await fetch(
            import.meta.env.VITE_APP_API + "/document/" + venta.DOC_ID
        ); //falta
        const type = await typeSale.json()

        const res = await fetch(
            import.meta.env.VITE_APP_API + "/sales_description/bysale/" + venta.DOC_ID + "/" + (type.SLT_ID == 15 ? "online" : "fisico")
        );
        return res.json();
    }
    function getVentaInfo() {
        SetVistaDescripcion([])
        console.log("id doc aqui creo", venta)
        getProductosByVenta().then((productsRegs: any) => {
            // console.log("primer fetch",productsRegs);
            productsRegs.forEach((element: any) => {
                api.productos.getAllDetails(element.SDT_DESCRIPTION).then((newval: any) => {
                    console.log("productos_econtrados", newval)
                    let prod: any = newval[0];
                    prod.cantidad = element.SDT_AMOUNT;
                    prod.descuento = element.SDT_DISCOUNT;
                    prod.precio = element.SDT_PRICE;
                    prod.stock = element.SDT_SUBTOTAL;
                    prod.subtotal = element.SDT_TOTAL;
                    prod.total = prod.subtotal - prod.descuento;
                    console.log("producto nuevo", prod)
                    //@ts-ignore
                    SetVistaDescripcion([...vistaDescripcion, prod])
                })

            });

        })
        SetFormDetalle({
            tipoComprobante: 1,
            PER_ID: 0,
            idCliente: venta.DOC_ID_CLIENT,
            razonSocial: venta.DOC_BUSINESS_NAME,
            direccion: venta.DOC_DIRECTION_CLIENT,
            metodoPago: 1,
            tipoMoneda: 1,
            tipoCambio: 1,
            vendedor: admin.user,
            monto: venta.DOC_NETO,
            fecha: getFecha(),
            carrito: vistaDescripcion,
            cambio: 0,
            vuelto: 0,
        })
    }
    function asignProds() {

    }
    //llenar productos

    //================================= Copia de Venta

    //vars of sales
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Realizar Venta';
    }, []);

    let [queryProducto, SetQueryProducto] = React.useState("");
    let [vistaDescripcion, SetVistaDescripcion] = React.useState([]

    );

    let [productos, SetProductos] = React.useState([]);

    let filtro = productos.filter((producto: any) => {
        return `${producto.PRO_NAME}`
            .toLowerCase()
            .includes(queryProducto.toLowerCase());
    });

    let [toggleInput, SetToggleInput] = React.useState(true); // propiedad usada para mostrar el div o no
    let [classInput, SetclassInput] = React.useState("default"); // propiedad usada para cambiar el atributo class del input buscador
    let [classDiv, SetclassDiv] = React.useState("div-search");
    let [productoMuestra, SetProductoMuestra] = React.useState(filtro[0]);
    const toggleClassInput = (caso: boolean) => {
        // función que cambia las clases del input y del div, ademas de toggleInput
        // @ts-ignore
        SetProductoMuestra({});
        if (caso == false) {
            SetclassInput("default");
            SetToggleInput(true);
            SetclassDiv("div-search");
        } else {
            SetclassInput("input-search");
            SetToggleInput(false);
            SetclassDiv("div-search-absolute");
        }
    };

    const toggleDiv = (e: any) => {
        // función que recibe el parámetro de un evento, es usado para el input
        SetQueryProducto(e.target.value);

        api.productos.getAllDetails(e.target.value).then((products) => {
            if (products.hasOwnProperty("message")) {
                if (products.message == "No se encuentran registros") {
                }
            } else {
                SetProductos(products);
            }
        });

        if (e.target.value == "") {
            //si no hay nada en el input entonces se oculta el div de muestra
            toggleClassInput(false);
        } else {
            toggleClassInput(true);
        }
    };
    const cleanInputSearch = () => {
        SetQueryProducto("");
    };
    let [cambio, SetCambio] = React.useState(0);
    let [vuelto, SetVuelto] = React.useState(0.0);

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
    //=======
    let [descuentoGeneral, SetDescuentoGeneral] = React.useState(0);
    let [subtotalGeneral, SetSubtotalGeneral] = React.useState(0);
    let [total, SetTotal] = React.useState(0);
    let [descuento, SetDescuento] = React.useState(0);
    const updateTotal = () => {
        const valores = vistaDescripcion.map((prod) => {
            // @ts-ignore
            return {
                // @ts-ignore
                total: prod.total,
                // @ts-ignore
                decuento: prod.descuento,
            };
        });
        let totalTotal = 0;
        let totalDescuento = 0;
        valores.map((e) => {
            totalTotal = totalTotal + e.total;
            totalDescuento = totalDescuento + e.decuento;
        });
        SetSubtotalGeneral(totalTotal);
        SetTotal(subtotalGeneral - descuentoGeneral);
        SetDescuento(totalDescuento);
    };
    //INFOVENTA
    const getFecha = () => {
        let hoy = new Date();
        //return hoy.getDate() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getFullYear();
        return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
    };

    const [admin, setAdmin] = useRecoilState(AdminState);
    let [formDetalle, SetFormDetalle] = React.useState({
        tipoComprobante: 1,
        PER_ID: 0,
        idCliente: venta.DOC_ID_CLIENT,
        razonSocial: venta.DOC_BUSINESS_NAME,
        direccion: venta.DOC_DIRECTION_CLIENT,
        metodoPago: 1,
        tipoMoneda: 1,
        tipoCambio: 1,
        vendedor: admin.user,
        monto: 50.0,
        fecha: getFecha(),
        carrito: vistaDescripcion,
        cambio: 0,
        vuelto: 0,
    });
    return (
        <>
            {/* @ts-ignore */}
            <Button ref={btnRef} onClick={() => {
                getVentaInfo();
                onOpen();
            }}>
                Generar
            </Button>
            {/* @ts-ignore */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={() => {
                    SetVistaDescripcion([]);
                    onClose();
                }}
                //@ts-ignore
                finalFocusRef={btnRef}
                size={'full'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Generar nuevo comprobante!!</DrawerHeader>

                    <DrawerBody>
                        <MyContain>
                            <Box display={{ md: "flex" }} w="100%">
                                <Box
                                    m="1"
                                    p="1"
                                    borderRadius="10px"
                                    w={["100%", "100%", "70%"]}
                                >
                                    <Box position="relative">
                                        <h2>
                                            <b>Productos</b>
                                        </h2>
                                        <br />
                                        <Buscador
                                            classInput={classInput}
                                            queryProducto={queryProducto}
                                            SetQueryProducto={SetQueryProducto}
                                            toggleDiv={toggleDiv}
                                            classDiv={classDiv}
                                            toggleInput={toggleInput}
                                            SetToggleInput={SetToggleInput}
                                            filtro={filtro}
                                            SetProductoMuestra={SetProductoMuestra}
                                            productoMuestra={productoMuestra}
                                            toggleClassInput={toggleClassInput}
                                            vistaDescripcion={vistaDescripcion}
                                            SetVistaDescripcion={SetVistaDescripcion}
                                            cleanInputSearch={cleanInputSearch}
                                            updateTotal={updateTotal}
                                            cambioVuelto={cambioVuelto}
                                        />
                                        <Divider m="2" />

                                        <Box pt={3}>
                                            <h2>
                                                <b>Descripción</b>
                                            </h2>
                                            <VentaTable
                                                updateTotal={updateTotal}
                                                cambioVuelto={cambioVuelto}
                                                vistaDescripcion={vistaDescripcion}
                                                SetVistaDescripcion={SetVistaDescripcion}
                                                total={subtotalGeneral}
                                                SetDescuentoGeneral={SetDescuentoGeneral}
                                            />
                                            <CalculadorTotal
                                                SetTotal={SetTotal}
                                                total={total}
                                                subtotalGeneral={subtotalGeneral}
                                                descuentoGeneral={descuentoGeneral}
                                                SetDescuentoGeneral={SetDescuentoGeneral}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    m="1"
                                    p="1"
                                    borderRadius="10px"
                                    w={["100%", "100%", "30%"]}
                                    position="relative"
                                >
                                    <InfoVenta
                                        vistaDescripcion={vistaDescripcion}
                                        total={total}
                                        subtotalGeneral={subtotalGeneral}
                                        descuentoGeneral={descuentoGeneral}
                                        descuento={descuento}
                                        cambio={cambio}
                                        vuelto={vuelto}
                                        cambioVuelto={cambioVuelto}
                                        SetCambio={SetCambio}
                                        handleChangeCambio={handleChangeCambio}
                                        formDetalle={formDetalle}
                                        SetFormDetalle={SetFormDetalle}
                                    />
                                </Box>
                            </Box>
                        </MyContain>
                    </DrawerBody>

                    {/* <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
        </>
    )

}


