import { Button, Flex, Heading, IconButton, useColorMode, useColorModeValue, Text, Center, Divider, useToast, Code } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ClientState, HeaderClient, NavClient } from '../../../Data/Atoms/Client'
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useMutation } from 'react-query';
import { changePassword, createCodigo, LoginAdmin, verifyCodigo } from '../../../Service/LoginService';
import { MyPasswordArea, MyTextInput } from '../../../GlobalUI/Forms/MyInputs';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { BiArrowBack, BiHome } from "react-icons/bi";
import { array } from 'yup/lib/locale';

export const Login = () => {
    const toast = useToast();
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);
    setNavClient(false)
    setHeadClient(false)
    const { toggleColorMode } = useColorMode()
    const [client, setClient] = useRecoilState(ClientState)
    const [card, setCard] = useState(0)
    const [validateMailSend, setValidateMailSend] = useState(true)
    const [usuario, setUsuario] = useState({ correo: "", usuario: "" })
    const [code, setCode] = useState("")
    const [password, setPassword] = useState({ password1: "", password2: "" })
    const formBackground = useColorModeValue("gray.300", "gray.700")
    const history = useHistory();
    const location = useLocation()
    const { mutateAsync, isLoading } = useMutation(LoginAdmin, {
        onSuccess: data => {

            if (!data.hasOwnProperty("message")) {
                //@ts-ignore
                if (data.roles.some((e: any) => e.ROL_NAME === 'CLIENTE')) {
                    setTimeout(() => history.push(previusObjectURL),
                        100
                    )
                    return setClient({
                        ...client, auth: true, iu: data.iu, user: data.user,
                        //@ts-ignore
                        roles: [...data.roles.map(val => val.ROL_NAME)],
                        accesos: data.accesos
                    })
                } else {
                    toast({
                        title: 'Usuario Invalido',
                        description: "Consulte con el administrador, si cuenta con el rol de 'CLIENTE'",
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                    })
                }

            } else {
                toast({
                    title: 'Usuario o Contraseña incorrectos',
                    description: "Verifique si la Contraseña es correcta. Sino no tiene un acuenta dele click al boton 'Registrar'",
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
            }
        },
    })
    const { mutateAsync: mutateAsyncCode, isLoading: isLoadingCode } = useMutation(createCodigo, {
        onSuccess: data => {
            if (data.status == 500) {
                toast({
                    title: 'Error',
                    description: data.message,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Correo Enviado',
                    description: "Rebice su correo electronico, Se le envio un codigo de verificacion",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                setValidateMailSend(false);
            }
        },
    })
    const { mutateAsync: mutateAsyncVerifyCode, isLoading: isLoadingVerifyCode } = useMutation(verifyCodigo, {
        onSuccess: data => {
            if (data.status == 500 || data.status == 404) {
                toast({
                    title: 'Error',
                    description: data.message,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Correo Enviado',
                    description: "Rebice su correo electronico, Se le envio un codigo de verificacion",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                setCard(2);

            }
        },
    })
    const { mutateAsync: mutateAsyncChangePassword, isLoading: isLoadingChangePassword } = useMutation(changePassword, {
        onSuccess: data => {
            if (data.status == 500) {
                toast({
                    title: 'Error',
                    description: data.message,
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Contraseña Cambiada',
                    description: "Exito al cambiar contraseña",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                mutateAsync({ user: usuario.usuario, password: password.password1 })
            }
        },
    })
    // @ts-ignore
    const previusObjectURL = location.state?.from || "/"
    const validate = Yup.object({
        user: Yup.string().required("Debe ingresar su correo"),
        password: Yup.string().required("Debe ingresar su contraseña").required("Debe ingresar su contraseña")
    })

    const values = {
        user: '',
        password: '',
    }



    // **
    function renderSwitch() {
        switch (card) {
            case 0:
                return <>
                    <Flex alignContent="center" mb={6}>
                        <Center mr={4}>
                            <Link to={"/"}>
                                <IconButton
                                    color="white"
                                    bg={"#2033c0"}
                                    _hover={{ bg: "#fbfbfb", color: "black" }}
                                    aria-label='Send email'
                                    fontSize={15}
                                    icon={<BiHome />}
                                />
                            </Link>
                        </Center>
                        <Heading>Iniciar Sesión</Heading>
                    </Flex>
                    <MyTextInput
                        label="Usuario"
                        name="user"
                        type="text"
                        placeholder="Correo de usuario"
                    />
                    <MyPasswordArea
                        label="Contraseña"
                        name="password"
                        placeholder="Contraseña de usuario"
                    />
                    <Button
                        w="full"
                        my={4}
                        borderRadius="full"
                        type="submit"
                        color="white"
                        bg={"#2033c0"}
                        _hover={{ bg: "#fbfbfb", color: "black" }}
                        isLoading={isLoading}
                    >
                        Iniciar sesión
                    </Button>
                    <Center>
                        <Button onClick={() => setCard(1)} color={"#2033c0"} variant='link'> ¿Has olvidado la contraseña? </Button>
                    </Center>
                    <Divider orientation='horizontal' />
                    <Center mb={5}>
                        <Text fontSize={{ base: 15, md: 20 }}>¿No estás registrado?</Text>
                    </Center>
                    <Link to={{ pathname: '/registrar', state: previusObjectURL }}>
                        <Button
                            color="#2033c0"
                            bg="#fbfbfb"
                            fontSize="15px"
                            fontWeight="bold"
                            _hover={{ bg: "#2033c0", color: "white" }}
                            borderRadius="full"
                            w="full"
                        >
                            Registrar</Button>
                    </Link>
                </>
                    ;
            case 1:
                return <>
                    <Flex alignContent="center" mb={6}>
                        <Center mr={4}>
                            <IconButton
                                onClick={() => setCard(0)}
                                color="white"
                                bg={"#2033c0"}
                                _hover={{ bg: "#fbfbfb", color: "black" }}
                                aria-label='Send email'
                                fontSize={15}
                                icon={<BiArrowBack />}
                            />
                        </Center>
                        <Heading>Recuperar Contraseña</Heading>
                    </Flex>
                    <MyTextInput
                        onChange={(e: any) => setUsuario((old) => ({ ...old, correo: e.target.value }))}
                        label="Correo"
                        name="correo"
                        type="email"
                        placeholder="Correo de usuario"
                    />
                    <MyTextInput
                        onChange={(e: any) => setUsuario((old) => ({ ...old, usuario: e.target.value }))}
                        label="Usuario"
                        name="usuario"
                        type="text"
                        placeholder="Usuario"
                        value={usuario.usuario}
                    />
                    <Button
                        onClick={async () => {
                            try {
                                await mutateAsyncCode(usuario);


                            } catch (error) {
                                console.log("error")
                            }
                        }}
                        //onClick={() => console.log(usuario)}
                        w="full"
                        my={4}
                        borderRadius="full"
                        color="white"
                        bg={"#2033c0"}
                        _hover={{ bg: "#fbfbfb", color: "black" }}
                        isLoading={isLoadingCode}
                    >
                        Enviar al Correo
                    </Button>
                    <MyTextInput
                        disabled={validateMailSend}
                        onChange={(e: any) => setCode(e.target.value)}
                        label="Codigo"
                        name="code"
                        type="number"
                        placeholder="6 digitos"
                    />
                    <Button
                        disabled={validateMailSend}
                        onClick={async () => {
                            try {
                                await mutateAsyncVerifyCode({ ...usuario, codigo: code });


                            } catch (error) {
                                console.log("error")
                            }
                        }}
                        w="full"
                        my={4}
                        borderRadius="full"
                        type="submit"
                        color="white"
                        bg={"#2033c0"}
                        _hover={{ bg: "#fbfbfb", color: "black" }}
                        isLoading={isLoading}
                    >Verificar Codigo</Button>
                </>;
            case 2:
                return <>
                    <Flex alignContent="center" mb={6}>
                        <Center mr={4}>
                            <IconButton
                                onClick={() => setCard(0)}
                                color="white"
                                bg={"#2033c0"}
                                _hover={{ bg: "#fbfbfb", color: "black" }}
                                aria-label='Send email'
                                fontSize={15}
                                icon={<BiArrowBack />}
                            />
                        </Center>
                        <Heading>Nueva Contraseña</Heading>
                    </Flex>
                    <MyTextInput
                        onChange={(e: any) => setPassword((old) => ({ ...old, password1: e.target.value }))}
                        label="Contraseña"
                        name="Password1"
                        type="password"
                        placeholder="Nueva Contraseña"
                        value={password.password1}
                    />
                    <MyTextInput
                        onChange={(e: any) => setPassword((old) => ({ ...old, password2: e.target.value }))}
                        label="Contraseña2"
                        name="Password2"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={password.password2}
                    />
                    <Button
                        onClick={async () => {
                            try {
                                console.log(password);

                                if (password.password1 == password.password2) {
                                    await mutateAsyncChangePassword({ usuario: usuario.usuario, password: password.password1 });
                                    toast({
                                        title: 'Contraseña actualizada',
                                        description: "la contraseña fue actualizada exitosamente",
                                        status: 'success',
                                        duration: 4000,
                                        isClosable: true,
                                    })
                                } else {
                                    toast({
                                        title: 'Error',
                                        description: "las contraseñas no coinciden",
                                        status: 'warning',
                                        duration: 4000,
                                        isClosable: true,
                                    })
                                }
                            } catch (error) {
                                console.log("error")
                            }
                        }}
                        w="full"
                        my={4}
                        borderRadius="full"
                        type="submit"
                        color="white"
                        bg={"#2033c0"}
                        _hover={{ bg: "#fbfbfb", color: "black" }}
                        isLoading={isLoading}
                    >
                        Crear Nueva Contraseña
                    </Button>
                </>;
            default:
                return 'foo';
        }
    }
    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex
                direction="column"
                p="12"
                rounded={16}
                boxShadow="0 0 1rem 0 rgba(0, 0, 0, .2);"
                borderRadius="5px;"
                backgroundColor=" rgba(255, 255, 255, .40);"
                backdropFilter="blur(5px);"
            >
                <Formik
                    initialValues={values}
                    validationSchema={validate}
                    onSubmit={async (values: any, { resetForm }) => {
                        switch (card) {
                            case 0:
                                await mutateAsync(values);
                                resetForm();
                                break;
                            case 1:

                                break;
                            case 2:
                                console.log("crear contraseña");
                                break;
                            default:
                                return 'Error';
                        }
                    }
                    }
                >
                    <Form>
                        {renderSwitch()}
                    </Form>
                </Formik>
            </Flex>

        </Flex >
    )
}
