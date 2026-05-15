export interface Address {
  idAddress: string;
  country: string;
  region: string;
  district: string;
  mainAddress: string;
  reference?: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  country: string;
  region: string;
  district: string;
  mainAddress: string;
  reference?: string;
  isDefault: boolean;
}
