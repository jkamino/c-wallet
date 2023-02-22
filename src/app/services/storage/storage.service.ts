import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Account, AddressBook, Contract, EncryptedAddressBook, EncryptedTransferHistory, TransferHistory } from 'src/app/models/models.types';
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

  /** transfer history*/
  /* transfer historyは自分のもののみアクセスさせるため、キーであるencryptedEmailを引数に持つ */
  async setEncryptedTransferHistory(_encryptedEmail: string, _encryptedHistory: string): Promise<void> {
    const item = await Storage.get({ key: 'transferHistory' });
    const oldHisotiryList: EncryptedTransferHistory[] = item.value ? JSON.parse(item.value) : [];
    // encryptedEmailをキーとして置き換え
    const newHistoryList: EncryptedTransferHistory[] = [
      ...(oldHisotiryList.filter(history => history.encryptedEmail !== _encryptedEmail)),
       {encryptedEmail:_encryptedEmail, encryptedList: _encryptedHistory}
    ];
    await Storage.set({ key: 'transferHistory', value: JSON.stringify(newHistoryList) });
  }
  async getEncryptedTransferHisory(_encryptedEmail: string): Promise<EncryptedTransferHistory | undefined> {
    const item = await Storage.get({ key: 'transferHistory' });
    const wholeHistoryList: EncryptedTransferHistory[] = item.value ? JSON.parse(item.value) : [];
    const myHistoryList = wholeHistoryList
      .find(historyList => historyList.encryptedEmail === _encryptedEmail)
    return myHistoryList;
  }
  async clearEncryptedTransferHiastoryList(): Promise<void> {
    await Storage.remove({ key: 'transferHistory' });
  }
  
  /**address book */
  /* address bookは自分のもののみアクセスさせるため、キーであるencryptedEmailを引数に持つ */
  async setEncryptedAddressBook(_encryptedEmail: string, _encryptedAddressBook: string): Promise<void> {
    const item = await Storage.get({ key: 'addressBook' });
    const oldAddressBookList: EncryptedAddressBook[] = item.value ? JSON.parse(item.value) : [];
    // encryptedEmailをキーとして置き換え
    const newAddressBookList: EncryptedAddressBook[] = [
      ...(oldAddressBookList.filter(addressBook => addressBook.encryptedEmail !== _encryptedEmail)),
        {encryptedEmail:_encryptedEmail, encryptedList: _encryptedAddressBook}
    ];
    
    await Storage.set({ key: 'addressBook', value: JSON.stringify(newAddressBookList) });
  }
  async getEncryptedAddressBook(_encryptedEmail: string): Promise<EncryptedAddressBook | undefined> {
      const item = await Storage.get({ key: 'addressBook' });
      const wholeAddressbook: EncryptedAddressBook[] = item.value ? JSON.parse(item.value) : [];
      const myAddressBook = wholeAddressbook
        .find(addressBook => addressBook.encryptedEmail === _encryptedEmail)
      return myAddressBook;
  }
  async clearAddressBookList(): Promise<void> {
    await Storage.remove({ key: 'addressBook' });
  }

  async clearStorage(): Promise<void> {
    await Storage.clear();
  }
}
