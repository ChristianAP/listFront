import {
  Button,
  Flex,
  Heading,
  Box,
  useColorMode,
  useColorModeValue,
  Skeleton,
  Center,
  Text,
  HStack,
  Tooltip,
  IconButton,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ClientState, HeaderClient } from "../../../Data/Atoms/Client";
import * as yup from "yup";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Link, useHistory, useLocation } from "react-router-dom";
import { NavClient } from "../../../Data/Atoms/Client";
import { MySelect, MyTextInput } from "../../../GlobalUI/Forms/MyInputs";
import { Formik, Form } from "formik";
import { useMutation, useQuery } from "react-query";
import { CreatePersona } from "../../../Service/PersonService";
import { CreatePerson } from "../../../Model/Person";
import { getTypePerson } from "../../../Service/TiendaOnlineService";
import { CreateClient } from "../../../Service/ClienteService";
import { createUser, createUserRol, validateUser } from "../../../Service/User";
import { LoginAdmin } from "../../../Service/LoginService";
import { MdStore } from "react-icons/md";
import { BsEye, BsEyeFill, BsEyeSlash, BsEyeSlashFill, BsPerson } from "react-icons/bs";
import "./style.css";
import { CgArrowsExchange } from "react-icons/cg";
import { BiHome } from "react-icons/bi";

