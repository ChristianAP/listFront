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
  Button,
  Stack,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { FaTruck } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { useMutation, useQuery } from "react-query";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { CostoCompraState, IdOderState } from "../../../Data/Atoms/Carrito";
import { ClientState, HeaderClient, NavClient } from "../../../Data/Atoms/Client";
import { CarritoState } from "../../../Data/Atoms/Carrito";
import { IPedidoDetailModel, IPedidoModel } from "../../../Model/Pedidos";
import { IProductoCompra } from "../../../Model/Productos";
import { socketApi } from "../../../Routes/Admin/Socket";
import { changeStatusOrder, closeAlert, createOrder, orderById, OrederEdit, validationAlert } from "../../../Service/TiendaOnlineService";
import { ListMetodoPago } from "../../../Service/MetodoPagoService";
import { AiFillClockCircle } from "react-icons/ai";

export const MetodoPago = () => {


  const [client, setClient] = useRecoilState(ClientState);

  //@ts-ignore
  const idOrderState = useRecoilValue(IdOderState);
  const location = useLocation();

  const setCarritoState = useSetRecoilState(CarritoState)
  const [costoCarrito, setCostoCarrito] = useRecoilState(CostoCompraState)
  const [selectedImage, setSelectedImage] = useState(false);
  const [close, setClose] = useState(false);
  const [payMethod, setPayMethod] = useState(0)

  const [metodoPago, setMetodoPago] = useState('BCP')
  const [timer, setTimer] = useState(
    {
      seconds: ('0' + Math.floor(900 % 60)).slice(-2),
      minutes: ('0' + Math.floor(900 / 60 % 60)).slice(-2),
      time: 900
    })


  const [image, setImage] = useState([]);
  const history = useHistory()
  const productos: IProductoCompra[] = JSON.parse(localStorage.getItem('cart') || '[]') as Array<IProductoCompra>
  const { isLoading: loading, isError, data, error, isFetching } = useQuery('metodo_pago', ListMetodoPago, { refetchOnWindowFocus: false })

  //obtenemos fecha para registrar el pedido:
  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  //@ts-ignore
  today = yyyy + '-' + mm + '-' + dd;
  //const { data } = useQuery("orderById", () => orderById(idOrderState), {});
  const { data: resChangeStatusOrder } = useQuery("changeOrder", () => { return changeStatusOrder({ orders_detail: productos }) }, {
    onSuccess: (data) => {
      setClose(true)
    },
    refetchOnWindowFocus: false
  })
  const file = useRef(null);
  const toast = useToast();

  const { mutateAsync, isLoading } = useMutation(createOrder)
  const { mutateAsync: UpdateOrder } = useMutation(OrederEdit,);
  const { mutate } = useMutation(closeAlert, {})


  const setHeadClient = useSetRecoilState(HeaderClient);
  const setNavClient = useSetRecoilState(NavClient);
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
  const resetFileInput = () => {
    // 👇️ reset input value
    //@ts-ignore
    file.current.value = null;
  };
  const handleFile = () => {
    // @ts-ignore
    file.current.click();
  };
  async function CreatePedido() {

    const pedido: IPedidoModel =
    {
      ORD_ID: null,
      CLI_ID: client.iu,
      USR_ID: null,
      ORT_ID: 2,
      ORD_DATE_ORDER: today + "",
      ORD_TOTAL_PRICE: costoCarrito.total + "",
      ORD_DISCOUNT_PRICE: costoCarrito.descuento + "",
      ORD_UNDISCOUNTED_PRICE: (costoCarrito.total + costoCarrito.descuento) + "",
      ORD_IGV: (((costoCarrito.total + costoCarrito.descuento) / 1.18) * 0.18) + "",
      ORD_STATUS: "0",
      ORD_METODO_PAGO : metodoPago
    }
    var orders_detail: IPedidoDetailModel[] = [];
    //@ts-ignore
    if (image[0].size < 1000000) {
      productos.map((val, idx) => {

        var order_detail: IPedidoDetailModel = {
          ODT_ID: null,
          DIS_ID: null,
          ORD_ID: null,
          SLT_ID: 15,
          PRO_ID: val.id,
          ODT_DAYS_TO_SENDE: "0",
          ODT_AMOUNT: val.online ? val.peso + "" : val.cantidad + "",
          ODT_SUBTOTAL: val.subtotal + "",
          ODT_STATUS: "1",
          ODT_ONLINE: val.online
        }
        orders_detail.push(order_detail)
      })
      const order = await mutateAsync({ order: { ...pedido }, orders_detail });
      let formData = new FormData();
      formData.append("IMAGE", image[0]);
      await UpdateOrder({ formData: formData, idOrder: order.orderId });
      socketApi.emit("createSaleOnline", {
        id: await order.orderId,
        client: String(client.iu),
        total: costoCarrito.total,
        date: "",
        type: "new",
      });
      setCostoCarrito({
        subtotal: 0,
        descuento: 0,
        total: 0
      })
      localStorage.removeItem('cart');
      setCarritoState([])
      history.push("/pedidos")
    }
    else {
      const comprimirImagen = (imagenComoArchivo: any, porcentajeCalidad: any) => {
        /*
          https://parzibyte.me/blog
        */
        return new Promise<Blob>((resolve, reject) => {
          const $canvas = document.createElement("canvas");
          //@ts-ignore
          const imagen = new Image();
          imagen.onload = () => {
            $canvas.width = imagen.width;
            $canvas.height = imagen.height;
            //@ts-ignore
            $canvas.getContext("2d").drawImage(imagen, 0, 0);
            $canvas.toBlob(
              (blob) => {
                if (blob === null) {
                  return reject(blob);
                } else {
                  resolve(blob);
                }
              },
              "image/jpeg",
              porcentajeCalidad / 100
            );
          };
          imagen.src = URL.createObjectURL(imagenComoArchivo);
        });
      };

      const blob = await comprimirImagen(image[0], 50);
      const file = new File([blob], "Imagen Redimencionada");
      if (file.size < 1000000) {
        productos.map((val, idx) => {

          var order_detail: IPedidoDetailModel = {
            ODT_ID: null,
            DIS_ID: null,
            ORD_ID: null,
            SLT_ID: 15,
            PRO_ID: val.id,
            ODT_DAYS_TO_SENDE: "0",
            ODT_AMOUNT: val.online ? val.peso + "" : val.cantidad + "",
            ODT_SUBTOTAL: val.subtotal + "",
            ODT_STATUS: "1",
            ODT_ONLINE: val.online
          }
          orders_detail.push(order_detail)
        })
        const order = await mutateAsync({ order: { ...pedido }, orders_detail });
        let formData = new FormData();
        formData.append("IMAGE", file);
        await UpdateOrder({ formData: formData, idOrder: order.orderId });
        socketApi.emit("createSaleOnline", {
          id: await order.orderId,
          client: String(client.iu),
          total: costoCarrito.total,
          date: "",
          type: "new",
        });
        setCostoCarrito({
          subtotal: 0,
          descuento: 0,
          total: 0
        })
        localStorage.removeItem('cart');
        setCarritoState([])
        history.push("/pedidos")
      } else {
        toast({
          title: "limite excedido",
          description: "La imagen que trata de subir es muy pesada",
          duration: 8000,
          isClosable: true,
        });
      }
    }
  }

  const handleTabClosing = () => { }

  const alertUser = (event: any) => {
    event.preventDefault()
    var items = []
    for (let i = 0; i < productos.length; i++) {
      const element = productos[i];
      items.push(element)
    }
    mutate({ orders_detail: items })
    event.returnValue = ''
  }


  useEffect(() => {
    previzualizarImg();
    setNavClient(false)
    setHeadClient(true);

  }, [loading]);
  useEffect(() => {
    resetFileInput()
    previzualizarImg();
    setImage([]);
    setSelectedImage(false);
  }, [payMethod]);

  useEffect(() => {
    if (close) {
      window.addEventListener('beforeunload', alertUser)
      window.addEventListener('unload', handleTabClosing)
      return () => {
        window.removeEventListener('beforeunload', alertUser)
        window.removeEventListener('unload', handleTabClosing)
      }
    }
  }, [close])

  useEffect(() => {
    return () => {
      if (!close) {
        var items = []
        for (let i = 0; i < productos.length; i++) {
          const element = productos[i];
          items.push(element)
        }
        //mutate({ orders_detail: items })
      }
    }
  }, []);

  useEffect(() => {
    if (!close) {
      var items = []
      for (let i = 0; i < productos.length; i++) {
        const element = productos[i];
        items.push(element)
      }
      mutate({ orders_detail: items })
      console.log("Location changed");
    }
  }, []);

  useEffect(() => {
    setTimeout(function () {
      if (!(timer.time < 1)) {
        setTimer({
          seconds: ('0' + Math.floor((timer.time - 1) % 60)).slice(-2),
          minutes: ('0' + Math.floor((timer.time - 1) / 60 % 60)).slice(-2),
          time: (timer.time - 1)
        })
        console.log(timer);
      } else {
        var items = []
        for (let i = 0; i < productos.length; i++) {
          const element = productos[i];
          items.push(element)
        }
        mutate({ orders_detail: items })
        history.push("/carrito")
      }
    }, 1000);
  }, [timer]);

  return (
    <Flex direction={{ base: "column", md: "row" }} p="8">
      {costoCarrito.total == 0 && <Redirect to={"/carrito"} />}
      <Box
        bg={metodoPagoBG}
        padding={{ base: "1", md: "5" }}
        marginX="2"
        borderRadius="xl"
        marginY="2"
        flex="7">
        <Text fontSize="2xl" as="legend">
          <AiFillClockCircle />
          <b>{timer.minutes}</b>:
          <b>{timer.seconds}</b>
        </Text>
        <FormLabel fontSize="3xl" as="legend">
          Realizar Pago
        </FormLabel>
        <Text fontSize="xl">
          Total a Pagar:{" "}
          <b style={{ color: "var(--chakra-colors-red-500)" }}>
            S/.{costoCarrito.total}
          </b>
        </Text>
        <Divider marginY="5" opacity="1" />
        <Text>Seleccione el método de pago de su preferencia</Text>
        <Metodo_Pago data={data} isLoading={loading}
          isFetching={isFetching}
          isError={isError}
          error={error}
          setPayMethod={setPayMethod} setMetodoPago = {setMetodoPago}
        />
        <Button
          disabled={!selectedImage}
          isLoading={isLoading}
          leftIcon={<FaTruck />}
          onClick={CreatePedido}
          colorScheme="teal"
          variant="solid"
          _hover={{ bg: buttonHoverBG }}>
          Concretar Pedido
        </Button>
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
          <Text mx={2}>Subir voucher</Text>
          <input
            ref={file}
            hidden
            style={{ width: "150px" }}
            type="file"
            id="seleccionArchivos"
            accept="image/*"
          />
        </Button>
        <Text>Solo se permite imagenes</Text>
        {loading ?
          <Stack>
            <Skeleton height="70px" />
            <Skeleton height="70px" />
            <Skeleton height="70px" />
          </Stack> :
          isError ?
            //@ts-ignore
            <h1>{error.message} {':('}</h1>
            :
            <img
              id="imagenPrevisualizacion"
              src={data[payMethod].MPG_IMAGE}></img>
        }
      </Box>
    </Flex>
  );
};

