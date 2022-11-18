import React, { ReactNode, useRef, useState } from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, GridItem, Stack, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useQuery } from "react-query";
import { AddProdCompra } from "./AddProdCompra";
import { ImportProdRemision } from "./ImportProd";
import { ExportModal } from "./exportModal";
import { ExportProd } from "./ExportProd";
import { Flex, Input, Spinner } from "@chakra-ui/react";
import { Verificar } from "./Verificar";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";

export const RegCompraModal = ({ fecha, handleInput, getMonday }: { fecha: any, handleInput: any, getMonday : any }) => {

  const [admin, setAdmin] = useRecoilState(AdminState);
  const [idProducto, setIdProducto] = useState<any>();
  //const { data: product, isError: catIsError, isLoading: catLoading } = useQuery("productsByIdCat", () => producstByCatId(idProducto.CAT_ID), { refetchOnWindowFocus: false });

  const { isOpen, onOpen, onClose } = useDisclosure();

  let [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const [completeAllValues, setCompleteAllValues] = useState(true);
  const inputEl = useRef(null);

  const [carganding, setCarganding] = useState(false)

  const {isOpen : opencarganding, onOpen : onOpenCarganding, onClose: onCloseCarganding} = useDisclosure()


  return (
    <>
    <Modal closeOnOverlayClick={false} onClose={onCloseCarganding} isOpen={carganding} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>IMPORTANDO DATOS</ModalHeader>
          <ModalBody>

            <Flex flexDirection={'column'} justifyContent={'center'} alignContent='center' alignSelf={'center'} alignItems={'center'} justifyItems='center' justifySelf={'center'}>
              <Stack direction='row' spacing={4}>
                <Spinner size='xl' />
              </Stack>
              <Text textTransform={'uppercase'} fontSize= '20px' fontWeight={'bold'} marginTop='10px'> CARGANDO REGISTROS </Text>
            </Flex>

          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box w={"fit-content"} display="grid" gridTemplateColumns={'repeat(6,1fr)'} gap={5}>
 
          <Input type="date" name="fechaIni" defaultValue={getMonday(new Date()).diffinit} onChange={handleInput} variant="filled" />
          <Input type="date" name="fechaFin" defaultValue={getMonday(new Date()).dayfinal} onChange={handleInput} variant="filled" />
      {/* @ts-ignore */}
        <Button visibility={admin['roles'].includes('CONDUCTOR') ? 'hidden' : 'visible'}  color={"white"} backgroundColor={"#38a169"} onClick={onOpen}>Agregar</Button>
        <ImportProdRemision setCarganding ={setCarganding}/>
        <Verificar/>
        <ExportProd fechas = {fecha}/>
      </Box>
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl">
        <ModalOverlay />
        <ModalContent maxW="80%">
          <ModalHeader>Registrar Guia de Remision</ModalHeader>
          <ModalCloseButton onClick={() => setCompleteAllValues(true)} />
          <ModalBody pb={6}>
            {/* <ProductRemissionComp ref={inputEl} setProduct={setIdProducto} remision={1} /> */}
            <Grid
              h="auto"
              templateRows="repeat(5, auto)"
              templateColumns="repeat(8, 12.5%)"
              w="full">
              <GridItem mx={2} mt="15px" colSpan={8}>
                {/* tabs para compras con detalle o solo kilaje */}
                {<AddProdCompra ref={inputEl} idProducto={idProducto} />}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => (onClose())}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
