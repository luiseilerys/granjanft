/**
 * Configuración principal del juego CryptoCrop: Genesis
 * Valores ajustables para balance y personalización
 */

export const CONFIG = {
    // Balance económico
    INFLATION_THRESHOLD: 50000,
    TAX_RATE: 0.05,
    BANK_INTEREST_RATE: 0.01,
    
    // Energía
    MAX_ENERGY_BASE: 100,
    ENERGY_REGEN_MINUTES: 5,
    ENERGY_REGEN_AMOUNT: 1,
    
    // Herramientas
    TOOL_REPAIR_COST: 10,
    TOOL_UPGRADE_COST: 50,
    TOOL_DEGRADATION_RATE: 2,
    
    // Cultivos
    CROP_ENERGY_COST: 15,
    HARVEST_ENERGY_COST: 10,
    
    // Validación
    ENABLE_SERVER_VALIDATION: false, // Cambiar a true en producción
    ANTI_CHEAT_ENABLED: false,
    
    // Webxdc
    SYNC_INTERVAL_MS: 500,
    UPDATE_UI_INTERVAL_MS: 5000,
    GAME_TICK_INTERVAL_MS: 60000,
    
    // Límites
    MAX_LEGENDARY_CARDS: 5,
    MAX_LAND_SIZE: 4,
    MAX_SKILL_LEVEL: 5,
    MAX_TOOL_LEVEL: 3,
    
    // Economía dinámica
    PRICE_VOLATILITY: 0.2,
    MIN_PRICE_MULTIPLIER: 0.5,
    MAX_PRICE_MULTIPLIER: 2.0,
    
    // Eventos
    DAY_LENGTH_MS: 86400000,
    SEASON_LENGTH_MS: 86400000,
    RAID_DURATION_MS: 3600000,
    AUCTION_DURATION_MS: 604800000,
    
    // Probabilidades
    LEGENDARY_CARD_DROP_RATE: 0.02,
    CRITICAL_HARVEST_CHANCE: 0.1,
    RARE_SEED_MUTATION_CHANCE: 0.05,
};

// Datos de cultivos - externalizados para fácil modificación
export const CROPS = {
    trigo: { emoji: "🌾", tiempoHoras: 12, valorBase: 6, precioSemilla: 3, exp: 10 },
    zanahoria: { emoji: "🥕", tiempoHoras: 8, valorBase: 5, precioSemilla: 2, exp: 8 },
    maiz: { emoji: "🌽", tiempoHoras: 16, valorBase: 8, precioSemilla: 4, exp: 12 },
    patata: { emoji: "🥔", tiempoHoras: 10, valorBase: 6, precioSemilla: 3, exp: 9 },
    tomate: { emoji: "🍅", tiempoHoras: 14, valorBase: 7, precioSemilla: 4, exp: 11 },
    fresa: { emoji: "🍓", tiempoHoras: 6, valorBase: 4, precioSemilla: 5, exp: 7 },
    arroz: { emoji: "🍚", tiempoHoras: 18, valorBase: 9, precioSemilla: 5, exp: 14 },
    cafe: { emoji: "☕", tiempoHoras: 20, valorBase: 12, precioSemilla: 8, exp: 18 }
};

// Datos de animales
export const ANIMALS = {
    chicken: { emoji: "🐔", product: "huevo", valorBase: 3, costo: 15, exp: 5 },
    cow: { emoji: "🐄", product: "leche", valorBase: 5, costo: 30, exp: 8 },
    sheep: { emoji: "🐑", product: "lana", valorBase: 4, costo: 25, exp: 6 },
    duck: { emoji: "🦆", product: "huevo_pato", valorBase: 4, costo: 20, exp: 6 },
    goat: { emoji: "🐐", product: "leche_cabra", valorBase: 6, costo: 35, exp: 9 }
};

// Estaciones y bonificaciones
export const SEASONS = ["🌱 Primavera", "☀️ Verano", "🍂 Otoño", "❄️ Invierno"];
export const SEASON_BONUS = {
    "🌱 Primavera": { trigo: 1.2, fresa: 1.3 },
    "☀️ Verano": { maiz: 1.2, tomate: 1.2 },
    "🍂 Otoño": { zanahoria: 1.2, patata: 1.2 },
    "❄️ Invierno": { arroz: 1.1, cafe: 1.1 }
};

