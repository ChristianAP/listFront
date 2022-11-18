import { Box, Button, Checkbox, Flex, Grid, GridItem, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Text, useDisclosure } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { GrConfigure } from "react-icons/gr";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { editConfigCodebar, getCodebars } from "../../../../Service/codebar_configService";
import { MyContain } from "../../../UI/Components/MyContain";
import { TableCharge } from "../../../UI/Components/TableCharge/tablecharge";
import { UpdateCodebar } from "./UpdateCodebar";


export const ConfCodebar = () => {

    return (
        <>
            <br />
            <MyContain>
                <Text>CONFIGURACIÓN DE CÓDIGO DE BARRAS</Text>
            </MyContain>
            <br />
            <MyContain>
                <TableConf />
            </MyContain>
        </>
    );

}

export const TableConf = () => {
    const { data, isError, isLoading, isFetched, isFetching } = useQuery("codebar",
        getCodebars, { refetchOnWindowFocus: false })

    console.log(data);

    const columns = [
        {
            Header: "N°",
            accessor: "CDC_ID",
            filter: "fuzzyText",
        },
        {
            Header: "CÓDIGO DE BARRAS",
            accessor: "CDC_NAME",
            filter: "fuzzyText",
        },
        {
            Header: "TAMAÑO",
            accessor: "CDC_LENGTH",
            filter: "fuzzyText",
        },
        {
            Header: "RANGO DE LECTURA",
            accessor: "CDC_DISTANCE",
            filter: "fuzzyText",
        },
        {
            Header: "Acciones",
            id: "actions",

            // @ts-ignore
            Cell: ({ row }) => <ActionCell ven={row.original} complete ={data}/>,
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
                hasFilters />
        </>
    );

}

const ActionCell = ({ven, complete}: {ven: any, complete:any}) => {

    return (
        <>
            <UpdateCodebar data={ven} complete={complete} />
        </>
    );
}