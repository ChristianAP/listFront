import { Box, Center, HStack } from "@chakra-ui/react";
import React from "react";
import { AcceptVoucher } from "./AcceptVoucher";
import { CancelledOrder } from "./CancelledOrder";
import { RejectedVoucher } from "./RejectedVoucher";

export const VerficationOptions = ({ confirmar, rechazar, cancelar }: any) => {
  return (
    <Box>
      <Center>
        <HStack spacing={8}>
          <AcceptVoucher confirmar={confirmar} />

          <RejectedVoucher rechazar={rechazar} />

          <CancelledOrder cancelled={cancelar} />
        </HStack>
      </Center>
    </Box>
  );
};
