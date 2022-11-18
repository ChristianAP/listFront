import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  Input,
  Skeleton,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BsFileEarmarkMinus, BsPlusSquareFill } from "react-icons/bs";
import { InputMessage } from "../../../GlobalUI/Forms/MyInputs";
import {
  EvidenceTicket,
  MessageTicket,
  NewMessageTicket,
  NewMessageTicketClient,
  OneTicketClient,
} from "../../../Model/Tickets";
import { socketApi } from "../../../Routes/Admin/Socket";
import {
  GetOneTicket,
  GetAllMessageOfTicket,
  NewMessageOfTicket,
  NewMessageOfTicketClient,
} from "../../../Service/Tickets";

export const ViewTicketClient = ({
  icon,
  idTicket,
}: {
  icon?: React.ReactElement;
  idTicket?: any;
}) => {
  // REACTORES
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewemessages, setViewMessages] = useState<MessageTicket[]>([]);

  const [statusAccordion, setstatus] = useState(0);
  const [statusTicket, setstatusTicket] = useState(0);
  const [updateActivate, setupdateActivate] = useState(false);

  const [viewticket, setViewTicket] = useState<OneTicketClient>({
    STC_ID: "",
    PER_ID: "",
    TCK_DESCRIPTION: "",
    TCK_END_HOUR: "",
    TCK_FINAL_LOCATION: "",
    TCK_ID: "",
    TCK_PETITIONER: "",
    TCK_REQUEST_DATE: "",
    TCK_REQUEST_HOUR: "",
    TCK_VIEW_HOUR: "",
    TCK_STATUS: "",
    TCK_SUPPORT_TYPE: "",
    TCK_TAG: "",
    TTC_ID: "",
    USR_ID: "",
    IMAGE: "",
  });
  const [sendmessages, setSendMessages] = useState<NewMessageTicketClient>({
    TCK_ID: 0,
    USR_SEND: 0,
    MSS_MESSAGE: "",
  });

  /*
   * Variables de pruebas
   */
  const [messageInput, setMessageInput] = useState("");

  const sendMessageInput = (event: any) => {
    event.preventDefault();
    if (messageInput != "") {
      newMessage(idTicket);
      sendmessages.TCK_ID = Number(idTicket);
      sendmessages.MSS_MESSAGE = messageInput;
      socketApi.emit("sendMessage", sendmessages, (message: any) => {
        if (message.TCK_ID == idTicket) {
          setViewMessages((viewemessages) => [...viewemessages, message]);
        }
        setMessageInput("");
      });
    }
  };
  /*
   * Fin de variables
   */

  function handleChangeInput(
    name: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setSendMessages({
      ...sendmessages,
      [name]: e.target.value,
    });
  }

  async function getOneTicket(id: number | undefined) {
    if (id !== undefined) {
      let one = await GetOneTicket(id);
      if (!one.status) {
        await getMessages(id);
        await setViewTicket(one);
        await setstatusTicket(1);
      }
    }
  }

  async function getMessages(id: number) {
    let messages = await GetAllMessageOfTicket(id);
    await setViewMessages(messages);
    if (messages.status != 404) {
      setstatus(1);
    }
  }

  async function newMessage(idTicket: number) {
    sendmessages.TCK_ID = idTicket;
    sendmessages.USR_SEND = 1;
    sendmessages.MSS_MESSAGE = messageInput;
    let messages = await NewMessageOfTicketClient(sendmessages);
    if (!messages.message) {
      await getMessages(idTicket);
    }
    // onClose();
  }

  useEffect(() => {
    socketApi.on("messageSocketAdmin", (message) => {
      if (message.TCK_ID == idTicket) {
        setViewMessages((viewemessages) => [...viewemessages, message]);
      }
    });
  }, []);

  return (
    <>
      <Button
        onClickCapture={() => getOneTicket(idTicket)}
        onClick={onOpen}
        colorScheme="teal"
        variant="ghost">
        {icon}
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size={"xl"}>
        <DrawerOverlay />
        {statusTicket != 0 ? (
          <>
            <DrawerContent>
              <DrawerHeader>
                <Flex>
                  <Box p="2">
                    <Heading size="md"> TICKET N° {idTicket} </Heading>
                  </Box>
                  <HStack spacing={4} marginLeft="4">
                    <Tag size="md" variant="solid" colorScheme="teal">
                      {viewticket.TCK_SUPPORT_TYPE == null
                        ? "N/A"
                        : viewticket.TCK_SUPPORT_TYPE}
                    </Tag>
                    <Tag size="md" variant="solid" colorScheme="teal">
                      {viewticket.TCK_TAG == null ? "N/A" : viewticket.TCK_TAG}
                    </Tag>
                  </HStack>
                </Flex>
              </DrawerHeader>

              <DrawerBody>
                <Formik initialValues={viewticket} onSubmit={() => {}}>
                  <Form>
                    <FormControl>
                      <strong> ASUNTO </strong>
                      <Box>► {viewticket.TCK_PETITIONER}</Box>
                    </FormControl>
                    <br />
                    <FormControl>
                      <strong> DESCRIPCIÓN </strong>
                      <Box>{viewticket.TCK_DESCRIPTION}</Box>
                    </FormControl>
                    <br />
                    <Flex color="white">
                      <Box flex="1" color="black" marginRight="20px">
                        <FormControl>
                          <strong> SOLICITADO </strong>
                          <Box>►{viewticket.TCK_REQUEST_DATE}</Box>
                        </FormControl>
                      </Box>
                      <Box flex="1" width="150px" color="black">
                        <FormControl>
                          <strong> LUGAR DE SOLICITUD </strong>
                          <Box>► {viewticket.TCK_FINAL_LOCATION}</Box>
                        </FormControl>
                      </Box>
                    </Flex>
                    <br />
                    <Accordion allowMultiple>
                      <AccordionItem>
                        {({ isExpanded }) => (
                          <>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  EVIDENCIA
                                </Box>
                                {isExpanded ? (
                                  <BsFileEarmarkMinus fontSize="12px" />
                                ) : (
                                  <BsPlusSquareFill fontSize="12px" />
                                )}
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <AspectRatio maxW="400px" ratio={4 / 3}>
                                <Image
                                  src={viewticket.IMAGE}
                                  alt="evidencia"
                                  objectFit="cover"
                                />
                              </AspectRatio>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>
                    <br />

                    <Accordion allowMultiple>
                      <AccordionItem>
                        {({ isExpanded }) => (
                          <>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  MENSAJES
                                </Box>
                                {isExpanded ? (
                                  <BsFileEarmarkMinus fontSize="12px" />
                                ) : (
                                  <BsPlusSquareFill fontSize="12px" />
                                )}
                              </AccordionButton>
                            </h2>

                            <AccordionPanel pb={4}>
                              <Box
                                className="boxMessages"
                                id="boxMessages"
                                // mh="300px"
                                // overflowY="scroll"
                                pl={2}
                                pr={2}
                                mb={2}>
                                {statusAccordion == 0 ? (
                                  <>
                                    {" "}
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      mt={2}
                                      p={2}
                                      background="blue.50">
                                      SIN MENSAJES
                                    </Box>
                                  </>
                                ) : (
                                  viewemessages.map((mgs, idx) => {
                                    return (
                                      <>
                                        <Box key={idx}>
                                          <>
                                            <Box
                                              key={idx}
                                              bg={
                                                mgs.USR_SEND == 1
                                                  ? "#FFFAF0"
                                                  : "#E2E8F0"
                                              }
                                              w="100%"
                                              p={2}
                                              color="black"
                                              textAlign={
                                                mgs.USR_SEND == 1
                                                  ? "right"
                                                  : "left"
                                              }>
                                              {mgs.USR_SEND == 1 ? (
                                                <>
                                                  {mgs.MSS_MESSAGE}

                                                  <Avatar
                                                    size="sm"
                                                    name={
                                                      mgs.USR_SEND == 1
                                                        ? "Cliente"
                                                        : "Trabajador"
                                                    }
                                                    bg={
                                                      mgs.USR_SEND == 1
                                                        ? "gray"
                                                        : "teal.500"
                                                    }
                                                    color="white"
                                                    mr="2"
                                                    ml="2"
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <Avatar
                                                    size="sm"
                                                    name={
                                                      mgs.USR_SEND == 1
                                                        ? "Cliente"
                                                        : "Trabajador"
                                                    }
                                                    bg={
                                                      mgs.USR_SEND == 1
                                                        ? "gray"
                                                        : "teal.500"
                                                    }
                                                    color="white"
                                                    mr="2"
                                                    ml="2"
                                                  />
                                                  {mgs.MSS_MESSAGE}
                                                </>
                                              )}
                                            </Box>
                                            <Text
                                              fontSize="xs"
                                              textAlign={
                                                mgs.USR_SEND == 1
                                                  ? "right"
                                                  : "left"
                                              }>
                                              {mgs.MSS_DATE +
                                                " " +
                                                mgs.MSS_TIME}
                                            </Text>
                                            <br />
                                          </>
                                        </Box>
                                      </>
                                    );
                                  })
                                )}
                              </Box>
                              <Flex color="white">
                                <InputMessage
                                  sendMessage={sendMessageInput}
                                  setMessage={setMessageInput}
                                  message={messageInput}
                                />
                              </Flex>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>

                    <br />

                    <Divider />
                    <br />
                    <FormControl>
                      <Button onClick={onClose} ml={4}>
                        SALIR
                      </Button>
                    </FormControl>
                  </Form>
                </Formik>
              </DrawerBody>
            </DrawerContent>
          </>
        ) : (
          <>
            <DrawerContent>
              <DrawerHeader>
                <Flex>
                  <Box p="2">
                    <Heading size="md">
                      {" "}
                      <Skeleton isLoaded={false}>TICKET N° 1</Skeleton>{" "}
                    </Heading>
                  </Box>
                </Flex>
              </DrawerHeader>

              <DrawerBody>
                <Flex color="white">
                  <Box flex="1" color="black" marginRight="20px">
                    <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                  </Box>
                  <Box flex="1" width="150px" color="black">
                    <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                  </Box>
                </Flex>

                <br />
                <FormControl>
                  <Box>
                    <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                  </Box>
                </FormControl>
                <br />
                <Box>
                  <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                </Box>

                <br />
                <Box>
                  <Skeleton isLoaded={false}>CARGANDO... </Skeleton>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </>
        )}
      </Drawer>
    </>
  );
};

const EstadoTicket = ({ message }: any) => {};
