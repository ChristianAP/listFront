import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ClientState, NavClient } from '../../../Data/Atoms/Client';
import {
  Box,
  Button,
  Circle,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  Tooltip,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  TableCaption,
  Select,
} from '@chakra-ui/react';
import { BsFillEyeFill, BsPlusSquare } from 'react-icons/bs';
import { MdAddAPhoto } from 'react-icons/md';
import {
  ModalAlertMessage,
  MyModalAlert,
} from '../../../Admin/UI/Components/ModalAlert/MyModal';
import { ListStatus } from '../../../Service/Tickets';
import {
  ClientCreateTicket,
  NewTicket,
  StatusTicket,
} from '../../../Model/Tickets';
import { MyContain } from '../../../Admin/UI/Components/MyContain';
import {
  CreateTicketTiendaOnline,
  CreateTicketTiendaOnlineWithImage,
  ListSoporteByIdPerson,
} from '../../../Service/TiendaOnlineService';
import { socketApi } from '../../../Routes/Admin/Socket';
import { ViewTicketClient } from './viewTicket';
import { useQuery } from 'react-query';

export const Soporte = () => {
  const setNavClient = useSetRecoilState(NavClient);
  const [reset, setReset] = useState(true);
  useEffect(() => {
    setNavClient(true);
  }, []);
  return (
    <Box id='asdd' padding={{ base: '3', md: '10', lg: '16' }}>
      <MyContain overflowX='scroll'>
        <HeaderTicket setReset={setReset} />
        <SoporteTable reset={reset} />
      </MyContain>
    </Box>
  );
};

