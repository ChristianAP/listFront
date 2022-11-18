import { Alert, Box, Flex, FormLabel, IconButton, Switch, toast, Tooltip, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { useMutation, useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { EditStepStatus, getOrdenStepsAll, getValidatedSteps } from "../../../../Service/OrderSteps";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { UpdateConductor } from "../Conductores/UpdateConductor";
import { UpdateStep } from "./UpdateStep";

export const TableSteps = () => {

    const { data, isFetched, isLoading, error, isFetching, isError } = useQuery('pasosOnline', getOrdenStepsAll, { refetchOnWindowFocus: false })


    const columns = [
        {
            Header: "N°",
            accessor: "ORS_ID",
            filter: "fuzzyText",
        },
        {
            Header: "Nombre del Paso Online",
            accessor: "ORS_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "Descripción del Paso Online",
            accessor: "ORS_DESCRIPTION",
            filter: "fuzzyText",
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} />,
        },
    ];

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    if (data.message) return <h1>{data.message} </h1>;

    return (
        <>
            <MyReactTable
                columns={columns}
                data={data}
                isPaginated
                hasFilters />
        </>
    );
}

const ActionCell = (ven: any) => {

    const [state, setState] = useState(ven['ven'].ORS_STATUS)
    const { mutateAsync } = useMutation(EditStepStatus)

    const { data: nroOrders, isLoading: isLoadingOrders } = useQuery(['validatedSteps', ven], () => getValidatedSteps(ven['ven'].ORS_ID), { refetchOnWindowFocus: false })

    console.log("SE PODRA VALIDAR? ...", nroOrders);
    const toast = useToast()

    return (

        <>
            <Flex gap={'10px'} justifyContent={'center'} alignItems={'center'}>
                <UpdateStep array={ven["ven"]}>
                    <IconButton aria-label='Update Step Online' bg={'blue.600'} color={'white'} icon={<BsPencilFill />} />
                </UpdateStep>
                <Box>
                    <Flex flexDirection={'row'} justifyContent={'center'} >
                        {
                            state == '1' ?
                                <>
                                    <Alert status={nroOrders && nroOrders[0].NRO > 0 ? 'warning' : 'success'} variant={"left-accent"}>

                                        <FormLabel htmlFor="ESTADO" mb="0" >
                                            ACTIVO
                                        </FormLabel>
                                        <Switch disabled={nroOrders && nroOrders[0].NRO > 0 ? true : false} isChecked={state == '1' ? true : false} size='lg' colorScheme={'green'} onChange={async (e) => {
                                            setState('0');
                                            await mutateAsync({ ORS_ID: ven['ven'].ORS_ID, ORS_STATUS: 0 })
                                        }}
                                        />
                                        <Tooltip label='INFO' hidden ={nroOrders && nroOrders[0].NRO > 0 ? false : true}>
                                            <IconButton
                                                hidden={nroOrders && nroOrders[0].NRO > 0 ? false : true}
                                                marginLeft={'20px'} aria-label="danger" icon={<CgDanger />} backgroundColor={'red.400'} color={'white'} fontSize={'lg'} borderRadius={'50%'} onClick={() =>
                                                    toast({
                                                        title: 'NO SE PUEDE MODIFICAR',
                                                        description: `Hay ${nroOrders[0].NRO} ordenes ubicadas en este paso`,
                                                        status: 'error',
                                                        duration: 3000,
                                                        isClosable: true,
                                                    })
                                                } />
                                        </Tooltip>
                                    </Alert>
                                </>

                                :

                                <>
                                    <Alert status={"error"} variant={'left-accent'}>
                                        <FormLabel htmlFor="ESTADO" mb="0" >
                                            INACTIVO
                                        </FormLabel>
                                        <Switch isChecked={state == '1' ? true : false} size='lg' onChange={async (e) => {
                                            setState('1');
                                            await mutateAsync({ ORS_ID: ven['ven'].ORS_ID, ORS_STATUS: 1 })
                                        }}
                                        />
                                    </Alert>
                                </>

                        }
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}