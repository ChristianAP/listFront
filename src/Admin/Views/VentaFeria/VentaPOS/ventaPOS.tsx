import React, { useEffect, useState } from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { SelectPOS } from './selectPOS'
import { Flex, Select } from '@chakra-ui/react'
import { useQuery } from 'react-query';
import { getPointSales } from '../../../../Service/PoaintSaleService';
import { VentaPosTable } from './VentaPosTable';
import { VentaPosInfo } from './VentaPosInfo';
import { useRecoilState } from 'recoil';
import { AdminState } from '../../../../Data/Atoms/Admin';

export const VentaPOS = () => {

    const [categoria, setCategoria] = useState(0)
    const [productos, setProductos] = useState([])

    const [admin, setAdmin] = useRecoilState(AdminState);
    const numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."]
    const getFecha = () => {
        let hoy = new Date();
        return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
    };

    const [price, setPrice] = useState("")

    function handleButton(numero: any) {
        setPrice(price + "" + numero)
    }

    function handleDelete() {
        setPrice(price.substring(0, price.length - 1))
    }

    // Valiables apra la venta
    let [cambio, SetCambio] = React.useState(0);
    let [vuelto, SetVuelto] = React.useState(0.0);
    let [descuento, SetDescuento] = React.useState(0);
    let [total, SetTotal] = React.useState(0);
    let [subtotalGeneral, SetSubtotalGeneral] = React.useState(0);
    let [descuentoGeneral, SetDescuentoGeneral] = React.useState(0);
    let [totalMontoInafecto, SetTotalMontoInafecto] = React.useState(0);
    let [totalIGVInafecto, SetTotalIGVInafecto] = React.useState(0);
    let [totalIGV, SetTotalIGV] = React.useState(0);
    let [totalGravada, SetTotalGravada] = React.useState(0);
    let [totalSubTotal, SetTotalSubTotal] = React.useState(0);
    let [formDetalle, SetFormDetalle] = React.useState({
        tipoComprobante: 77,
        PER_ID: 0,
        idCliente: "00000000",
        razonSocial: "CLIENTES VARIOS",
        direccion: "",
        metodoPago: 5,
        tipoMoneda: 1,
        tipoCambio: 1,
        cuentaPago: 'BCP',
        vendedor: admin.user,
        monto: 50.0,
        fecha: getFecha(),
        carrito: [],
        cambio: 0,
        vuelto: 0,
    });

    // Use State de Data para poder modificar su valor al agregar producto
    const [array, setArray] = useState([])
    // Use State de Productos
    const [listProd, setListProd] = useState([])

    const [POS_ID, setPOS_ID] = useState(0)

    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Venta de POS';
    }, []);

    return (
        <>
            <MyContain>
                <SelectPOS setPOS_ID={setPOS_ID} width={"300px"} admin={admin} />
            </MyContain>

            <Flex marginTop={'1%'} gap={'10px'} flexDirection={{ base: "column", md: "row" }}>
                <VentaPosTable
                    POS_ID={POS_ID}
                    array={array}
                    setArray={setArray}
                    listProd={listProd}
                    setListProd={setListProd}

                    //@variables para la venta
                    cambio={cambio}
                    vuelto={vuelto}
                    descuento={descuento}
                    total={total}
                    subtotalGeneral={subtotalGeneral}
                    descuentoGeneral={descuentoGeneral}
                    totalMontoInafecto={totalMontoInafecto}
                    totalIGVInafecto={totalIGVInafecto}
                    totalIGV={totalIGV}
                    totalGravada={totalGravada}
                    totalSubTotal={totalSubTotal}
                    //@variables para setear para la venta
                    SetCambio={SetCambio}
                    SetVuelto={SetVuelto}
                    SetDescuento={SetDescuento}
                    SetTotal={SetTotal}
                    SetSubtotalGeneral={SetSubtotalGeneral}
                    SetDescuentoGeneral={SetDescuentoGeneral}
                    SetTotalMontoInafecto={SetTotalMontoInafecto}
                    SetTotalIGVInafecto={SetTotalIGVInafecto}
                    SetTotalIGV={SetTotalIGV}
                    SetTotalGravada={SetTotalGravada}
                    SetTotalSubTotal={SetTotalSubTotal}
                    formDetalle={formDetalle}
                    SetFormDetalle={SetFormDetalle}
                    //Buttons
                    numeros={numeros}
                    price={price}
                    setPrice={setPrice}
                    handleButton={handleButton}
                    handleDelete={handleDelete}
                    //filtros
                    categoria={categoria}
                    setCategoria={setCategoria}
                    productos={productos}
                    setProductos={setProductos}
                />

                <VentaPosInfo
                    POS_ID={POS_ID}
                    array={array}
                    setArray={setArray}
                    listProd={listProd}
                    setListProd={setListProd}
                    //@variables para la venta
                    cambio={cambio}
                    vuelto={vuelto}
                    descuento={descuento}
                    total={total}
                    subtotalGeneral={subtotalGeneral}
                    descuentoGeneral={descuentoGeneral}
                    totalMontoInafecto={totalMontoInafecto}
                    totalIGVInafecto={totalIGVInafecto}
                    totalIGV={totalIGV}
                    totalGravada={totalGravada}
                    totalSubTotal={totalSubTotal}
                    //@variables para setear para la venta
                    SetCambio={SetCambio}
                    SetVuelto={SetVuelto}
                    SetDescuento={SetDescuento}
                    SetTotal={SetTotal}
                    SetSubtotalGeneral={SetSubtotalGeneral}
                    SetDescuentoGeneral={SetDescuentoGeneral}
                    SetTotalMontoInafecto={SetTotalMontoInafecto}
                    SetTotalIGVInafecto={SetTotalIGVInafecto}
                    SetTotalIGV={SetTotalIGV}
                    SetTotalGravada={SetTotalGravada}
                    SetTotalSubTotal={SetTotalSubTotal}
                    formDetalle={formDetalle}
                    SetFormDetalle={SetFormDetalle}
                    //Buttons
                    numeros={numeros}
                    price={price}
                    setPrice={setPrice}
                    handleButton={handleButton}
                    handleDelete={handleDelete}
                    //filtros
                    categoria={categoria}
                    setCategoria={setCategoria}
                    productos={productos}
                    setProductos={setProductos}
                />
            </Flex>
        </>
    )
}
