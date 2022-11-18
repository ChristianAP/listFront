import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { getPointSaleById } from "../../../../Service/PoaintSaleService";
import { SelectPOS } from "../VentaPOS/selectPOS";
import { ExportModal } from "./exportModal";

export const Verificar = () => {
    const [cargando, setCargando] = useState(false)


    const [POS_ID, setPOS_ID] = useState(0)
    const [pointSale, setPointSale] = useState<any>()
    const [admin, setAdmin] = useRecoilState(AdminState);

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
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Button isLoading={cargando} mx={2} colorScheme="green">
                        <Text mx={2}>Verificar</Text>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Exportar Guía de Remisión</PopoverHeader>
                    <PopoverBody display={"grid"}>
                        <SelectPOS setPOS_ID={setPOS_ID} width={"300px"} admin={admin} />
                        <br />
                        <ExportModal array = {pointSale}/>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>

    )
}