const Metodo_Pago = ({ data, isLoading, isFetching, isError, error, setPayMethod, setMetodoPago}: { data: any, isLoading: any, isFetching: any, isError: any, error: any, setPayMethod: any, setMetodoPago : any }) => {

  const colors = useColorModeValue(
    ["red.50", "#003f9710", "#901a9e10"],
    ["red.900", "teal.900", "blue.900"]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const bg = colors[tabIndex];
  if (isLoading || isFetching) return (
    <Stack>
      <Skeleton height="70px" />
      <Skeleton height="70px" />
      <Skeleton height="70px" />
    </Stack>
  )

  // @ts-ignore
  if (isError) return <h1>{error.message} {':('}</h1>
  // @ts-ignore
  if (data.message) return <h1>{data.message}</h1>
  return (
    <Tabs
      marginY="10"
      orientation="vertical"
      onChange={(index) => {
        setTabIndex(index);
        setPayMethod(index);
      }}>
      <TabList>
        {

          data ?
            data.map((e: any) => {
              if (e.MPG_STATUS !== '0') {
                return <Tab onClick={() => setMetodoPago(e.MPG_NAME)}>{e.MPG_NAME}</Tab>
              }
            })
            :
            <>
              <Tab >NO DATA</Tab>
            </>
        }


        {/* // <Tab >{data[0].MPG_NAME}</Tab>
        // <Tab >{data[1].MPG_NAME}</Tab>
        // <Tab >{data[2].MPG_NAME}</Tab>
        // <Tab >{data[3].MPG_NAME}</Tab> */}
      </TabList>
      <TabPanels bg={bg}>
        {
          data ?
            data.map((e: any) => {
              if (e.MPG_STATUS !== '0') {
                return <TabPanel>{e.MPG_DESCRIPTION}</TabPanel>
              }
            })
            :
            <TabPanel>NO HAY NINGUN MÉTODO DE PAGO REGISTRADO :C</TabPanel>

        }



        {/* // <TabPanel>{data[0].MPG_DESCRIPTION}</TabPanel>
        // <TabPanel>{data[1].MPG_DESCRIPTION}</TabPanel>
        // <TabPanel>{data[2].MPG_DESCRIPTION}</TabPanel>
        // <TabPanel>{data[3].MPG_DESCRIPTION}</TabPanel> */}
      </TabPanels>
    </Tabs>
  );
};
