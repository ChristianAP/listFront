import { Box, Flex, Grid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { HeaderClient, NavClient } from '../../../Data/Atoms/Client';
import { ICategoria } from '../../../Model/Categoria';
import { IPromocion } from '../../../Model/Prociones';
import { ListPromotion } from '../../../Service/PromotionAdminService';
import { getCategories } from '../../../Service/TiendaOnlineService';
import { CategoriaComp } from '../../UI/Component/CategoriaComp';
import { Slider } from '../../UI/Component/Slider';
import { TitleCenter } from '../../UI/Component/TitleCenter';
import { SliderCards } from '../../UI/Layout/SliderCards';

/* estilos categoria */
const eCategoriaContainer = {
  color: "red",
  display: "flex",
  padding: "0 5%",
  width: "100%",
  justifyContent: "space-around",
}

export const ClientDashboard = () => {
  const { isLoading, isError, data, error, isFetching } = useQuery('promociones', ListPromotion, { refetchOnWindowFocus: false })
  const setNavClient = useSetRecoilState(NavClient);
  const setHeadClient = useSetRecoilState(HeaderClient);
  const [descuentoCant, setDescuentoCant] = useState(0);
  useEffect(() => {
    setNavClient(false)
    setHeadClient(true)
  }, [])
  return (
    <Flex direction="column">
      <div>
        {isLoading ? <Box>cargando</Box> : <Slider promocion={data} />}
      </div>
      <Box bg="white" borderRadius="lg" margin={{ base: "3", md: "7" }} paddingX={{ base: "2", md: "8" }} paddingY="5">
        {/* <Flex gridGap="5" overflowY="auto" css={{
          '&::-webkit-scrollbar': {
            width: '1px',
          },
          '&::-webkit-scrollbar-track': {
            width: '1px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: "var(--chakra-colors-gray-300)",
            borderRadius: '12px',
          },
        }}>
          
        </Flex> */}
        <div>
          <TitleCenter title={descuentoCant ? "Productos" : "Promociones"} justifyContent="space-around" margin="50px 0" />
        </div>
        <Box bg="gray.200" borderRadius="20px" paddingY="10">
          <SliderCards
            descuentoCant={descuentoCant}
            setDescuentoCant={setDescuentoCant} />
        </Box>
      </Box>
    </Flex>

  )
}