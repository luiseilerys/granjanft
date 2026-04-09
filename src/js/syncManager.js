/**
 * Sistema de sincronización multi-plataforma
 * Maneja la sincronización del estado entre Webxdc y localStorage
 */

import { platform } from './platformAdapter.js';
import { CONFIG } from '../config/gameConfig.js';

export class SyncManager {
    constructor() {
        this.sharedState = {};
        this.localState = {};
        this.listeners = [];
        this.lastSyncTime = 0;
        this.syncInterval = null;
        
        this.init();
    }
    
    /**
     * Inicializa el sistema de sincronización
     */
    init() {
        // Establecer listener para actualizaciones entrantes
        platform.setUpdateListener((update) => {
            this.handleIncomingUpdate(update);
        });
        
        // Iniciar sync periódico solo en Webxdc
        if (platform.isWebxdc) {
            this.startAutoSync();
        }
        
        console.log('[SyncManager] Inicializado en modo:', platform.isWebxdc ? 'Webxdc' : 'Navegador');
    }
    
    /**
     * Inicia sincronización automática (solo Webxdc)
     */
    startAutoSync() {
        if (this.syncInterval) return;
        
        this.syncInterval = setInterval(() => {
            this.syncState();
        }, CONFIG.SYNC_INTERVAL_MS);
    }
    
    /**
     * Detiene sincronización automática
     */
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    
    /**
     * Maneja actualizaciones entrantes
     */
    handleIncomingUpdate(update) {
        const payload = update.payload;
        
        if (!payload) return;
        
        switch (payload.type) {
            case 'SHARED':
                this.mergeSharedState(payload.data);
                break;
            case 'SAVE':
                // Otro jugador guardó su estado
                console.log('[Sync] Jugador actualizó estado:', payload.key);
                break;
            case 'ACTION':
                // Acción de otro jugador que afecta el estado compartido
                this.handleRemoteAction(payload.action, payload.params);
                break;
        }
        
        // Notificar a los listeners
        this.notifyListeners('update', payload);
    }
    
    /**
     * Fusiona estado compartido recibido
     */
    mergeSharedState(partialData) {
        Object.assign(this.sharedState, partialData);
        this.saveLocal();
        this.notifyListeners('shared', partialData);
    }
    
    /**
     * Maneja acciones remotas
     */
    handleRemoteAction(action, params) {
        console.log('[Sync] Acción remota:', action, params);
        // Aquí se procesarían acciones que afectan el estado global
        // como votaciones, mercado, etc.
    }
    
    /**
     * Sincroniza el estado actual
     */
    syncState() {
        if (!platform.isWebxdc) return;
        
        const now = Date.now();
        if (now - this.lastSyncTime < CONFIG.SYNC_INTERVAL_MS) return;
        
        this.lastSyncTime = now;
        
        // Enviar estado local para sincronizar
        platform.sendUpdate({
            payload: {
                type: 'SYNC',
                timestamp: now,
                localState: this.localState
            },
            description: 'Sincronización periódica'
        });
    }
    
    /**
     * Actualiza estado compartido y broadcast
     */
    broadcastShared(partial) {
        // Actualizar estado compartido localmente
        if (!this.sharedState.version) {
            this.sharedState.version = 0;
        }
        this.sharedState.version++;
        Object.assign(this.sharedState, partial);
        
        // Guardar localmente
        this.saveLocal();
        
        // Enviar actualización si es Webxdc
        if (platform.isWebxdc) {
            platform.sendUpdate({
                payload: {
                    type: 'SHARED',
                    data: partial,
                    version: this.sharedState.version
                },
                description: 'Actualización compartida'
            });
        }
        
        // Notificar cambios
        this.notifyListeners('shared', partial);
    }
    
    /**
     * Guarda estado en almacenamiento persistente
     */
    saveLocal() {
        const data = {
            shared: this.sharedState,
            local: this.localState,
            lastSave: Date.now()
        };
        
        platform.saveData('cc_economy_sync', data);
    }
    
    /**
     * Carga estado desde almacenamiento persistente
     */
    loadLocal() {
        const data = platform.loadData('cc_economy_sync');
        
        if (data) {
            if (data.shared) {
                this.sharedState = data.shared;
            }
            if (data.local) {
                this.localState = data.local;
            }
            
            console.log('[Sync] Estado cargado correctamente');
            this.notifyListeners('load', data);
            return true;
        }
        
        console.log('[Sync] No hay estado guardado, inicializando...');
        this.initializeDefaultState();
        return false;
    }
    
