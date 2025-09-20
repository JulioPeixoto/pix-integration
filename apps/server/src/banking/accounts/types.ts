import type { Prisma } from "../../../external/prisma/generated/client"

export type { BankAccount, AccountType, PersonType } from "../../../external/prisma/generated/client"

export type CreateBankAccountRequest = Prisma.BankAccountCreateInput
export type UpdateBankAccountRequest = Prisma.BankAccountUpdateInput

export interface BankAccountValidation {
  isValid: boolean
  errors: string[]
  bankName?: string
}
