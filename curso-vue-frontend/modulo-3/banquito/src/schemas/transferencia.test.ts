import { describe, expect, it } from 'vitest'
import { transferenciaSchema } from './transferencia'

const cuentaOrigenId = 'cta-origen'
const beneficiarioId = 'ben-destino'
const conceptoLargo = 'a'.repeat(80)

const base = { cuentaOrigenId, beneficiarioId, monto: 150.5 }

describe('transferenciaSchema', () => {
  it.each([
    {
      caso: 'monto mínimo de un céntimo',
      datos: { cuentaOrigenId, beneficiarioId, monto: 0.01 },
      esperado: { cuentaOrigenId, beneficiarioId, monto: 0.01 },
    },
    {
      caso: 'monto entero',
      datos: { ...base, monto: 1 },
      esperado: { ...base, monto: 1 },
    },
    {
      caso: 'un decimal',
      datos: { ...base, monto: 10.5 },
      esperado: { ...base, monto: 10.5 },
    },
    {
      caso: 'dos decimales',
      datos: { ...base, monto: 10.25 },
      esperado: { ...base, monto: 10.25 },
    },
    {
      caso: 'en el límite diario',
      datos: { ...base, monto: 3000 },
      esperado: { ...base, monto: 3000 },
    },
    {
      caso: 'sin concepto',
      datos: base,
      esperado: base,
    },
    {
      caso: 'concepto vacío',
      datos: { ...base, concepto: '' },
      esperado: base,
    },
    {
      caso: 'concepto de 80 caracteres',
      datos: { ...base, concepto: conceptoLargo },
      esperado: { ...base, concepto: conceptoLargo },
    },
  ])('$caso', ({ datos, esperado }) => {
    expect(transferenciaSchema.parse(datos)).toEqual(esperado)
  })

  it.each([
    {
      caso: 'falta la cuenta de origen',
      datos: { beneficiarioId, monto: 10 },
      campo: 'cuentaOrigenId',
      mensaje: 'Elige una cuenta de origen',
    },
    {
      caso: 'cuenta de origen vacía',
      datos: { ...base, cuentaOrigenId: '' },
      campo: 'cuentaOrigenId',
      mensaje: 'Elige una cuenta de origen',
    },
    {
      caso: 'falta el beneficiario',
      datos: { cuentaOrigenId, monto: 10 },
      campo: 'beneficiarioId',
      mensaje: 'Elige un beneficiario',
    },
    {
      caso: 'beneficiario vacío',
      datos: { ...base, beneficiarioId: '' },
      campo: 'beneficiarioId',
      mensaje: 'Elige un beneficiario',
    },
    {
      caso: 'falta el monto',
      datos: { cuentaOrigenId, beneficiarioId },
      campo: 'monto',
      mensaje: 'Escribe un monto',
    },
    {
      caso: 'monto no numérico',
      datos: { ...base, monto: 'diez' },
      campo: 'monto',
      mensaje: 'Escribe un monto',
    },
    {
      caso: 'monto vacío',
      datos: { ...base, monto: Number.NaN },
      campo: 'monto',
      mensaje: 'Escribe un monto',
    },
    {
      caso: 'monto cero',
      datos: { ...base, monto: 0 },
      campo: 'monto',
      mensaje: 'El monto debe ser mayor que 0',
    },
    {
      caso: 'monto negativo',
      datos: { ...base, monto: -1 },
      campo: 'monto',
      mensaje: 'El monto debe ser mayor que 0',
    },
    {
      caso: 'tres decimales',
      datos: { ...base, monto: 0.001 },
      campo: 'monto',
      mensaje: 'Máximo 2 decimales',
    },
    {
      caso: 'más de dos decimales',
      datos: { ...base, monto: 10.555 },
      campo: 'monto',
      mensaje: 'Máximo 2 decimales',
    },
    {
      caso: 'un céntimo sobre el límite',
      datos: { ...base, monto: 3000.01 },
      campo: 'monto',
      mensaje: 'Superas el límite diario de S/ 3000',
    },
    {
      caso: 'por encima del límite diario',
      datos: { ...base, monto: 3001 },
      campo: 'monto',
      mensaje: 'Superas el límite diario de S/ 3000',
    },
    {
      caso: 'concepto de 81 caracteres',
      datos: { ...base, concepto: `${conceptoLargo}b` },
      campo: 'concepto',
      mensaje: 'Máximo 80 caracteres',
    },
  ])('$caso', ({ datos, campo, mensaje }) => {
    const resultado = transferenciaSchema.safeParse(datos)
    expect(resultado.success).toBe(false)
    if (resultado.success) return

    const delCampo = resultado.error.issues.filter((issue) => issue.path[0] === campo)
    expect(delCampo.map((issue) => issue.message)).toContain(mensaje)
  })
})
