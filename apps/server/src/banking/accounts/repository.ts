import db from "../../../external/prisma"
import type { BankAccount, CreateBankAccountRequest, UpdateBankAccountRequest } from "./types"

export class BankAccountRepository {
  static async findById(id: string): Promise<BankAccount | null> {
    try {
      return await db.bankAccount.findUnique({
        where: { id },
      })
    } catch (error) {
      console.error("Error finding bank account by id:", error)
      return null
    }
  }

  static async findByUserId(userId: string): Promise<BankAccount[]> {
    try {
      return await db.bankAccount.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    } catch (error) {
      console.error("Error finding bank accounts by userId:", error)
      return []
    }
  }

  static async findByConta(
    banco: string,
    agencia: string,
    conta: string,
    cpfCnpj: string
  ): Promise<BankAccount | null> {
    try {
      return await db.bankAccount.findFirst({
        where: {
          banco,
          agencia,
          conta,
          cpfCnpj,
        },
      })
    } catch (error) {
      console.error("Error finding bank account by conta:", error)
      return null
    }
  }

  static async createBankAccount(data: CreateBankAccountRequest): Promise<BankAccount> {
    try {
      return await db.bankAccount.create({
        data,
      })
    } catch (error) {
      console.error("Error creating bank account:", error)
      throw new Error("Failed to create bank account")
    }
  }

  static async updateBankAccount(id: string, data: UpdateBankAccountRequest): Promise<BankAccount | null> {
    try {
      return await db.bankAccount.update({
        where: { id },
        data,
      })
    } catch (error) {
      console.error("Error updating bank account:", error)
      return null
    }
  }

  static async deleteBankAccount(id: string): Promise<boolean> {
    try {
      await db.bankAccount.delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error("Error deleting bank account:", error)
      return false
    }
  }

  static async validateAccount(id: string): Promise<BankAccount | null> {
    try {
      return await db.bankAccount.update({
        where: { id },
        data: { validada: true },
      })
    } catch (error) {
      console.error("Error validating bank account:", error)
      return null
    }
  }
}
