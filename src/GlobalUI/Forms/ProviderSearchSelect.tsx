import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  useAutoComplete,
} from "@choc-ui/chakra-autocomplete";
import { useField, useFormikContext } from "formik";
import React, { useEffect, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";

// @ts-ignore
export const ProviderSearchSelect = ({ itemClick, getdata, loading, data, label, ...props }) => {
  const formikProps = useFormikContext();
  // @ts-ignore
  const [field, meta] = useField(props);

  const changeInput = (value: any) => {
    formikProps.setFieldValue(field.name, value);
  };
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` apunta al elemento de entrada de texto montado
    //@ts-ignore
    inputEl.current.focus();
  };

  return (
    <AutoComplete emptyState={<Center>No Hay Resultados 😢</Center>} openOnFocus>
      <FormControl>
        <Flex alignItems={"center"} gap={"5px"}>
          <AutoCompleteInput
            ref={inputEl}
            {...field}
            autoComplete="off"
            placeholder={props.placeholder}
            onKeyUp={(e: any) => {
              console.log(e.target.value);
              setTimeout(() => {
                getdata(e.target.value)
              }, 2000);

            }}
            variant="filled"
          />
          <Button
            h="1.75rem"
            size="sm"
            onClick={onButtonClick}
          >
            <BiSearchAlt />
          </Button>
        </Flex>
        <AutoCompleteList>
          {!loading && data ? (
            data.length > 0 ? (
              data.map((option: any, oid: any) => (
                <AutoCompleteItem
                  key={`option-${oid}`}
                  value={option}
                  label={option.PER_DNI + " - " + option.PER_NAME}
                  textTransform="capitalize"
                  // @ts-ignore
                  onClick={() => itemClick(option, changeInput)}
                >
                  <Box alignItems={'start'} textAlign={'start'}>
                    <Text fontSize="sm" fontWeight={'bold'}>
                      {option.PER_TRADENAME
                        ? option.PER_TRADENAME
                        : option.PER_NAME + " " + option.PER_LASTNAME}
                    </Text>
                    <Text fontSize="xs">
                      {option.PER_DNI
                        ? `DNI: ${option.PER_DNI}`
                        : `RUC:  ${option.PER_RUC}`}
                    </Text>
                  </Box>
                </AutoCompleteItem>
              ))
            ) : (
              <Skeleton height="35%" borderRadius="5px" />
            )
          ) : (
            <Skeleton height="35%" borderRadius="5px" />
          )}
        </AutoCompleteList>
        <FormErrorMessage>{"a"}</FormErrorMessage>
      </FormControl>
    </AutoComplete>

  );
};

// @ts-ignore
export const ProductSearchSelect = ({ itemClick, setPro, pro, loading, data, label, product, ...props }) => {
  const formikProps = useFormikContext();

  // @ts-ignore
  const [field, meta] = useField(props);
  if (data && !data.status) {
    //@ts-ignore
    console.log(data.filter(el => !product.includes(el)), product, data);
  }

  const changeInput = (value: any) => {
    formikProps.setFieldValue(field.name, value);
  };
  return (
    <AutoComplete openOnFocus>
      <FormControl>
        <AutoCompleteInput
          {...field}
          placeholder={props.placeholder}
          autoComplete={"off"}
          onChange={(e: any) => setPro(e.target.value)}
          onKeyUp={(e: any) => setPro(e.target.value)}
          value={pro}
          variant="filled"
        />
        <Box position={"fixed"} zIndex={"99"}>
          <AutoCompleteList>
            {!loading && data ? (
              data.length > 0 ? (
                //@ts-ignore
                data.filter(el => !product.includes(el)).map((option: any, oid: any) => (
                  <AutoCompleteItem
                    key={`option-${oid}`}
                    value={option}
                    label={option.PRO_NAME + " - " + option.PRO_CREATE_DATE}
                    textTransform="capitalize"
                    // @ts-ignore
                    onClick={() => itemClick(option, changeInput)}
                  >
                    <Flex>
                      <Image src={option.PRO_IMAGE} height={"50px"} />
                      <Box alignItems={'start'} textAlign={'start'}>
                        <Text fontSize="sm" fontWeight={'bold'}>
                          {option.PRO_BARCODE}
                        </Text>
                        <Text fontSize="xs">
                          {option.PRO_NAME + " " + option.PRO_CREATE_DATE}
                        </Text>
                      </Box>
                    </Flex>
                  </AutoCompleteItem>
                ))
              ) : (
                <Skeleton height="35%" borderRadius="5px" />
              )
            ) : (
              <></>
            )}
          </AutoCompleteList>
        </Box>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </AutoComplete>
  );
};
