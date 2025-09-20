export interface PixTransferRequest {
  valor: number
  chavePix: string
  nomeDestinatario: string
  descricao?: string
}

export interface PixTransferResponse {
  transactionId: string
  status: "PENDING" | "COMPLETED" | "FAILED"
  valor: number
  dataHora: string
}

export interface AutorizacaoRequest {
  chavePix: string
  valor: number
  periodicidade: "MENSAL" | "SEMANAL" | "ANUAL"
  dataInicio: string
  dataFim?: string
}

export interface AutorizacaoResponse {
  id: string
  status: "ATIVA" | "CANCELADA" | "PAUSADA"
  chavePix: string
  valor: number
  periodicidade: string
  proximoDebito: string
}

export interface QRCodeRequest {
  valor: number
  descricao?: string
  expiracaoMinutos?: number
}

export interface QRCodeResponse {
  qrCode: string
  txId: string
  status: string
  valor: number
  expiracaoEm: string
}

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE"
  headers?: Record<string, string>
  body?: any
}
