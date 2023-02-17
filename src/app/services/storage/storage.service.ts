import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Account, Contract } from 'src/app/models/models.types';
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

    /**transaction history list*/
    async setTransactionHistoryList(_transactionHistoryList: string[]): Promise<void> {
      const historyList = JSON.stringify(_transactionHistoryList);
      await Storage.set({ key: 'transactionHistoryList', value: historyList });
    }
    async getTransactionHisoryList(): Promise<string[] | null> {
        const item = await Storage.get({ key: 'transactionHistoryList' });
        const historyList = item.value ? JSON.parse(item.value) : [];
        return historyList;
    }
    async clearTransactionHiastoryList(): Promise<void> {
      await Storage.remove({ key: 'transactionHistoryList' });
    }
  
  async clearStorage(): Promise<void> {
    await Storage.clear();
  }
}
