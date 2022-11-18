import { Box } from "@chakra-ui/react";
import { Formik } from "formik";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { ProviderSearchSelect } from "../../../../GlobalUI/Forms/ProviderSearchSelect";
import { searchPersonByDocument } from "../../../../Service/PersonService";

export const SearchClient = (props: any) => {
  const [searcher, setSearcher] = React.useState({ searcher: "" });

  // This function is for the search client and yes, is a async function and important
  const busquedaPersona = useQuery(
    ["personSearch", searcher],
    () => mutateAsync(searcher),
    { refetchOnWindowFocus: false }
  );

  const {
    mutateAsync,
    data = [],
    isLoading,
  } = useMutation(searchPersonByDocument);
  
  const fnSetFormDetalle = (data: any) => {
    console.log("CLIENTE DE LISTA SELECCIONADO ... ", data);
    
    props.SetFormDetalle({
      ...props.formDetalle,
      PER_ID: data.PER_ID,
      idCliente:
        data.PER_RUC && data.PER_RUC !== "-" ? data.PER_RUC : data.PER_DNI,
      razonSocial: data.PER_TRADENAME
        ? data.PER_TRADENAME
        : data.PER_NAME + " " + data.PER_LASTNAME,
      direccion: data.PER_DIRECTION ? data.PER_DIRECTION : "",
      metodoPago: data.PMT_ID ? data.PMT_ID : 5,
      adicionalPago: data.PMT_PRICE ? data.PMT_PRICE : 0,
      LCT_ID : data.LCT_ID
    });
  };

  function getDataSearch(event: any) {
    if (event != "") {
      setSearcher({ searcher: event });
    }
  }

  return (
    <>
      <Box>
        <Formik initialValues={{}} onSubmit={() => undefined}>
          <ProviderSearchSelect
            loading={isLoading}
            data={data}
            label="Cliente"
            getdata={getDataSearch}
            // @ts-ignore
            itemClick={(option, func) => {
              let {
                PER_ID,
                PMT_ID,
                PER_DNI,
                PER_RUC,
                PER_NAME,
                PMT_PRICE,
                PER_LASTNAME,
                PER_TRADENAME,
                PER_DIRECTION,
                LCT_ID
              } = option;
              fnSetFormDetalle(option);
            }}
            placeholder="Buscar Cliente"
            name="search"
            id="search"
          />
        </Formik>
      </Box>
    </>
  );
};
