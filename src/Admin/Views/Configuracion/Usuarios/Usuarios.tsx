import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  Grid,
  Center,
  FormLabel,
  FormControl,
  Stack,
  Switch,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { MyContain } from "../../../UI/Components/MyContain";
import { AddUsuarios } from "./AddUser";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { ListAllUsers, UpdateStatusUsers } from "../../../../Service/User";
import { FaPlus } from "react-icons/fa";
import { TableChargeList } from "../../../UI/Components/TableCharge/tablecharge";
import { BsPencilFill } from "react-icons/bs";
import { EditPOSUser } from "./EditPOSUser";

export const Usuarios = () => {
  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    "allusers",
    ListAllUsers,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Usuarios';
  }, [])


  const columns = [
    {
      Header: "USUARIO",
      accessor: "USUARIO",
      filter: "fuzzyText",
    },
    {
      Header: "PERSONA",
      accessor: "NOMBRES",
      filter: "fuzzyText",
    },
    {
      Header: "ROL",
      accessor: "ROL",
    },

    {
      Header: "Acciones",
      id: "actions",

      // @ts-ignore
      Cell: ({ row }) => <ActionCell estado={row.original} refetch={refetch} />,
    },
  ];

  if (isLoading || isFetching) return (<TableChargeList />)

  // @ts-ignore
  if (isError) return <Center> <h1>{error.message} </h1></Center>;

  return (
    <>
      <Grid gap="1rem">
        <AddUsuarios refetch={refetch}>
          <Button leftIcon={<FaPlus />} colorScheme="green">
            Agregar
          </Button>
        </AddUsuarios>
        <MyContain>
          {/* <Button>asd</Button> */}
          {data.status != 404 || data.status != 400 ? (
            <MyReactTable
              columns={columns}
              data={data}
              isPaginated
              hasFilters
              pagesOptions={[15, 25, 50]}
            />
          ) : (
            <>
              <Center> SIN DATA</Center>
            </>
          )}
        </MyContain>
      </Grid>
    </>
  );
};

const ActionCell = ({ estado, refetch }: { estado: any, refetch: any }) => {
  const [userestado, setestado] = useState(estado.ESTADO);
  const [change, setchange] = useState(estado.ESTADO == 0 ? false : true);
  const onClose = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  async function handleChange(estadoupdate: any) {
    if (estadoupdate == 0) {
      setIsLoading(true);
      let res = await UpdateStatusUsers(estado.ID, "1");
      if (res.status == 200) {
        setestado(1);
        setchange(true);
        setIsLoading(false);
      }
    } else if (estadoupdate == 1) {
      setIsLoading(true);
      let res = await UpdateStatusUsers(estado.ID, "0");
      if (res.status == 200) {
        setestado(0);
        setchange(false);
        setIsLoading(false);
      }
    }
    refetch();
    onClose();
  }

  return (
    <>
      <Stack direction={{ base: "column", md: "row" }}>
        <FormControl display="flex" alignItems="center">
          {userestado == 0 ? (
            <>
              <FormLabel htmlFor="ESTADO" mb="0">
                Inactivo
              </FormLabel>
              <Switch
                id="ESTADO"
                isChecked={change}
                colorScheme="green"
                onChange={() => setIsOpen(true)}
              />
            </>
          ) : (
            <>
              <FormLabel htmlFor="ESTADO" mb="0">
                Activo
              </FormLabel>
              <Switch
                id="ESTADO"
                isChecked={change}
                colorScheme="green"
                onChange={() => setIsOpen(true)}
              />
            </>
          )}
        </FormControl>
        {estado.ROL != "CLIENTE" && <EditPOSUser user={estado.ID} />}
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        //@ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnOverlayClick={false}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {userestado == 0 ? "Activar" : "Desactivar"}
            </AlertDialogHeader>
            <AlertDialogBody>¿Está seguro?</AlertDialogBody>
            <AlertDialogFooter>
              <Button
                // @ts-ignore
                ref={cancelRef}
                onClick={onClose}
                isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => handleChange(userestado)}
                isLoading={isLoading}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
