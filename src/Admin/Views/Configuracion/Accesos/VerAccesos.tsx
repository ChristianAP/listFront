import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle, AiOutlineEye } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import queryClient from "../../../../Mutations/Client";
import {
  AddAccessesRol,
  DeleteAccessesRol,
  GetByRol,
  UpdateEstatusAccessesRol,
} from "../../../../Service/RolService";
import { TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";

export const VerAccesos = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const listAccesses: any = [];

  // const { mutateAsync, isLoading, data } = useMutation(
  //   "access_rol",
  //   GetByRol,
  //   {}
  // );

  const { data, isLoading, refetch } = useQuery(
    "access_rol",
    () => GetByRol(props.idrol),
    { refetchOnWindowFocus: false, enabled: false }
  );

  return (
    <>
      <Tooltip label='Ver'>

        <Button
          onClick={() => {
            refetch(), onOpen();
          }}
        >
          <Icon as={AiOutlineEye} />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Accesos </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {data ? (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Modulo</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data &&
                    data.map((acc: any, idx: any) => (
                      <Tr key={idx}>
                        <Td>{acc.Acceso}</Td>
                        <Td>
                          <Table variant="striped" colorScheme="gray">
                            <Thead>
                              <Tr>
                                <Th>Acceso</Th>
                                <Th>Descripción</Th>
                                <Th>Acción</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {acc.SubAccesos.map((sub: any, idx: any) => (
                                <Tr key={idx}>
                                  <Td>{sub.nombre}</Td>
                                  <Td>{sub.descripcion}</Td>
                                  <Td>
                                    <Actions
                                      estado={sub.estado}
                                      idrol={props.idrol}
                                      data={sub}
                                      listAccesses={listAccesses}
                                      refetch={refetch}
                                    />
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            ) : (
              isLoading && <TableChargeListProduct />
            )}
            {/* <TablaAccesos rol={props.idrol}/> */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export const Actions = (props: any) => {
  const [sw, setSw] = React.useState(props.estado);
  const toast = useToast();

  // function changeSwitch(e: React.ChangeEvent<HTMLInputElement>, data: any) {
  function changeSwitch() {
    props.data.estado == 2 ? CreateAccesses(props.data) : UpdateAccesses();
  }

  async function UpdateAccesses() {
    let response = await UpdateEstatusAccessesRol(props.data);
    if (response.message) {
      setSw(!sw);
      props.refetch();
      toast({
        title: "Acceso.",
        description: response.message,
        status: response.status == 500 ? "error" : "success",
        duration: 9000,
        position: "bottom-left",
        isClosable: true,
      });
    }
  }

  async function DeleteAccesses() {
    let response = await DeleteAccessesRol(props.data);
    if (response.message) {
      setSw(!sw);
      props.refetch();
      toast({
        title: "Acceso.",
        description: response.message,
        status: response.status !== 200 ? "error" : "success",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  async function CreateAccesses(data: any) {
    props.data.estado = 1;

    let array_data = {
      ROL_ID: props.idrol,
      ACC_ID: data.id,
    };

    let response = await AddAccessesRol(array_data);
    if (response.message) {
      setSw(1);
      toast({
        title: "Acceso.",
        description: response.message,
        status: response.status == 500 ? "error" : "success",
        duration: 9000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Flex>
        <Center>
          <Box m={2}>
            <Center>
              <Icon as={BiBlock} color={sw == 1 ? "gray" : "red"} w={6} h={6} />
              <Switch
                size="sm"
                colorScheme="green"
                onChange={() => {
                  changeSwitch();
                  setSw(!sw);
                }}
                isChecked={sw == 1 ? true : false}
              />
              <Icon
                as={sw == 2 ? IoMdAddCircleOutline : AiOutlineCheckCircle}
                color={sw == 1 ? "green" : "gray"}
                w={6}
                h={6}
              />
            </Center>
          </Box>
          <Box>
            <Button
              onClick={DeleteAccesses}
              isDisabled={sw == 2 ? true : false}
            >
              <Icon w={5} h={5} color="red" as={BsTrash} />
            </Button>
          </Box>
        </Center>
      </Flex>
    </>
  );
};
