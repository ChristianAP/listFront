import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Box,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

export const flavourOptions = [
  { value: "vanilla", label: "Vanilla", rating: "safe" },
  { value: "chocolate", label: "Chocolate", rating: "good" },
  { value: "strawberry", label: "Strawberry", rating: "wild" },
  { value: "salted-caramel", label: "Salted Caramel", rating: "crazy" },
];

// @ts-ignore
export const ProviderSearchSelectInput = ({
  searchClick,
  handleChange,
  values,
  loading,
  data,
  label,
  ...props
}: any) => {
  // // @ts-ignore
  // const [field, meta] = useField(props);

  // const formikProps = useFormikContext();

  // const changeInput = (value: any) => {
  //   formikProps.setFieldValue(field.name, value);
  // };

  return (
    <>
      <FormControl p={4}>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type="text"
            placeholder="Ingresa un nombre"
            value={values}
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={searchClick}
              isDisabled={loading}
              isLoading={loading}
            >
              Buscar
            </Button>
          </InputRightElement>
        </InputGroup>
        <Select
          name="Busqueda"
          placeholder="Selecciona una opción"
          size="sm"
          display={data ? "flex" : "none"}
        >
          {data ? (
            data.map((item: any, idx: any) => (
              <option key={idx} value={item.PER_ID}>
                {item.PER_NAME + " " + item.PER_LASTNAME}
              </option>
            ))
          ) : (
            <></>
          )}
        </Select>
      </FormControl>
    </>
  );
};

// export const SearchSelectInput = ({ data, getData, setData }: any) => {
//   function asd(items: any) {
//     console.log("data", data);
//     console.log("items", items);
//   }

//   function handleChangeSelect() {
//     console.log("name");
//     // [name]: e.target.value
//   }
//   return (
//     <>
//       <FormLabel htmlFor="persona" width={{ base: "100%", md: "100%" }}>
//         <InputGroup>
//           <InputLeftElement pointerEvents="none" children={<FaUserPlus />} />
//           {/* @ts-ignore */}
//           <Input
//             onChange={getData}
//             id="persona"
//             type="search"
//             placeholder="Nombres o Razón Social"
//             list="ice-cream-flavors"
//           />
//           <datalist id="ice-cream-flavors">
//             {data.isLoading ? (
//               <option value="Cargando..." />
//             ) : !data.data.message ? (
//               data.data.map((item: any, idx: any) => {
//                 return (
//                   <option
//                     key={idx}
//                     value={
//                       item.PER_TRADENAME
//                         ? item.PER_TRADENAME
//                         : item.PER_NAME + " " + item.PER_LASTNAME
//                     }
//                   >
//                     {item.PER_DNI
//                       ? `DNI: ${item.PER_DNI}`
//                       : `RUC:  ${item.PER_RUC}`}
//                   </option>
//                 );
//               })
//             ) : (
//               <option value={data.data.message}>404</option>
//             )}
//           </datalist>
//         </InputGroup>
//       </FormLabel>
//     </>
//   );
// };
