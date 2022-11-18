import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import "./InputSearch.css";
import api from "./ApiVentas";
import { Buscador } from "./Buscador";
import { InfoVenta } from "./InfoVenta";
import React, { useEffect, useState } from "react";
import { VentaTable } from "./VentaTable";
import { CalculadorTotal } from "./CalculadoraTotal";
import { MyContain } from "../../../UI/Components/MyContain";
import { useRecoilState } from "recoil";
import { AdminState } from "../../../../Data/Atoms/Admin";
import { SelectPOS } from "../../VentaFeria/VentaPOS/selectPOS";
import { getConfigTienda } from "../../../../Service/ConfigAdminService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { aperturarCajaDay, CloseCash, getCajaByUserID, getSalesForCash } from "../../../../Service/CashService";
import { Form, Formik } from "formik";
import { MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { BiLockOpen } from "react-icons/bi";
import { ListMetodoPago } from "../../../../Service/MetodoPagoService";

export const getFecha = () => {
  let hoy = new Date();
  return hoy.getFullYear() + "-" + (hoy.getMonth() + 1) + "-" + hoy.getDate()
};

export const RealizarVenta = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Realizar Venta';
  }, []);

  let [pos_ID, setPOS_ID] = React.useState(0);
  let [cambio, SetCambio] = React.useState(0);
  let [vuelto, SetVuelto] = React.useState(0.0);
  let [descuento, SetDescuento] = React.useState(0);
  let [productos, SetProductos] = React.useState([]);
  let [queryProducto, SetQueryProducto] = React.useState("");
  let [total, SetTotal] = React.useState(0);




  let filtro = productos.filter((producto: any) => {
    return `${producto.PRO_NAME}`
      .toLowerCase()
      .includes(queryProducto.toLowerCase());
  });

  let [productoMuestra, SetProductoMuestra] = React.useState(filtro[0]);
  const cambioVuelto = () => {
    let cambioVuelto: number = cambio - total;
    cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
    SetVuelto(cambioVuelto);

  }
  const handleChangeCambio = (e: any) => {

    SetCambio(e.target.value);
    let cambioVuelto: number = parseFloat(e.target.value) - total;
    cambioVuelto = parseFloat(cambioVuelto.toFixed(2));
    SetVuelto(cambioVuelto);

  }
  //INFOVENTA
  const [admin, setAdmin] = useRecoilState(AdminState);
  let [formDetalle, SetFormDetalle] = React.useState({
    tipoComprobante: 1,
    PER_ID: 0,
    POS_ID: pos_ID,
    idCliente: "00000000",
    razonSocial: "CLIENTES VARIOS",
    direccion: "",
    metodoPago: 5,
    tipoMoneda: 1,
    tipoCambio: 1,
    cuentaPago: 'BCP',
    vendedor: admin.user,
    monto: 50.0,
    fecha: getFecha(),
    carrito: [],
    cambio: 0,
    vuelto: 0,
    LCT_ID: 1
  });

  //=======
  let [subtotalGeneral, SetSubtotalGeneral] = React.useState(0);
  let [descuentoGeneral, SetDescuentoGeneral] = React.useState(0);
  let [vistaDescripcion, SetVistaDescripcion] = React.useState([]);
  let [totalMontoInafecto, SetTotalMontoInafecto] = React.useState(0);
  let [totalIGVInafecto, SetTotalIGVInafecto] = React.useState(0);
  let [totalIGV, SetTotalIGV] = React.useState(0);
  let [totalGravada, SetTotalGravada] = React.useState(0);
  let [totalSubTotal, SetTotalSubTotal] = React.useState(0);

  const updateTotal = () => {
    const valores = vistaDescripcion.map((prod) => {
      return {
        // @ts-ignore
        total: prod.total,
        // @ts-ignore
        decuento: prod.descuento,
        // @ts-ignore
        inafec: prod.inafecta,
      };
    });
    let totalTotal = 0;
    let totalDescuento = 0;
    let totalInafect = 0;
    let totalIGVInafect = 0;
    let totaIGV = 0;
    let gravada = 0;
    let subTotal = 0;
    valores.map((e) => {
      subTotal = subTotal + (e.total / 1.18);
      gravada = gravada + (e.inafec == 1 ? 0 : e.total);
      totalTotal = totalTotal + (e.inafec == 1 ? e.total / 1.18 : e.total);
      totaIGV = totaIGV + (e.inafec == 1 ? 0 : (e.total / 1.18) * 0.18);
      totalDescuento = totalDescuento + e.decuento;
      if (e.inafec == "1") {
        totalInafect = totalInafect + (e.total / 1.18);
        totalIGVInafect = totalIGVInafect + ((e.total / 1.18) * 0.18);
      }
    });

    SetTotalMontoInafecto(totalInafect);
    SetTotalIGVInafecto(totalIGVInafect);
    SetSubtotalGeneral(totalTotal);
    SetTotal(subtotalGeneral - descuentoGeneral);
    SetDescuento(totalDescuento);
    SetTotalIGV(totaIGV);
    SetTotalGravada(gravada);
    SetTotalSubTotal(subTotal - descuentoGeneral)
  };
  useEffect(() => {
    SetFormDetalle(old => { return { ...old, POS_ID: pos_ID } })
  }, [pos_ID]);


  const [disabledClient, setDisabledClient] = useState(false)
  const [nextStep, setNextStep] = useState(false);

  /////////////////////// PARA LA APERTURA DE CAJA ////////////////////////////////////

  const { data: company, isLoading: loadingCompány, isFetching: fetchingCompany } = useQuery("OpenCash", getConfigTienda, { refetchOnWindowFocus: false })
  // const { data, isError, isLoading, error, isFetching } = useQuery('caja', getCaja,
  //     { refetchOnWindowFocus: false })

  const { isOpen, onClose, onOpen } = useDisclosure()

  const { isOpen: isOpenCierre, onClose: onCloseCierre, onOpen: onOpenCierre } = useDisclosure()
  const [open, setOpen] = useState(false)

  // const [admin, setAdmin] = useRecoilState(AdminState);
  // const { data: dataUltUser, isError: isErrorUserUlt, isFetching: fetchingUltUser, isLoading: loadingUltUser, refetch: refetchUltUser, error: errorULltUser } =
  //     useQuery(['ult', admin.iu], () => getUltimoCashByUserID(admin.iu), { refetchOnWindowFocus: false })
  const { data, isError, isFetching, isLoading, refetch, error } = useQuery(['caja', admin.iu], () => getCajaByUserID(admin.iu), { refetchOnWindowFocus: false })


  const { mutateAsync, data: dataCreate, isError: isErrorCreate, isLoading: loadingCreate } = useMutation(aperturarCajaDay)

  const [modal, setModal] = useState(false)
  const [moodcaja, setModcaja] = useState('')
  const [actualDate, setActualdate] = useState('')

  const [objUltimo, setObjUltimo] = useState<any>([])

  const toast = useToast()

  const queryClient = useQueryClient()
  useEffect(() => {
    //@ts-ignore
    // document.getElementById('title_view').textContent = 'Apertura Caja';

    console.log('ID DEL USUARIO', admin.iu);

    let ObjUltApertura = data && !data.message ? data[data.length - 1] : []
    setObjUltimo(ObjUltApertura)

    let dateUltimaAperura = data && !data.message ? data[data.length - 1].CJA_DATE_OPNING : null
    let fecha = new Date()
    let dia = fecha.getDate()
    let mes = fecha.getMonth() + 1
    let anio = fecha.getFullYear()
    let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
    setActualdate(fecha.toLocaleDateString())
    console.log(dateUltimaAperura);

    if (company && !company.message) {
      if (company && company[0].COM_OPEN_CASH == '1') {

        if (data && !data.message) {
          if (dateUltimaAperura !== null) {
            // if (ObjUltApertura.CJA_CLOSING_AMOUNT != '' && ObjUltApertura.CJA_ARCHING_AMOUNT != null && ObjUltApertura.CJA_STATUS == '2') {
            if (ObjUltApertura.CJA_STATUS == '2') {
              console.log("LA CAJA DEL DIA ANTERIOR ESTA CERRADA ");

              if (dateUltimaAperura == fechaActual) {
                //// aqui se validara si el campo monto de apertura es diferente que o, si lo es
                // no debe de mostrar el modal, pero si es igual a 0 entonces muestra el modal
                setModal(false)
              } else if (dateUltimaAperura != fechaActual) {
                // procedemos a ejecutar el servicio de crecaión de caja con el dia de hoy, pero con el monto que se guardara en el input
                setModal(true)
                console.log('se abre porque no se aperturó caja');
              }
            } else {
              console.log("LA CAJA DEL DIA ANTERIOR NO ESTA CERRADA, DEBE DE MOSTRAR EL MODAL PARA EL CIERRE DE CAJA DEL DIA ANTERIOR", ObjUltApertura);
              if (dateUltimaAperura == fechaActual) {
                //// aqui se validara si el campo monto de apertura es diferente que o, si lo es
                // no debe de mostrar el modal, pero si es igual a 0 entonces muestra el modal
                setModal(false)
              } else if (dateUltimaAperura != fechaActual) {
                // procedemos a ejecutar el servicio de crecaión de caja con el dia de hoy, pero con el monto que se guardara en el input
                console.log('se abre porque no se aperturó caja', modal);
                setOpen(true)
              }
            }
          } else {
            setModal(true)
            console.log('se abre porque no hay registros anteriores');
          }

        }
      }
    }


    /// aqui validemos si el monto de apertura de caja es 0
  }, [data, company])


  return (
    <React.Fragment>



      <Box display={{ md: "flex" }} w="100%">
        <Box
          m="1"
          p="1"
          borderRadius="10px"
          w={["100%", "100%", "30%"]}
          position="relative"
        >
          <MyContain>
            <SelectPOS setPOS_ID={setPOS_ID} width={"300px"} admin={admin} />
          </MyContain>

          <InfoVenta
            vistaDescripcion={vistaDescripcion}
            SetVistaDescripcion={SetVistaDescripcion}
            total={total}
            totalMontoInafecto={totalMontoInafecto}
            totalIGVInafecto={totalIGVInafecto}
            SetFormDetalle={SetFormDetalle}
            subtotalGeneral={subtotalGeneral}
            descuentoGeneral={descuentoGeneral}
            descuento={descuento}
            cambio={cambio}
            vuelto={vuelto}
            cambioVuelto={cambioVuelto}
            SetCambio={SetCambio}
            handleChangeCambio={handleChangeCambio}
            formDetalle={formDetalle}
            totalGravada={totalGravada}
            totalSubTotal={totalSubTotal}
            disabledClient={disabledClient}
            setDisabledClient={setDisabledClient}
            setNextStep={setNextStep}
          />
          {/* <Button onClick={()=> {
            console.log(formDetalle);
            
          }} >asdads</Button> */}
        </Box>
        <Box
          m="1"
          p="1"
          borderRadius="10px"
          w={["100%", "100%", "70%"]}
        >
          <MyContain>
            <Box position="relative" hidden={!disabledClient}>
              <h2>
                <b>Insumos</b>
              </h2>
              <br />
              <Buscador
                SetProductoMuestra={SetProductoMuestra}
                SetFormDetalle={SetFormDetalle}
                vistaDescripcion={vistaDescripcion}
                productoMuestra={productoMuestra}
                SetVistaDescripcion={SetVistaDescripcion}
                formDetalle={formDetalle}
                nextStep={nextStep}
                setNextStep={setNextStep}
              />
              <Divider m="2" />

              <Box pt={3}>
                <h2 >
                  <b >Descripción</b>
                </h2>

                <VentaTable
                  updateTotal={updateTotal}
                  cambioVuelto={cambioVuelto}
                  vistaDescripcion={vistaDescripcion}
                  SetVistaDescripcion={SetVistaDescripcion}
                  total={subtotalGeneral}
                  SetDescuentoGeneral={SetDescuentoGeneral}
                />
                <CalculadorTotal
                  totalIGV={totalIGV}
                  SetTotal={SetTotal}
                  total={total}
                  subtotalGeneral={subtotalGeneral}
                  descuentoGeneral={descuentoGeneral}
                  SetDescuentoGeneral={SetDescuentoGeneral}
                  SetFormDetalle={SetFormDetalle}
                />
              </Box>
            </Box>

            <Box hidden={disabledClient}>
              DEBE DE SELECCIONAR UN CLIENTE
            </Box>
          </MyContain>
        </Box>

      </Box>

      {/* ///////////////////////////////////////// PARA EL MODAL DE APERTURA Y EL DE CIERRE //////////////////////////////////////////// */}

      {/* MODAL QUE SE EJECUTARA PARA APERTURA DE CAJA */}
      <Modal onClose={onClose} isOpen={modal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>APERTURA DE CAJA - {actualDate}</ModalHeader>
          <Link href="/admin/ventas/listar-venta">
            <ModalCloseButton />
          </Link>
          <ModalBody>
            <Formik
              /* enableReinitialize={true} */
              initialValues={{ monto_apertura: '' }}
              /* validationSchema={validate} */
              onSubmit={
                async (values: any) => {
                  console.log(values);
                  let fecha = new Date()
                  let dia = fecha.getDate()
                  let mes = fecha.getMonth() + 1
                  let anio = fecha.getFullYear()
                  let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)
                  // console.log({
                  //             POS_ID: 1,
                  //             CJA_OPNING_AMOUNT: values.monto_apertura,
                  //             CJA_CLOSING_AMOUNT: 0,
                  //             CJA_ARCHING: '0',
                  //             CJA_STATUS: '1',
                  //             CJA_DATE_OPNING: fechaActual,
                  //             CJA_DATE_CLOSING: '',
                  //             USR_ID: admin.iu,
                  //          });                                    

                  if (values.monto_apertura != '' && Number(values.monto_apertura) >= 0) {
                    await mutateAsync(
                      {
                        POS_ID: 1,
                        CJA_OPNING_AMOUNT: values.monto_apertura,
                        CJA_CLOSING_AMOUNT: '',
                        CJA_ARCHING: '0',
                        CJA_STATUS: '1',
                        CJA_DATE_OPNING: fechaActual,
                        CJA_DATE_CLOSING: '',
                        USR_ID: admin.iu,
                      }
                    )
                    queryClient.invalidateQueries("caja")
                    onClose()
                  } else {
                    toast({
                      title: 'Ocurrió un error',
                      description: "El Monto de apertura no puede estar en blanco o ser negativo...",
                      status: 'error',
                      duration: 5000,
                      variant: 'left-accent',
                      isClosable: true,
                    })
                  }
                }}
            >
              <Form>
                <Flex flexDirection={'column'} gap={'10px'}>
                  <Alert status='info' variant={'left-accent'}>
                    <AlertIcon />
                    Se tiene que iniciar caja para poder continuar ...
                  </Alert>
                  <MyTextInput label='Ingrese Monto para Aperturar Caja :' name="monto_apertura" placeholder='0' autocomplete="off" />
                  <Button type={"submit"} leftIcon={<BiLockOpen />} colorScheme='whatsapp'>&nbsp;  APERTURAR CAJA</Button>
                </Flex>
              </Form>

            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* MODAL DE CIERRE DE CAJA POR SI LA CAJA DEL DIA ANTERIOR NO FUE CERRADA */}


      <Modal onClose={onCloseCierre} isOpen={open} isCentered>
        <ModalOverlay />
        <ModalContent maxW={'50%'}>
          <br />
          <ModalHeader >
            <Flex flexDirection={'row'} gap='20%'>

              <Text style={{ 'fontWeight': 'bold', 'float': 'left' }}>
                CIERRE DE CAJA / {objUltimo.CJA_DATE_OPNING}
              </Text>
              <Alert status='error' variant={'left-accent'} style={{ 'float': 'right', 'width': '40%' }}>
                <Text fontWeight={'bold'}>
                  Saldo Apertura Caja : S/. {objUltimo.CJA_OPNING_AMOUNT}
                </Text>
              </Alert>
            </Flex>
          </ModalHeader>
          {/* <ModalCloseButton onClick={()=> setOpen(false)} /> */}
          <ModalBody>
            <ContentCierr cash={objUltimo} setOpen={setOpen} setModal={setModal} />
          </ModalBody>
          <ModalFooter>
            {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};


