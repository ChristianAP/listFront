import {
  Box,
  Flex,
  Icon,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

// @ts-ignore
export const TransactionRow = ({
  type,
  name,
  date,
  logo,
  price,
  color,
  title,
}: any) => {
  const textColor = useColorModeValue("gray.700", "black");

  return (
    <Box m={0.5} p={2} width={{ sm: "full", md: "full", lg: "full" }}>
      <Flex alignItems="center">
        <Box
          me="12px"
          borderRadius="50%"
          color={colorType(type)}
          border="1px solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="35px"
          h="35px"
        >
          <Icon as={logo} />
        </Box>
        <Flex
          direction="row"
          justifyContent="space-between"
          backgroundColor={color}
          width={{ sm: "full", md: "full", lg: "full" }}
        >
          <Box margin={1}>
            <Text
              fontSize={{ sm: "md", md: "lg", lg: "md" }}
              color={textColor}
              fontWeight="bold"
            >
              {name}
            </Text>
            <Text
              fontSize={{ sm: "xs", md: "sm", lg: "xs" }}
              color="gray.400"
              fontWeight="semibold"
            >
              {date}
            </Text>
          </Box>
          <Box margin={1} color={colorType(type)}>
            <Text fontSize={{ sm: "md", md: "lg", lg: "md" }} fontWeight="bold">
              {title}
            </Text>
            <Text fontSize={{ sm: "md", md: "lg", lg: "md" }} fontWeight="bold">
              {price}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

// @ts-ignore
export const WarehuseRow = ({ type, name, logo, color }: any) => {
  const textColor = useColorModeValue("gray.700", "black");

  return (
    <Box padding={2} width={{ sm: "full", md: "full", lg:"sm" }}>
      <Flex alignItems="center">
        <Box
          me="12px"
          borderRadius="50%"
          color={colorType(type)}
          border="1px solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="35px"
          h="35px"
        >
          <Icon as={logo} />
        </Box>
        <Spacer />
        <Box
          width={{ sm: "full", md: "full"}}
          borderRadius="2%"
          backgroundColor={color}
          padding={2}
        >
          <Text
            fontSize={{ sm: "md", md: "lg", lg: "md" }}
            color={textColor}
            fontWeight="bold"
          >
            {name}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

const colorType = (type: any) => {
  // switch de type
  switch (type) {
    case "AI":
      return "green";
    case "S":
      return "red";
    case "ADB":
      return "blue";
    default:
      return "orange";
  }
};