// Investigaciones disponibles
export const RESEARCH = [
    { id: "fertilizer", name: "Fertilizante avanzado", cost: 100, effect: "+20% rendimiento" },
    { id: "irrigation", name: "Riego inteligente", cost: 200, effect: "-15% tiempo" },
    { id: "genetics", name: "Ingeniería genética", cost: 300, effect: "Mejores genes" },
    { id: "bees", name: "Apicultura", cost: 150, effect: "+50% miel" },
    { id: "trade", name: "Comercio exterior", cost: 250, effect: "Rutas +25%" }
];

// Cartas legendarias
export const LEGENDARY_CARDS = [
    { id: "golden_wheat", name: "Trigo Dorado", emoji: "🌾✨", efecto: "+10% valor venta trigo", probabilidad: 0.02 },
    { id: "dragon_fruit", name: "Fruta Dragón", emoji: "🐉🍎", efecto: "+15% rendimiento", probabilidad: 0.01 },
    { id: "phoenix_egg", name: "Huevo Fénix", emoji: "🔥🥚", efecto: "Animales producen doble", probabilidad: 0.015 }
];

// Mascotas
export const PETS = [
    { id: "dog", name: "Perro", emoji: "🐕", costo: 200, efecto: "+10% cosecha" },
    { id: "cat", name: "Gato", emoji: "🐈", costo: 250, efecto: "+10% productos animales" },
    { id: "dragon", name: "Dragón", emoji: "🐉", costo: 1000, efecto: "+20% todo" }
];

// Habilidades
export const SKILLS = ["farming", "animal", "fishing", "mining", "combat"];

// Recetas de cocina
export const RECIPES_COOKING = {
    "pan": { ingredients: { trigo: 2 }, energia: 20, emoji: "🍞" },
    "sopa": { ingredients: { zanahoria: 1, patata: 1 }, energia: 30, emoji: "🥣" },
    "torta": { ingredients: { trigo: 1, fresa: 2, huevo: 1 }, energia: 50, emoji: "🍰" }
};

// Hechizos
export const SPELLS = [
    { id: "rain", name: "Lluvia Invocada", cost: 50, effect: "Cambia clima a lluvia por 2h", emoji: "🌧️" },
    { id: "growth", name: "Crecimiento Rápido", cost: 100, effect: "Acelera todos los cultivos un 50% por 1h", emoji: "🌱⚡" },
    { id: "luck", name: "Suerte del Granjero", cost: 80, effect: "+30% de cosecha por 1h", emoji: "🍀" }
];

// Mercado negro
export const BLACK_MARKET_ITEMS = [
    { name: "Semilla mágica", price: 100, effect: "Planta que da oro" },
    { name: "Fertilizante ilegal", price: 50, effect: "+50% rendimiento por 1 cosecha" }
];

// Items de lujo (drenaje)
export const LUXURY_ITEMS = [
    { id: "golden_statue", name: "Estatua Dorada", emoji: "🗿", price: 5000, description: "Decora tu granja (sin efecto)" },
    { id: "rainbow_tractor", name: "Tractor Arcoíris", emoji: "🌈🚜", price: 10000, description: "Skin exclusiva" },
    { id: "legendary_title", name: "Título 'Rey Granjero'", emoji: "👑", price: 20000, description: "Aparece junto a tu nombre" }
];

// Animales de carreras
export const RACE_ANIMALS = [
    { name: "Rápido Relámpago", emoji: "🐎", odds: 2.0 },
    { name: "Tortuga Veloz", emoji: "🐢", odds: 5.0 },
    { name: "Gallina Cohete", emoji: "🐔", odds: 3.0 }
];

// Logros
export const ACHIEVEMENTS = [
    { id: "firstHarvest", name: "Primera cosecha", req: 1 },
    { id: "animalLover", name: "Amante de animales", req: 5 },
    { id: "richFarmer", name: "Rico granjero", req: 500 },
    { id: "genius", name: "Genio genético", req: 1 },
    { id: "fisherman", name: "Pescador", req: 10 },
    { id: "beekeeper", name: "Apicultor", req: 50 },
    { id: "dungeonMaster", name: "Señor de las mazmorras", req: 10 },
    { id: "miner", name: "Minero experto", req: 20 }
];
