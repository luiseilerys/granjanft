/**
 * Suite de pruebas para CryptoCrop: Genesis
 * Valida la lógica del juego y previene regresiones
 */

// Mock de localStorage
const mockLocalStorage = {
    data: {},
    getItem(key) { return this.data[key] || null; },
    setItem(key, value) { this.data[key] = value; },
    removeItem(key) { delete this.data[key]; },
    clear() { this.data = {}; }
};

// Mock de webxdc
const mockWebxdc = {
    sendUpdate: () => {},
    setUpdateListener: () => {},
    selfAddr: () => 'test_user_123',
    selfName: () => 'TestPlayer'
};

// Test runner simple
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    run(name, fn) {
        try {
            fn();
            this.passed++;
            this.tests.push({ name, status: 'PASS' });
            console.log(`✅ PASS: ${name}`);
        } catch (error) {
            this.failed++;
            this.tests.push({ name, status: 'FAIL', error: error.message });
            console.error(`❌ FAIL: ${name} - ${error.message}`);
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    summary() {
        console.log('\n=== RESUMEN DE PRUEBAS ===');
        console.log(`Total: ${this.passed + this.failed}`);
        console.log(`✅ Pasadas: ${this.passed}`);
        console.log(`❌ Fallidas: ${this.failed}`);
        return this.failed === 0;
    }
}

// ============================================
// PRUEBAS DE CONFIGURACIÓN
// ============================================
function runConfigTests(runner) {
    runner.run('CONFIG tiene valores válidos', () => {
        runner.assert(CONFIG.INFLATION_THRESHOLD > 0, 'INFLATION_THRESHOLD debe ser positivo');
        runner.assert(CONFIG.BANK_INTEREST_RATE > 0, 'BANK_INTEREST_RATE debe ser positivo');
        runner.assert(CONFIG.MAX_ENERGY_BASE > 0, 'MAX_ENERGY_BASE debe ser positivo');
    });

    runner.run('CROPS tiene datos completos', () => {
        const crops = Object.values(CROPS);
        runner.assert(crops.length > 0, 'Debe haber cultivos definidos');
        crops.forEach(crop => {
            runner.assert(crop.emoji, 'Cada cultivo debe tener emoji');
            runner.assert(crop.tiempoHoras > 0, 'Tiempo debe ser positivo');
            runner.assert(crop.valorBase > 0, 'Valor base debe ser positivo');
            runner.assert(crop.precioSemilla > 0, 'Precio semilla debe ser positivo');
        });
    });

    runner.run('ANIMALS tiene datos completos', () => {
        const animals = Object.values(ANIMALS);
        runner.assert(animals.length > 0, 'Debe haber animales definidos');
        animals.forEach(animal => {
            runner.assert(animal.emoji, 'Cada animal debe tener emoji');
            runner.assert(animal.product, 'Cada animal debe tener producto');
            runner.assert(animal.costo > 0, 'Costo debe ser positivo');
        });
    });

    runner.run('SEASONS está correctamente definido', () => {
        runner.assertEquals(SEASONS.length, 4, 'Debe haber 4 estaciones');
        runner.assert(Object.keys(SEASON_BONUS).length === 4, 'Cada estación debe tener bonificaciones');
    });
}

// ============================================
// PRUEBAS DEL VALIDADOR
// ============================================
function runValidatorTests(runner) {
    const testState = {
        energy: 50,
        coins: 100,
        seeds: { trigo: 5, zanahoria: 3 },
        tools: { azada: 100, hoz: 100, regadera: 100 },
        landSize: 2,
        crops: [],
        inventory: { trigo: 10, huevo: 5 },
        animals: [
            { type: 'chicken', fedAt: Date.now() },
            { type: 'chicken', fedAt: Date.now() }
        ],
        level: 5
    };

    runner.run('Validador permite plantación válida', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('plant', testState, {
            seedId: 'trigo',
            x: 0,
            y: 0
        });
        runner.assert(result.valid, 'Plantación válida debe ser aceptada');
    });

    runner.run('Validador rechaza plantación sin energía', () => {
        const validator = new GameValidator();
        const lowEnergyState = { ...testState, energy: 5 };
        const result = validator.validateAction('plant', lowEnergyState, {
            seedId: 'trigo',
            x: 0,
            y: 0
        });
        runner.assert(!result.valid, 'Debe rechazar por energía insuficiente');
        runner.assert(result.error.includes('Energía'), 'Error debe mencionar energía');
    });

    runner.run('Validador rechaza plantación sin semillas', () => {
        const validator = new GameValidator();
        const noSeedsState = { ...testState, seeds: {} };
        const result = validator.validateAction('plant', noSeedsState, {
            seedId: 'trigo',
            x: 0,
            y: 0
        });
        runner.assert(!result.valid, 'Debe rechazar por falta de semillas');
    });

    runner.run('Validador rechaza coordenadas inválidas', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('plant', testState, {
            seedId: 'trigo',
            x: 10,
            y: 10
        });
        runner.assert(!result.valid, 'Debe rechazar coordenadas fuera de rango');
    });

    runner.run('Validador permite cosecha válida', () => {
        const validator = new GameValidator();
        const stateWithCrop = {
            ...testState,
            crops: [{ id: 123, etapa: 'cosechable', x: 0, y: 0 }]
        };
        const result = validator.validateAction('harvest', stateWithCrop, {
            cropId: 123
        });
        runner.assert(result.valid, 'Cosecha válida debe ser aceptada');
    });

    runner.run('Validador rechaza cosecha prematura', () => {
        const validator = new GameValidator();
        const stateWithYoungCrop = {
            ...testState,
            crops: [{ id: 123, etapa: 'brote', x: 0, y: 0 }]
        };
        const result = validator.validateAction('harvest', stateWithYoungCrop, {
            cropId: 123
        });
        runner.assert(!result.valid, 'Debe rechazar cultivo no maduro');
    });

    runner.run('Validador permite venta válida', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('sell', testState, {
            item: 'trigo',
            quantity: 5
        });
        runner.assert(result.valid, 'Venta válida debe ser aceptada');
    });

    runner.run('Validador rechaza venta sin inventario', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('sell', testState, {
            item: 'maiz',
            quantity: 5
        });
        runner.assert(!result.valid, 'Debe rechazar venta sin items');
    });

    runner.run('Validador detecta cantidad sospechosa', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('sell', testState, {
            item: 'trigo',
            quantity: 5000
        });
        runner.assert(!result.valid, 'Debe detectar cantidad sospechosa');
    });

    runner.run('Validador permite cría con 2 animales', () => {
        const validator = new GameValidator();
        const result = validator.validateAction('breed', testState, {
            animalType: 'chicken'
        });
        runner.assert(result.valid, 'Cría con 2 animales debe ser válida');
    });

    runner.run('Validador rechaza cría con 1 animal', () => {
        const validator = new GameValidator();
        const stateOneAnimal = {
            ...testState,
            animals: [{ type: 'chicken', fedAt: Date.now() }]
        };
        const result = validator.validateAction('breed', stateOneAnimal, {
            animalType: 'chicken'
        });
        runner.assert(!result.valid, 'Debe rechazar cría con solo 1 animal');
    });

    runner.run('Validador de integridad acepta estado válido', () => {
        const validator = new GameValidator();
        const valid = validator.validateStateIntegrity(testState);
        runner.assert(valid, 'Estado válido debe pasar integridad');
    });

    runner.run('Validador de integridad rechaza monedas negativas extremas', () => {
        const validator = new GameValidator();
        const invalidState = { ...testState, coins: -5000 };
        const valid = validator.validateStateIntegrity(invalidState);
        runner.assert(!valid, 'Debe rechazar monedas negativas extremas');
    });

    runner.run('Validador de integridad rechaza energía imposible', () => {
        const validator = new GameValidator();
        const invalidState = { ...testState, energy: 500 };
        const valid = validator.validateStateIntegrity(invalidState);
        runner.assert(!valid, 'Debe rechazar energía imposible');
    });
}

