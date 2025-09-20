import {
  BankAccountPlain,
  BankAccountPlainInputCreate,
  BankAccountPlainInputUpdate,
} from "../../../external/prisma/generated/prismabox/BankAccount"

export const CreateBankAccountSchema = BankAccountPlainInputCreate
export const UpdateBankAccountSchema = BankAccountPlainInputUpdate
export const BankAccountResponseSchema = BankAccountPlain
