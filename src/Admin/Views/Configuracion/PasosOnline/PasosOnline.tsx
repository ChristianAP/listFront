import { useEffect } from "react";
import React from "react";
import { MyContain } from "../../../UI/Components/MyContain";
import { useQuery } from "react-query";
import { getOrdenSteps, getOrdenStepsAll } from "../../../../Service/OrderSteps";
import { TableSteps } from "./TableSteps";

export const PasosOnline = () => {
    useEffect(() => {
        //@ts-ignore
        document.getElementById('title_view').textContent = 'PASOS ONLINE';
    }, [])

    
    return (
        <>
            <MyContain>
                <TableSteps/>
            </MyContain>
        </>
    )
}