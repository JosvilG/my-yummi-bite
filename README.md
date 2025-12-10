# MyYummiBite 🍳

Una aplicación móvil moderna para descubrir recetas aleatorias, guardar tus favoritas y organizarlas por categorías.

## ✨ Características

- 🎲 Descubre recetas aleatorias con filtros de cocina
- ❤️ Guarda tus recetas favoritas
- 📁 Organiza recetas en categorías personalizadas
- 📸 Toma fotos de tus platos
- 👤 Perfil de usuario con tu colección
- 🔥 Firebase para autenticación y almacenamiento
- 🍽️ Integración con Spoonacular API

## Estado del Proyecto

- ✅ Flujo de autenticación completo con pantallas rediseñadas y validaciones.
- ✅ Experiencia visual adaptativa con selector de tema claro/oscuro/automático y uso consistente de la paleta.
- ✅ Internacionalización mediante i18next, selector de idioma y textos traducibles en toda la app.
- ✅ Pestaña de perfil conectada a Firestore con favoritos, configuraciones y modales coherentes.
- 🚧 Pendiente: pruebas automatizadas, soporte offline/búsqueda avanzada y experiencias sociales (compartir y puntuación).

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js (v16 o superior)
- pnpm (v8 o superior): `npm install -g pnpm`
- Expo CLI: `pnpm add -g expo-cli`
- Cuenta de Firebase
- API Key de Spoonacular

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JosvilG/MyYummiBite.git
   cd MyYummiBite
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` y añade tus credenciales:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   
   EXPO_PUBLIC_SPOONACULAR_API_KEY=tu_spoonacular_api_key
   ```

4. **Iniciar el proyecto**
   ```bash
   pnpm start
   ```

5. **Ejecutar en dispositivo/emulador**
   - iOS: Presiona `i`
   - Android: Presiona `a`
   - Web: Presiona `w`

## 📱 Capturas de Pantalla

*(Agregar capturas de pantalla aquí)*

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: React Native (Expo)
- **Navegación**: React Navigation v6
- **Estado**: MobX + Context API
- **Backend**: Firebase (Auth, Firestore, Storage)
- **API**: Spoonacular
- **Estilos**: StyleSheet nativo

### Estructura del Proyecto

```
MyYummiBite/
├── src/
│   ├── app/
│   │   ├── config/          # Firebase y otros providers globales
│   │   ├── navigation/      # AppNavigator + stacks
│   │   └── providers/       # AuthProvider, RecipeProvider, AppProviders
│   ├── features/
│   │   ├── auth/            # Pantallas + servicios de autenticación
│   │   ├── profile/         # UI/Hooks del perfil
│   │   └── recipes/         # UI, hooks, servicios y store MobX para recetas
│   ├── shared/
│   │   ├── components/      # Componentes agnósticos (Title, ReturnHeaderButton…)
│   │   └── icons/           # SVGs convertidos a componentes RN
│   └── constants/           # Temas y constantes de dominio
│       ├── theme.js
│       └── recipe.js
├── assets/                  # Fuentes y media estática
├── .env                     # Variables de entorno (no commitear)
├── .env.example             # Plantilla de configuración
├── app.json                 # Configuración de Expo
└── package.json
```

### Alias de imports

Para evitar rutas relativas largas configuramos:

| Alias       | Apunta a        | Uso                                  |
|-------------|-----------------|--------------------------------------|
| `@/*`       | `src/*`         | Features, providers, componentes...  |
| `@assets/*` | `assets/*`      | Imágenes y fuentes globales          |

Estos alias funcionan en Metro/Babel y TypeScript (`tsconfig.json`), así que puedes importar, por ejemplo, `@/shared/icons/add` o `@assets/user.jpg` sin preocuparte por la profundidad del archivo.

## 🔧 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Activa Storage para imágenes
5. Copia las credenciales a tu archivo `.env`

### Estructura de Firestore

```
users/
  {userId}/
    - id: string
    - username: string
    - name: string
    - email: string
    - createdAt: timestamp
    
    FavRecipes/
      {recipeId}/
        - id: number
        - url: string
        - category?: string
        - savedAt: timestamp
    
    Categories/
      {categoryId}/
        - category: string
```

## 🍳 Configuración de Spoonacular API

