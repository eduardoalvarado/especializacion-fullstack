const SIMBOLO = { PEN: 'S/', USD: 'US$' } as const

export function dinero(monto: number, moneda: 'PEN' | 'USD' = 'PEN') {
  const n = Math.abs(monto).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${monto < 0 ? '−' : ''}${SIMBOLO[moneda]} ${n}`
}

export function fecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function cuentaOculta(cci: string) {
  return `•••• ${cci.slice(-4)}`
}