const HeaderTicket = ({ setReset }: { setReset: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('lg');
  const [viewModal, setViewModal] = useState(false);
  const [messageModal, setMessageModal] = useState();
  const [statusModal, setStatusModal] = useState('');
  const [image, setImage] = useState([])
  const [client, setClient] = useRecoilState(ClientState);
  const [listStatus, setStatus] = useState<StatusTicket[]>([]);

  const [ticket, setTicket] = useState<ClientCreateTicket>({
    STC_ID: '1',
    USR_ID: null,
    PER_ID: null,
    TCK_DESCRIPTION: '',
    TCK_FINAL_LOCATION: '',
    TCK_PETITIONER: '',
    TCK_SUPPORT_TYPE: null,
    TCK_TAG: null,
  });

  async function getStatus() {
    let liststatus = await ListStatus();
    if (!liststatus.status) {
      await setStatus(liststatus);
    }
  }

  function handleChangeSelect(
    name: any,
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }

  function handleChangeInput(
    name: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }

  function handleChangeTextArea(
    name: any,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setTicket({
      ...ticket,
      [name]: e.target.value,
    });
  }
  function handleChangeFile(
    e: any
  ) {
    setImage(e.target.files)
  }

  async function saveTicket() {
    let createTicket = await CreateTicketTiendaOnline(ticket);

    if (createTicket.data) {
      if (image[0]) {
        let formData = new FormData();
        //@ts-ignore
        formData.append('IMAGE', image[0]);
        //@ts-ignore
        formData.append('TCK_ID', createTicket.data);
        let createEvidence = await CreateTicketTiendaOnlineWithImage(formData);
      }
      setMessageModal(createTicket.message);
      socketApi.emit('createTicketClient', {
        id: createTicket.data,
        client: client.iu,
        asunto: ticket.TCK_DESCRIPTION,
        date: '',
        hour: '',
        type: 'new',
      });
      setStatusModal('success');
      setViewModal(true);
      await clearInputs();
      setReset(false);
      onClose()
    } else {
      setMessageModal(createTicket.message);
      setStatusModal('error');
      setViewModal(true);
      onClose()
    }
    setTimeout(() => {
      setViewModal(false);
    }, 3000);
  }

  function clearInputs() {
    setTicket({
      STC_ID: '1',
      USR_ID: null,
      PER_ID: '2',
      TCK_DESCRIPTION: '',
      TCK_FINAL_LOCATION: '',
      TCK_PETITIONER: '',
      TCK_SUPPORT_TYPE: null,
      TCK_TAG: null,
    });
    setImage([])
  }

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <>
      {viewModal == true ? (
        <>
          <ModalAlertMessage
            message={messageModal}
            status={statusModal}
            icon={<AlertIcon boxSize='40px' mr={0} />}
            buttons={
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                SALIR
              </Button>
            }
          />
        </>
      ) : (
        <></>
      )}
      <Button onClick={onOpen} colorScheme='teal' variant='ghost'>
        <Circle size='40px' color='gray.900'>
          <BsPlusSquare />
        </Circle>
        Agregar
      </Button>
      <Flex
        alignItems='center'
        justifyContent='space-around'
        width='100%'
        m={2}>
        <Stack direction='row'>
          <Heading as='h4' size='md'>
            Mis Tickets
          </Heading>
        </Stack>
      </Flex>
      <Drawer onClose={onClose} isOpen={isOpen} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Crear Ticket</DrawerHeader>
          <DrawerBody>
            <br />
            <FormControl>
              <FormLabel>Asunto</FormLabel>
              <Input
                placeholder='Aqui va el asunto'
                onChange={(e: any) => handleChangeInput('TCK_PETITIONER', e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                placeholder='Aqui va una Descripción'
                onChange={(e: any) => handleChangeTextArea('TCK_DESCRIPTION', e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Lugar</FormLabel>
              <Input
                placeholder='Aqui va el lugar'
                onChange={(e: any) => handleChangeInput('TCK_FINAL_LOCATION', e)}
              />
            </FormControl>
            <br />
            <FormControl>
              <FormLabel>Tipo de soporte</FormLabel>
              <Select w='250px' placeholder='Selecciona un estado' onChange={(e: any) => handleChangeSelect('TCK_SUPPORT_TYPE', e)}>
                <option key='1' value='Producto Dañado'>Producto Dañado</option>
                <option key='2' value='Producto Vencido'>Producto Vencido</option>
              </Select>
            </FormControl>
            <br />
            <Button
              size='md'
              height='48px'
              width='200px'
              border='2px'
              borderColor='green.500'>
              <input type='file' name='imagen' onChange={(e: any) => handleChangeFile(e)} />{' '}
              <MdAddAPhoto className='evidence' type='file' />
            </Button>
            <br />
            <br />
            <Flex justifyContent='flex-end' width='100%'>
              <FormControl width='220px'>
                <Button colorScheme='blue' mr={3} onClick={saveTicket}>
                  Agregar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
              </FormControl>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const SoporteTable = ({ reset }: { reset: any }) => {
  const [ticket, setTickets] = useState<NewTicket[]>([]);
  let { data, isLoading, refetch } = useQuery('ticketsSoporte', ListSoporteByIdPerson, { refetchOnWindowFocus: false })

  useEffect(() => {
    refetch()
  }, [reset]);
  if (isLoading) { return (<MyModalAlert message='Cargando Tickets ...' />) }
  if (data.status) { return (<Text>{data.message}</Text>) }
  return (
    <>
      <Table colorScheme='gray'>
        <Thead background='gray.300'>
          <Tr>
            <Th>Estado</Th>
            <Th>Asunto</Th>
            <Th>Solicitado</Th>
            <Th>Lugar de solicitud</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((value: any, idx: number) => {
            return (
              <Tr key={idx}>
                <Td>
                  <Flex display='-webkit-box'>
                    <EstadoTicket
                      estado={value.ESTADO}
                      descripcionEstado={value.STATUS_DES}
                    />
                  </Flex>
                </Td>
                <Td>{value.ASUNTO}</Td>
                <Td>{value.SOLICITADO}</Td>
                <Td>{value.LOCACION}</Td>
                <Td>
                  <ViewTicketClient
                    idTicket={value.ID}
                    icon={
                      <>
                        <BsFillEyeFill />
                      </>
                    }
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <TableCaption>Nuevos Tickets</TableCaption>
      </Table>
    </>
  );
};

const MyViewStatus = ({ status, tooltip }: { status: any; tooltip: any }) => {
  let color;
  let text;
  if (status == 'NUEVO') {
    color = '#FFB648';
    text = 'N';
  } else if (status == 'ABIERTO') {
    color = '#E34F32';
    text = 'A';
  } else if (status == 'PENDIENTE') {
    color = '#3091EC';
    text = 'P';
  } else if (status == 'CERRADO') {
    color = '#87929D';
    text = 'C';
  }
  return (
    <>
      <Tooltip hasArrow label={tooltip} bg={color}>
        <Box
          w='100%'
          bg={color}
          color='white'
          marginLeft={1}
          paddingLeft={1}
          paddingRight={1}
          borderRadius={5}
          textAlign='center'>
          {text}
        </Box>
      </Tooltip>
    </>
  );
};

const EstadoTicket = ({ estado, descripcionEstado }: any) => {
  if (estado == 'NUEVO') {
    return (
      <Box>
        <MyViewStatus status={estado} tooltip={descripcionEstado} />
      </Box>
    );
  } else if (estado == 'PENDIENTE') {
    return (
      <Box>
        <MyViewStatus status={estado} tooltip={descripcionEstado} />
      </Box>
    );
  } else if (estado == 'CERRADO') {
    return (
      <Box>
        <MyViewStatus status={estado} tooltip={descripcionEstado} />
      </Box>
    );
  } else if (estado == 'ABIERTO') {
    return (
      <Box>
        <MyViewStatus status={estado} tooltip={descripcionEstado} />
      </Box>
    );
  } else {
    return (
      <Box>
        <MyViewStatus status={estado} tooltip={descripcionEstado} />
      </Box>
    );
  }
};
