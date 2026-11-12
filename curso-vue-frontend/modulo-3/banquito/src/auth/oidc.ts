import { aleatorio, huella } from './pkce'
import { CLIENTE, EMISOR, REDIRECCION, pedirTokens } from './servidor'

import { setToken } from './token'

export async function iniciarLogin(destino = '/') {
  const verifier = aleatorio()
  const state = aleatorio(16)

  sessionStorage.setItem('pkce', JSON.stringify({ verifier, state, destino }))
  const parametros = new URLSearchParams({
    client_id: CLIENTE,
    redirect_uri: REDIRECCION,
    response_type: 'code',
    scope: 'openid',
    state,
    code_challenge: await huella(verifier),
    code_challenge_method: 'S256',
  })
  location.assign(`${EMISOR}/oauth/authorize?${parametros}`)
}

export async function completarLogin(params: URLSearchParams) {
  const guardado = JSON.parse(sessionStorage.getItem('pkce') ?? 'null')
  sessionStorage.removeItem('pkce')

  if (!guardado || params.get('state') !== guardado.state)
    throw new Error('Respuesta no reconocida')

  const data = await pedirTokens({
    grant_type: 'authorization_code',
    code: params.get('code') ?? '',
    redirect_uri: REDIRECCION,
    client_id: CLIENTE,
    code_verifier: guardado.verifier,
  })

  setToken(data.access_token, data.id_token)
  return guardado.destino as string
}
