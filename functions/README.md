# Firebase Functions

## Setup

1. Instala dependencias:
   - `cd functions`
   - `pnpm install`

2. Inicia emulador (solo functions):
   - `pnpm serve`

## Deploy

- `pnpm deploy -- --project <firebase-project-id>`

## Notas

- Mantén secretos fuera del cliente. Para Spoonacular y similares, usa variables/secretos de Functions.
- Este folder es independiente del `package.json` raíz (no hay workspace).

