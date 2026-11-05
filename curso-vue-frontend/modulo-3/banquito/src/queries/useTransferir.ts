import { transferir } from '@/api/transferencias'
import { useAccion } from '@/lib/accion'

export function useTransferir() {
  return useAccion(transferir)
}
