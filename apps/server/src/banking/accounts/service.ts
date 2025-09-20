import { BankAccountRepository } from "./repository"
import type { BankAccount, CreateBankAccountRequest, UpdateBankAccountRequest } from "./types"

export class BankAccountService {
  static async getBankAccount(id: string): Promise<BankAccount | null> {
    return await BankAccountRepository.findById(id)
  }

  static async createBankAccount(data: CreateBankAccountRequest): Promise<BankAccount> {
    const existingAccount = await BankAccountRepository.findByConta(data.banco, data.agencia, data.conta, data.cpfCnpj)
    if (existingAccount) {
      throw new Error("Account already exists")
    }

    return await BankAccountRepository.createBankAccount(data)
  }

  static async updateBankAccount(id: string, data: UpdateBankAccountRequest): Promise<BankAccount | null> {
    const account = await BankAccountRepository.findById(id)
    if (!account) {
      throw new Error("Account not found")
    }

    return await BankAccountRepository.updateBankAccount(id, data)
  }

  static async deleteBankAccount(id: string): Promise<boolean> {
    const account = await BankAccountRepository.findById(id)
    if (!account) {
      throw new Error("Account not found")
    }

    return await BankAccountRepository.deleteBankAccount(id)
  }
}
