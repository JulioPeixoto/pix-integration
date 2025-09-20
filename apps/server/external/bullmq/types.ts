export interface PixProcessingJob {
  transactionId: string
  amount: number
  recipientPixKey: string
  recipientName: string
  bankAccountId: string
  description?: string
}

export interface PixValidationJob {
  pixKey: string
  type: "CPF" | "EMAIL" | "PHONE" | "RANDOM"
}

export interface NotificationJob {
  type: "EMAIL" | "SMS" | "WEBHOOK"
  recipient: string
  template: string
  data: Record<string, any>
}

export interface JobResult {
  success: boolean
  data?: any
  error?: string
  timestamp: Date
}

export interface QueueStats {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}
