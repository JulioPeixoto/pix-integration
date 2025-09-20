import { itauConfig } from "./config"
import type { RequestConfig } from "./types"

export class ItauClient {
  private token?: string
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = itauConfig.baseUrl
    this.timeout = itauConfig.timeout
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: itauConfig.clientId || "",
          client_secret: itauConfig.clientSecret || "",
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data = await response.json()
      this.token = data.access_token
    } catch (error) {
      console.error("Error authenticating with Itaú:", error)
      throw error
    }
  }

  private async makeRequest<T>(endpoint: string, config: RequestConfig): Promise<T> {
    if (!this.token) {
      await this.authenticate()
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ...config.headers,
    }

    const requestInit: RequestInit = {
      method: config.method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
    }

    try {
      const response = await fetch(url, requestInit)

      if (response.status === 401) {
        this.token = undefined
        await this.authenticate()

        headers.Authorization = `Bearer ${this.token}`
        const retryResponse = await fetch(url, {
          ...requestInit,
          headers,
        })

        if (!retryResponse.ok) {
          throw new Error(`Request failed: ${retryResponse.status}`)
        }

        return await retryResponse.json()
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "POST", body: data })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "PUT", body: data })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" })
  }
}
