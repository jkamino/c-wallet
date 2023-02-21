import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Account, AddressBook, Contract, TransferHistory } from 'src/app/models/models.types';
/**
 * ローカルストレージの管理サービス
 * set/getでローカルストレージの操作をまとめる
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /** privateKey */
  async setPrivateKey(_privateKey: string): Promise<void> {
    await Storage.set({ key: 'privateKey', value: _privateKey });
  }
  async getPrivateKey(): Promise<string | null> {
    const item = await Storage.get({ key: 'privateKey' });
    return item.value;
  }
  async clearPrivateKey(): Promise<void> {
    await Storage.remove({ key: 'privateKey' });
  }

  /** walletAddress */
  async setWalletAddress(_walletAddress: string): Promise<void> {
    await Storage.set({ key: 'walletAddress', value: _walletAddress });
  }
  async getWalletAddress(): Promise<string | null> {
    const item = await Storage.get({ key: 'walletAddress' });
    return item.value;
  }
  async clearWalletAddress(): Promise<void> {
    return await Storage.remove({ key: 'walletAddress' });
  }

  /**email address */
  async setEmailAddress(_emailAddress: string): Promise<void> {
    await Storage.set({ key: 'emailAddress', value: _emailAddress });
  }
  async getEmailAddress(): Promise<string | null> {
    const item = await Storage.get({ key: 'emailAddress' });
    return item.value;
  }
  async clearEmailAddress(): Promise<void> {
    await Storage.remove({ key: 'emailAddress' });
  }

  /** contractService */
  async setContractService(_serviceName: string): Promise<void> {
    await Storage.set({ key: 'contractService', value: _serviceName });
  }
  async getContractService(): Promise<string | null> {
    const item = await Storage.get({ key: 'contractService' });
    return item.value;
  }
  async clearContractService(): Promise<void> {
    await Storage.remove({ key: 'contractService' });
  }

  /** contractAddress */
  async setContractAddress(_contractAddress: string): Promise<void> {
    await Storage.set({ key: 'contractAddress', value: _contractAddress });
  }
  async getContractAddress(): Promise<string | null> {
    const item = await Storage.get({ key: 'contractAddress' });
    return item.value;
  }
  async clearContractAddress(): Promise<void> {
    await Storage.remove({ key: 'contractAddress' });
  }

  /** manual contract name */
  async setContractName(_contractName: string): Promise<void> {
    await Storage.set({ key: 'contractName', value: _contractName });
  }
  async getContractName(): Promise<string | null> {
    const item = await Storage.get({ key: 'contractName' });
    return item.value;
  }
  async clearContractName(): Promise<void> {
    await Storage.remove({ key: 'contractName' });
  }

  /**Contract List */
  async setContractList(_contractList: Contract[]): Promise<void> {
    const contractList = JSON.stringify(_contractList);
    await Storage.set({ key: 'contractList', value: contractList });
  }
  async getContractList(): Promise<Contract[] | []> {
    const item = await Storage.get({ key: 'contractList' });
    const contractList = item.value ? JSON.parse(item.value) : [];
    return contractList;
  }
  async clearContractList(): Promise<void> {
    await Storage.remove({ key: 'contractList' });
  }
  /**Accounts */
  async setAccounts(_accounts: Account[]): Promise<void> {
    const accounts = JSON.stringify(_accounts);
    await Storage.set({ key: 'accounts', value: accounts });
  }
  async getAccounts(): Promise<Account[] | []> {
    const item = await Storage.get({ key: 'accounts' });
    const accounts = item.value ? JSON.parse(item.value) : [];
    return accounts;
  }
  async clearAccounts(): Promise<void> {
    await Storage.remove({ key: 'accounts' });
  }
  /**transaction No*/
  async setTransactionHash(_transactionHash: string): Promise<void> {
    await Storage.set({ key: 'transactionHash', value: _transactionHash });
  }
  async getTransactionHash(): Promise<string | null> {
    const item = await Storage.get({ key: 'transactionHash' });
    return item.value;
  }
  async clearTransactionHash(): Promise<void> {
    await Storage.remove({ key: 'transactionHash' });
  }

  /** transfer history list*/
  /* transfer history listは自分のものだけアクセスさせる */
  async addTransferHistory(_transferHistory: TransferHistory): Promise<void> {
    const item = await Storage.get({ key: 'transferHistory' });
    const oldHisotiryList: TransferHistory[] = item.value ? JSON.parse(item.value) : [];
    const newItem = JSON.stringify([...oldHisotiryList, _transferHistory]);
    await Storage.set({ key: 'transferHistory', value: newItem });
  }
  async getTransferHisoryList(_owner: string): Promise<TransferHistory[]> {
    const item = await Storage.get({ key: 'transferHistory' });
    const wholeHistoryList: TransferHistory[] = item.value ? JSON.parse(item.value) : [];
    const myHistoryList = wholeHistoryList
      .filter(historyList => historyList.owner === _owner)
    return myHistoryList;
  }
  async clearTransferHiastoryList(): Promise<void> {
    await Storage.remove({ key: 'transferHistory' });
  }
  
  /**address book */
  /* address bookは自分のものだけアクセスさせる */
  async addAddressBook(_addressBook: AddressBook): Promise<void> {
    const item = await Storage.get({ key: 'addressBook' });
    const oldAddressBookList: AddressBook[] = item.value ? JSON.parse(item.value) : [];
    const newItem = JSON.stringify([...oldAddressBookList, _addressBook]);
    await Storage.set({ key: 'addressBook', value: newItem });
  }
  async getAddressBookList(_owner: string): Promise<AddressBook[]> {
      const item = await Storage.get({ key: 'addressBook' });
      const wholeAddressbook: AddressBook[] = item.value ? JSON.parse(item.value) : [];
      const myAddressBook = wholeAddressbook
        .filter(addressBook => addressBook.owner === _owner)
      return myAddressBook;
  }
  async clearAddressBookList(): Promise<void> {
    await Storage.remove({ key: 'addressBook' });
  }

  async clearStorage(): Promise<void> {
    await Storage.clear();
  }
}
