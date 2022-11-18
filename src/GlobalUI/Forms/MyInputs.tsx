import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Textarea,
  Select,
  Skeleton,
  InputGroup,
  Text,
  Box,
  InputRightElement,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { useField, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai";
import { BsEye, BsEyeSlash, BsUpload } from "react-icons/bs";
import "./MyInputs.css";
// @ts-ignore
export const MyTextInput = ({ label, ...props }) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    // @ts-ignore
    <FormControl isInvalid={meta.touched && meta.error} isDisabled={props.active ? props.active : false} display={props.active ? 'none' : 'block'}>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Input {...field} {...props} variant="filled" />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

// @ts-ignore
export const MyPasswordArea = ({ label, ...props }) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    // @ts-ignore
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Ingresar contraseña"
          variant="filled"
          {...field}
          {...props}
        />
        <InputRightElement width="4.5rem">
          {show ? <IconButton onClick={handleClick} aria-label='Search database' icon={<BsEye />} /> :
            <IconButton onClick={handleClick} aria-label='Search database' icon={<BsEyeSlash />} />}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

// @ts-ignore
export const MyTextArea = ({ label, ...props }) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    // @ts-ignore
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Textarea {...field} {...props} variant="filled" />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

// @ts-ignore
export const MyCheckbox = ({ children, ...props }) => {
  // @ts-ignore
  const [field, meta] = useField(props);

  return (
    // @ts-ignore
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel htmlFor={props.id || props.name}></FormLabel>
      <Checkbox defaultChecked={field.value} {...field} {...props}>
        {children}
      </Checkbox>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

// @ts-ignore
export const MySelect = ({ label, ...props }) => {
  // @ts-ignore
  const [field, meta] = useField(props);
  return (
    // @ts-ignore
    <FormControl isInvalid={meta.touched && meta.error} isDisabled={props.active ? props.active : false} >
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Select variant="filled" {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export const MyImageInput = ({
  image,
  setImage,
  setFile,
}: {
  image: string;
  setImage: (val: string) => void;
  setFile?: any;
}) => {
  const [prev, setPrev] = useState(image);

  const [load, setLoad] = useState(false);

  const file = useRef(null);

  const handleFile = () => {
    // @ts-ignore
    file.current.click();
  };

  const handleImage = () => {
    // @ts-ignore
    setPrev(URL.createObjectURL(file.current.files[0]));
    // @ts-ignore
    // @ts-ignore
    setImage(file.current.files[0]);
    getBase64Image(file.current);
  };
  //@ts-ignore
  function getBase64Image(element) {
    var file = element.files[0];
    setFile(element.files);
    var reader = new FileReader();
    reader.onloadend = function () {
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <FormControl mb={3}>
        <FormLabel>Imagen</FormLabel>
        <Button
          w="full"
          leftIcon={<BsUpload />}
          variant="solid"
          onClick={handleFile}>
          Subir Imagen
        </Button>
        <Input ref={file} type="file" hidden onChange={handleImage} />
      </FormControl>
      <Skeleton isLoaded={load} height="full">
        <Image
          m="auto"
          id="img"
          onLoad={() => setLoad(true)}
          w="full"
          src={prev}
          alt="Imagen :v"
        />
      </Skeleton>
    </>
  );
};

export const InputMessage = ({
  setMessage,
  sendMessage,
  message,
  sendMessageStatus,
}: {
  setMessage?: any;
  sendMessage?: any;
  message?: any;
  sendMessageStatus?: any;
}) => (
  <FormControl>
    <Flex color="white">
      <Box flex="1" color="black" marginRight="20px">
        <Input
          className="input"
          type="text"
          placeholder="Escribe tu mensaje"
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
      </Box>

      <Button
        disabled={sendMessageStatus}
        isLoading={sendMessageStatus}
        colorScheme="blue"
        onClick={(e) => sendMessage(e)}>
        ENVIAR <AiOutlineSend style={{ marginLeft: "10px" }} />
      </Button>
    </Flex>
  </FormControl>
);

export const InputSearch = ({
  dataGet,
  valueSearch,
  selectedValue,
  setValueSearch,
  sendValueSearch,
  sendMessageStatus,
}: {
  dataGet?: any;
  valueSearch?: any;
  selectedValue?: any;
  setValueSearch?: any;
  sendValueSearch?: any;
  sendMessageStatus?: any;
}) => {
  return (
    <FormControl>
      <Flex color="white">
        <Box flex="1" color="black">
          <InputGroup size="md">
            <Input
              className="input"
              type="text"
              color="black"
              mr={4}
              placeholder="Escribe para empezar a buscar"
              value={valueSearch}
              onChange={({ target: { value } }) => setValueSearch(value)}
              onKeyPress={(event) =>
                event.key === "Enter" ? sendValueSearch(event) : null
              }
            />
            <InputRightElement width="4.5rem" mr={2}>
              <Button
                h="1.75rem"
                size="sm"
                disabled={sendMessageStatus}
                isLoading={sendMessageStatus}
                onClick={(e) => sendValueSearch(e)}>
                <AiOutlineSearch color="gray" />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Flex>
      <Box
        mt={1}
        className="dataSearch"
        display={dataGet.length != 0 ? "block" : "none"}>
        {dataGet.message ? (
          <>
            <Box
              _hover={{ backgroundColor: "gray.100" }}
              p={2}>
              <Text fontSize="md" color="red">
                No existen resultados, ingresa otro dato
              </Text>
            </Box>
          </>
        ) : (
          dataGet?.map((val: any, idx: any) => {
            return (
              <Box
                key={idx}
                _hover={{ backgroundColor: "gray.100" }}
                p={2}
                onClick={() => { selectedValue(val.PER_ID, val.PERSON) }}
                cursor="pointer">
                <Text>{val.PER_TRADENAME || val.PERSON}</Text>
              </Box>
            );
          })
        )}
      </Box>
    </FormControl>
  );
};

// @ts-ignore
export const ProviderSearchInput = ({ itemClick, loading, data, label, ...props }) => {
  // @ts-ignore
  const [field, meta] = useField(props);

  const formikProps = useFormikContext()

  const changeInput = (value: any) => {
    formikProps.setFieldValue(field.name, value)
  }

  return (
    <AutoComplete openOnFocus>
      {
        loading ? (
          <Skeleton height="35%" borderRadius="5px" />
        ) : (<>
          {/* @ts-ignore */}
          <FormControl isInvalid={meta.touched && meta.error} isDisabled={props.active ? props.active : false}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <AutoCompleteInput
              {...field}
              placeholder={props.placeholder}
              variant="filled"
            />
            <AutoCompleteList>
              {/* @ts-ignore */}
              {data
                .map((option: any, oid: any) => (
                  <AutoCompleteItem
                    key={`option-${oid}`}
                    value={option}
                    label={(option.PER_DNI == '' ? option.PER_RUC : option.PER_DNI) + " - " + option.PER_TRADENAME}
                    textTransform="capitalize"
                    // @ts-ignore
                    onClick={() => itemClick(option, changeInput)}
                  >
                    {option.PER_TRADENAME}
                  </AutoCompleteItem>
                ))}
            </AutoCompleteList>
            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        </>)
      }
    </AutoComplete>
  );
}
