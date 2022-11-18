import {
  Button,
  DrawerBody,
  HStack,
  FormControl,
  Skeleton,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { MySelect, MyTextInput } from "../../../../GlobalUI/Forms/MyInputs";
import { EditarCliente } from "../../../../Service/ClienteService";
import { EditPersona } from "../../../../Service/PersonService";
import { useQuery } from "react-query";
import { getListClient } from "../../../../Service/PriceListAdminService";

export const EditCliente = ({
  reload,
  personType,
  grupo,
  clasificacion,
  viewcliente,
  onclose,
}: {
  reload: any;
  children?: ReactNode;
  category?: any;
  personType?: any;
  grupo?: any;
  clasificacion?: any;
  viewcliente?: any;
  onclose?: any;
}) => {
  const [isLoading, setLoading] = useState(false);
  const { data: listClient, isLoading: loadingListClient } = useQuery('listClient', getListClient, { refetchOnWindowFocus: false })

  return (
    <>
      <DrawerBody>
        <Formik
          initialValues={viewcliente}
          // validationSchema={validate}
          onSubmit={async (values: any) => {
            setLoading(true);
            await EditarCliente(viewcliente.CLI_ID, {
              //GRO_ID: values.GRO_ID,
              CLA_ID: values.CLA_ID,
            });
            delete values["GRO_ID"];
            delete values["CLA_ID"];
            delete values["PER_ID"];
            delete values["CLI_ID"];
            await EditPersona(viewcliente.PER_ID, {
              values,
            });
            await reload();
            await onclose();
          }}>
          <Form>
            <HStack spacing="20px">
              <FormControl>
                <MySelect label="TIPO DE CLIENTE" name="PET_ID">
                  {personType?.map((value: any, idx: any) => {
                    if (Number(value.PET_ID) == viewcliente.PET_ID) {
                      return (
                        <option key={idx} value={value.PET_ID} selected={true}>
                          {value.PET_NAME}{" "}
                        </option>
                      );
                    } else {
                      return (
                        <option key={idx} value={value.PET_ID}>
                          {value.PET_NAME}{" "}
                        </option>
                      );
                    }
                  })}
                </MySelect>
              </FormControl>
              <FormControl>
                {grupo ?
                  <MySelect label="Forma de Pago" name="PMT_ID">
                    {grupo?.map((value: any, idx: any) => {
                      if (Number(value.PMT_ID) == viewcliente.PMT_ID) {
                        return (
                          <option key={idx} value={value.PMT_ID} selected={true}>
                            {value.PMT_NAME}{" "}
                          </option>
                        );
                      } else {
                        return (
                          <option key={idx} value={value.PMT_ID}>
                            {value.PMT_NAME}{" "}
                          </option>
                        );
                      }
                    })}
                  </MySelect> : <Skeleton height="20px" w={40} />}

              </FormControl>
              <FormControl>
                {clasificacion ?
                  <MySelect label="CLASIFICACIÓN DE CLIENTE" name="CLA_ID">
                    {clasificacion?.map((value: any, idx: any) => {
                      if (Number(value.CLA_ID) == viewcliente.CLA_ID) {
                        return (
                          <option key={idx} value={value.CLA_ID} selected={true}>
                            {value.CLA_NAME}{" "}
                          </option>
                        );
                      } else {
                        return (
                          <option key={idx} value={value.CLA_ID}>
                            {value.CLA_NAME}{" "}
                          </option>
                        );
                      }
                    })}
                  </MySelect> : <Skeleton height="20px" w={40} />}
              </FormControl>
              <FormControl>
                <MySelect
                  label="ASIGNAR LISTA DE PRECIO"
                  name="LCT_ID"
                  placeholder="Seleccione una lista de precio para el cliente"
                // //@ts-ignore
                // onChange={(event) => {
                //   setClienteForm({
                //     ...clienteForm,
                //     CLA_ID: event.target.value,
                //   });
                // }}
                >
                  {listClient?.map((value: any, idx: any) => (
                    <option key={idx} value={value.LCT_ID}>
                      {value.LCT_NAME}{" "}
                    </option>
                  ))}
                </MySelect>
              </FormControl>
            </HStack>

            <br />
            <HStack spacing="20px">
              <FormControl>
                <MyTextInput
                  label="NOMBRES COMPLETOS"
                  name="PER_NAME"
                  type="text"
                />
              </FormControl>
              <FormControl>
                <MyTextInput
                  label="APELLIDOS COMPLETOS"
                  name="PER_LASTNAME"
                  type="text"
                />
              </FormControl>
            </HStack>
            <br />
            <HStack spacing="20px">
              <FormControl>
                <MyTextInput
                  label="NOMBRE COMERCIAL"
                  name="PER_TRADENAME"
                  type="text"
                />
              </FormControl>
              <FormControl>
                <MyTextInput
                  label="EMAIL"
                  name="PER_EMAIL"
                  type="email"
                  required={true}
                />
              </FormControl>
            </HStack>
            <br />
            <HStack spacing="20px">
              <FormControl>
                <MyTextInput label="DNI" name="PER_DNI" type="number" />
              </FormControl>
              <FormControl>
                <MyTextInput label="RUC" name="PER_RUC" type="number" />
              </FormControl>
              <FormControl>
                <MyTextInput
                  label="N° CELULAR"
                  name="PER_N_PHONE"
                  type="number"
                />
              </FormControl>
            </HStack>
            <br />
            <HStack spacing="20px">
              <FormControl>
                <MyTextInput
                  label="DIRECCIÓN"
                  name="PER_DIRECTION"
                  type="text"
                />
              </FormControl>
              <FormControl>
                <MyTextInput
                  label="DEPARTAMENTO"
                  name="PER_DEPARTMENT"
                  type="text"
                />
              </FormControl>
              <FormControl>
                <MyTextInput
                  label="PROVINCIA"
                  name="PER_PROVINCE"
                  type="text"
                />
              </FormControl>
            </HStack>
            <br />
            <HStack spacing="20px">
              <FormControl>
                <MyTextInput label="DISTRITO" name="PER_DISTRIC" type="text" />
              </FormControl>
              <FormControl>
                <MyTextInput label="PAÍS" name="PER_COUNTRY" type="text" />
              </FormControl>
            </HStack>
            <br />
            <FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                mr={3}
                isLoading={isLoading}
                isDisabled={isLoading}
                disabled={isLoading}>
                Editar
              </Button>
              <Button onClick={onclose}>Cancelar</Button>
            </FormControl>
          </Form>
        </Formik>
      </DrawerBody>
    </>
  );
};
