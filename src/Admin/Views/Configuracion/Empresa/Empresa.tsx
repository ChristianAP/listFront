import {
  Grid,
  Box,
  Text,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { CgExtensionAdd } from "react-icons/cg";

import { getCompany } from "../../../../Service/CompanyService";
import { CreateCompanyModal } from "./CreateCompany";

import { ConfiguracionImpresion } from "./ConfiguracionImpresion";
import { ConfiguracionComprobante } from "./ConfiguracionComprobante";
import { DatosEmpresa } from "./DatosEmpresa";
import { PersonaContacto } from "./PersonaContacto";
export const Empresa = () => {
  useEffect(() => {
    //@ts-ignore
    document.getElementById('title_view').textContent = 'Empresa';
  }, [])

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    "company",
    getCompany,
    { refetchOnWindowFocus: false }
  );

  if (isLoading || isFetching) return <></>;

  if (data.status == 404)
    return (
      <>
        <Grid gap="1rem">
          <CreateCompanyModal>
            <Center height="500px">
              <Box
                background="white"
                borderRadius="20px"
                color="gray"
                cursor="pointer">
                <CgExtensionAdd size="150px" />
                <Center p={ 2 }>
                  <Text
                    //@ts-ignore
                    size="10px"
                  > Añadir Empresa </Text>
                </Center>
              </Box>
            </Center>
          </CreateCompanyModal>
        </Grid>
      </>
    );

  // @ts-ignore
  if (isError) return <h1>{ error.message } </h1>;

  return (
    <>
      <Grid gap="1rem">
        <Box background="white" borderRadius="10px" p={ 4 }>
          <Tabs>
            <TabList>
              <Tab>Configuración Comprobantes</Tab>
              <Tab>Datos de Empresa</Tab>
              <Tab>Datos de Persona de Contacto</Tab>
              <Tab isDisabled>Configuración Impresión</Tab>
            </TabList>
            <TabPanels>
              <TabPanel> <ConfiguracionComprobante /></TabPanel>
              <TabPanel><DatosEmpresa data={ data } /></TabPanel>
              <TabPanel><PersonaContacto data={ data } /></TabPanel>
              <TabPanel><ConfiguracionImpresion /></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Grid>
    </>
  );
};
