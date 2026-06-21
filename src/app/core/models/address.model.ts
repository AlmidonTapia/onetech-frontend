export interface Address {
  idAddress: string;
  country: string;
  ubigeoCode: string;
  mainAddress: string;
  reference?: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  country: string;
  ubigeoCode: string;
  mainAddress: string;
  reference?: string;
  isDefault: boolean;
}
