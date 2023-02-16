import { Injectable } from '@angular/core';
import {
  DigitalContentObject,
  DigitalContentSpec,
  ETHAccount,
  ObjectBalanceOf,
  OwnedObjectsOf,
  Erc20BalanceOf
} from 'src/app/models/models.types';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'privatechain',
    networkId: 1,
    chainId: 11421,
  },
  'petersburg'
);
//@dev https://github.com/ChainSafe/web3.js/issues/1354
const providerOption = {
  reconnect: {
    auto: true,
    delay: 1000, // ms
    onTimeout: false,
    // maxAttempts:
  },
  timeout: 5000, // ms
  clientConfig: {
    maxReceivedFrameSize: 10000000000,
    maxReceivedMessageSize: 10000000000,
    keepalive: true,
    keepaliveInterval: 1000, // ms
    dropConnectionOnKeepaliveTimeout: true,
    keepaliveGracePeriod: 4000, // ms
  },
};
@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  web3: any;
  provider: any;
  TokenManagerContract: any;
  DigitalContentContract: any;
  Erc20Contract: any;

  /** init Web3 */
  init() {
    this.provider = new Web3.providers.WebsocketProvider(
      environment.providerUrl,
      providerOption
    );
    this.web3 = new Web3(this.provider);
  }

  /**
   * change contract
   * @param tokenManagerContractAbi contract abi
   * @param tokenManagerContractAddress contract address
   * @param digitalContentContractAbi contract abi
   * @param digitalContentContractAddress contract address
   */
  changeContract(
    tokenManagerContractAbi: any,
    tokenManagerContractAddress: any,
    digitalContentContractAbi: any,
    digitalContentContractAddress: any
  ) {
    if (!this.web3) {
      this.init();
    }
    
    this.DigitalContentContract = null;
    this.TokenManagerContract = null;
    this.TokenManagerContract = new this.web3.eth.Contract(
      tokenManagerContractAbi,
      tokenManagerContractAddress
    );
    this.DigitalContentContract = new this.web3.eth.Contract(
      digitalContentContractAbi,
      digitalContentContractAddress
    );
  }

  /**
   * change ERC20 contract
   * @param erc20ContractAbi contract abi
   * @param erc20ContractAddress contract address
   */
  setErc20Contract(
    erc20ContractAbi: any,
    erc20ContractAddress: any
  ) {
    this.Erc20Contract = new this.web3.eth.Contract(
      erc20ContractAbi,
      erc20ContractAddress
    )  
  }
  /**
   * マニュアル入力用
   * @param _digitalContentContractAbi
   * @param _digitalContentContractAddress
   */
  manualContract(
    _digitalContentContractAbi: any,
    _digitalContentContractAddress: any
  ) {
    this.DigitalContentContract = new this.web3.eth.Contract(
      _digitalContentContractAbi,
      _digitalContentContractAddress
    );
  }
  /**create Address */
  async createAddress(): Promise<ETHAccount> {
    if (!this.web3) {
      this.init();
    }
    const account = await this.web3.eth.accounts.create();
    return { address: account.address, privateKey: account.privateKey };
  }
  /**private_key to Address */
  async privateKeyToAddress(_privateKey: string) {
    if (!this.web3) {
      this.init();
    }
    try {
      const address = await this.web3.eth.accounts.privateKeyToAccount(
        _privateKey
      ).address;
      return address;
    } catch (e) {
      throw e;
    }
  }

  /**disconnect */
  disconnect() {
    if (!this.web3) return;
    this.web3.currentProvider.disconnect();
    this.web3 = null;
    this.DigitalContentContract = null;
    this.TokenManagerContract = null;
  }

  /**以下　ABI依存の関数 */
  /**
   * object transfer
   * @param _address
   * @param _privateKey
   * @param _from
   * @param _to
   * @param _objectId
   * @returns
   */
  objectTransferFrom(
    _address: any,
    _privateKey: any,
    _from: any,
    _to: any,
    _objectId: any
  ) {
    if (!this.web3) {
      this.init();
    }
    const txData = this.DigitalContentContract.methods
      .transferFrom(_from, _to, _objectId)
      .encodeABI();
    return this._sendSignedTransaction(
      _address,
      _privateKey,
      txData,
      this.DigitalContentContract.options.address
    );
  }

  /**
   * get digital-content-object by specID
   * @param _specId
   * @returns
   */
  getDigitalContentSpec(_specId: number): Promise<DigitalContentSpec> {
    if (!this.web3) {
      this.init();
    }
    return new Promise((resolve, reject) => {
      //time out error
      setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
      this.DigitalContentContract.methods
        .getDigitalContentSpec(_specId)
        .call()
        .then((result: any) => {
          resolve({ spec: result });
        })
        .catch((e: any) => {
          reject({ error: e });
        });
    });
  }

  /**
   * get digital-content-object by objectID
   * @param _objectId
   * @returns
   */
  getDigitalContentObject(_objectId: number): Promise<DigitalContentObject> {
    if (!this.web3) {
      this.init();
    }
    return new Promise((resolve, reject) => {
      //time out error
      setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
      this.DigitalContentContract.methods
        .getDigitalContentObject(_objectId)
        .call()
        .then((result: any) => {
          resolve({ object: result });
        })
        .catch((e: any) => {
          reject({ error: e });
        });
    });
  }

  /**
   * has object number by address
   * @param _owner owner address
   * @returns
   */
  objectBalanceOf(_owner: string): Promise<ObjectBalanceOf> {
    if (!this.web3) {
      this.init();
    }
    return new Promise((resolve, reject) => {
      //time out error
      setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
      this.DigitalContentContract.methods
        .objectBalanceOf(_owner)
        .call()
        .then((result: any) => {
          resolve({ _ownedObjectsCount: result });
        })
        .catch((e: any) => {
          reject({ error: e });
        });
    });
  }

  /**
   * has objectIds by address
   * @param _owner owner address
   * @returns
   */
  ownedObjectsOf(_owner: string): Promise<OwnedObjectsOf> {
    if (!this.web3) {
      this.init();
    }
    return new Promise((resolve, reject) => {
      //time out error
      setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
      this.DigitalContentContract.methods
        .ownedObjectsOf(_owner)
        .call()
        .then((result: any) => {
          resolve({ _ownedObjects: result });
        })
        .catch((e: any) => {
          reject({ error: e });
        });
    });
  }

    /**
   * balance of ERC20 token 
   */
    balanceOf(_owner: string): Promise<Erc20BalanceOf> {
      if (!this.web3) {
        this.init();
      }
      return new Promise((resolve, reject) => {
        //time out error
        setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
        this.Erc20Contract.methods
          .balanceOf(_owner)
          .call()
          .then((result: any) => {
            resolve({ balance: result });
          })
          .catch((e: any) => {
            reject({ error: e });
          });
      });
    }

      /**
   * object transfer
   * @param _address
   * @param _privateKey
   * @param _to
   * @param _value
   * @returns
   */
  erc20TokenTransfer(
    _address: any,
    _privateKey: any,
    _to: any,
    _value: string
  ) {
    if (!this.web3) {
      this.init();
    }
    const txData = this.Erc20Contract.methods
      .transfer(_to, _value)
      .encodeABI();
    return this._sendSignedTransaction(
      _address,
      _privateKey,
      txData,
      environment.erc20TokenContractAddress
    );
  }


  //private function
  /**
   * transactions
   * @param _from
   * @param _privateKey
   * @param _txData
   * @param _cAddress
   * @returns
   */
  async _sendSignedTransaction(
    _from: any,
    _privateKey: any,
    _txData: any,
    _cAddress: any
  ) {
    return new Promise(async (resolve, reject) => {
      //time out error
      setTimeout(() => reject({error:{message:'timeOut'}}), 30000);
      const nonce = await this.web3.eth.getTransactionCount(_from, 'pending');
      const rawTx = {
        from: _from,
        to: _cAddress,
        gas: 4700000,
        gasPrice: 0,
        data: _txData,
        nonce: nonce,
      };
      const tx = new Tx(rawTx, { common: customCommon });
      tx.sign(Buffer.from(_privateKey.split('0x')[1], 'hex'));
      const serializedTx = tx.serialize();
      this.web3.eth
        .sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('confirmation', (confirmationNumber: any, receipt: any) => {
          if (confirmationNumber === 1) {
            resolve(receipt.transactionHash);
          }
        })
        .on('error', (e: any) => {
              reject({ error: e });
        });
    });
  }
}
