import {
    AlertIcon,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay, FormControl,
    FormLabel,
    Heading,
    HStack, Select,
    useDisclosure
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { MyTextInput } from '../../../../GlobalUI/Forms/MyInputs';
import {
    Clasificacion,
    Grupo,
    PersonType
} from '../../../../Model/Clientes';
import { CreateClient } from '../../../../Service/ClienteService';
import { CreatePersona } from '../../../../Service/PersonService';
import { ModalAlertMessage } from '../../../UI/Components/ModalAlert/MyModal';
import { NewClientValues } from '../RealizarVenta/InfoVenta';

interface NewClient {
    title?: any;
    icon?: React.ReactElement;
    reload?: any;
    personType?: PersonType[];
    grupo?: Grupo[];
    clasificacion?: Clasificacion[];
    sizeButton: string;
    persona: any;
    setPersona: any;
    clientState: boolean;
    clienteForm: any;
    setClienteForm: any;
    actionCloseDraw: any;
}

export const AddBussines = ({
    title,
    icon,
    reload,
    personType,
    grupo,
    clasificacion,
    sizeButton,
    persona,
    setPersona,
    clientState,
    clienteForm,
    setClienteForm,
    actionCloseDraw,
}: NewClient) => {
    // REACTORES
    const [size, setSize] = React.useState('xl');
    let { isOpen: isOpenNewClient, onOpen: onOpenNewClient, onClose: onCloseNewClient} = useDisclosure()
    const [viewModal, setViewModal] = useState(false);
    const [messageModal, setMessageModal] = useState('');
    const [statusModal, setStatusModal] = useState('');
    const [typeClient, setTypeClient] = useState(1);

    const buttonOpen: any = React.createRef();

    const OpenDraw = () => {
        onOpenNewClient();
    };
    // function handleChangeInput(
    //     name: any,
    //     e: React.ChangeEvent<HTMLInputElement>
    // ) {
    //     setPersona({
    //         ...persona,
    //         [name]: e.target.value,
    //     });
    // }

    function handleChangeSelect(
        name: any,
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        if (name != 'PET_ID') {
            setClienteForm({
                ...clienteForm,
                [name]: e.target.value,
            });
        } else {
            setPersona({
                ...persona,
                [name]: e.target.value,
            });
        }
    }

    async function saveClient(persona_data: any) {
        setMessageModal('Registrando Cliente ...');
        setStatusModal('info');
        setViewModal(true);
        let createPersona = await CreatePersona(persona_data);
        if (createPersona.data) {
            clienteForm.PER_ID = createPersona.data;
            let createClient = await CreateClient(clienteForm);
            setMessageModal(createClient.message);
            setStatusModal('success');
            setViewModal(true);
            clearInputs();
            await reload();
        } else {
            setMessageModal(createPersona.message);
            setStatusModal('error');
            setViewModal(true);
        }
        setTimeout(() => {
            setViewModal(false);
        }, 1000);
    }

    function clearInputs() {
        setPersona(NewClientValues);

        setClienteForm({
            CLA_ID: 1,
            GRO_ID: 1,
            PER_ID: 0,
        });
    }

    if (persona.PER_DNI.length > 0 || persona.PER_RUC > 0) {
        isOpenNewClient = true;
    }

    return (
        <>
            { viewModal == true ? (
                <>
                    <ModalAlertMessage
                        message={ messageModal }
                        status={ statusModal }
                        icon={ <AlertIcon boxSize='40px' mr={ 0 } /> }
                    />
                </>
            ) : (
                <></>
            ) }
            <Button
                onClick={ OpenDraw }
                ref={ buttonOpen }
                colorScheme='green'
                size={ sizeButton }>
                { icon }
                { title }
            </Button>
            <Drawer
                placement={ 'bottom' }
                onClose={ onCloseNewClient }
                isOpen={ isOpenNewClient }
                size={ size }>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>
                        <Box p='2'>
                            <Heading size='md'>Nuevo Cliente </Heading>
                        </Box>
                    </DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Formik
                            initialValues={ persona }
                            // validationSchema={ BussinesInitialValues }
                            onSubmit={ async (values: any) => {
                                console.log(values)
                            } }>
                            <Form>
                                <HStack spacing='20px' mb={ 5 }>

                                    <FormControl>
                                        <FormLabel>Tipo de cliente</FormLabel>
                                        <Select
                                            placeholder='Selecciona un tipo'
                                            name='PET_ID'
                                            onChange={ (e) => handleChangeSelect('PET_ID', e) }>
                                            { personType?.map((value, idx) => {
                                                if (Number(value.PET_ID) == persona.PET_ID) {
                                                    return (
                                                        <option
                                                            key={ idx }
                                                            value={ value.PET_ID }
                                                            selected={ true }>
                                                            { value.PET_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                } else {
                                                    return (
                                                        <option key={ idx } value={ value.PET_ID }>
                                                            { value.PET_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                }
                                            }) }
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Grupo de cliente</FormLabel>
                                        <Select
                                            placeholder='Selecciona un grupo'
                                            name='GRO_ID'
                                            onChange={ (e) => handleChangeSelect('GRO_ID', e) }>
                                            { grupo?.map((value, idx) => {
                                                if (Number(value.GRO_ID) == clienteForm.GRO_ID) {
                                                    return (
                                                        <option
                                                            key={ idx }
                                                            value={ value.GRO_ID }
                                                            selected={ true }>
                                                            { value.GRO_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                } else {
                                                    return (
                                                        <option key={ idx } value={ value.GRO_ID }>
                                                            { value.GRO_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                }
                                            }) }
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Clasificación de cliente</FormLabel>
                                        <Select
                                            placeholder='Selecciona una clasificación'
                                            name='CLA_ID'
                                            onChange={ (e) => handleChangeSelect('CLA_ID', e) }>
                                            { clasificacion?.map((value, idx) => {
                                                if (Number(value.CLA_ID) == clienteForm.CLA_ID) {
                                                    return (
                                                        <option
                                                            key={ idx }
                                                            value={ value.CLA_ID }
                                                            selected={ true }>
                                                            { value.CLA_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                } else {
                                                    return (
                                                        <option key={ idx } value={ value.CLA_ID }>
                                                            { value.CLA_NAME }{ ' ' }
                                                        </option>
                                                    );
                                                }
                                            }) }
                                        </Select>
                                    </FormControl>
                                </HStack>
                                <HStack spacing='20px' mb={ 5 }>
                                    <MyTextInput
                                        label='Nombre comercial'
                                        name='PER_TRADENAME'
                                        type='text'
                                        placeholder='Nombre comercial'
                                    />
                                    <MyTextInput
                                        label='RUC'
                                        name='PER_RUC'
                                        type='text'
                                        placeholder='Ingresa un ruc'
                                    />
                                </HStack>
                                <HStack spacing='20px' mb={ 5 }>
                                    <MyTextInput
                                        label='N° de celular'
                                        name='PER_N_PHONE'
                                        type='number'
                                        placeholder='Ingresa un número de celular'
                                    />
                                    <MyTextInput
                                        label='Correo electronico'
                                        name='PER_EMAIL'
                                        type='number'
                                        placeholder='Ingresa un correo electronico'
                                    />
                                </HStack>
                                <HStack spacing='20px' mb={ 5 }>
                                    <MyTextInput
                                        label='Pais de origen'
                                        name='PER_COUNTRY'
                                        type='text'
                                        placeholder='Ingresa un pais de origen'
                                    />
                                    <MyTextInput
                                        label='Departamento'
                                        name='PER_DEPARTMENT'
                                        type='text'
                                        placeholder='Ingresa un departamento'
                                    />
                                    <MyTextInput
                                        label='Provincia'
                                        name='PER_PROVINCE'
                                        type='text'
                                        placeholder='Ingresa una provincia'
                                    />
                                </HStack>
                                <HStack spacing='20px' mb={ 5 }>
                                    {/* <FormControl>
                                        <FormLabel>DISTRITO</FormLabel>
                                        <Input
                                            onChange={ (e) => handleChangeInput('PER_DISTRIC', e) }
                                            name='PER_DISTRIC'
                                            value={ persona.PER_DISTRIC }
                                        />
                                    </FormControl> */}
                                    <MyTextInput
                                        label='Distrito'
                                        name='PER_DISTRIC'
                                        type='text'
                                        placeholder='Ingresa un distrito'
                                    />
                                    <MyTextInput
                                        label='Dirección'
                                        name='PER_DIRECTION'
                                        type='text'
                                        placeholder='Ingresa una dirección'
                                    />

                                </HStack>
                                <Button type='submit' colorScheme='blue' mr={ 3 }>
                                    Agregar
                                </Button>
                                <Button
                                    onClick={ () => {
                                        clearInputs();
                                        onCloseNewClient
                                        actionCloseDraw();
                                    } }>
                                    Cancelar
                                </Button>
                            </Form>
                        </Formik>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
