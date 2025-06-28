import * as libxmljs from 'libxmljs'
import * as fs from 'fs'
import * as path from 'path'

export function validateXmlWithXsd(xmlString: string): boolean {
  const xsdPath = path.join(__dirname, '..', '..', 'schemas', 'nfe', 'modelo.xsd')
  if (!fs.existsSync(xsdPath)) {
    throw new Error(`Arquivo XSD não encontrado: ${xsdPath}`)
  }
  const xsdString = fs.readFileSync(xsdPath, 'utf8')
  const xsdDoc = libxmljs.parseXml(xsdString)
  const xmlDoc = libxmljs.parseXml(xmlString)

  const valid = xmlDoc.validate(xsdDoc)

  if (!valid) {
    const errors = xmlDoc.validationErrors.map((e) => e.message).join('; ')
    throw new Error('XML inválido: ' + errors)
  }

  return true
}
