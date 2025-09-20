export interface CacheOptions {
  ttl?: number
  nx?: boolean
}

export interface CacheResult<T> {
  data: T | null
  exists: boolean
  ttl: number
}

export interface HashData {
  [key: string]: string | number | boolean
}

export interface ListItem {
  value: any
  score?: number
}

export interface RedisStats {
  memory: string
  connections: number
  commands: number
  keyspace: Record<string, any>
}
