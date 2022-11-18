export interface ListaClientes {
  ID: string;
  DATES: string;
  TRADENAME: string;
  TIPO: string;
  EMAIL: string;
  PHONE: string;
  DIRECTION: string;
  DISTRITO: string;
  DEPARTMENT: string;
  COUNTRY: string;
}

export interface createCliente {
  PER_ID: number;
  CLA_ID: number;
}

export interface Cliente {
  PER_ID: string;
  CLI_ID: string;
  PET_NAME: string;
  PER_NAME: string;
  PER_LASTNAME: string;
  PER_TRADENAME: string;
  PER_EMAIL: string;
  PER_N_PHONE: string;
  PER_DIRECTION: string;
}

export interface OneClient {
  PER_ID: number;
  PMT_ID?: number;
  CLI_ID: number;
  GRO_ID: number;
  PET_ID: number;
  CLA_ID: number;
  PER_NAME: string;
  PER_LASTNAME: string;
  PER_TRADENAME: string;
  PER_EMAIL: string;
  PER_DNI: string;
  PER_RUC: string;
  PER_N_PHONE: string;
  PER_DIRECTION: string;
  PER_DEPARTMENT: string;
  PER_PROVINCE: string;
  PER_DISTRIC: string;
  PER_COUNTRY: string;
}

export interface Clasificacion {
  CLA_ID: string;
  CLA_NAME: string;
  CLA_DESCRIPTION: string;
}

export interface Grupo {
  GRO_ID: string;
  GRO_NAME: string;
  GRO_DESCRIPTION: string;
}

export interface PersonType {
  PET_ID: string;
  PET_NAME: string;
  PET_DESCRIPTION: string;
}