1. Regístrate en [Spoonacular](https://spoonacular.com/food-api)
2. Obtén tu API Key
3. Añádela a `.env` como `EXPO_PUBLIC_SPOONACULAR_API_KEY`

### Límites de la API

- Plan gratuito: 150 requests/día
- Considera implementar caché si necesitas más

## 📝 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
pnpm start

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios

# Ejecutar en Web
pnpm web

# Verificar código con ESLint
pnpm lint

# Formatear código con Prettier
pnpm format
```

## 🧪 Testing

*(Por implementar)*

```bash
pnpm test
```

## 🚢 Deployment

### Crear build de producción

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Usa ESLint y Prettier
- Sigue la estructura de carpetas existente
- Documenta funciones complejas
- Escribe commits descriptivos
- Añade tests si es posible

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Spoonacular API](https://spoonacular.com/food-api) por la API de recetas
- [Expo](https://expo.dev/) por el framework
- [Firebase](https://firebase.google.com/) por los servicios backend

## 🗺️ Roadmap

- [x] Refactorización completa a arquitectura moderna
- [x] Actualización a Expo SDK 52
- [x] Migración a Firebase v10
- [x] React Navigation v6
- [x] Implementar TypeScript
- [ ] Añadir tests unitarios
- [ ] Soporte offline
- [ ] Compartir recetas en redes sociales
- [ ] Sistema de puntuación de recetas
- [x] Modo oscuro
- [x] Internacionalización (i18n)

## 🛠️ Comandos Útiles

### Desarrollo Diario

```bash
# Iniciar con caché limpio
expo start -c

# Ejecutar específicamente en una plataforma
pnpm android  # o presiona 'a'
pnpm ios      # o presiona 'i'
pnpm web      # o presiona 'w'
```

### Limpieza y Mantenimiento

```bash
# Limpiar completamente el proyecto
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
expo start -c

# Auditar y corregir vulnerabilidades
pnpm audit
pnpm audit fix
```

### Build y Deploy

```bash
# Instalar EAS CLI
pnpm add -g eas-cli

# Login
eas login

# Build para producción
eas build --platform android
eas build --platform ios

# Submit a stores
eas submit --platform android
eas submit --platform ios
```

### Solución de Problemas Comunes

```bash
# Error: "Unable to resolve module"
watchman watch-del-all
rm -rf node_modules
pnpm install
expo start -c

# Error: Puerto en uso
pnpm dlx kill-port 19000 19001 19002

# Error: Problemas con Firebase
# 1. Verifica que .env exists
ls -la | grep .env
# 2. Reinicia con caché limpio
expo start -c
```

### Git Workflow

```bash
# Crear nueva rama para feature
git checkout -b feature/nueva-feature

# Añadir y commitear cambios
git add .
git commit -m "Descripción del cambio"

# Push a tu repositorio
git push origin feature/nueva-feature
```

### Pro Tips

**Alias útiles** (añade a `.bashrc` o `.zshrc`):

```bash
alias exs='expo start'
alias exc='expo start -c'
alias exa='expo start --android'
alias exi='expo start --ios'
```

**Comandos de teclado en Expo:**
- `a` - Abrir en Android
- `i` - Abrir en iOS  
- `w` - Abrir en Web
- `r` - Reload app
- `d` - Open DevTools

## 🔄 Actualización desde Versión Antigua

Si estás migrando desde la versión 1.x:

1. **Backup del proyecto**
   ```bash
   cp -r . ../MyYummiBite-backup
   ```

2. **Limpiar instalación antigua**
   ```bash
   rm -rf node_modules
   rm pnpm-lock.yaml
   ```

3. **Instalar nuevas dependencias**
   ```bash
   pnpm install
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

5. **Iniciar con caché limpio (opcional)**
   ```bash
   expo start -c
   ```

### Verificación de Instalación

Checklist:
- [ ] `node_modules` instalado sin errores
- [ ] Archivo `.env` creado y configurado
- [ ] Se puede ejecutar `pnpm start` sin errores
- [ ] Puedes ver la pantalla de login en Expo Go

### Diferencias Principales

**Firebase (v8 → v10):**
```javascript
// Antes
import { fire, auth, db } from './database/firebase';

// Ahora
import { auth, db } from './src/app/config/firebase';
```

**React Navigation (v5 → v6):**
- `tabBarOptions` → `screenOptions`
- Navegación automática basada en el estado de autenticación

**Estructura:**
- Todo el código productivo vive en `src/`
- `features/` agrupa pantallas, hooks y servicios por dominio
- `shared/` contiene UI reutilizable y SVGs

## 📚 Documentación Adicional

- [Changelog](./CHANGELOG.md) - Historial de cambios

---

**Versión actual:** 1.0.0  
**Última actualización:** Diciembre 2025
