# banquito-api

API local de **Banquito**, la app del módulo 3. Un solo servidor para las cuatro sesiones; en memoria
(se reinicia con cada arranque) y con datos deterministas.

```sh
npm install
npm run api        # http://localhost:4000 — sin identidad (sesión 1 y 3)
npm run api:auth   # con servidor de identidad OIDC + PKCE (sesiones 2 y 4)
npm test           # 10 pruebas (núcleo + identidad)
```

## Núcleo (`/api`)

| Método | Ruta | Notas |
| --- | --- | --- |
| GET | `/api/perfil`, `/api/cuentas`, `/api/cuentas/:id` | |
| GET | `/api/movimientos?cuentaId&q&tipo&page&limit` | `{ items, total, page, limit }` + `X-Total-Count` |
| GET/POST | `/api/beneficiarios` | POST → 201 + `Location`; 422 si hay campos inválidos; 409 si la cuenta ya existe |
| GET/PUT/DELETE | `/api/beneficiarios/:id` | PUT reemplaza el recurso completo; DELETE → 204 |
| POST | `/api/transferencias` | `Idempotency-Key` opcional; 422 `INSUFFICIENT_FUNDS` / `DAILY_LIMIT` (S/ 3000) |

Todos los errores tienen la misma forma: `{ "code": "VALIDATION", "message": "…", "fields": { "monto": "…" } }`.

## Perillas de clase

```sh
curl -X POST localhost:4000/__admin/config -H 'content-type: application/json' \
  -d '{"latenciaMs":800}'          # cada petición /api tarda 800 ms
  -d '{"fallarProximas":2}'        # las 2 próximas responden 500
  -d '{"tasaFallo":0.3}'           # 30 % de las peticiones fallan
  -d '{"xss":true}'                # añade un movimiento con HTML en el concepto (sesión 2)
  -d '{"ttlAccesoSeg":15}'         # access token de 15 s (sesión 4)
curl -X POST localhost:4000/__admin/reset   # vuelve a los datos iniciales
```

## Identidad (`AUTH=on`, sesiones 2 y 4)

Cliente `banquito-web`; redirecciones solo a `http://localhost:<puerto>/…`; usuario `ana` / `banquito123`.
`GET /.well-known/openid-configuration`, `GET|POST /oauth/authorize` (PKCE `S256` obligatorio),
`POST /oauth/token` (`authorization_code` y `refresh_token`), `POST /oauth/logout`.
El access token (JWT HS256, 300 s) viaja en el cuerpo; el **refresh token solo en cookie `HttpOnly`**
con rotación y detección de reutilización; `refresh_token` y `logout` exigen CSRF (cookie `csrf` + cabecera `X-CSRF-Token`).
Con `AUTH=on`, `/api/*` exige `Authorization: Bearer` (401 `UNAUTHENTICATED` o `TOKEN_EXPIRED`).

> Solo para clase: secreto fijo, un usuario, sin HTTPS. **Verificado solo con pruebas de API**; la interfaz
> de identidad se prueba en la sesión 2.
