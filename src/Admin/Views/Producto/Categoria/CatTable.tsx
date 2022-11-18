import { Button, IconButton, Stack, Skeleton, Img, HStack, Spacer, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { getAllCategories } from '../../../../Service/TiendaOnlineService';
import { EditCatModal } from './EditeCatModal';
import { DeleteCatDialog } from './DeleteCatDialog';
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable';
import { TableChargeListProduct } from '../../../UI/Components/TableCharge/tablecharge';
import { FaPlus } from 'react-icons/fa';
import { MyContain } from '../../../UI/Components/MyContain';
import { CreateCatModal } from './CreateCatModal';
import { ButtonRefetch } from '../../../UI/Components/ButtonRefetch';

export const CatTable = () => {

    // ? QUERY PARA OBTENER LA DATA DEL BACKEND
    const { isLoading, isError, data, error, isFetching, refetch } = useQuery('categories', getAllCategories, { refetchOnWindowFocus: false })

    /*
    ? SE DEFINE LOS TEXTOS A RENDERIZAR
    ? LOS KEY SERÁN USADOS PARA RENDERIZAR LA DATA
    */
    const columns = [
        {
            // ? TEXTO PARA RENDERIZAR EN LOS THead
            Header: 'ID',
            // ? TEXTO PARA RENDERIZAR EN LOS TFooter
            Footer: 'ID',
            // ? EN EL ACCESOR SE INDICA EL KEY DE LA DATA
            accessor: 'CAT_ID',
            // ? SE DESHABILITA LOS FILTROS PARA ESTA COLUMNA
            disableFilters: true
        },
        {
            Header: 'Imagen',
            Footer: 'Imagen',
            accessor: 'CAT_IMAGE',
            // @ts-ignore
            Cell: ({ row }) => (
                <Img borderRadius={"full"} boxSize="80px" style={{ objectFit: "cover" }} src={row.original.CAT_IMAGE} />
            ),
        },
        // ? SI NO SE DEFINE EL 'Filter' EL FILTRO SERÁ AUTOMÁTICO
        {
            Header: 'Nombre',
            Footer: 'Nombre',
            accessor: 'CAT_NAME',
            filter: 'fuzzyText',
        },
        {
            Header: 'Fecha de creación',
            Footer: 'Fecha de creación',
            accessor: 'CAT_CREATE_DATE',
        },

        /*
        ? SI QUEREMOS SUBCOMPONENTES EN NUESTRAS CELDAS
        ? DEBEMOS ASIGNAR UN ID A LA COLUMNA
        ? Y REEMPLAZAR EL 'accesor' POR LA PROPIEDAD 'Cell'
         */
        {
            Header: 'Acciones',
            Footer: 'Acciones',
            id: 'actions', // It needs an ID
            /*
            ? EL ELEMENTO 'row.original' REPRESENTA EL OBJETO DE LA DATA
            ? EN ESTE CASO 'row.original' EQUIVALE A '{CAT_ID:'1', CAT_NAME:'name', ...rest}'
            */
            // @ts-ignore
            Cell: ({ row }) => (
                <ActionCell cat={row.original} />
            ),
        },
    ]

    // @ts-ignore
    if (isLoading || isFetching) return (<TableChargeListProduct />)

    // @ts-ignore
    if (isError) return <h1>{error.message} {':('}</h1>

    return (
        <>
            <MyContain>
                <HStack>
                    <CreateCatModal>
                        <Button leftIcon={<FaPlus />} colorScheme="green" >Agregar</Button>
                    </CreateCatModal>
                    <Spacer />
                    <ButtonRefetch refetch={refetch} />
                </HStack>
            </MyContain>
            <MyContain>
                <MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
            </MyContain>
        </>
    )
}

/*
* SUBCOMPONENTE PARA LAS CELDAS DE 'Acciones'
? EN ESTE CASO USAMOS EL SUBCOMPONENTE PARA LOS BOTONES DE 'Eliminar', 'Editar' y EL BOTON PARA CAMBIAR ESTADO
? LOS HOOKS Y VARIABLES USADOS SON ENFOCADOS A ESTAS FUNCIONALIDADES
*/
const ActionCell = ({ cat }: { cat: any }) => {

    const status = cat.CAT_STATUS === '1'

    const { mutateAsync, isLoading } = useMutation('editeCategory')

    async function handleStatus() {
        let formData = new FormData();
        /* append input field values to formData */
        for (let value in cat) {
            if (value != "CAT_STATUS") {
                formData.append(value, cat[value]);
            } else {
                formData.append("CAT_STATUS", cat.CAT_STATUS === '1' ? "0" : "1");
            }
        }
        //@ts-ignore
        await mutateAsync({ formData: formData, CAT_ID: cat.CAT_ID })
        //mutate({ ...cat, CAT_STATUS: cat.CAT_STATUS === '1' ? '2' : '1' })
    }

    return (
        <Stack direction={{ base: "column", md: "row" }}>
            <EditCatModal category={cat}>
                <Tooltip label='Editar'>
                    <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
                </Tooltip>
            </EditCatModal>
            <DeleteCatDialog catId={cat.CAT_ID}>
                <Tooltip label='Eliminar'>
                    <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
                </Tooltip>
            </DeleteCatDialog>
            <Button
                colorScheme={status ? "green" : "yellow"}
                onClick={handleStatus}
                isLoading={isLoading}
            >
                {status ? 'Activado' : 'Desactivado'}
            </Button>
        </Stack>)
}