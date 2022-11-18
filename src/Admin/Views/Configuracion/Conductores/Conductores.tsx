import React, { useEffect } from "react";
import { MyContain } from "../../../UI/Components/MyContain";
import { AddConductor } from "./AddConductor";
import { TableConductor } from "./TableConductor";

export const Conductores = () => {
    /* useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'Conductores';
    }, []) */
    return(
        <>
        <MyContain>
            <AddConductor/>
        </MyContain>
        <br />
        <MyContain>
            <TableConductor />
        </MyContain>
        </>
    )
}