import {
    Box,
    Divider,
    Flex,
} from "@chakra-ui/react";
import { MyContain } from "../../../UI/Components/MyContain";
import React, { useEffect } from "react";
import "./InputSearch.css";
import api from "./ApiVentas";
import { VentaTable } from "./VentaTable";
import { CalculadorTotal } from "./CalculadoraTotal";
import { InfoVenta } from "./InfoVenta";
import { Buscador } from "./Buscador";

export const VentasLibre = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Realizar Venta';
    }, []);

    let [queryProducto, SetQueryProducto] = React.useState("");
    let [vistaDescripcion, SetVistaDescripcion] = React.useState([]);

    let [productos, SetProductos] = React.useState([]);

    let filtro = productos.filter((producto: any) => {
        return `${producto.PRO_NAME}`
            .toLowerCase()
            .includes(queryProducto.toLowerCase());
    });

    let [toggleInput, SetToggleInput] = React.useState(true); // propiedad usada para mostrar el div o no
    let [classInput, SetclassInput] = React.useState("default"); // propiedad usada para cambiar el atributo class del input buscador
    let [classDiv, SetclassDiv] = React.useState("div-search");
    let [productoMuestra, SetProductoMuestra] = React.useState({
        DIS_ID: null
        , DIS_NAME: null
        , DIS_PERCENTAGE: null
        , DIS_STATUS: null
        , PRD_ID: 2
        , PRD_UNIT_PRICE: "3.5"
        , PRL_STATUS: "1"
        , PRO_CODE: "123"
        , PRO_ID: 2
        , PRO_IMAGE: "http://165.227.200.161:4000/upload/oB-lGhEtd32VHvyb4l62GcWN.jpg"
        , PRO_NAME: "patita"
        , STK_ID: 2
        , STK_TODAY: 2.8
        , cantidad: 1
        , descuento: 0
        , precio: 3.5
        , stock: 2.8
        , subtotal: 3.5
        , total: 3.5
    });
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
        console.log(vistaDescripcion);
        const valores = vistaDescripcion.map((prod) => {
            // @ts-ignore
            return {
                // @ts-ignore
                total: prod.total ? prod.total : 0,
                // @ts-ignore
                decuento: prod.descuento ? prod.descuento : 0,
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
    return (
        <React.Fragment>
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
                        />
                    </Box>
                </Box>
            </MyContain>
        </React.Fragment>
    );
};
