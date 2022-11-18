import React from 'react';
import { MyContain } from '../../../UI/Components/MyContain';
import { Select, Skeleton, Text } from '@chakra-ui/react'
import { useQuery } from 'react-query';
import { getPointSales } from '../../../../Service/PoaintSaleService';
import { useRecoilState } from 'recoil';
import { getUsPointSalesByUserId } from '../../../../Service/UsPointSale';

export const SelectPOS = ({ setPOS_ID, width, admin }: { setPOS_ID: any, width: any, admin?: any }) => {

    // const { data, isError, isFetching, isLoading, refetch } = useQuery('PuntoVenta', getPointSales, { refetchOnWindowFocus: false })
    const { data: poinSaleByUser, isLoading: pointSableLoading, isFetching: pointFeching } = useQuery('poinSaleByUser', () => getUsPointSalesByUserId(admin ? admin.iu : 0), {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data[0] && data[0].USR_ID != null) {
                setPOS_ID(data[0].POS_ID)
            }
        }
        /* setPOS_ID(data[0].POS_ID) */
    })



    if (pointSableLoading || pointFeching) return (
        <Skeleton height="70px" />
    )
    if (poinSaleByUser.message) return (
        <Text>No es Encontraron Puntos de Venta Registrados</Text>
    )
    return (
        <>
            <Select
                onChangeCapture={(e) => {
                    //@ts-ignore
                    if (e.target.value != poinSaleByUser[0].POS_ID) {
                        //@ts-ignore
                        console.log(e.target.value);
                        alert("Estas apunto de vender en un punto de venta que no te corresponde")
                    }
                }}/* defaultValue={poinSaleByUser && poinSaleByUser.message && poinSaleByUser[0].POS_ID}  */
                placeholder='Select option'
                width={width}
                onChange={(e) => { setPOS_ID(e.target.value) }}>
                {poinSaleByUser.map((element: any) =>
                    <option disabled={admin.roles.includes("CONDUCTOR") && element.USR_ID == null ? true : false} selected={poinSaleByUser[0].POS_ID == element.POS_ID} value={element.POS_ID}>{element.POS_NAME}</option>
                )}
            </Select>
        </>
    )
}
