import { Box, IconButton, Skeleton, Stack, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { MyReactTable } from '../../../../GlobalUI/Table/MyReactTable'
import { getProviders } from '../../../../Service/ProviderService'
import { MyContain } from '../../../UI/Components/MyContain'
import { DeleteProviderDialog } from './DeleteProviderDialog'
import { EditProviderModal } from './EditeProviderModal'

export const ProvTable = () => {
  const { data, isLoading, isError, error, isFetching } = useQuery('tempActive', getProviders, { refetchOnWindowFocus: false })

  //@ts-ignore
  //const data = []

  const columns = [
    {
      Header: 'Nombre de proveedor',
      Footer: 'Nombre de proveedor',
      accessor: 'PER_NAMES'
    },
    {
      Header: 'Tipo de Proveedor',
      Footer: 'Tipo de Proveedor',
      accessor: 'PER_TRADENAME'
    },
    {
      Header: 'Número',
      Footer: 'Número',
      accessor: 'PER_N_PHONE'
    },
    {
      Header: 'Acciones',
      Footer: 'Acciones',
      accessor: 'cell',
      // @ts-ignore
      Cell: ({ row }) => (
        <ActionCell prov={row.original} />
      ),
    },
  ]

  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;
  return (
    <>
      {!isLoading ? (
        (data.length > 0) ? (
          <MyContain>
            <MyReactTable columns={columns} data={data} isPaginated hasFilters pagesOptions={[50, 75, 100]} />
          </MyContain>
        ) : (
          <MyContain>
            <Text
              align="center"
              //@ts-ignore
              size="xl">
              No hay Proveedores
            </Text>
          </MyContain>
        )
      ) : (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
    </>
  )
}

const ActionCell = ({ prov }: { prov: any }) => {
  return (
    <Stack style={{ justifyContent: "center" }} direction={{ base: "column", md: "row" }}>
            // * MODAL PARA EDITAR
      <EditProviderModal provider={prov}>
        <Tooltip label='Editar'>
          <IconButton icon={<AiFillEdit />} aria-label="Editar" colorScheme="blue" />
        </Tooltip>
      </EditProviderModal>
            // ! MODAL PARA ELIMINAR
      <DeleteProviderDialog providerId={prov.PER_ID}>
        <Tooltip label='Eliminar'>
          <IconButton icon={<AiFillDelete />} aria-label="Eliminar" colorScheme="red" />
        </Tooltip>
      </DeleteProviderDialog>
    </Stack>)
}