export const Registrar = () => {
  const setNavClient = useSetRecoilState(NavClient);
  const setHeadClient = useSetRecoilState(HeaderClient);
  setNavClient(false)
  setHeadClient(false);
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const previusObjectURL = location.state?.from || "/";
  const [user, setUser] = useRecoilState(ClientState);
  const [ruc, setRuc] = useState(false)
  const [values, setValues] = useState({
    PET_ID: "",
    PER_NAME: "",
    PER_LASTNAME: "",
    PER_TRADENAME: "",
    PER_EMAIL: "",
    PER_DNI: "",
    PER_RUC: "-",
    PER_N_PHONE: "",
    PER_DIRECTION: "",
    PER_DEPARTMENT: "",
    PER_PROVINCE: "",
    PER_DISTRIC: "",
    PER_COUNTRY: "",
    USR_USER: "",
    USR_PASSWORD: "",
  })
  const TypePerson = useQuery("typePerson", getTypePerson, {
    refetchOnWindowFocus: false,
  });
  const [usuario, setUer] = useState("")
  const [show, setShow] = React.useState(false)
  const [cargando, setCargando] = React.useState(false)

  const handleClick = () => setShow(!show)

  const { mutateAsync: usuarioValidate } = useMutation(validateUser);
  const { mutateAsync: logIn, isLoading } = useMutation(LoginAdmin);
  const { mutateAsync: CreateUser } = useMutation(createUser);
  const { mutateAsync: CrateClient } = useMutation(CreateClient, {
    onSuccess: (data) => {
      if (data.data) {
      } else {
      }
    },
  });
  const { mutateAsync: CreatePerson } = useMutation(CreatePersona);

  const [usuarioElegido, setUsuarioElegido] = useState(0);

  const validate = yup.object().shape({
    PER_NAME: yup.string().required("Debe ingresar su nombre"),
    PET_ID: yup.number().required("Debe escoger alguno"),
    PER_RUC: yup.string().required("Debe ingresar su ruc"),
    PER_LASTNAME: yup.string().required("Debe ingresar su apellido"),
    PER_N_PHONE: yup.string().required("Debe ingresar su numero de celular"),
    PER_COUNTRY: yup.string().required("Debe ingresar su ciudad"),
    PER_DEPARTMENT: yup.string().required("Debe ingresar su departamento"),
    PER_PROVINCE: yup.string().required("Debe ingresar su provincia"),
    PER_DISTRIC: yup.string().required("Debe ingresar su distrito"),
    PER_DIRECTION: yup.string().required("Debe ingresar su dirección"),
    PER_EMAIL: yup.string().email('Tiene que ser un Email').required("Debe ingresar su correo electronico"),
    USR_USER: yup.string().required("Debe ingresar un usuario"),
    USR_PASSWORD: yup.string().required("Debe ingresar una contraseña"),
    PER_DNI: yup.string().required("Debe ingresar su DNI"),
  });

  const validateEmpresa = yup.object().shape({
    PET_ID: yup.string().required("Seleccione un tipo"),
    PER_TRADENAME: yup
      .string()
      .required("Debe ingresar el nombre comercial de tu negocio"),
    PER_RUC: yup.number().required("Debe ingresar tu RUC"),
    PER_N_PHONE: yup.string().required("Debe ingresar su numero de celular"),
    PER_COUNTRY: yup.string().required("Debe ingresar su ciudad"),
    PER_DEPARTMENT: yup.string().required("Debe ingresar su departamento"),
    PER_PROVINCE: yup.string().required("Debe ingresar su provincia"),
    PER_DISTRIC: yup.string().required("Debe ingresar su distrito"),
    PER_DIRECTION: yup.string().required("Debe ingresar su dirección"),
    PER_EMAIL: yup.string().required("Debe ingresar su correo electronico"),
    USR_USER: yup.string().required("Debe ingresar un usuario"),
    USR_PASSWORD: yup.string().required("Debe ingresar una contraseña"),
  });

  function aparecerCampo(e: any) {
    let petId = e.target.value == 8
    setValues({ ...values, PET_ID: e.target.value, PER_RUC: petId ? "-" : "-" })
    if (petId) {
      setRuc(true);
    } else {
      setRuc(false);
    }
  }
  const toast = useToast()

  if (TypePerson.isLoading) return <Skeleton height="500px" />;
  return (
    <Flex minHeight="100vh" alignItems="center" justifyContent={"center"}>
      <Flex
        direction="column"
        maxW={{ base: "80%", md: "60vw" }}
        w="100%"
        background="white"
        p="4"
        m="4"
        rounded={16}
        boxShadow="0 0 1rem 0 rgba(0, 0, 0, .2);"
        borderRadius="5px;"
        backgroundColor=" rgba(255, 255, 255, .40);"
        backdropFilter="blur(5px);"
      >
        {usuarioElegido === 0 ? (
          <EleccionRegistrarUsuario statusElegirsUsuario={setUsuarioElegido} />
        ) : (
          <>
            <Heading mb={2}>
              <Center>
                Registrar {usuarioElegido === 1 ? "Empresa" : "Persona"}
              </Center>
              <Tooltip label="Cambiar de tipo de registro.">
                <Button onClick={() => setUsuarioElegido(0)}>
                  <CgArrowsExchange fontSize={20} />
                </Button>
              </Tooltip>
            </Heading>
            <hr />
            <Formik
              // * VALORES INICIALES
              enableReinitialize
              initialValues={values || {}}
              // * VALIDADOR
              validationSchema={
                usuarioElegido === 1 ? validateEmpresa : validate
              }
              // * ENVIAR
              onSubmit={async (val) => {
                setCargando(true)
                const validador = await usuarioValidate(val.USR_USER)
                if (validador.utlizado == 0) {
                  const user = {
                    USR_USER: val.USR_USER,
                    USR_PASSWORD: val.USR_PASSWORD,
                    USR_STATUS: "1",
                  };
                  const idUser = await CreateUser(user);
                  // @ts-ignore
                  const persona: CreatePerson = {
                    PET_ID: val.PET_ID,
                    USR_ID: idUser.data,
                    PER_NAME: val.PER_NAME,
                    PER_LASTNAME: val.PER_LASTNAME,
                    PER_DNI: val.PER_DNI,
                    //@ts-ignore
                    PER_RUC: val.PER_RUC,
                    //@ts-ignore
                    PER_EMAIL: val.PER_EMAIL,
                    //@ts-ignore
                    PER_N_PHONE: val.PER_N_PHONE,
                    //@ts-ignore
                    PER_TRADENAME: val.PER_TRADENAME,
                    //@ts-ignore
                    PER_DIRECTION: val.PER_DIRECTION,
                    //@ts-ignore
                    PER_DEPARTMENT: val.PER_DEPARTMENT,
                    //@ts-ignore
                    PER_PROVINCE: val.PER_PROVINCE,
                    //@ts-ignore
                    PER_DISTRIC: val.PER_DISTRIC,
                    //@ts-ignore
                    PER_COUNTRY: val.PER_COUNTRY,
                  };
                  const idPersona = await CreatePerson(persona);
                  await createUserRol({ USR_ID: idUser.data, roles: [4], PER_ID: idPersona.data });
                  const client = {
                    CLA_ID: 3,
                    GRO_ID: 1,
                    PER_ID: idPersona.data,
                  };
                  await CrateClient(client);
                  const loginData = await logIn({
                    //@ts-ignore
                    user: val.USR_USER,
                    //@ts-ignore
                    password: val.USR_PASSWORD,
                  });
                  if (!loginData.hasOwnProperty("message")) {
                    setUser({
                      //@ts-ignore
                      ...user,
                      auth: true,
                      user: loginData.user,
                      //@ts-ignore
                      roles: [...loginData.roles.map((val) => val.ROL_NAME)],
                      //@ts-ignore
                      accesos: loginData.accesos,
                    });
                  }
                  history.push("/");
                  setTimeout(() => history.push(previusObjectURL), 100);
                } else {
                  toast({
                    title: 'Usuario Repetido',
                    description: "Ingresar otro Usuario",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  })
                  setCargando(false)
                }
              }}>
              <Form>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  mb={8}
                  mt={4}
                  marginX={{ base: "0", md: "8" }}>
                  <Box
                    w={{ base: "90%", md: "300px" }}
                    margin={{ base: "0px 20px", md: "3px 20px" }}
                    alignItems="flex-start">
                    <MySelect
                      onChange={aparecerCampo}
                      label={
                        usuarioElegido === 2
                          ? "Tipo de Persona"
                          : " Tipo de Empresa"
                      }
                      name="PET_ID">
                      <option value="" label="">
                        Seleccione Una Opción
                      </option>
                      {
                        // @ts-ignore
                        TypePerson.data.map((type, idx) =>
                          usuarioElegido === 2 && (type.PET_ID == 1 || type.PET_ID == 8) ? (
                            <option key={idx} value={type.PET_ID}>
                              {type.PET_NAME}
                            </option>
                          ) : usuarioElegido === 1 && type.PET_ID != 1 ? (
                            <option key={idx} value={type.PET_ID}>
                              {type.PET_NAME}
                            </option>
                          ) : (
                            <></>
                          )
                        )
                      }
                    </MySelect>
                  </Box>
                </Flex>

                {ruc && <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  marginX={{ base: "0", md: "8" }}>
                  <Box style={{ margin: "3px 20px" }} w={{ base: "auto", md: "300px" }}>
                    <MyTextInput
                      label="RUC"
                      name="PER_RUC"
                      type="number"
                      placeholder="RUC"
                    />
                  </Box>
                </Flex>}
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  marginX={{ base: "0", md: "8" }}>
                  {usuarioElegido === 2 ? (
                    <>
                      <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                        <MyTextInput
                          label="Nombre"
                          name="PER_NAME"
                          type="text"
                          placeholder="Nombre"
                        />
                      </Box>
                      <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                        <MyTextInput
                          label="Apellido"
                          name="PER_LASTNAME"
                          type="text"
                          placeholder="Apellido"
                        />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                  {usuarioElegido === 1 ? (
                    <>
                      <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                        <MyTextInput
                          label="Nombre Comercial"
                          name="PER_TRADENAME"
                          type="text"
                          placeholder="Nombre Comercial"
                        />
                      </Box>

                      <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                        <MyTextInput
                          label="RUC"
                          name="PER_RUC"
                          type="number"
                          placeholder="RUC"
                        />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                </Flex>


                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  marginX={{ base: "0", md: "8" }}>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Celular"
                      name="PER_N_PHONE"
                      type="number"
                      placeholder="Celular"
                    />
                  </Box>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Correo"
                      name="PER_EMAIL"
                      type="text"
                      placeholder="Correo"
                    />
                  </Box>
                </Flex>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  marginX={{ base: "0", md: "8" }}
                  marginBottom="25px">
                  <Box
                    style={{ margin: "3px 20px" }} 
                    w={{ base: "90%", md: "300px" }}
                    /* width={usuarioElegido === 2 ? "300px" : "74%"} */>
                    <MyTextInput
                      label="Dirección"
                      name="PER_DIRECTION"
                      type="text"
                      placeholder="Dirección"
                    />
                  </Box>
                  {usuarioElegido === 2 ? (
                    <>
                      <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                        <MyTextInput
                          label="DNI"
                          name="PER_DNI"
                          type="number"
                          placeholder="DNI"
                        />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )}
                </Flex>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  marginX={{ base: "0", md: "8" }}>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="País"
                      name="PER_COUNTRY"
                      type="text"
                      placeholder="País"
                    />
                  </Box>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Departamento"
                      name="PER_DEPARTMENT"
                      type="text"
                      placeholder="Departamento"
                    />
                  </Box>
                </Flex>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  mb={8}
                  marginX={{ base: "0", md: "8" }}>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Provincia"
                      name="PER_PROVINCE"
                      type="text"
                      placeholder="Provincia"
                    />
                  </Box>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Distrito"
                      name="PER_DISTRIC"
                      type="text"
                      placeholder="Distrito"
                    />
                  </Box>
                </Flex>

                <Flex
                  direction={{ base: "column", lg: "row" }}
                  justifyContent="center"
                  mb={8}
                  marginX={{ base: "0", md: "8" }}>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }}>
                    <MyTextInput
                      label="Usuario"
                      name="USR_USER"
                      type="text"
                      placeholder="Usuario"
                    />
                  </Box>
                  <Box style={{ margin: "3px 20px" }} width={{ base: "90%", md: "300px" }} display={"flex"} alignItems={"end"}>
                    <MyTextInput
                      label="Contraseña"
                      name="USR_PASSWORD"
                      type={show ? 'text' : 'password'}
                      placeholder="Contraseña"
                    />
                    {/* <InputRightElement width='4.5rem'>
                      <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement> */}
                    < Button h={"40px"} size='sm' onClick={handleClick}>
                      {show ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </Button>
                  </Box>
                </Flex>

                <Flex justifyContent="center">
                  <Button type="submit" my={6} w="70%" colorScheme="blue" isLoading={cargando}>
                    Registrar
                  </Button>
                </Flex>
              </Form>
            </Formik>
          </>
        )}
      </Flex>
    </Flex >
  );
};

export const EleccionRegistrarUsuario = ({
  statusElegirsUsuario,
}: {
  statusElegirsUsuario?: any;
}) => {
  return (
    <>
      <Box w="100%" p={4}>
        <Flex alignContent="center" mb={9}>
          <Center mr={4}>
            <Link to={"/"}>
              <IconButton
                variant='outline'
                colorScheme='teal'
                aria-label='Send email'
                icon={<BiHome />}
              />
            </Link>
          </Center>
          <Center >
            <Text fontWeight={300} color="black" fontSize={30}>
              Elige como quieres registrarte.
            </Text>
          </Center>
        </Flex>
        <Center>
          <Box w="100%" alignSelf="center" alignItems="center">
            <HStack spacing="50px" alignItems="center" flexDirection={{ base: "column", sm: "row" }}>
              <Box
                onClick={() => {
                  statusElegirsUsuario(1);
                }}
                className="eleccion"
                w={{ base: "100%", sm: "50%" }}
                p={{ base: "2", sm: "5" }}
                bg="gray.100"
                rounded={16}>
                <Center>
                  <MdStore className="eleccion_icon" size={90} color="black" />
                </Center>
                <Center>
                  <Text
                    fontWeight={900}
                    className="eleccion_texto"
                    color="black">
                    Empresa
                  </Text>
                </Center>
              </Box>
              <Box
                onClick={() => {
                  statusElegirsUsuario(2);
                }}
                w={{ base: "100%", sm: "50%" }}
                className="eleccion"
                marginInlineStart={{ base: "0px !important", sm: "50px !important" }}
                p={{ base: "2", sm: "5" }}
                bg="gray.100"
                rounded={16}>
                <Center>
                  <BsPerson className="eleccion_icon" size={90} color="black" />
                </Center>
                <Center>
                  <Text
                    fontWeight={900}
                    className="eleccion_texto"
                    color="black">
                    Persona Natural
                  </Text>
                </Center>
              </Box>
            </HStack>
          </Box>
        </Center>
      </Box>
    </>
  );
};
