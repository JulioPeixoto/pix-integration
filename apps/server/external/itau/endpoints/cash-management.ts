import { ItauClient } from "../client"
import type { PixTransferRequest, PixTransferResponse, QRCodeRequest, QRCodeResponse } from "../types"

export class CashManagementService extends ItauClient {
  async enviarPix(dados: PixTransferRequest): Promise<PixTransferResponse> {
    return this.post("/cash-management/v1/pagamentos/pix", dados)
  }

  async consultarPagamento(transactionId: string): Promise<PixTransferResponse> {
    return this.get(`/cash-management/v1/pagamentos/${transactionId}`)
  }

  async gerarQRCodePix(dados: QRCodeRequest): Promise<QRCodeResponse> {
    return this.post("/cash-management/v1/pix/qrcode", dados)
  }
}
