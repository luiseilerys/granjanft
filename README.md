# CryptoCrop: Genesis - Economía y Drenaje

[![Webxdc Compatible](https://img.shields.io/badge/Webxdc-Compatible-blue)](https://webxdc.org)
[![Browser Compatible](https://img.shields.io/badge/Browser-Compatible-green)](https://developer.mozilla.org)
[![Version](https://img.shields.io/badge/version-2.0.0-orange)](./index.html)

## 🎮 Descripción

Juego web tipo "idle/incremental" con mecánicas de granja, economía compleja y sistema de drenaje. 
**Ahora compatible con Webxdc (multiplayer P2P) y navegadores tradicionales.**

## ✨ Características Principales

### Sistemas de Juego
- 🌱 **Agricultura**: 8 cultivos con genética y cruzamiento
- 🐔 **Animales**: 5 especies con cría y productos
- 📊 **Economía**: Bolsa, mercado P2P, inflación dinámica
- 🏦 **Banca**: Intereses, futuros, apuestas
- ⛏️ **RPG**: Minería, mazmorras, hechizos, cocina
- 🤝 **Social**: Cooperativas, incursiones, votaciones
- 🏆 **Endgame**: Prestigio, investigación, mascotas

### Novedades v2.0 - Multi-Plataforma
- ✅ **Detección automática** de plataforma (Webxdc/Navegador)
- ✅ **Sincronización P2P real** en Webxdc
- ✅ **localStorage fallback** en navegadores
- ✅ **APIs unificadas** para desarrollo consistente
- ✅ **Exportar/Importar** estado del juego
- ✅ **Validación anti-trampas** integrada

## 🚀 Instalación y Uso

### En Navegador Web

```bash
# Opción 1: Servidor local
python3 -m http.server 8000
# Abrir http://localhost:8000

# Opción 2: Archivo directo (limitado)
# Abrir index.html en Chrome/Firefox/Edge
```

### En Webxdc

1. Empaquetar el proyecto:
```bash
zip -r cryptcrop.xdc index.html manifest.toml src/ tests/
```

2. Cargar en cliente compatible (Delta Chat, etc.)

3. Jugar multiplayer P2P automático

## 📁 Estructura del Proyecto

```
/workspace
├── index.html              # Punto de entrada principal
├── manifest.toml           # Configuración Webxdc
├── MULTIPLATFORM.md        # Guía detallada multi-plataforma
├── REFACTORING.md          # Documentación de refactorización
├── README.md               # Este archivo
├── src/
│   ├── config/
│   │   └── gameConfig.js   # Configuración centralizada
│   ├── css/
│   │   └── styles.css      # Estilos organizados
│   └── js/
│       ├── platformAdapter.js  # Adaptador multi-plataforma
│       ├── syncManager.js      # Gestor de sincronización
│       └── validator.js        # Validador anti-trampas
└── tests/
    └── game.test.js        # Suite de pruebas
```

## 🔧 APIs Públicas

### Platform Adapter
```javascript
import { platform } from './src/js/platformAdapter.js';

platform.getUserId()           // ID único del usuario
platform.getUserName()         // Nombre mostrado  
platform.isWebxdc              // Boolean: es Webxdc?
platform.saveData(key, data)   // Guardar datos
platform.loadData(key)         // Cargar datos
platform.sendUpdate(payload)   // Enviar actualización
platform.setUpdateListener(cb) // Escuchar actualizaciones
```

### Sync Manager
```javascript
import { syncManager } from './src/js/syncManager.js';

syncManager.getSharedState()   // Estado compartido
syncManager.getLocalState()    // Estado local
syncManager.broadcastShared(d) // Broadcast cambios
syncManager.addListener(cb)    // Suscribirse a cambios
syncManager.exportState()      // Exportar completo
syncManager.importState(data)  // Importar completo
```

## 🧪 Testing

```bash
# Ejecutar tests
node tests/game.test.js

# Servidor de desarrollo
python3 -m http.server 8000
```

## 📊 Comparativa de Plataformas

| Característica | Webxdc | Navegador |
|---------------|--------|-----------|
| Multiplayer P2P | ✅ Real | ⚠️ Simulado |
| Persistencia | ✅ Webxdc Storage | ✅ LocalStorage |
| Notificaciones | ❌ Console | ✅ Notification API |
| Sync Automático | ✅ Cada 500ms | ❌ Manual |
| Exportar/Importar | ✅ | ✅ |

## 🛠️ Desarrollo

### Requisitos
- Navegador moderno (Chrome 61+, Firefox 60+)
- Para módulos ES6: servidor HTTP (no file://)

### Arquitectura

1. **platformAdapter.js**: Detecta entorno y provee APIs unificadas
2. **syncManager.js**: Maneja sincronización y persistencia
3. **validator.js**: Previene trampas y valida acciones
4. **gameConfig.js**: Configuración externalizada

### Añadir Nueva Funcionalidad

```javascript
// 1. Importar módulos
import { platform, syncManager } from './src/js/platformAdapter.js';

// 2. Usar APIs unificadas
syncManager.broadcastShared({ nuevaFeature: true });

// 3. El código funciona en ambas plataformas automáticamente
```

## 📝 Changelog

### v2.0.0 (Actual)
- ✅ Compatibilidad multi-plataforma Webxdc/Navegador
- ✅ Sistema de sincronización mejorado
- ✅ Validación anti-trampas
- ✅ Configuración externalizada
- ✅ CSS modular con variables
- ✅ Manifest para Webxdc

### v1.0.0
- Juego base monocromático
- Todos los sistemas originales

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama (`git checkout -b feature/nueva`)
3. Commit cambios (`git commit -m 'Añadir nueva feature'`)
4. Push (`git push origin feature/nueva`)
5. Abrir Pull Request

## 📄 Licencia

Misma licencia que el proyecto original.

## 🔗 Enlaces

- [Documentación Multi-Plataforma](MULTIPLATFORM.md)
- [Guía de Refactorización](REFACTORING.md)
- [Webxdc.org](https://webxdc.org)

---

**Desarrollado con ❤️ para la comunidad CryptoCrop**
