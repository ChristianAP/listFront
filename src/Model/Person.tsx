export interface ListaPersonasTicket {
  PER_ID: string;
  PERSON: string;
  PER_DNI: string;
  PER_RUC: string;
  PER_TRADENAME: string;
}

export interface CreatePerson {
  PER_ID?: string;
  PMT_ID?: number | string;
  PET_ID: number | string;
  USR_ID?: number,
  PER_NAME: string;
  PER_LASTNAME: string;
  PER_DNI: string;
  PER_RUC: string;
  PER_EMAIL: string;
  PER_N_PHONE: string;
  PER_TRADENAME: string;
  PER_DIRECTION: string;
  PER_DEPARTMENT: string;
  PER_PROVINCE: string;
  PER_DISTRIC: string;
  PER_COUNTRY: string;
  PER_PHOTO?: string;
  PER_ACTIVE: string;
  PER_CONDITION: string;
}