    /**
     * Inicializa estado por defecto
     */
    initializeDefaultState() {
        // Estado compartido por defecto
        this.sharedState = {
            version: 0,
            mercado: [],
            votaciones: [],
            climaGlobal: 'soleado',
            climaExpira: Date.now() + 3600000,
            calificaciones: [],
            cooperativas: [],
            leaderboard: {},
            stockPrices: {},
            raidActive: null,
            season: '🌱 Primavera',
            seasonExpires: Date.now() + 86400000,
            globalChallenges: [],
            tradeRoutes: [],
            futures: [],
            moonEvent: null,
            blackMarket: [],
            day: 1,
            lastDayUpdate: Date.now(),
            coopBank: 0,
            achievementLedger: [],
            farmSnapshots: [],
            salesLog: [],
            auctionItem: null,
            communityFund: 0,
            doubleProduction: null
        };
        
        // Estado local por defecto
        this.localState = {
            userId: platform.getUserId(),
            displayName: platform.getUserName(),
            landSize: 2,
            mejoras: [],
            toolLevel: 1,
            coins: 200,
            energy: 100,
            ultimaRecarga: Date.now(),
            level: 1,
            xp: 0,
            prestige: 0,
            crops: [],
            inventory: {},
            seeds: {},
            animals: [],
            tools: { azada: 100, regadera: 100, hoz: 100 },
            reputacion: 0,
            coopId: null,
            misiones: [],
            logros: [],
            researchUnlocked: [],
            pondLevel: 1,
            beehives: 0,
            lastHoneyCollect: 0,
            lastDailyBonus: 0,
            lastFishTime: 0,
            legendaryCards: [],
            pet: null,
            sprinklers: 0,
            lastMoonCheck: 0,
            bankCoins: 0,
            skills: { farming: 1, animal: 1, fishing: 1, mining: 1, combat: 1 },
            pickaxeLevel: 1,
            ores: { copper: 0, iron: 0, gold: 0 },
            greenhouse: false,
            greenhouseLevel: 1,
            tractor: false,
            lastFestival: 0,
            npcQuests: [],
            swordLevel: 1,
            essence: 0,
            dungeonDepth: 1,
            lastDungeon: 0,
            dailyStreak: 0,
            lastLogin: Date.now(),
            lastMaintenance: Date.now(),
            cosmetics: []
        };
        
        // Inicializar inventario con valores por defecto
        this.localState.inventory = {
            trigo: 0, zanahoria: 0, maiz: 0, patata: 0,
            tomate: 0, fresa: 0, arroz: 0, cafe: 0,
            huevo: 0, leche: 0, lana: 0, huevo_pato: 0, leche_cabra: 0,
            miel: 0, pescado_comun: 0, pescado_grande: 0, pescado_dorado: 0,
            madera: 2, piedra: 1, pasto: 5, fertilizante: 0,
            copper: 0, iron: 0, gold: 0, essence: 0
        };
        
        // Inicializar semillas
        this.localState.seeds = {
            trigo: 5, zanahoria: 3, maiz: 2, patata: 2,
            tomate: 1, fresa: 0, arroz: 0, cafe: 0
        };
        
        this.saveLocal();
    }
    
    /**
     * Obtiene estado compartido
     */
    getSharedState() {
        return this.sharedState;
    }
    
    /**
     * Obtiene estado local
     */
    getLocalState() {
        return this.localState;
    }
    
    /**
     * Actualiza estado local
     */
    setLocalState(key, value) {
        if (typeof key === 'string') {
            this.localState[key] = value;
        } else if (typeof key === 'object') {
            Object.assign(this.localState, key);
        }
        this.saveLocal();
    }
    
    /**
     * Registra listener para cambios de estado
     */
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * Remueve listener
     */
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
    
    /**
     * Notifica a todos los listeners
     */
    notifyListeners(type, data) {
        this.listeners.forEach(callback => {
            try {
                callback(type, data);
            } catch (e) {
                console.error('[Sync] Error en listener:', e);
            }
        });
    }
    
    /**
     * Exporta estado completo para backup
     */
    exportState() {
        return {
            shared: this.sharedState,
            local: this.localState,
            exportedAt: Date.now(),
            platform: platform.isWebxdc ? 'webxdc' : 'browser',
            version: '1.0'
        };
    }
    
    /**
     * Importa estado desde backup
     */
    importState(exportedData) {
        try {
            const data = typeof exportedData === 'string' 
                ? JSON.parse(exportedData) 
                : exportedData;
            
            if (data.shared) {
                this.sharedState = data.shared;
            }
            if (data.local) {
                this.localState = data.local;
            }
            
            this.saveLocal();
            this.notifyListeners('import', data);
            
            console.log('[Sync] Estado importado correctamente');
            return true;
        } catch (e) {
            console.error('[Sync] Error al importar estado:', e);
            return false;
        }
    }
    
    /**
     * Limpia estado y reinicia
     */
    reset() {
        this.sharedState = {};
        this.localState = {};
        localStorage.removeItem('cc_economy_sync');
        this.initializeDefaultState();
        this.notifyListeners('reset', null);
    }
}

// Singleton
export const syncManager = new SyncManager();
