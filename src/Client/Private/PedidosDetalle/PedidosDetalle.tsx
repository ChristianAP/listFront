import {
  Box,
  Flex,
  FormLabel,
  Text,
  useColorModeValue,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Image,
  Button,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { FaTruck } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { useMutation, useQuery } from "react-query";
import { Link, useParams, Redirect } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ClientState, HeaderClient, NavClient } from "../../../Data/Atoms/Client";
import { PaymentMethodState } from "../../../Data/Atoms/PaymentMethod";
import { socketApi } from "../../../Routes/Admin/Socket";
import { orderById, OrederEdit } from "../../../Service/TiendaOnlineService";

export const PedidosDetalle = () => {
  //@ts-ignore
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(false);
  const [image, setImage] = useState([]);
  const [nextStep, setNextStep] = useState(false);
  const { data } = useQuery("orderById", () => orderById(id), {});

  const [client, setClient] = useRecoilState(ClientState);

  const { mutate, isLoading } = useMutation(OrederEdit, {
    onSuccess: () => {
      setNextStep(true);
    },
    onError: () => {
      alert("Error inesperado");
    },
  });
  const setNavClient = useSetRecoilState(NavClient);
  const setHeadClient = useSetRecoilState(HeaderClient);
  useEffect(() => {
    setNavClient(false)
    setHeadClient(true);
  }, []);

  const metodoPagoBG = useColorModeValue("white", "gray.700");
  const buttonHoverBG = useColorModeValue("gray.500", "gray.300");
  const imgMetodoPagoBG = useColorModeValue("white", "gray.700");

  function previzualizarImg() {
    const $seleccionArchivos = document.getElementById(
      "seleccionArchivos"
    ) as HTMLInputElement,
      $imagenPrevisualizacion = document.getElementById(
        "imagenPrevisualizacion"
      ) as HTMLImageElement;
    // Escuchar cuando cambie
    $seleccionArchivos.addEventListener("change", (e) => {
      //@ts-ignore
      setImage(e.target.files);
      setSelectedImage(true);
      // Los archivos seleccionados, pueden ser muchos o uno
      const archivos = $seleccionArchivos.files;
      // Si no hay archivos salimos de la función y quitamos la imagen
      if (!archivos || !archivos.length) {
        $imagenPrevisualizacion.src = "";
        return;
      }
      // Ahora tomamos el primer archivo, el cual vamos a previsualizar
      const primerArchivo = archivos[0];
      // Lo convertimos a un objeto de tipo objectURL
      const objectURL = URL.createObjectURL(primerArchivo);
      // Y a la fuente de la imagen le ponemos el objectURL
      $imagenPrevisualizacion.src = objectURL;
    });
  }
  const handleFile = () => {
    // @ts-ignore
    file.current.click();
  };
  const file = useRef(null);
  const updatePedido = () => {

    let idClient = String(client.iu);
    let promocion = {};
    let formData = new FormData();
    /* FormData requires name: id image[0] */
    formData.append("CLI_ID", idClient);
    formData.append("IMAGE", image[0]);
    formData.append("ORD_DATE_ORDER", data.ORD_DATE_ORDER);
    formData.append("ORD_DISCOUNT_PRICE", data.ORD_DISCOUNT_PRICE);
    formData.append("ORD_IGV", data.ORD_IGV);
    formData.append("ORD_STATUS", "1");
    formData.append("ORD_TOTAL_PRICE", data.ORD_TOTAL_PRICE);
    formData.append("ORD_UNDISCOUNTED_PRICE", data.ORD_UNDISCOUNTED_PRICE);
    formData.append("ORD_VOUCHER", data.ORD_VOUCHER);
    socketApi.emit("createSaleOnline", {
      id: "1",
      client: idClient,
      total: data.ORD_TOTAL_PRICE,
      date: "",
      type: "new",
    });

    mutate({ formData: formData, idOrder: data.ORD_ID });
  };
  if (!data) {
    return <h1>cargando...</h1>;
  }
  useEffect(() => {
    previzualizarImg();
  }, []);

  return (
    <Flex direction={{ base: "column", md: "row" }} p="8">
      <Box
        bg={metodoPagoBG}
        padding={{ base: "1", md: "5" }}
        marginX="2"
        borderRadius="xl"
        marginY="2"
        flex="7">
        <FormLabel fontSize="3xl" as="legend">
          Realizar Pago
        </FormLabel>
        <Text fontSize="xl">
          Total a Pagar:{" "}
          <b style={{ color: "var(--chakra-colors-red-500)" }}>
            S/.{data.ORD_TOTAL_PRICE}
          </b>
        </Text>
        <Divider marginY="5" opacity="1" />
        <Text>Seleccione el metodo de pago de su preferencia</Text>
        <Metodo_Pago />
        <Button
          disabled={!selectedImage}
          isLoading={isLoading}
          leftIcon={<FaTruck />}
          onClick={updatePedido}
          colorScheme="teal"
          variant="solid"
          _hover={{ bg: buttonHoverBG }}>
          Concretar Pedido
        </Button>
        {nextStep && <Redirect to="/pedidos" />}
      </Box>
      <Box
        bg={imgMetodoPagoBG}
        padding={{ base: "1", md: "5" }}
        marginX="2"
        borderRadius="xl"
        marginY="2"
        flex="5">
        <Button
          onClick={handleFile}
          mx={2}
          leftIcon={<GrGallery />}
          colorScheme="green">
          <Text mx={2}>Subir Vaucher</Text>
          <input
            ref={file}
            hidden
            style={{ width: "150px" }}
            type="file"
            id="seleccionArchivos"
            accept="image/*"
          />
        </Button>
        <ImagenPago />
      </Box>
    </Flex>
  );
};
const ImagenPago = () => {
  const metodoPagoState = useRecoilValue(PaymentMethodState);
  switch (metodoPagoState) {
    case "trans":
      return (
        <Image
          id="imagenPrevisualizacion"
          src="https://www.bbva.com/wp-content/uploads/2019/11/transferencias2.jpg"></Image>
      );
    case "bcp":
      return (
        <Image
          id="imagenPrevisualizacion"
          src="https://is2-ssl.mzstatic.com/image/thumb/Purple125/v4/45/12/aa/4512aac9-2c01-bfda-e416-4dee1f15954c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png"></Image>
      );
    case "yape":
      return (
        <Image
          id="imagenPrevisualizacion"
          src="https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/50/d8/eb/50d8ebdc-d38a-1988-0a01-6fbfef0e6896/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png"></Image>
      );
    default:
      return (
        <Image
          id="imagenPrevisualizacion"
          src="https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/50/d8/eb/50d8ebdc-d38a-1988-0a01-6fbfef0e6896/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png"></Image>
      );
  }
};
const Metodo_Pago = () => {
  const setMetodo_pago = useSetRecoilState(PaymentMethodState);
  const colors = useColorModeValue(
    ["red.50", "#003f9710", "#901a9e10"],
    ["red.900", "teal.900", "blue.900"]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const bg = colors[tabIndex];
  return (
    <Tabs
      marginY="10"
      orientation="vertical"
      onChange={(index) => {
        setTabIndex(index);
      }}>
      <TabList>
        <Tab onClick={() => setMetodo_pago("trans")}>
          Transferencia Bancaria
        </Tab>
        <Tab onClick={() => setMetodo_pago("bcp")}>Banco de Credito</Tab>
        <Tab onClick={() => setMetodo_pago("yape")}>Yape</Tab>
      </TabList>
      <TabPanels bg={bg}>
        <TabPanel>{"datos del Dueño de la Cuenta"}</TabPanel>
        <TabPanel>{"datos del Dueño de la Cuenta"}</TabPanel>
        <TabPanel>{"datos y numero del Dueño de la Cuenta"}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};
