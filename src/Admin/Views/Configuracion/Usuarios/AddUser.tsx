import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
  FormLabel,
  FormControl,
  Flex,
  Text,
  Box,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { Form, Formik } from "formik";
import {
  InputSearch,
  MyPasswordArea,
  MyTextInput,
} from "../../../../GlobalUI/Forms/MyInputs";
import {
  createUser,
  createUserRol,
  SearchUser,
} from "../../../../Service/User";
import { GetAllRol } from "../../../../Service/RolService";

export const AddUsuarios = ({ children, refetch }: { children: ReactNode, refetch:any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rolesvalues, getrolesvalues] = useState<[]>([]);
  const [messagesRoles, messageRole] = useState("");

  const [isLoading, setisLoading] = useState(false);

  const [valueId, setValueId] = React.useState(String);
  const [searchInput, setSearchInput] = useState("");
  const [listPerson, setPersonSearch] = useState<[]>([]);
  const [valueName, setValueName] = React.useState(String);

  const toast = useToast();
  const rolesSelect: any = [];

  async function changeSelectSearch(changeValueId: any, changeValueName: any) {
    setValueId(changeValueId);
    setValueName(changeValueName);
  }

  const valuesInitial = {
    USR_USER: "",
    USR_PASSWORD: "",
  };

  async function searchPerson(event: any) {
    event.preventDefault();
    if (
      searchInput != "" ||
      event.type == "click" ||
      event.type == "keypress"
    ) {
      setPersonSearch(await SearchUser(searchInput));
    }
  }

  function handleChangeBox(
    e: React.ChangeEvent<HTMLInputElement>,
    idSelect: any
  ) {
    if (e.target.checked == true) {
      rolesSelect.push(idSelect);
    } else if (e.target.checked == false) {
      for (let i in rolesSelect) {
        if (rolesSelect[i] === idSelect) {
          rolesSelect.splice(i, 1);
        }
      }
    }
  }

  async function getRoles() {
    let roles = await GetAllRol();
    if (roles.length > 0) {
      getrolesvalues(roles);
    } else {
      messageRole(roles.message);
    }
  }

  async function cancel() {
    setPersonSearch([]);
    setValueId("");
    setValueName("");
    setSearchInput("");
    setisLoading(false);
    onClose();
  }

  return (
    <>
      <div
        onClick={() => {
          onOpen();
          getRoles();
        }}>
        {children}
      </div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir Usuario</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={valuesInitial}
            onSubmit={async (values: any) => {
              if (
                values.USR_USER != "" &&
                values.USR_PASSWORD != "" &&
                rolesSelect.length > 0 &&
                valueId != ""
              ) {
                setisLoading(true);
                let response = await createUser(values);
                if (response.status == '200') {
                  let dataRolSend = {
                    PER_ID: valueId,
                    USR_ID: response.data,
                    roles: rolesSelect,
                  };
                  let responseRol = await createUserRol(dataRolSend);
                  if (responseRol.status == '200') {
                    toast({
                      title: "" + responseRol.message,
                      status: "success",
                      isClosable: true,
                    });
                    refetch();
                    cancel();
                  } else {
                    setisLoading(false);
                    toast({
                      title: "" + responseRol.message,
                      status: "error",
                      isClosable: true,
                    });
                  }
                } else {
                  setisLoading(false);
                  toast({
                    title: "" + response.message,
                    status: "error",
                    isClosable: true,
                  });
                }
              } else {
                toast({
                  title: "Llena todos los campos",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}>
            <Form>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>
                    <Flex>
                      <Box>Persona</Box>
                    </Flex>
                  </FormLabel>
                  {valueId == "" ? (
                    <InputSearch
                      setValueSearch={setSearchInput}
                      sendValueSearch={searchPerson}
                      valueSearch={searchInput}
                      dataGet={listPerson}
                      selectedValue={changeSelectSearch}
                    />
                  ) : (
                    <Text fontWeight="bold">{valueName}</Text>
                  )}
                </FormControl>
                <br />
                <MyTextInput
                  label="Usuario"
                  name="USR_USER"
                  type="text"
                  placeholder="Nombre de usuario"
                />
                <MyPasswordArea
                  label="Contraseña"
                  name="USR_PASSWORD"
                  // type="text"
                />
                <br />
                <Box>
                  <FormLabel mb="0">
                    Roles
                  </FormLabel>
                  {rolesvalues.length > 0 ? (
                    <>
                      {rolesvalues.map((rol: any) => (
                        <>
                          <Flex color="white">
                            <Checkbox
                              colorScheme="green"
                              onChange={(e:any) => handleChangeBox(e, rol.ROL_ID)}>
                              <Text color="black">{rol.ROL_NAME}</Text>
                            </Checkbox>
                          </Flex>
                        </>
                      ))}
                    </>
                  ) : (
                    <Text>{messagesRoles}</Text>
                  )}
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                  colorScheme="green"
                  mr={3}>
                  Agregar
                </Button>
                <Button onClick={cancel}>Cancelar</Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
