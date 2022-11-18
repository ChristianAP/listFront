import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";

// @ts-ignore
export const ProviderSearchInput = ({
  inputSearch,
  handleChangeSearch,
  searchData,
  loading,
  type,
  placeholder
}: any) => {
  return (
    <>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={type}
          placeholder={placeholder}
          value={inputSearch}
          onChange={handleChangeSearch}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={searchData}
            isDisabled={loading}
            isLoading={loading}
          >
            <BiSearchAlt />
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
