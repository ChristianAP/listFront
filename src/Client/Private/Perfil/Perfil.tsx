import { Flex, FormControl, FormLabel, Button, Text, useColorModeValue, Skeleton, Select, FormErrorMessage, Box, Divider, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import { Form, Formik, useField } from 'formik';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { MyTextInput } from '../../../GlobalUI/Forms/MyInputs';
import { chagePassword, editPerson, getPerfilFact } from '../../../Service/TiendaOnlineService';

export const Perfil = () => {
    const setNavClient = useSetRecoilState(NavClient);
    const setHeadClient = useSetRecoilState(HeaderClient);

    useEffect(() => {
        setNavClient(true)
        setHeadClient(true)
    }, [])

    return (
        <Flex justifyContent="space-around">
            <PerfilContent></PerfilContent>
        </Flex>
    )
}
export const PerfilContent = () => {

    const PerfilFact = useQuery('perfilfact', async () => await getPerfilFact(), { refetchOnWindowFocus: false })

    let values
    // ? OBJETO DE DEFINICIÓN DE VALORES INICIALES PARA EL FORMULARIO
    if (PerfilFact.isLoading) return <Skeleton height="500px" />
    if (PerfilFact.data.message) return <Text>No se encontro registros</Text>
    return <MyPerfilForm PerfilFact={PerfilFact} />
}

const MyPerfilForm = ({ PerfilFact }: any) => {
    const perfilBoxBG = useColorModeValue('white', 'gray.800');
    const toast = useToast();
    const queryClient = useQueryClient()


    const { mutateAsync: EditPerson, isLoading: editLoading } = useMutation(editPerson, {
        onSuccess: data => {
            if (data.status != '200') {
                toast({
                    title: 'No funciono',
                    description: data.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Datos Actualizados',
                    description: "Correctamente",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        },
    })
    console.log(PerfilFact.data)
    const { mutateAsync, isLoading } = useMutation(chagePassword, {
        onSuccess: data => {
            if (data.message) {
                toast({
                    title: 'No funciono',
                    description: data.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Contraseña cambiada',
                    description: "Correctamente",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        },
    })
    const validate = (PerfilFact.data.PET_ID == "1" || PerfilFact.data.PET_ID == "7" || PerfilFact.data.PET_ID == "8") ? PerfilFact.data.PET_ID == "8" ?
        yup.object().shape({
            PER_NAME: yup.string().required("Debe ingresar su nombre"),
            PER_LASTNAME: yup.string().required("Debe ingresar su apellido"),
            PER_N_PHONE: yup.string().required("Debe ingresar su numero de telefono"),
            PER_COUNTRY: yup.string().required("Debe ingresar su pais"),
            PER_DEPARTMENT: yup.string().required("Debe ingresar su departamento"),
            PER_PROVINCE: yup.string().required("Debe ingresar su provincia"),
            PER_DISTRIC: yup.string().required("Debe ingresar su distrito"),
            PER_DIRECTION: yup.string().required("Debe ingresar su direccion"),
            PER_EMAIL: yup.string().required("Debe ingresar su email"),
            PER_DNI: yup.string().required("Debe ingresar su dni"),
            PER_TRADENAME: yup.string().required("Debe ingresar su nombre"),
            PER_RUC: yup.string().required("Debe ingresar su ruc"),
        }) :
        yup.object().shape({
            PER_NAME: yup.string().required("Debe ingresar su nombre"),
            PER_LASTNAME: yup.string().required("Debe ingresar su apellido"),
            PER_N_PHONE: yup.string().required("Debe ingresar su numero de telefono"),
            PER_COUNTRY: yup.string().required("Debe ingresar su pais"),
            PER_DEPARTMENT: yup.string().required("Debe ingresar su departamento"),
            PER_PROVINCE: yup.string().required("Debe ingresar su provincia"),
            PER_DISTRIC: yup.string().required("Debe ingresar su distrito"),
            PER_DIRECTION: yup.string().required("Debe ingresar su direccion"),
            PER_EMAIL: yup.string().required("Debe ingresar su email"),
            PER_DNI: yup.string().required("Debe ingresar su dni"),
        }) : yup.object().shape({
            PER_TRADENAME: yup.string().required("Debe ingresar su nombre"),
            PER_N_PHONE: yup.string().required("Debe ingresar su numero de telefono"),
            PER_COUNTRY: yup.string().required("Debe ingresar su pais"),
            PER_DEPARTMENT: yup.string().required("Debe ingresar su departamento"),
            PER_PROVINCE: yup.string().required("Debe ingresar su provincia"),
            PER_DISTRIC: yup.string().required("Debe ingresar su distrito"),
            PER_DIRECTION: yup.string().required("Debe ingresar su direccion"),
            PER_EMAIL: yup.string().required("Debe ingresar su email"),
            PER_RUC: yup.string().required("Debe ingresar su ruc"),
        })
    const values2 = {
        USR_PASSWORD: "",
        USR_PASSWORD2: "",
        USR_PASSWORD2_1: ""
    }
    const validate2 = yup.object().shape({
        USR_PASSWORD: yup.string().required("Debe ingresar su contraseña"),
        USR_PASSWORD2: yup.string().required("Debe ingresar su nueva contraseña"),
        USR_PASSWORD2_1: yup.string().required("Repita su contraseña").oneOf([yup.ref('USR_PASSWORD2'), null], 'las contraseñas deberian de ser iguales'),
    })
    return (
        <Box>
            <Formik
                // * VALORES INICIALES
                initialValues={PerfilFact.data || {}}
                // * VALIDADOR
                validationSchema={validate}
                // * ENVIAR
                onSubmit={async (valuesPerson, { resetForm }) => {
                    delete valuesPerson.USR_PASSWORD;
                    delete valuesPerson.USR_USER;
                    delete valuesPerson.CLI_ID;
                    await EditPerson(valuesPerson);
                    queryClient.invalidateQueries('perfilfact')
                    //resetForm();
                }}>
                <Form style={{ background: perfilBoxBG, marginTop: "25px", borderRadius: "10px" }}>
                    {(PerfilFact.data.PET_ID == "1" || PerfilFact.data.PET_ID == "7" || PerfilFact.data.PET_ID == "8") ? PerfilFact.data.PET_ID == "8" ?
                        <>
                            <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                                <Box style={{ margin: "3px 20px", width: "300px" }} >
                                    <Text fontSize="3xl">Perfil</Text >
                                    <MyTextInput
                                        label="Razon Social"
                                        name="PER_TRADENAME"
                                        type="text"
                                        placeholder="Nombre"
                                    />
                                </Box>
                                <Box style={{ margin: "3px 20px", width: "300px" }} >
                                    <Text fontSize="3xl" display={{ base: "none", lg: "block" }} opacity="0">Perfil</Text >
                                    <MyTextInput
                                        label="Ruc"
                                        name="PER_RUC"
                                        type="text"
                                        placeholder="Nombre"
                                    />
                                </Box>
                            </Flex>
                            <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                                <Box style={{ margin: "3px 20px", width: "300px" }} >
                                    <MyTextInput
                                        label="Nombre"
                                        name="PER_NAME"
                                        type="text"
                                        placeholder="Nombre"
                                    />
                                </Box>
                                <Box style={{ margin: "3px 20px", width: "300px" }}>
                                    <MyTextInput
                                        label="Apellido"
                                        name="PER_LASTNAME"
                                        type="text"
                                        placeholder="Apellido"
                                    />
                                </Box>
                            </Flex></>
                        : <><Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                            <Box style={{ margin: "3px 20px", width: "300px" }} >
                                <Text fontSize="3xl">Perfil</Text >
                                <MyTextInput
                                    label="Nombre"
                                    name="PER_NAME"
                                    type="text"
                                    placeholder="Nombre"
                                />
                            </Box>
                            <Box style={{ margin: "3px 20px", width: "300px" }}>
                                <Text fontSize="3xl" display={{ base: "none", lg: "block" }} opacity="0">Perfil</Text >
                                <MyTextInput
                                    label="Apellido"
                                    name="PER_LASTNAME"
                                    type="text"
                                    placeholder="Apellido"
                                />
                            </Box>
                        </Flex></>
                        : <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                            <Box style={{ margin: "3px 20px", width: "300px" }} >
                                <Text fontSize="3xl">Perfil</Text >
                                <MyTextInput
                                    label="Razon Social"
                                    name="PER_TRADENAME"
                                    type="text"
                                    placeholder="Nombre"
                                />
                            </Box>
                            <Box style={{ margin: "3px 20px", width: "300px" }} >
                                <Text fontSize="3xl" display={{ base: "none", lg: "block" }} opacity="0">Perfil</Text >
                                <MyTextInput
                                    label="Ruc"
                                    name="PER_RUC"
                                    type="text"
                                    placeholder="Nombre"
                                />
                            </Box>
                        </Flex>
                    }
                    {/* <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }} >
                            <MyTextInput
                                label="Usuario"
                                name="USR_USER"
                                type="text"
                                placeholder="Usuario"
                            />
                        </Box>
                    </Flex> */}
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }} >
                            <MyTextInput
                                label="Celular"
                                name="PER_N_PHONE"
                                type="text"
                                placeholder="Celular"
                            />
                        </Box>
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput
                                label="Correo"
                                name="PER_EMAIL"
                                type="text"
                                placeholder="Correo"
                            />
                        </Box>
                    </Flex>
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }} >
                            <MyTextInput

                                label="País"
                                name="PER_COUNTRY"
                                type="text"
                                placeholder="País"
                            />
                        </Box>
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput

                                label="Departamento"
                                name="PER_DEPARTMENT"
                                type="text"
                                placeholder="Departamento"
                            />
                        </Box>
                    </Flex>
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }} >
                            <MyTextInput

                                label="Provincia"
                                name="PER_PROVINCE"
                                type="text"
                                placeholder="Provincia"
                            />
                        </Box>
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput

                                label="Distrito"
                                name="PER_DISTRIC"
                                type="text"
                                placeholder="Distrito"
                            />
                        </Box>
                    </Flex>
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} marginBottom="25px">
                        <Box style={{ margin: "3px 20px", width: "300px" }} >
                            <MyTextInput

                                label="Dirección"
                                name="PER_DIRECTION"
                                type="text"
                                placeholder="Dirección"
                            />
                        </Box>
                        {(PerfilFact.data.PET_ID == "1" || PerfilFact.data.PET_ID == "7" || PerfilFact.data.PET_ID == "8") && <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput

                                label="DNI"
                                name="PER_DNI"
                                type="text"
                                placeholder="DNI"
                            />
                        </Box>}
                    </Flex>
                    <Flex justifyContent={"center"}>
                        <Button isLoading={editLoading} width={"90%"} marginY="15px" colorScheme="facebook" variant="solid" type="submit"> Actualizar </Button>
                    </Flex>
                </Form>
            </Formik>

            <Text fontSize={"20px"}><b> Cambiar Contraseña</b></Text>
            <Formik
                // * VALORES INICIALES
                initialValues={values2 || {}}
                // * VALIDADOR
                validationSchema={validate2}
                // * ENVIAR
                onSubmit={async (values, { resetForm }) => {
                    await mutateAsync(values);
                    resetForm();
                }}>
                <Form style={{ background: perfilBoxBG, marginTop: "25px", borderRadius: "10px" }}>
                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} marginY={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput
                                label="Contraseña anterior"
                                name="USR_PASSWORD"
                                type="password"
                                placeholder="Contraseña"
                            />
                        </Box>
                    </Flex>
                    <Flex justifyContent={"center"}>
                        <Divider width={"85%"} />
                    </Flex>

                    <Flex direction={{ base: "column", lg: "row" }} justifyContent="center" marginX={{ base: "4", md: "8" }} >
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput
                                label="Nueva Contraseña"
                                name="USR_PASSWORD2"
                                type="password"
                                placeholder="Contraseña"
                            />
                        </Box>
                        <Box style={{ margin: "3px 20px", width: "300px" }}>
                            <MyTextInput
                                label="Repetir Nueva Contraseña"
                                name="USR_PASSWORD2_1"
                                type="password"
                                placeholder="Contraseña"
                            />
                        </Box>
                    </Flex>
                    <Flex justifyContent={"center"}>
                        <Button isLoading={isLoading} width={"90%"} marginY="15px" colorScheme="facebook" variant="solid" type="submit"> Actualizar </Button>
                    </Flex>
                </Form>
            </Formik>
        </Box>
    )
}

export const MySelect = ({ label, ...props }: any) => {
    // @ts-ignore
    const [field, meta] = useField(props);
    return (
        // @ts-ignore
        <FormControl isInvalid={meta.touched && meta.error}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Select {...field} {...props}>
                {props.options && props.options.map((val: any, id: number) =>
                    <option value={val.PET_ID} key={id}>{val.PET_NAME}</option>
                )}
            </Select>
            <FormErrorMessage>{meta.error}</FormErrorMessage>
        </FormControl>
    )
}
