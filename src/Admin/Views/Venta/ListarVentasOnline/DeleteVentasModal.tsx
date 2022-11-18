import {
    Accordion,
    AccordionButton,
    AccordionPanel,
    AccordionItem,
    Drawer,
    DrawerOverlay,
    useDisclosure,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    Box,
    Text,
    Center,
    Flex,
    Button,
    Image,
    IconButton,
    FormControl,
    Badge,
    useToast,
    DrawerCloseButton,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import React, { ReactNode, useRef, useState } from "react";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import { IoPrintSharp, IoDownloadSharp, IoMail } from "react-icons/io5";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import { listaSaleOnline } from "../../../../Data/Atoms/SaleOnline";
import { ListForDocument } from "../../../../Service/PersonService";
import {
    ChangeOrderState,
    deleteOrder,
    getDocumentForSaleOnline,
    ListProductsSalesOnline,
    VerifyVoucherOrder,
} from "../../../../Service/Sales";
import {
    SendMail,
    SendMailRejectedVoucher,
} from "../../../../Service/SendMailService";
import api from "../RealizarVenta/ApiVentas";
import { CambiarEstado } from "./CambiarEstado";
import { DonwloadPDF } from "./DonwloadPDF";
import { TablaProductosVentasOnline } from "./TablaProductos";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { Tooltip } from "@chakra-ui/react";

import success from "./assets/images/success.gif";
import denied from "./assets/images/denied.gif";
import noimage from "../../../UI/Assets/images/noimage.png";
import { VerficationOptions } from "./VerificationOptions/VerificationOptions";
import { VerifiedVoucher } from "./VerifiedVoucher/VerifiedVoucher";
import { DescriptionOrder } from "./Description/DescriptionOrder";
import { closeAlert } from "../../../../Service/TiendaOnlineService";

export const DeleteVentasModal = ({
    children,
    venta,
}: {
    children: ReactNode;
    venta?: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef()
    const { mutateAsync, isLoading } = useMutation(deleteOrder)
    const { mutateAsync: closeAlertAsync, isLoading: isLoadingClose } = useMutation(closeAlert)

    const queryClient = useQueryClient();

    async function handleDelete() {
        console.log(venta);
        let dataProduct = await ListProductsSalesOnline(venta.PEDIDO);
        console.log(dataProduct);
        var items = []
        for (let i = 0; i < dataProduct.length; i++) {
            const element = dataProduct[i];
            items.push({ ...element, id: element.PRO_ID })
        }
        console.log(items);

        await closeAlertAsync({ orders_detail: items })
        // @ts-ignore
        await mutateAsync(venta.PEDIDO);
        queryClient.invalidateQueries("salesonline")
        onClose()
    }
    return (
        <>
            <div onClick={() => onOpen()}>
                {children}
            </div>
            <AlertDialog
                isOpen={isOpen}
                //@ts-ignore
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Categoría
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            ¿Está seguro? No podrá deshacer esta acción después.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                // @ts-ignore
                                ref={cancelRef}
                                onClick={onClose}
                                isDisabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                onClick={handleDelete}
                                isLoading={isLoading}
                            >
                                Confirmar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

