import { UserRepository } from "./repository"
import type { User, CreateUserRequest, UpdateUserRequest, PixHistory } from "./types"

export class UserService {
  static async getUser(id: string): Promise<User | null> {
    return await UserRepository.findById(id)
  }

  static async createUser(data: CreateUserRequest): Promise<User> {
    const existingUser = await UserRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error("Email already in use")
    }

    return await UserRepository.createUser(data)
  }

  static async updateUser(id: string, data: UpdateUserRequest): Promise<User | null> {
    const user = await UserRepository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }

    return await UserRepository.updateUser(id, data)
  }

  static async deleteUser(id: string): Promise<User> {
    const user = await UserRepository.findById(id)
    if (!user) {
      throw new Error("User not found")
    }
    return await UserRepository.deleteUser(id)
  }

  static async getUserPixHistory(userId: string): Promise<PixHistory[]> {
    return await UserRepository.getPixHistory(userId)
  }

  static async addToPixHistory(
    userId: string,
    pixData: Omit<PixHistory, "id" | "userId" | "createdAt">
  ): Promise<PixHistory> {
    return await UserRepository.addPixHistory(userId, pixData)
  }
}
