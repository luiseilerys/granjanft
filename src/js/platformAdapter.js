/**
 * Adaptador de plataforma para compatibilidad Webxdc y Navegador
 * Detecta automáticamente el entorno y proporciona APIs consistentes
 */

export class PlatformAdapter {
    constructor() {
        this.isWebxdc = false;
        this.webxdcInstance = null;
        this.storageType = 'local';
        this.peerId = null;
        this.peerName = null;
        
        this.detectEnvironment();
    }
    
    /**
     * Detecta si estamos en Webxdc o navegador normal
     */
    detectEnvironment() {
        // Verificar si webxdc está disponible
        if (typeof window !== 'undefined' && window.webxdc && window.webxdc.sendUpdate) {
            this.isWebxdc = true;
            this.webxdcInstance = window.webxdc;
            this.storageType = 'webxdc';
            this.peerId = this.webxdcInstance.selfAddr();
            this.peerName = this.webxdcInstance.selfName();
            
            console.log('[Platform] Ejecutando en Webxdc');
        } else {
            this.isWebxdc = false;
            this.storageType = 'local';
            // Generar ID único para navegador
            this.peerId = 'browser_' + Math.random().toString(36).substr(2, 9);
            this.peerName = localStorage.getItem('cc_player_name') || 'Granjero Web';
            
            console.log('[Platform] Ejecutando en Navegador');
        }
    }
    
    /**
     * Obtiene el ID del usuario actual
     */
    getUserId() {
        return this.peerId;
    }
    
    /**
     * Obtiene el nombre del usuario actual
     */
    getUserName() {
        return this.peerName;
    }
    
    /**
     * Guarda datos según el entorno
     */
    saveData(key, data) {
        if (this.isWebxdc) {
            // En Webxdc, usar sendUpdate para sincronizar
            try {
                this.webxdcInstance.sendUpdate({
                    payload: { type: 'SAVE', key, data },
                    description: `Guardado: ${key}`
                });
            } catch (e) {
                console.warn('[Platform] Error al guardar en Webxdc:', e);
            }
        }
        
        // Siempre guardar en localStorage como backup
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('[Platform] Error al guardar en localStorage:', e);
        }
    }
    
    /**
     * Carga datos según el entorno
     */
    loadData(key) {
        // Intentar cargar de localStorage primero
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('[Platform] Error al cargar de localStorage:', e);
        }
        
        return null;
    }
    
    /**
     * Envía una actualización a otros jugadores (solo Webxdc)
     */
    sendUpdate(payload, description = '') {
        if (this.isWebxdc && this.webxdcInstance) {
            this.webxdcInstance.sendUpdate({
                payload,
                description
            });
        }
    }
    
    /**
     * Establece listener para actualizaciones entrantes
     */
    setUpdateListener(callback) {
        if (this.isWebxdc && this.webxdcInstance) {
            this.webxdcInstance.setUpdateListener(callback);
        } else {
            // Mock para navegador - se puede usar para simular multiplayer
            window.mockUpdateCallback = callback;
        }
    }
    
    /**
     * Simula recepción de actualización (para testing en navegador)
     */
    simulateUpdate(payload) {
        if (window.mockUpdateCallback) {
            window.mockUpdateCallback(payload);
        }
    }
    
    /**
     * Verifica si hay conexión a internet
     */
    isOnline() {
        if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
            return navigator.onLine;
        }
        return true;
    }
    
    /**
     * Obtiene información del dispositivo/plataforma
     */
    getDeviceInfo() {
        return {
            platform: this.isWebxdc ? 'webxdc' : 'browser',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            screen: typeof window !== 'undefined' ? {
                width: window.screen?.width,
                height: window.screen?.height
            } : null,
            language: typeof navigator !== 'undefined' ? navigator.language : 'es'
        };
    }
    
    /**
     * Muestra notificación (adaptada a cada plataforma)
     */
    showNotification(title, message) {
        if (this.isWebxdc) {
            // Webxdc no tiene notificaciones nativas, usar console o UI custom
            console.log(`[Notification] ${title}: ${message}`);
        } else {
            // Navegador: usar Notification API si está disponible
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body: message });
            } else {
                console.log(`[Notification] ${title}: ${message}`);
            }
        }
    }
    
    /**
     * Solicita permisos de notificación
     */
    async requestNotificationPermission() {
        if (!this.isWebxdc && 'Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            } catch (e) {
                console.warn('[Platform] Error solicitando permisos:', e);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Exporta estado del juego para compartir
     */
    exportGameState(state) {
        const exportData = {
            version: '1.0',
            timestamp: Date.now(),
            platform: this.isWebxdc ? 'webxdc' : 'browser',
            playerId: this.peerId,
            playerName: this.peerName,
            state: state
        };
        
        return JSON.stringify(exportData);
    }
    
    /**
     * Importa estado del juego desde exportación
     */
    importGameState(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Validar estructura básica
            if (!data.version || !data.state) {
                throw new Error('Formato inválido');
            }
            
            return data.state;
        } catch (e) {
            console.error('[Platform] Error al importar estado:', e);
            return null;
        }
    }
}

// Singleton global
export const platform = new PlatformAdapter();

// Hacer disponible globalmente para compatibilidad con código legacy
if (typeof window !== 'undefined') {
    window.platformAdapter = platform;
}