export const ContentCierr = ({ cash, setOpen, setModal }: { cash: any, setOpen: any, setModal?: any }) => {
  const { data, isError, error, isFetched, isFetching, isLoading } = useQuery(['SaleOfCash', cash], () => getSalesForCash(cash), { refetchOnWindowFocus: false })
  const { data: listMetodoPago, error: errorMetodoPago, isLoading: loadingMetodoPago } = useQuery('metodo_pago', ListMetodoPago, { refetchOnWindowFocus: false })
  const [totalOnline, setTotalOnline] = useState(0)
  const [efectivo, setEfectivo] = useState(0)

  const [cuadre, setCuadre] = useState(true)
  const [diferencia, setFiferencia] = useState(cash.CJA_OPNING_AMOUNT)

  const { mutateAsync } = useMutation(CloseCash)

  const toast = useToast()

  const queryClient = useQueryClient()

  console.log(data);

  useEffect(() => {
    let suma = 0
    let efectivo = 0
    if (data && !data.message && listMetodoPago && !listMetodoPago.message) {
      data.map((e: any) => {
        let type = listMetodoPago.find((element: any) => element.MPG_NAME == e.DOC_METODO_PAGO).MPG_TYPE
        console.log('ESTE ES EL TIPO ...', type);
        if (e.SLT_ID === 5) {
          suma += e.DOC_NETO
          if (type == '1') {
            efectivo += e.DOC_NETO
          }
        }
      })
    }

    setEfectivo(efectivo)
    setTotalOnline(suma)

  }, [data, listMetodoPago])



  function calcular(event: any) {
    let dif = Number(event.target.value)
    let apertura_caja = Number(cash.CJA_OPNING_AMOUNT) + Number(efectivo)
    let total = dif - apertura_caja
    if (total >= 0) {
      setCuadre(true)
      setFiferencia((total))
    } else {
      setCuadre(false)
      setFiferencia((total))

    }

    console.log(dif);

  }

  const valuesInitial = {
    fisico: ''
  }
  return (
    <>
      <MyContain>
        <Formik
          /* enableReinitialize={true} */
          initialValues={valuesInitial}
          /* validationSchema={validate} */
          onSubmit={
            async (values: any) => {
              console.log(values.fisico)
              let fecha = new Date()
              let dia = fecha.getDate()
              let mes = fecha.getMonth() + 1
              let anio = fecha.getFullYear()
              let fechaActual = anio + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia)

              if (values.fisico != '' && Number(values.fisico) >= 0) {
                await mutateAsync(
                  {
                    CJA_ID: cash.CJA_ID,
                    CJA_CLOSING_AMOUNT: values.fisico,
                    CJA_ARCHING: diferencia > 0 ? 2 : diferencia < 0 ? 0 : 1,
                    CJA_ARCHING_AMOUNT: Math.abs(diferencia).toFixed(2),
                    CJA_STATUS: 2,
                    CJA_DATE_CLOSING: fechaActual,
                  }
                )
                queryClient.invalidateQueries("caja")
                setOpen(false)
                setModal(true)
              } else {
                toast({
                  title: 'Ocurrió un error',
                  description: "El Monto de Cierre no puede estar en blanco o ser negativo...",
                  status: 'error',
                  duration: 5000,
                  variant: 'left-accent',
                  isClosable: true,
                })
              }
            }}
        >
          <Form>
            <Alert status='info' variant={'left-accent'}>
              <AlertIcon />
              <Text fontWeight={'bold'}>
                Hoy {cash.CJA_DATE_OPNING} se realizaron {data && !data.message ? data.length : 0} ventas con un total de S/. {totalOnline}
              </Text>
            </Alert>
            <br />
            <Text style={{ 'fontSize': '17px' }}>MONTO ACUMULADO DEL DIA (ONLINE / FÍSICO) : </Text>
            <br />
            <Grid templateColumns={'repeat(2,1fr)'} gap={'10px'}>
              <GridItem>
                <label>Total Ventas en Efectivo : </label><br />
                <Input aria-label="TOTAL VENDIDO ONLINE" value={efectivo} style={{ 'width': '50%' }} disabled />
              </GridItem>
              <GridItem>
                <label>Total Ventas en Caja: </label>
                <MyTextInput label="" style={{ 'width': '50%' }} name='fisico' placeholder={'Ingrese el monto ...'} onKeyUp={(e: any) => {
                  calcular(e)
                }} />
              </GridItem>
            </Grid>
            <br />
            <div style={{ 'width': '50%', 'margin': '0 auto' }}>
              <Alert status={cuadre ? 'success' : 'warning'} variant={'left-accent'}>
                <AlertIcon />
                <Text fontWeight={'bold'}>
                  Se generó una {cuadre ? 'ganancia' : 'perdida'} de S/.{diferencia}
                </Text>
              </Alert>
            </div>

            <Box display={'flex'} flexDirection='row' gap={'20%'} justifyContent='center' justifySelf={'center'}>
              <Button type="submit">CERRAR CAJA</Button>
              <Link href="/admin/ventas/listar-venta">
                <Button>IR A LISTAR VENTA</Button>
              </Link>
            </Box>
          </Form>
        </Formik>
      </MyContain>
    </>
  )
}