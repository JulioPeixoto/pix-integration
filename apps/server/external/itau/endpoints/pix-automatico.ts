import { ItauClient } from "../client"
import type { AutorizacaoRequest, AutorizacaoResponse } from "../types"

export class PixAutomaticoService extends ItauClient {
  async criarAutorizacaoRecorrente(dados: AutorizacaoRequest): Promise<AutorizacaoResponse> {
    return this.post("/pix/automatico/v1/autorizacoes", dados)
  }

  async consultarAutorizacao(id: string): Promise<AutorizacaoResponse> {
    return this.get(`/pix/automatico/v1/autorizacoes/${id}`)
  }

  async cancelarAutorizacao(id: string): Promise<void> {
    return this.delete(`/pix/automatico/v1/autorizacoes/${id}`)
  }
}
