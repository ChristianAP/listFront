import { Flex, IconButton } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { getConductor } from "../../../../Service/PersonService";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { DeleteConductor } from "./DeleteConductor";
import { UpdateConductor } from "./UpdateConductor";

export const TableConductor = () => {

    const {data, isError, isFetching, isLoading, refetch, error} = useQuery('conductor', getConductor, {refetchOnWindowFocus : false})

    console.log("ESTA ES LA DATA ", data)
    const columns = [
        {
            Header: "Nombre Conductor",
            accessor: "PER_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "Número de Placa",
            accessor: "PER_PLATE",
            filter: "fuzzyText",
        },
        {
            Header: "Número de Licencia",
            accessor: "PER_LICENSE",
            disableFilters: true,
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} />,
        },
    ];

    useEffect(()=> {
        
    })

    // @ts-ignore
    if (isLoading || isFetching) return (<TableCharge />)

    // @ts-ignore
    if (isError) return <h1>{error.message} </h1>;

    if(data.message) return <h1>{data.message} </h1>;

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

const ActionCell = (ven : any) => (
    <>
    <Flex gap={'10px'} justifyContent={'center'}>
        <DeleteConductor array = {ven['ven']}>
            <IconButton aria-label='Delete Point Sale' bg={'red.600'} color={'white'} icon={<AiTwotoneDelete />} />
        </DeleteConductor>
        <UpdateConductor array={ven["ven"]}>
            <IconButton aria-label='Delete Point Sale' bg={'blue.600'} color={'white'} icon={<BsPencilFill />} />
        </UpdateConductor>
    </Flex>
    </>
)