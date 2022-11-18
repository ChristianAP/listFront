import { Badge, Box, Flex, Spacer } from "@chakra-ui/react";
import React from "react";

export const VerifiedVoucher = ({
  aprobacion,
  voucher,
}: {
  aprobacion?: any;
  voucher?: any;
}) => {
  let theVerifiedIs = "";
  let colorVerified = "";

  switch (aprobacion) {
    case "1":
      theVerifiedIs = "Voucher verificado";
      colorVerified = "green";
      break;
    case "2":
      theVerifiedIs = "Voucher rechazado";
      colorVerified = "red";
      break;
    default:
      theVerifiedIs = "Falta Verificación";
      colorVerified = "yellow";
      break;
  }

  return (
    <Box flex="1" textAlign="left">
      <Flex>
        <Box>
          <strong> Documento de Pago: </strong>
          {/* { voucher == null ? "Sin Voucher" : "Voucher Eliminado" } */}
          {voucher !== null
            ? "Voucher Adjunto"
            : voucher === null
            ? "Sin Voucher"
            : "Voucher Eliminado"}
        </Box>
        <Spacer />
        <Box pr={4}>
          <strong> Verificación: </strong>
          <Badge colorScheme={colorVerified} variant="outline">
            {theVerifiedIs}
          </Badge>
        </Box>
      </Flex>
    </Box>
  );
};