// ============================================
// PRUEBAS DE ECONOMÍA
// ============================================
function runEconomyTests(runner) {
    runner.run('Precios base son positivos', () => {
        Object.values(CROPS).forEach(crop => {
            runner.assert(crop.valorBase > 0, `${crop.emoji} valor debe ser positivo`);
            runner.assert(crop.precioSemilla > 0, `${crop.emoji} precio semilla debe ser positivo`);
        });
    });

    runner.run('Costos de animales son razonables', () => {
        Object.values(ANIMALS).forEach(animal => {
            runner.assert(animal.costo >= 10, `${animal.emoji} costo mínimo 10`);
            runner.assert(animal.costo <= 1000, `${animal.emoji} costo máximo 1000`);
        });
    });

    runner.run('Investigaciones tienen costos crecientes', () => {
        let lastCost = 0;
        RESEARCH.forEach(res => {
            runner.assert(res.cost > lastCost, `${res.name} debe costar más que anterior`);
            lastCost = res.cost;
        });
    });

    runner.run('Items de lujo tienen precios altos', () => {
        LUXURY_ITEMS.forEach(item => {
            runner.assert(item.price >= 1000, `${item.name} debe ser item de lujo (>=1000$)`);
        });
    });
}

// ============================================
// PRUEBAS DE PROGRESIÓN
// ============================================
function runProgressionTests(runner) {
    runner.run('Niveles de habilidad tienen máximo', () => {
        runner.assert(CONFIG.MAX_SKILL_LEVEL > 0, 'Debe haber límite de habilidades');
    });

    runner.run('Logros tienen requisitos definidos', () => {
        ACHIEVEMENTS.forEach(ach => {
            runner.assert(ach.id, 'Logro debe tener ID');
            runner.assert(ach.name, 'Logro debe tener nombre');
            runner.assert(ach.req > 0, 'Logro debe tener requisito positivo');
        });
    });

    runner.run('Cartas legendarias tienen probabilidades válidas', () => {
        LEGENDARY_CARDS.forEach(card => {
            runner.assert(card.probabilidad > 0, `${card.name} probabilidad > 0`);
            runner.assert(card.probabilidad < 1, `${card.name} probabilidad < 1`);
        });
    });
}

// ============================================
// EJECUCIÓN DE PRUEBAS
// ============================================
function runAllTests() {
    console.log('🧪 Iniciando suite de pruebas...\n');
    
    // Configurar mocks globales
    global.localStorage = mockLocalStorage;
    global.webxdc = mockWebxdc;
    
    const runner = new TestRunner();
    
    // Ejecutar todas las pruebas
    runConfigTests(runner);
    runValidatorTests(runner);
    runEconomyTests(runner);
    runProgressionTests(runner);
    
    // Mostrar resumen
    const allPassed = runner.summary();
    
    if (allPassed) {
        console.log('\n🎉 ¡Todas las pruebas pasaron!');
    } else {
        console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
    }
    
    return allPassed;
}

// Exportar para usar en navegador o Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, TestRunner };
}

// Auto-ejecutar si estamos en entorno de prueba
if (typeof process !== 'undefined' && process.argv && process.argv.includes('--test')) {
    runAllTests();
}
