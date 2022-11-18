import { Grid } from "@chakra-ui/react";
import React, { useEffect } from "react"
import { MyContain } from "../../../UI/Components/MyContain";
import { FormaVentaTable } from "./FormaVentaTable";
export const FormaVenta = () => {

    /* useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'FORMA DE VENTA';
    }, []) */

    return (
        <MyContain >
            <FormaVentaTable />
        </MyContain>
    )
}