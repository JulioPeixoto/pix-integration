import { Queue, Worker, Job, QueueEvents } from "bullmq"
import { bullmqConfig } from "./config"
import type { PixProcessingJob, PixValidationJob, NotificationJob, JobResult, QueueStats } from "./types"

export class BullMQClient {
  private queues: Map<string, Queue> = new Map()
  private workers: Map<string, Worker> = new Map()
  private queueEvents: Map<string, QueueEvents> = new Map()

  static readonly QUEUES = {
    PIX_PROCESSING: "pix-processing",
    PIX_VALIDATION: "pix-validation",
    NOTIFICATIONS: "notifications",
    ANALYTICS: "analytics",
  } as const

  constructor() {
    this.initializeQueues()
  }

  private initializeQueues(): void {
    Object.values(BullMQClient.QUEUES).forEach(queueName => {
      const queue = new Queue(queueName, {
        connection: bullmqConfig.connection,
        defaultJobOptions: bullmqConfig.defaultJobOptions,
      })

      const queueEvents = new QueueEvents(queueName, {
        connection: bullmqConfig.connection,
      })

      this.queues.set(queueName, queue)
      this.queueEvents.set(queueName, queueEvents)
    })
  }

  async addPixProcessingJob(data: PixProcessingJob, options?: any): Promise<Job<PixProcessingJob>> {
    const queue = this.queues.get(BullMQClient.QUEUES.PIX_PROCESSING)!
    return await queue.add("process-pix", data, options)
  }

  createPixProcessingWorker(processor: (job: Job<PixProcessingJob>) => Promise<JobResult>): Worker<PixProcessingJob> {
    const worker = new Worker(BullMQClient.QUEUES.PIX_PROCESSING, processor, {
      connection: bullmqConfig.connection,
      ...bullmqConfig.workerOptions,
    })

    this.workers.set(BullMQClient.QUEUES.PIX_PROCESSING, worker)
    return worker
  }

  async addPixValidationJob(data: PixValidationJob, options?: any): Promise<Job<PixValidationJob>> {
    const queue = this.queues.get(BullMQClient.QUEUES.PIX_VALIDATION)!
    return await queue.add("validate-pix-key", data, options)
  }

  createPixValidationWorker(processor: (job: Job<PixValidationJob>) => Promise<JobResult>): Worker<PixValidationJob> {
    const worker = new Worker(BullMQClient.QUEUES.PIX_VALIDATION, processor, {
      connection: bullmqConfig.connection,
      ...bullmqConfig.workerOptions,
    })

    this.workers.set(BullMQClient.QUEUES.PIX_VALIDATION, worker)
    return worker
  }

  async addNotificationJob(data: NotificationJob, options?: any): Promise<Job<NotificationJob>> {
    const queue = this.queues.get(BullMQClient.QUEUES.NOTIFICATIONS)!
    return await queue.add("send-notification", data, options)
  }

  createNotificationWorker(processor: (job: Job<NotificationJob>) => Promise<JobResult>): Worker<NotificationJob> {
    const worker = new Worker(BullMQClient.QUEUES.NOTIFICATIONS, processor, {
      connection: bullmqConfig.connection,
      ...bullmqConfig.workerOptions,
    })

    this.workers.set(BullMQClient.QUEUES.NOTIFICATIONS, worker)
    return worker
  }

  async getQueueStats(queueName: string): Promise<QueueStats> {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`)
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ])

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    }
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName)
    if (queue) {
      await queue.pause()
    }
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName)
    if (queue) {
      await queue.resume()
    }
  }

  async cleanQueue(queueName: string, grace: number = 5000): Promise<void> {
    const queue = this.queues.get(queueName)
    if (queue) {
      await queue.clean(grace, 1000, "completed")
      await queue.clean(grace, 1000, "failed")
    }
  }

  async shutdown(): Promise<void> {
    await Promise.all([
      ...Array.from(this.workers.values()).map(worker => worker.close()),
      ...Array.from(this.queues.values()).map(queue => queue.close()),
      ...Array.from(this.queueEvents.values()).map(events => events.close()),
    ])
  }

  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName)
  }

  getWorker(queueName: string): Worker | undefined {
    return this.workers.get(queueName)
  }

  getQueueEvents(queueName: string): QueueEvents | undefined {
    return this.queueEvents.get(queueName)
  }
}
