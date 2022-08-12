/**web3 Models
 *　独自の定義がある場合はここも変更する必要あり
 */
export type ETHAccount = {
  address: string;
  privateKey: string;
};
export type DigitalContentObject = {
  object: Web3ContentObject;
};
export type Web3ContentObject = {
  objectId: number;
  specId: number;
  objectIndex: number;
  owner: string;
  info: string;
  mediaId: string;
};
export type DigitalContentSpec = {
  spec: Web3ContentSpec;
};
export type Web3ContentSpec = {
  specId: number;
  totalSupplyLimit: number;
  mediaId: string;
  name: string;
  owner: string;
  symbol: string;
  contentType: string;
  originalSpecIds: number[];
  contractDocuments: string[];
  copyrightFeeRatio: string[];
  allowSecondaryMerket: boolean;
  info: string;
};

export type ContentObject = {
  objectId: number;
  specId: number;
  objectIndex: number;
  owner: string;
  mediaId: string;
  info: ContentObjectInfo | Info;
  spec: Web3ContentSpec;
};
export type ContentObjectInfo = {
  specId: string;
  issuer: string;
  name: string;
  productInfo: string;
};
export type ContentObjectProduct = {
  product: ContentObjectInfo;
};
export type Info = {
  info: string;
};
export type ObjectBalanceOf = {
  _ownedObjectsCount: string;
};
export type OwnedObjectsOf = {
  _ownedObjects: number[];
};

/**
 * contract
 */
export type Contract = {
  address: string;
  name: string;
};
/**
 * account
 */
export type Account = {
  privateKey: string;
  emailAddress: string;
  contractService: string;
  contractList: Contract[];
};
/**
 * clipboard
 */
export interface IClipboardResponse {
  isSuccess: boolean;
  content?: string;
  event?: Event;
  successMessage?: string;
}
