import { Button } from '@chakra-ui/button'
import React from 'react'
import { useParams } from 'react-router'
import { ImpresionRemision } from './ImpresionRemision'
import { ImpresionVenta } from './ImpresionVenta'
import { ImpresionVentaTicket } from './ImpresionVentaTicket'

export const Impresion = () => {
    //@ts-ignore
    let { item, id } = useParams()
    function activador() {
        window.print();
    }
    function Print() {
        window.print();
    }
    switch (item) {
        case "ventas":
            return <React.Fragment>
                <Button bg={"#0080ff"}
                    color={"white"}
                    _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }} onClick={Print} id="boton">Imprimir</Button>
                <ImpresionVenta productos={[]} idventa={id} activador={activador} />
            </React.Fragment>
            break;
        case "ventasticket":
            return <React.Fragment>
                <Button bg={"#0080ff"}
                    color={"white"}
                    _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }} onClick={Print} id="boton">Imprimir</Button>
                <ImpresionVentaTicket idventa={id} activador={activador} />
            </React.Fragment>
            break;
        case "remision":
            return <React.Fragment>
                <Button bg={"#0080ff"}
                    color={"white"}
                    _hover={{ bg: "rgb(237 242 247)", color: "#0080ff" }} onClick={Print} id="boton">Imprimir</Button>
                <ImpresionRemision productos={[]} idventa={id} activador={activador} />
            </React.Fragment>
            break;
    }
    return (
        <h1>Impresiones ELECTRÓNICOS</h1>
    )
}
