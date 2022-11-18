import { Box, Button, ButtonGroup, Flex, Grid, HStack, IconButton, Image, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ICategoria } from "../../../Model/Categoria";
import { TitleCenter } from "./TitleCenter";
import "./CategoriaComp.css";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getCategories } from "../../../Service/TiendaOnlineService";
import { producstCategoria, producstRemision } from "../../../Service/RemisionAdminService";
import { IoArrowBack, IoReturnDownBack } from "react-icons/io5";
/* estilos categoria */
const categoriaComp = {
  borderRadius: "30px 30px 30px 30px",
};
export const CategoriaComp = ({
  background,
  setCategoria,
  setForm,
  form,
}: {
  background?: boolean;
  setCategoria?: any;
  setForm?: any;
  form?: any;
}) => {
  const { data, isLoading, isError, refetch } = useQuery(
    "categorie",
    getCategories,
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <h1>Cargando</h1>;

  if (isError) {
    return <h1>Error</h1>;
  }
  if (data.message) {
    return <h1>No hay data</h1>;
  }

  return (
    <>
      {!background ?
        <><HStack display={{ base: "none", md: "flex" }} spacing="10" justify="space-between" padding={"5"} overflow="auto" className="category_scroll">
          <ButtonGroup variant="link" spacing="20" margin={"auto"}>
            {data.map((val: any, idx: number) =>

              <Link
                className="link__cat"
                key={idx}
                to={"/categoria/" + val.CAT_NAME.replace(" ", "-")}
              >
                <Button color={"white"} fontSize={"xl"} key={val}>{val.CAT_NAME}</Button>
              </Link>

            )}
            <Link
              className="link__cat"
              to={"/nosotros"}
            >
              <Button color={"white"} fontSize={"xl"}> Nosotros</Button>
            </Link>
          </ButtonGroup>
        </HStack></>
        :
        <>{data.map((val: any, idx: number) => (
          <Box
            key={idx}
            className="contenedor__cat other__cat"
            onClick={() => {
              setCategoria(val);
              form
                ? setForm({
                  ...form,
                  prod: { ID: val.CAT_ID, NAME: val.CAT_NAME },
                })
                : "";
            }}
          >
            <Image
              src={val.CAT_IMAGE}
              alt={val.CAT_NAME}
              width={{ base: "125px", md: "250px" }}
              height={"auto"}
              objectFit="cover"
            />
            <div className="button__cat">
              <Text fontWeight={"150px"} fontSize={"3xl"}>
                {val.CAT_NAME}
              </Text>
            </div>
          </Box>
        ))
        }</>
      }
    </>
  );
};

export const ProductRemissionComp = ({
  setProduct,
  ref,
  remision,
}: {
  setProduct?: any;
  ref?: any;
  remision: any;
}) => {
  const { data, isLoading, isError, refetch } = useQuery(
    "productsRemissions",
    () => producstRemision(remision, 0, 1),
    { refetchOnWindowFocus: false }
  );

  if (isLoading) return <h1>Cargando</h1>;

  if (isError) {
    return <h1>Error</h1>;
  }
  if (data.message) {
    return <h1>No hay data</h1>;
  }

  return (
    <>
      {data.map((val: any, idx: number) => (
        <Box
          key={idx}
          className="contenedor__cat other__cat"
          onClick={() => {
            setProduct(val);
          }}
        >
          <Image
            src={val.PRO_IMAGE}
            alt={val.PRO_NAME}
            width={{ base: "125px", md: "250px" }}
            height={"auto"}
            objectFit="cover"
          />
          <div className="button__cat">
            <Text fontWeight={"150px"} fontSize={"3xl"}>
              {val.PRO_NAME}
            </Text>
          </div>
        </Box>
      ))}
    </>
  );
};

export const ProductFindComp = ({
  setProduct,
  remision,
  SetFormDetalle,
  formDetalle,
  vistaDescripcion = [],
  productoMuestra = {},
  SetVistaDescripcion = () => { },
  nextStep,
  setNextStep
}: {
  setProduct?: any;
  remision: any;
  SetFormDetalle?: any;
  formDetalle?: any;
  vistaDescripcion?: any;
  productoMuestra?: any;
  SetVistaDescripcion?: any;
  nextStep: any
  setNextStep: any
}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [tablausuarios, setTablaUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState({ cat: '', LCT_ID: formDetalle.LCT_ID });
  const [busqueda, setBusqueda] = useState();

  const { isLoading: loadingCat, isError: errorCat, refetch: refetchCat } = useQuery(
    "productsCategorias",
    () => producstCategoria(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategorias(data);
      },
    }
  );
  const { isLoading, isError, refetch } = useQuery(
    ["productsRemissions", categoria],
    () => producstRemision(remision, Number(categoria.cat), categoria.LCT_ID),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTablaUsuarios(data);
        setUsuarios(data);
      },
    }
  );

  const handleChage = (e: any) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };
  const handleReturn = (categoria: any) => {
    setNextStep(false)
  }
  const handleAdd = (props?: any) => {
    if (props.val.STK_TODAY == null) {
      props.valor.stock = 0;
    } else {
      props.valor.stock = props.val.STK_TODAY;
    }
    props.valor.cantidad = 1;
    props.valor.inafecta = props.valor.PRO_INAFECT;
    props.valor.precio = (props.val.PRD_UNIT_PRICE * 1.0);
    props.valor.subtotal = props.valor.precio * props.valor.cantidad;
    props.valor.descuento = 0;
    if (props.val.DIS_PERCENTAGE != null) {
      props.valor.descuento =
        (props.valor.subtotal / 1.18) *
        parseFloat(props.val.DIS_PERCENTAGE) *
        0.01 *
        1.18;
    }
    props.valor.total = props.valor.subtotal - props.valor.descuento;

    let iguales: boolean = false;
    vistaDescripcion.forEach((elemento: any) => {
      if (elemento.PRO_ID == productoMuestra.PRO_ID) {
        iguales = true;
      }
    });
    if (!iguales) {
      // SetFormDetalle({
      //   ...formDetalle,
      //   idCliente: (props.valor.PER_DNI && props.valor.PER_DNI.length > 0)
      //     ?
      //     props.valor.PER_DNI :
      //     (props.valor.PER_RUC && props.valor.PER_RUC.length > 0)
      //       ? props.valor.PER_RUC :
      //       "00000000",
      //   razonSocial: (props.valor.PER_DNI && props.valor.PER_DNI.length > 0)
      //     ? props.valor.PER_NAME + " " + props.valor.PER_LASTNAME :
      //     (props.valor.PER_DNI && props.valor.PER_DNI.length > 0) ?
      //       props.valor.PER_TRADENAME :
      //       "CLIENTES VARIOS",
      //   direccion: props.valor.PER_DIRECTION,
      //   metodoPago: props.valor.PMT_ID ? props.valor.PMT_ID : 5,
      // })
      SetFormDetalle({
        ...formDetalle,
        idCliente: (props.valor.PER_DNI && props.valor.PER_DNI.length > 0)
          ?
          props.valor.PER_DNI :
          (props.valor.PER_RUC && props.valor.PER_RUC.length > 0)
            ? props.valor.PER_RUC :
            (formDetalle.idCliente.length > 1 ? formDetalle.idCliente : "00000000"),
        razonSocial: (props.valor.PER_DNI && props.valor.PER_DNI.length > 0)
          ? props.valor.PER_NAME + " " + props.valor.PER_LASTNAME :
          (props.valor.PER_DNI && props.valor.PER_DNI.length > 0) ?
            props.valor.PER_TRADENAME :
            (formDetalle.idCliente.length > 1 ? formDetalle.razonSocial : "CLIENTES VARIOS"),
        // direccion: props.valor.PER_DIRECTION == null || '' ? formDetalle.direccion : props.valor.PER_DIRECTION , // talvez este mal abajo es el q posible solucion
        direccion: formDetalle.direccion == null || '' ? (props.valor.PER_DIRECTION == null || '' ? '' : props.valor.PER_DIRECTION) : formDetalle.direccion,
        // metodoPago: props.valor.PMT_ID ? props.valor.PMT_ID : 5,
        metodoPago: formDetalle.metodoPago == null || '' ? (props.valor.PMT_ID == null || '' ? 5 : props.valor.PMT_ID) : formDetalle.metodoPago,
      })
      SetVistaDescripcion([...vistaDescripcion, props.valor]);
    }
  }

  const filtrar = (terminoBusqueda: any) => {
    var resultadosBusqueda = tablausuarios.filter((elemento: any) => {

      if (
        elemento.PRO_NAME.toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setUsuarios(resultadosBusqueda);
  };

  if (loadingCat) return <h1>Cargando</h1>;

  if (errorCat) {
    return <h1>Error</h1>;
  }
  //@ts-ignore
  if (categorias.message) {
    return <h1>No hay data</h1>;
  }

  return (
    <>
      <Box display={!nextStep ? "block" : "none"}>
        <Flex gap={5} overflowX={"auto"} className="category_scroll" overflowY={"hidden"}>
          {categorias.map((val: any, idx: number) => (
            <Box
              key={idx}
              className="contenedor__cat other__cat"
              onClick={() => {
                setCategoria({ cat: val.CAT_ID, LCT_ID: formDetalle.LCT_ID });
                setNextStep(true);
              }}
            >
              <Image
                src={val.CAT_IMAGE}
                alt={val.CAT_NAME}
                width={{ base: "125px", md: "250px" }}
                height={"auto"}
                objectFit="cover"
              />
              <div className="button__cat">
                <Text fontWeight={"150px"} fontSize={"xl"}>
                  {val.CAT_NAME}
                </Text>
              </div>
            </Box>
          ))}
        </Flex>
      </Box>
      <Box display={nextStep ? "block" : "none"}>
        {isLoading && <h1>Cargando</h1>}
        {isError && <h1>Error</h1>}
        <Flex>
          <IconButton aria-label='Search database' onClick={handleReturn} icon={<IoArrowBack />} />
          <Input value={busqueda} onChange={handleChage} />
        </Flex>
        {//@ts-ignore
          usuarios.message && <h1>No se encontro resultados, asugurece de tener Stock o una Lisa de Precios activa</h1>}
        <Flex gap={5} overflowX={"auto"} className="category_scroll" overflowY={"hidden"}>
          {//@ts-ignore
            !(usuarios.message) && usuarios.map((val: any, idx: number) => (
              <Box
                key={idx}
                className="contenedor__cat other__cat"
                onClick={() => {
                  handleAdd({ valor: val, val });
                }}
              >
                <Image
                  src={
                    val.PRO_IMAGE
                  }
                  alt={val.PRO_NAME}
                  width={{ base: "125px", md: "250px" }}
                  height={"auto"}
                  objectFit="cover"
                />
                <div className="button__cat">
                  <Text fontWeight={"150px"} fontSize={"xl"}>
                    {val.PRO_NAME}
                  </Text>
                </div>
              </Box>
            ))}
        </Flex>
      </Box>

    </>
  );
};

/* 
export const CategoriaCompHeader = (categorias: ICategoria[]) => {
  const { data, isLoading, refetch } = useQuery('categories', getCategories)
  return (
    <>
      <div className="dropdown">
        <button className="dropbtn">Dropdown</button>
        <div className="dropdown-content">
          {data.map((val: any) =>
            <a href="#">{val.CAT_NAME}</a>
          )}
        </div>
      </div>

    </>)
} */
