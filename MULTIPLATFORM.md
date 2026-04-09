# Guía de Compatibilidad Multi-Plataforma

## Resumen
El juego **CryptoCrop: Genesis** ahora es compatible tanto con **Webxdc** como con **navegadores web tradicionales**.

## Arquitectura

### Nuevos Módulos

1. **`src/js/platformAdapter.js`**
   - Detecta automáticamente el entorno (Webxdc vs Navegador)
   - Proporciona APIs unificadas para almacenamiento y comunicación
   - Maneja notificaciones y características específicas de plataforma

2. **`src/js/syncManager.js`**
   - Gestiona sincronización de estado multi-jugador
   - Funciona con Webxdc (P2P real) y navegador (localStorage + simulación)
   - Sistema de listeners para actualizaciones en tiempo real

3. **`src/config/gameConfig.js`**
   - Configuración centralizada del juego
   - Valores ajustables sin modificar código

4. **`src/js/validator.js`**
   - Validación anti-trampas
   - Verificación de integridad del estado

5. **`src/css/styles.css`**
   - Estilos externos organizados
   - Variables CSS para personalización

## Cómo Funciona

### En Webxdc
```javascript
// Detección automática
platform.isWebxdc === true

// Sincronización P2P real
syncManager.broadcastShared({ coins: 100 });

// ID único por jugador
platform.getUserId() // "user_abc123"
```

### En Navegador
```javascript
// Detección automática
platform.isWebxdc === false

// Almacenamiento local
syncManager.broadcastShared({ coins: 100 }); // Guarda en localStorage

// ID generado
platform.getUserId() // "browser_xyz789"
```

## Migración de Código Legacy

El código original sigue funcionando gracias a wrappers compatibles:

```javascript
// Antes (solo webxdc)
webxdc.sendUpdate({...});

// Ahora (compatible ambos)
broadcastShared(data); // Usa syncManager automáticamente
```

## Características por Plataforma

| Característica | Webxdc | Navegador |
|---------------|--------|-----------|
| Multiplayer P2P | ✅ Real | ⚠️ Simulado |
| Persistencia | ✅ Webxdc Storage | ✅ LocalStorage |
| Notificaciones | ❌ Console | ✅ Notification API |
| Sync Automático | ✅ Cada 500ms | ❌ Manual |
| Exportar/Importar | ✅ | ✅ |

## Uso en Producción

### Para Webxdc
1. Empaquetar todo el proyecto en un ZIP
2. Incluir `manifest.toml` de Webxdc
3. Subir a instancia compatible

### Para Navegador
1. Servir `index.html` desde cualquier servidor HTTP
2. O abrir directamente como archivo local
3. Los datos se guardan en localStorage

## Testing

### Probar en Navegador
```bash
# Servidor local simple
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Probar en Webxdc
1. Usar cliente Webxdc (Delta Chat, etc.)
2. Cargar el archivo .xdc
3. Verificar sincronización entre múltiples instancias

## APIs Públicas

### Platform Adapter
```javascript
platform.getUserId()           // ID único del usuario
platform.getUserName()         // Nombre mostrado
platform.isWebxdc              // Boolean: es Webxdc?
platform.saveData(key, data)   // Guardar datos
platform.loadData(key)         // Cargar datos
platform.sendUpdate(payload)   // Enviar actualización
platform.setUpdateListener(cb) // Escuchar actualizaciones
platform.showNotification(t, m)// Mostrar notificación
platform.exportGameState(s)    // Exportar estado
platform.importGameState(json) // Importar estado
```

### Sync Manager
```javascript
syncManager.getSharedState()   // Estado compartido
syncManager.getLocalState()    // Estado local
syncManager.broadcastShared(d) // Broadcast cambios
syncManager.addListener(cb)    // Suscribirse a cambios
syncManager.saveLocal()        // Forzar guardado
syncManager.loadLocal()        // Cargar desde storage
syncManager.exportState()      // Exportar completo
syncManager.importState(data)  // Importar completo
syncManager.reset()            // Reiniciar todo
```

## Solución de Problemas

### El juego no guarda en navegador
- Verificar que localStorage está habilitado
- Revisar consola por errores de CORS
- Asegurar usar protocolo http:// o https:// (no file://)

### No hay sincronización en Webxdc
- Verificar que todos los jugadores usan la misma versión
- Revisar logs de console para errores de sendUpdate
- Confirmar manifest.toml correcto

### Errores de módulos ES6
- Servir desde servidor HTTP (no file://)
- Verificar MIME types correctos
- Usar browser moderno (Chrome 61+, Firefox 60+)

## Ejemplo de Uso

```javascript
// Inicialización automática al cargar
import { platform, syncManager } from './src/js/platformAdapter.js';

// Detectar plataforma
console.log('Plataforma:', platform.isWebxdc ? 'Webxdc' : 'Navegador');

// Cargar estado guardado
syncManager.loadLocal();

// Obtener estados
const shared = syncManager.getSharedState();
const local = syncManager.getLocalState();

// Modificar y broadcast
syncManager.broadcastShared({
    climaGlobal: 'lluvia',
    day: shared.day + 1
});

// Escuchar cambios
syncManager.addListener((type, data) => {
    console.log('Cambio:', type, data);
    updateUI();
});
```

## Futuras Mejoras

- [ ] IndexedDB para mayor capacidad de almacenamiento
- [ ] Service Workers para modo offline
- [ ] WebRTC para multiplayer en navegador
- [ ] Compresión de estado para sync más rápido
- [ ] Historial de cambios para undo/redo

## Licencia

Mismo license que el proyecto principal.
