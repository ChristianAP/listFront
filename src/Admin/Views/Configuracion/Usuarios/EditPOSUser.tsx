import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    Center,
    Tooltip,
    IconButton,
    useDisclosure,
    Button,
    ModalFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Checkbox,
    Flex,
    Text,
    Skeleton,
} from "@chakra-ui/react";
import { BsPencilFill } from "react-icons/bs";
import { Form, Formik } from "formik";
import { MyCheckbox } from "../../../../GlobalUI/Forms/MyInputs";
import { createUsPointSale, deleteByUserUsPointSale, deleteUsPointSale, getUsPointSalesByUserId } from "../../../../Service/UsPointSale";
import { useRecoilState } from "recoil";

export const EditPOSUser = ({ user }: { user: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [usuario, setUsuario] = useState(0);
    const { mutateAsync: createUsPintsale, isLoading: createUsLoading } = useMutation(createUsPointSale)

    const queryClient = useQueryClient();

    const { mutateAsync: deleteUsPintsale, isLoading: deleteUsLoading } = useMutation(deleteByUserUsPointSale)
    //createUsPointSale

    const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
        ["pointSalesByUser", usuario],
        () => getUsPointSalesByUserId(usuario),
        { refetchOnWindowFocus: false }
    );

    function handleClick(user: number) {
        onOpen()
        setUsuario(user)
    }

    return (
        <>
            <Tooltip label='Editar'>
                <IconButton onClick={() => handleClick(user)} aria-label='Editar' bg={"blue.600"} icon={<BsPencilFill />} />
            </Tooltip>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Usuario</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={{}}
                        onSubmit={async (value) => {
                            await deleteUsPintsale(usuario)
                            for (const val in value) {
                                //@ts-ignore
                                if (value[val]) {
                                    createUsPintsale({
                                        USR_ID: usuario,
                                        POS_ID: Number(val),
                                        UPS_STATUS: "1"
                                    })
                                }
                            }
                            setUsuario(0)
                            queryClient.invalidateQueries('allusers')

                            onClose()
                        }}>
                        <Form>
                            <ModalBody pb={6}>
                                {
                                    isLoading || isFetching ?
                                        <>
                                            <Skeleton w={"90%"} h="20px" />
                                            <Skeleton w={"90%"} h="20px" />
                                            <Skeleton w={"90%"} h="20px" />
                                        </>
                                        : data.map((point_sale: any, idx: number) => (
                                            <Flex color="black" key={"key-" + idx}>
                                                <MyCheckbox
                                                    defaultChecked={point_sale.UPS_STATUS == 1}
                                                    name={point_sale.POS_ID}
                                                >
                                                    {point_sale.POS_NAME}
                                                </MyCheckbox>
                                            </Flex>
                                        ))
                                }
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
                                <Button onClick={onClose}>Cancelar</Button>
                            </ModalFooter>
                        </Form>
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    );
};
