import Redis from "ioredis"
import { redisConfig } from "./config"
import type { CacheOptions, CacheResult, HashData, RedisStats } from "./types"

export class RedisClient {
  private client: Redis
  private isConnected = false

  constructor() {
    this.client = new Redis(redisConfig)
    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.client.on("connect", () => {
      console.log("Redis connected")
      this.isConnected = true
    })

    this.client.on("error", error => {
      console.error("Redis error:", error)
      this.isConnected = false
    })

    this.client.on("close", () => {
      console.log("Redis connection closed")
      this.isConnected = false
    })
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
    }
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect()
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const serialized = JSON.stringify(value)

    if (options?.ttl) {
      await this.client.setex(key, options.ttl, serialized)
    } else if (options?.nx) {
      await this.client.setnx(key, serialized)
    } else {
      await this.client.set(key, serialized)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.client.get(key)
    return result ? JSON.parse(result) : null
  }

  async getWithTTL<T>(key: string): Promise<CacheResult<T>> {
    const [data, ttl] = await Promise.all([this.client.get(key), this.client.ttl(key)])

    return {
      data: data ? JSON.parse(data) : null,
      exists: !!data,
      ttl,
    }
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  async hset(key: string, data: HashData): Promise<void> {
    const serialized: Record<string, string> = {}
    for (const [field, value] of Object.entries(data)) {
      serialized[field] = typeof value === "string" ? value : JSON.stringify(value)
    }
    await this.client.hset(key, serialized)
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    const result = await this.client.hget(key, field)
    return result ? JSON.parse(result) : null
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const result = await this.client.hgetall(key)
    const parsed: Record<string, T> = {}

    for (const [field, value] of Object.entries(result)) {
      try {
        parsed[field] = JSON.parse(value)
      } catch {
        parsed[field] = value as T
      }
    }

    return parsed
  }

  async lpush<T>(key: string, ...values: T[]): Promise<number> {
    const serialized = values.map(v => JSON.stringify(v))
    return await this.client.lpush(key, ...serialized)
  }

  async rpop<T>(key: string): Promise<T | null> {
    const result = await this.client.rpop(key)
    return result ? JSON.parse(result) : null
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    const results = await this.client.lrange(key, start, stop)
    return results.map(r => JSON.parse(r))
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern)
  }

  async flushdb(): Promise<void> {
    await this.client.flushdb()
  }

  async info(): Promise<RedisStats> {
    const info = await this.client.info()
    const lines = info.split("\r\n")
    const stats: any = {}

    for (const line of lines) {
      if (line.includes(":")) {
        const [key, value] = line.split(":")
        stats[key] = isNaN(Number(value)) ? value : Number(value)
      }
    }

    return {
      memory: stats.used_memory_human || "0",
      connections: stats.connected_clients || 0,
      commands: stats.total_commands_processed || 0,
      keyspace: stats,
    }
  }

  get raw(): Redis {
    return this.client
  }
}
