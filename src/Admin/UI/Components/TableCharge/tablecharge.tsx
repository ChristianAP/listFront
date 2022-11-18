import React from "react";
import {
  Grid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MyContain } from "../MyContain";

export const TableChargeProductAndDescription = () => {
  return (
    <>
      <MyContain>

        <Table>
          <Thead>
            <Tr>
              <Td>
                <SkeletonCircle size="20" />
              </Td>
              <Td>
                <Skeleton height="20px" w={ 40 } />
              </Td>
              <Td>
                <Skeleton height="20px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="20px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="20px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="20px" w={ 50 } />
              </Td>
            </Tr>
          </Thead>
        </Table>
      </MyContain>
    </>
  );
};

export const TableChargeListProduct = () => {
  return (
    <>
      <MyContain>

        <Table>
          <Thead>
            <Tr>
              <Td>
                <SkeletonCircle size="10" />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 40 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonCircle size="8" />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 40 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonCircle size="8" />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 40 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
            </Tr>
            <Tr>
              <Td>
                <SkeletonCircle size="8" />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 40 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
              <Td>
                <Skeleton height="15px" w={ 50 } />
              </Td>
            </Tr>
          </Thead>
        </Table>
      </MyContain>

    </>
  );
};

export const TableChargeList = () => {
  return (
    <>
      <Grid gap="1rem">
        <MyContain>
          <Table className="table">
            <Tbody>
              <Tr>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
                <Td>
                  <Stack>
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                    <Skeleton height="30px" />
                  </Stack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </MyContain>
      </Grid>
    </>
  );
};

export const TableCharge = () => {
  return (
    <MyContain>
      <Stack>
        <Skeleton height="70px" />
        <Skeleton height="70px" />
        <Skeleton height="70px" />
        <Skeleton height="70px" />
        <Skeleton height="70px" />
        <Skeleton height="70px" />
        <Skeleton height="70px" />
      </Stack>
    </MyContain>
  );
}