/**
 * Validador de acciones del juego
 * Previene trampas y valida el estado del juego
 */

import { CONFIG, CROPS, ANIMALS } from '../config/gameConfig.js';

export class GameValidator {
    constructor() {
        this.enabled = CONFIG.ANTI_CHEAT_ENABLED;
    }

    /**
     * Valida si una acción es legítima
     * @param {string} action - Tipo de acción
     * @param {object} state - Estado actual del jugador
     * @param {object} params - Parámetros de la acción
     * @returns {object} { valid: boolean, error?: string }
     */
    validateAction(action, state, params) {
        if (!this.enabled) {
            return { valid: true };
        }

        switch (action) {
            case 'plant':
                return this.validatePlant(state, params);
            case 'harvest':
                return this.validateHarvest(state, params);
            case 'sell':
                return this.validateSell(state, params);
            case 'buy':
                return this.validateBuy(state, params);
            case 'breed':
                return this.validateBreed(state, params);
            default:
                return { valid: true };
        }
    }

    /**
     * Valida plantación de cultivos
     */
    validatePlant(state, params) {
        const { seedId, x, y } = params;

        // Verificar energía suficiente
        if (state.energy < CONFIG.CROP_ENERGY_COST) {
            return { 
                valid: false, 
                error: `Energía insuficiente. Requiere ${CONFIG.CROP_ENERGY_COST}` 
            };
        }

        // Verificar semillas disponibles
        if (!state.seeds[seedId] || state.seeds[seedId] <= 0) {
            return { valid: false, error: 'No tienes semillas de este tipo' };
        }

        // Verificar herramienta
        if (!state.tools.azada || state.tools.azada < 5) {
            return { valid: false, error: 'Herramienta en mal estado' };
        }

        // Verificar coordenadas válidas
        if (x < 0 || x >= state.landSize || y < 0 || y >= state.landSize) {
            return { valid: false, error: 'Coordenadas fuera de rango' };
        }

        // Verificar que la parcela esté vacía
        if (state.crops.some(c => c.x === x && c.y === y)) {
            return { valid: false, error: 'Parcela ya ocupada' };
        }

        // Verificar que la semilla existe
        if (!CROPS[seedId]) {
            return { valid: false, error: 'Semilla inválida' };
        }

        return { valid: true };
    }

    /**
     * Valida cosecha de cultivos
     */
    validateHarvest(state, params) {
        const { cropId } = params;

        // Verificar energía
        if (state.energy < CONFIG.HARVEST_ENERGY_COST) {
            return { 
                valid: false, 
                error: `Energía insuficiente. Requiere ${CONFIG.HARVEST_ENERGY_COST}` 
            };
        }

        // Verificar herramienta
        if (!state.tools.hoz || state.tools.hoz < 10) {
            return { valid: false, error: 'Hoz en mal estado' };
        }

        // Buscar el cultivo
        const crop = state.crops.find(c => c.id === cropId);
        if (!crop) {
            return { valid: false, error: 'Cultivo no encontrado' };
        }

        // Verificar etapa del cultivo
        if (crop.etapa !== 'cosechable') {
            return { valid: false, error: 'El cultivo no está listo para cosechar' };
        }

        return { valid: true };
    }

    /**
     * Valida venta de items
     */
    validateSell(state, params) {
        const { item, quantity = 1 } = params;

        // Verificar inventario
        if (!state.inventory[item] || state.inventory[item] < quantity) {
            return { valid: false, error: 'No tienes suficiente de este item' };
        }

        // Verificar cantidad razonable (anti-trampa)
        if (quantity > 1000) {
            return { 
                valid: false, 
                error: 'Cantidad sospechosamente alta' 
            };
        }

        return { valid: true };
    }

    /**
     * Valida compras
     */
    validateBuy(state, params) {
        const { cost, itemType } = params;

        // Verificar monedas
        if (state.coins < cost) {
            return { valid: false, error: 'Monedas insuficientes' };
        }

        // Verificar precio razonable
        const maxPrice = this.getMaxPrice(itemType);
        if (cost > maxPrice * 2) {
            return { 
                valid: false, 
                error: 'Precio sospechosamente alto' 
            };
        }

        return { valid: true };
    }

    /**
     * Valida cría de animales
     */
    validateBreed(state, params) {
        const { animalType } = params;

        // Verificar costo
        if (state.coins < 50) {
            return { valid: false, error: 'Monedas insuficientes para cruzar' };
        }

        // Verificar tener al menos 2 animales del tipo
        const count = state.animals.filter(a => a.type === animalType).length;
        if (count < 2) {
            return { valid: false, error: `Necesitas al menos 2 ${animalType}s` };
        }

        return { valid: true };
    }

    /**
     * Obtiene el precio máximo razonable para un item
     */
    getMaxPrice(itemType) {
        const basePrices = {
            'semilla': 10,
            'animal': 50,
            'herramienta': 100,
            'mejora': 500
        };
        return basePrices[itemType] || 1000;
    }

    /**
     * Valida integridad del estado del jugador
     */
    validateStateIntegrity(state) {
        if (!this.enabled) return true;

        // Verificar valores negativos imposibles
        if (state.coins < -1000) return false;
        if (state.energy < 0 || state.energy > 200) return false;
        if (state.level < 1 || state.level > 100) return false;

        // Verificar inventario
        for (const [item, qty] of Object.entries(state.inventory || {})) {
            if (qty < 0 || qty > 10000) return false;
        }

        // Verificar herramientas
        for (const [tool, durability] of Object.entries(state.tools || {})) {
            if (durability < 0 || durability > 100) return false;
        }

        return true;
    }

    /**
     * Registra acción para auditoría
     */
    logAction(userId, action, params, result) {
        if (!this.enabled) return;
        
        const logEntry = {
            timestamp: Date.now(),
            userId,
            action,
            params,
            success: result.valid
        };
        
        // En producción, enviar al servidor
        console.log('[AUDIT]', logEntry);
        
        // Guardar en localStorage para debugging
        const auditLog = JSON.parse(localStorage.getItem('cc_audit_log') || '[]');
        auditLog.push(logEntry);
        if (auditLog.length > 100) auditLog.shift(); // Mantener últimos 100
        localStorage.setItem('cc_audit_log', JSON.stringify(auditLog));
    }
}

// Singleton
export const validator = new GameValidator();
