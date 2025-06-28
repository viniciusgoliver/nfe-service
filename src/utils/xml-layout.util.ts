interface InvoiceXMLData {
  client: {
    cnpj: string
    name: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  status: string
  valor: number
}

export function xmlLayout(data: InvoiceXMLData) {
  return `<?xml version="1.0" encoding="UTF-8"?>
          <nfe>
            <emitente>
              <cnpj>${data.client.cnpj}</cnpj>
              <nome>${data.client.name}</nome>
            </emitente>
            <destinatario>
              <cnpj>${data.client.cnpj}</cnpj>
              <nome>${data.client.name}</nome>
            </destinatario>
            <valor>${Number(data.valor).toFixed(2)}</valor>
            <produtos>
              ${data.items
                .map((prod) =>
                  `
              <produto>
                <nome>${prod.name}</nome>
                <quantidade>${prod.quantity}</quantidade>
                <preco>${Number(prod.price).toFixed(2)}</preco>
              </produto>
              `.trim()
                )
                .join('\n    ')}
            </produtos>
            <status>${data.status}</status>
          </nfe>`
}
