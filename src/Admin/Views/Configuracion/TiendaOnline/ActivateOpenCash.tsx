import { Checkbox } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UpdateCompany } from "../../../../Service/CompanyService";

export const ActiveOpenCash = ({ data }: { data: any }) => {

    const { mutateAsync } = useMutation(UpdateCompany)
    const [carganding, setCarganding] = useState(false)
    const queryClient = useQueryClient()
    return (
        <>
            <Checkbox size='md' colorScheme='green' disabled = {carganding}
            defaultChecked={data[0].COM_OPEN_CASH == '1' ? true : false}
            onChange={async (e)=> {
                console.log(e.target.checked);  
                setCarganding(true)
                await mutateAsync({COM_ID : data[0].COM_ID, COM_OPEN_CASH : e.target.checked ? '1' : '0'})
                queryClient.invalidateQueries("configuracionTiendaOnline")
                setCarganding(false)

            }}>
                Habilitar Apertura de Caja
            </Checkbox>
        </>
    )
}