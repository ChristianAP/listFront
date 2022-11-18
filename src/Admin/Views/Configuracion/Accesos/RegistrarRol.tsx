import {
  Box,
  Button,
  Center,
  Flex,
  GridItem,
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
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { BiBlock } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { MyTextArea, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { AddRol, GetByRol } from "../../../../Service/RolService";
import { TableChargeListProduct } from "../../../UI/Components/TableCharge/tablecharge";
import * as yup from "yup";

export const RegistrarRol = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const listAccesses: any = [];
  const toast = useToast();

  const validate = yup.object().shape({
    ROL_NAME: yup.string().required("Debe ingresar nombre para el rol"),
  });

  const { data, isLoading, refetch } = useQuery(
    "access_rol",
    () => GetByRol(0),
    { refetchOnWindowFocus: false, enabled: false }
  );

  const { mutateAsync, isLoading: CreateLoading } = useMutation(AddRol, {
    onSuccess: (data) => {
      if (data.status != 200) {
        Alert({
          title: "Oops, Error",
          description: data.message,
          status: "error",
        });
      } else {
        Alert({
          title: "Datos Actualizados",
          description: data.message,
          status: "success",
        });
      }
    },
  });

  function Alert(props: any) {
    toast({
      title: props.title,
      description: props.description,
      status: props.status,
      duration: 8000,
      isClosable: true,
    });
  }

  return (
    <>
      <Button
        onClick={() => {
          refetch(), onOpen();
        }}
        ml={2}
        mr={2}
        colorScheme="green"
      >
        Agregar Nuevo Rol
        <Icon ml={2} mr={2} as={IoMdAddCircleOutline} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Accesos </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                ROL_NAME: "",
                ROL_DESCRIPTION: "",
              }}
              validationSchema={validate}
              onSubmit={async (values: any) => {
                if (listAccesses.length <= 0) {
                  Alert({
                    title: "Accesos",
                    description: "Seleccione al menos un acceso",
                    status: "error",
                  });
                } else {
                  await mutateAsync({
                    ROLE: values,
                    ACCESSES: listAccesses,
                  });

                  onClose();
                }
              }}
            >
              <Form>
                <Flex overflowX={"auto"}>
                  <Box ml={2} mr={2}>
                    <GridItem mx={2} m={2} colSpan={3} rowSpan={2}>
                      <MyTextInput
                        label="Nombre de rol"
                        name="ROL_NAME"
                        placeholder="Nombre del rol"
                      />
                    </GridItem>
                    <GridItem mx={2} m={2} colSpan={3} rowSpan={2}>
                      <MyTextArea
                        label="Descripción"
                        name="ROL_DESCRIPTION"
                        placeholder="Descripción del rol"
                      />
                    </GridItem>
                  </Box>
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
                                    {acc.SubAccesos.map(
                                      (sub: any, idx: any) => (
                                        <Tr key={idx}>
                                          <Td>{sub.nombre}</Td>
                                          <Td>{sub.descripcion}</Td>
                                          <Td>
                                            <Actions
                                              data={sub}
                                              listAccesses={listAccesses}
                                              refetch={refetch}
                                            />
                                          </Td>
                                        </Tr>
                                      )
                                    )}
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
                </Flex>
                <ModalFooter>
                  <Button
                    type="submit"
                    isLoading={CreateLoading}
                    isDisabled={CreateLoading}
                    colorScheme="green"
                    mr={3}
                  >
                    Agregar
                  </Button>
                  <Button colorScheme="green" mr={3} onClick={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </Form>
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const Actions = (props: any) => {
  const [sw, setSw] = React.useState(true);
  const listAcc = props.listAccesses;

  function changeSwitch(e: React.ChangeEvent<HTMLInputElement>, data: any) {
    if (e.target.checked == true) {
      listAcc.push({ ACC_ID: data.id });
    } else if (e.target.checked == false) {
      for (let i in listAcc) {
        if (listAcc[i].ACC_ID === data.id) {
          listAcc.splice(i, 1);
        }
      }
    }
  }

  return (
    <>
      <Flex>
        <Center>
          <Box m={2}>
            <Center>
              <Icon as={BiBlock} color={!sw ? "gray" : "red"} w={6} h={6} />
              <Switch
                size="sm"
                colorScheme="green"
                onChange={(e: any) => {
                  changeSwitch(e, props.data);
                  setSw(!sw);
                }}
                isChecked={!sw ? true : false}
              />
              <Icon
                as={IoMdAddCircleOutline}
                color={!sw ? "green" : "gray"}
                w={6}
                h={6}
              />
            </Center>
          </Box>
        </Center>
      </Flex>
    </>
  );
};
