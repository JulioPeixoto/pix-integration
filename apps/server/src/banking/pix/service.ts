import { ItauClient } from "../../../external/itau/client"
import type { PixTransferRequest, PixTransferResponse } from "../../../external/itau/types"

export class PixService {
  private readonly itauClient = new ItauClient()
    
  async transferPix (data: PixTransferRequest): Promise<PixTransferResponse> {
    return await this.itauClient.transferPix(data) as PixTransferResponse
  }
}