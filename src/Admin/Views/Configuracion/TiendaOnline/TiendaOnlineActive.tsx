import { Checkbox, Skeleton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { window } from 'rxjs';
import { accesstiendaonline, UpdateCompany } from "../../../../Service/CompanyService";
import { MyContain } from '../../../UI/Components/MyContain';

export const TiendaOnlineActive = ({ data }: { data: any }) => {
    const queryClient = useQueryClient()
    const [awating, setAwating] = useState(false)
    const { mutateAsync } = useMutation(UpdateCompany)
    const { mutateAsync : online } = useMutation(accesstiendaonline)
    const { mutateAsync : online2 } = useMutation(accesstiendaonline)



    return (
        <>
            <Checkbox
                disabled={awating}
                defaultChecked={data[0].COM_CONFIG_ONLINE == "1"}
                onChange={
                    async (e) => {
                        console.log(e.target.checked);
                        setAwating(true)
                        await mutateAsync({ COM_ID: data[0].COM_ID, COM_CONFIG_ONLINE: e.target.checked ? "1" : "0" })
                        queryClient.invalidateQueries("configuracionTiendaOnline");
                        ['302', '305'].map(async (elment:any) => {
                            await online({nro : 1, ACC_ID : elment, STATUS : e.target.checked ? "0" : "1" })
                        })                        
                        setAwating(false)
                        location.reload()
                    }
                }
            >
                Activar Stock Iguales
            </Checkbox>
        </>
    )
}
