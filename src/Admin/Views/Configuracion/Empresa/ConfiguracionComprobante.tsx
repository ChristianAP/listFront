import React from "react";
import { useQuery } from "react-query";
import { MyContain } from "../../../UI/Components/MyContain";
import { Box, Center, Spacer, Stack, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { MyReactTable } from "../../../../GlobalUI/Table/MyReactTable";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/alert";
import { CloseButton } from "@chakra-ui/close-button";
import { Spinner } from "@chakra-ui/spinner";
export const ConfiguracionComprobante = () => {
  async function getComprobantes() {
    const res = await fetch(import.meta.env.VITE_APP_API + "/document_type/"); //falta
    return res.json();
  }
  const { isLoading, isError, data, error ,refetch} = useQuery(
    "comprobantes",
    getComprobantes
  );
  const columnas = [
    {
      Header: "Nombre",
      Footer: "Nombre",
      accessor: "DCT_NAME",
    },
    {
      Header: "Serie",
      Footer: "Serie",
      accessor: "DCT_SERIE",
    },
    {
      Header: "Numeración",
      Footer: "Numeración",
      accessor: "DCT_SEQUENCE",
    },
    {
      Header: "Editar",
      Footer: "Editar",
      //@ts-ignore
      Cell: ({ row }) => (
        <React.Fragment>
          <ModalEditar comprobante={row.original} recarga={refetch}/>
        </React.Fragment>
      ),
    },
  ];
  if (isLoading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  //@ts-ignore
  if (isError) return <h1>{error.message}</h1>;
  return (
    <>
      <Box w="100%">
        <MyContain>
          <Text align="center">Configuración de comprobantes</Text>
          <MyReactTable data={data} columns={columnas} />
        </MyContain>
      </Box>
    </>
  );
};

const ModalEditar = ({ comprobante = {},recarga }: { comprobante: any ,recarga:any}) => {
    
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [comp, SetComp] = React.useState({
    DCT_ESTADO: comprobante.DCT_ESTADO,
    DCT_ID: comprobante.DCT_ID,
    DCT_NAME: comprobante.DCT_NAME,
    DCT_SEQUENCE:
      comprobante.DCT_SEQUENCE == null ? 1 : comprobante.DCT_SEQUENCE,
    DCT_SERIE: comprobante.DCT_SERIE == null ? "" : comprobante.DCT_SERIE,
  });
  function handleInputComp(e: any) {
    SetComp({
      ...comp,
      [e.target.name]: e.target.value,
    });
  }
  async function ApiEditarComprobante(datos: any) {
    try {
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      };
      const res = await fetch(
        import.meta.env.VITE_APP_API + "/document_type/" + datos.DCT_ID,
        requestOptions
      ); //falta
      const data = await res.json();
      return data;
    } catch (Error) {
      return Error;
    }
  }
  let [toggle, SetToggle] = React.useState(false);
  let [carga, SetCarga] = React.useState(false);
  let [mensaje, SetMensaje] = React.useState({
    status: 100,
    statusAlert: "info",
    message: "editando comprobante",
  });
  function EditarComprobante() {
    SetToggle(true);
    SetCarga(true);
    ApiEditarComprobante(comp).then((result: any) => {
      SetCarga(false);
      let estado = result.status;
      //resultado 200
      if (estado == 200) {
        SetMensaje({
          status: 200,
          statusAlert: "success",
          message: "comprobante editado exitósamente",
        });
        ModificarComprobante()
        recarga();
        closeModal()
      }
      //resultado 404
      if (estado == 404) {
        SetMensaje({
          status: 404,
          statusAlert: "error",
          message: "no se encontró la ruta para editar al comprobante",
        });
      }
      //resultado 500
      if (estado == 500) {
        SetMensaje({
          status: 500,
          statusAlert: "error",
          message:
            "hay errores en el servidor, porfavor comuniquese con el responsable de tecnología",
        });
      }
    });
  }
  function closeModal(){
    SetToggle(false);
    SetCarga(false);
    SetMensaje({
      status: 100,
      statusAlert: "info",
      message: "editando comprobante",
    });
    onClose();
  }
  function ModificarComprobante(){
      comprobante = comp;
  }
  return (
    <>
      <Button onClick={onOpen}>Editar</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        //   closeOnOverlayClick={toggle}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Comprobante {comp.DCT_NAME}</ModalHeader>
          <ModalCloseButton />
          <Box display={toggle ? "none" : "block"}>
            <ModalBody>
              <FormControl id="email">
                <FormLabel>Serie</FormLabel>
                <Input
                  type="text"
                  value={comp.DCT_SERIE}
                  name="DCT_SERIE"
                  onChange={handleInputComp}
                  required
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Numeración</FormLabel>
                <Input
                  type="number"
                  value={comp.DCT_SEQUENCE}
                  name="DCT_SEQUENCE"
                  onChange={handleInputComp}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cerrar
              </Button>
              <Button colorScheme="blue" onClick={EditarComprobante}>
                Editar
              </Button>
            </ModalFooter>
          </Box>
          {/**cuando hace click en editar */}
          <Box display={toggle ? "block" : "none"}>
            <Center>
              <Spinner size="xl" mb={4} display={carga ? "block" : "none"} />
            </Center>
            <Alert 
            //@ts-ignore
            status={mensaje.statusAlert}>
              <AlertIcon />
              <AlertDescription>{mensaje.message}</AlertDescription>
            </Alert>
            <Center>
              <Button variant="ghost" m={3} onClick={closeModal}>
                Cerrar
              </Button>
            </Center>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
