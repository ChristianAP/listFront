import React from "react";
import { TableHeadProps, Thead as ChakraThead } from "@chakra-ui/react";

export const Thead = (props: TableHeadProps) => {
  const { children, ...rest } = props;

  return (
    <ChakraThead {...rest}>
      {React.isValidElement(children) &&
      // @ts-ignore
        React.cloneElement(children, { inHeader: true })}
    </ChakraThead>
  );
};
