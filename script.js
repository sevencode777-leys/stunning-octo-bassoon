
// Game State - حالة اللعبة المحسنة
class GameState {
    constructor() {
        this.resources = {
            gold: 1000,
            population: 100,
            happiness: 75,
            security: 60,
            food: 500,
            army: 0,
            wood: 300,
            stone: 200,
            iron: 100,
            coal: 50,
            mana: 50,
            reputation: 50,
            workers: {
                woodcutters: 0,
                miners: 0,
                farmers: 0,
                builders: 0,
                guards: 0
            }
        };

        this.buildings = {
            house: 0,
            farm: 0,
            market: 0,
            hospital: 0,
            school: 0,
            barracks: 0,
            mine: 0,
            wall: 0,
            workshop: 0,
            temple: 0,
            library: 0,
            port: 0,
            tower: 0,
            fortress: 0,
            academy: 0,
            shrine: 0,
            gates: 0,
            moat: 0,
            lumbermill: 0,
            quarry: 0,
            ironworks: 0,
            warehouse: 0
        };

        this.policies = {
            taxRate: 25,
            militarySpending: 30,
            educationSpending: 20,
            healthSpending: 15,
            tradePolicy: 20,
            defenseReadiness: 50
        };

        this.research = {
            agriculture: false,
            medicine: false,
            engineering: false,
            militaryTech: false,
            trade: false,
            philosophy: false,
            metallurgy: false,
            architecture: false,
            fortification: false,
            magicArts: false,
            espionage: false,
            siegeWeapons: false,
            diplomacy: false,
            astronomy: false
        };

        this.year = 1;
        this.month = 1;
        this.day = 1;
        this.season = 'spring';
        this.weather = 'clear';
        this.isNight = false;
        this.gameSpeed = 2000;
        this.isPaused = false;
        this.selectedTile = null;
        this.selectedBuilding = null;
        this.isFirstTime = !localStorage.getItem('hasPlayedBefore');

        this.map = Array(15).fill().map(() => Array(15).fill(null));

        this.events = [];
        this.eventQueue = [];
        this.achievements = [];
        this.monthlyDecisions = [];
        this.lastDecisionTime = 0;
        this.nextDecisionIn = 10;

        this.gameRunning = true;
        this.difficulty = 'normal';
        this.score = 0;

        this.currentThreat = null;
        this.threatLevel = 0;
        this.lastAttack = 0;
        this.defenseMode = false;
        this.enemyStrength = 0;
        this.battleResults = [];

        this.difficultySettings = {
            easy: {
                attackFrequency: 0.2,
                enemyStrength: 0.6,
                resourceMultiplier: 1.8,
                eventFrequency: 0.4,
                disasterChance: 0.1,
                startingResources: 2.0
            },
            normal: {
                attackFrequency: 0.5,
                enemyStrength: 1.0,
                resourceMultiplier: 1.0,
                eventFrequency: 1.0,
                disasterChance: 0.3,
                startingResources: 1.0
            },
            hard: {
                attackFrequency: 0.8,
                enemyStrength: 1.6,
                resourceMultiplier: 0.6,
                eventFrequency: 1.8,
                disasterChance: 0.6,
                startingResources: 0.5
            }
        };

        this.statistics = {
            totalBattlesWon: 0,
            totalBattlesLost: 0,
            totalEnemiesDefeated: 0,
            totalResourcesLost: 0,
            biggestAttackSurvived: 0,
            consecutiveVictories: 0,
            timesSaved: 0,
            totalPlayTime: 0,
            decisionsCount: 0,
            buildingsConstructed: 0,
            workersHired: 0
        };

        this.enemyTypes = {
            bandits: { 
                strength: 15, 
                frequency: 'common', 
                weakness: 'walls',
                name: 'لصوص',
                description: 'مجموعة من اللصوص يهاجمون ليلاً'
            },
            orcs: { 
                strength: 40, 
                frequency: 'uncommon', 
                weakness: 'magic',
                name: 'أورك',
                description: 'محاربون أشداء من الأراضي البعيدة'
            },
            vikings: { 
                strength: 70, 
                frequency: 'rare', 
                weakness: 'naval',
                name: 'فايكنغ',
                description: 'غزاة البحر الشماليون'
            },
            dragons: { 
                strength: 150, 
                frequency: 'legendary', 
                weakness: 'specialized',
                name: 'تنين',
                description: 'وحش أسطوري يهدد المملكة'
            }
        };

        this.resourceProduction = {
            wood: 0,
            stone: 0,
            iron: 0,
            coal: 0,
            food: 0
        };

        this.weatherEffects = {
            clear: { happiness: 0, production: 1.0, description: 'طقس صافي' },
            rain: { happiness: -2, production: 0.9, description: 'مطر خفيف' },
            storm: { happiness: -5, production: 0.7, description: 'عاصفة قوية' },
            drought: { happiness: -3, production: 0.8, description: 'جفاف' },
            snow: { happiness: -1, production: 0.95, description: 'ثلوج' }
        };

        this.notifications = [];
        this.soundEnabled = true;
        this.autoSave = true;
        this.language = 'ar';

        this.applyDifficultySettings();
    }

    applyDifficultySettings() {
        const settings = this.difficultySettings[this.difficulty];
        const multiplier = settings.startingResources;

        Object.keys(this.resources).forEach(resource => {
            if (typeof this.resources[resource] === 'number' && resource !== 'workers') {
                this.resources[resource] = Math.floor(this.resources[resource] * multiplier);
            }
        });
    }
}

// بيانات المباني المحسنة والمكتملة
const BUILDING_DATA = {
    house: { 
        cost: { gold: 30, wood: 20, stone: 10 },
        goldIncome: 5, 
        populationCapacity: 10, 
        populationBonus: 8,
        happinessBonus: 2,
        upkeep: 2,
        buildTime: 1,
        requirements: {},
        category: 'residential',
        description: 'مساكن للعائلات تزيد من عدد السكان والرضا',
        defenseValue: 2,
        workersRequired: { builders: 1 }
    },
    farm: { 
        cost: { gold: 50, wood: 30, stone: 5 },
        foodProduction: 25, 
        goldIncome: 3,
        upkeep: 3,
        buildTime: 2,
        requirements: {},
        category: 'resource',
        description: 'تنتج الطعام اللازم لإطعام السكان',
        workersRequired: { farmers: 2 }
    },
    market: { 
        cost: { gold: 80, wood: 40, stone: 20 },
        goldIncome: 20, 
        happinessBonus: 5,
        upkeep: 5,
        buildTime: 2,
        requirements: {},
        category: 'commercial',
        description: 'مركز تجاري يولد الذهب ويحسن الاقتصاد'
    },
    lumbermill: {
        cost: { gold: 100, stone: 30, iron: 10 },
        woodProduction: 15,
        upkeep: 8,
        buildTime: 3,
        requirements: {},
        category: 'resource',
        description: 'ينتج الخشب اللازم للبناء',
        workersRequired: { woodcutters: 3 }
    },
    quarry: {
        cost: { gold: 120, wood: 20, iron: 15 },
        stoneProduction: 10,
        upkeep: 10,
        buildTime: 3,
        requirements: {},
        category: 'resource',
        description: 'يستخرج الحجر للبناء',
        workersRequired: { miners: 2 }
    },
    mine: { 
        cost: { gold: 180, wood: 40, stone: 30, iron: 15 },
        goldIncome: 30,
        coalProduction: 5,
        upkeep: 10,
        buildTime: 4,
        requirements: {},
        category: 'resource',
        description: 'يستخرج المعادن النفيسة والفحم',
        workersRequired: { miners: 4 }
    },
    hospital: { 
        cost: { gold: 150, wood: 60, stone: 40 },
        happinessBonus: 20, 
        populationBonus: 8,
        upkeep: 8,
        buildTime: 3,
        requirements: {},
        category: 'health',
        description: 'يقدم الرعاية الصحية ويزيد الرضا والنمو السكاني'
    },
    school: { 
        cost: { gold: 100, wood: 40, stone: 30 },
        happinessBonus: 15, 
        researchBonus: 2,
        upkeep: 6,
        buildTime: 2,
        requirements: {},
        category: 'education',
        description: 'يعلم الأطفال ويسرع البحث العلمي'
    },
    barracks: { 
        cost: { gold: 200, wood: 80, stone: 60, iron: 20 },
        armyCapacity: 25, 
        securityBonus: 15,
        upkeep: 12,
        buildTime: 3,
        requirements: {},
        category: 'military',
        description: 'يدرب الجنود ويحسن الأمن'
    },
    wall: { 
        cost: { gold: 60, stone: 40, iron: 5 },
        securityBonus: 8,
        upkeep: 3,
        buildTime: 2,
        requirements: {},
        category: 'military',
        description: 'يوفر الحماية من الهجمات الخارجية',
        defenseValue: 15,
        workersRequired: { builders: 2 }
    },
    workshop: {
        cost: { gold: 120, wood: 60, stone: 20, iron: 10 },
        goldIncome: 12,
        happinessBonus: 8,
        upkeep: 7,
        buildTime: 2,
        requirements: {},
        category: 'commercial',
        description: 'ينتج السلع المحلية ويوفر فرص عمل'
    },
    temple: {
        cost: { gold: 200, wood: 80, stone: 100 },
        happinessBonus: 25,
        securityBonus: 5,
        upkeep: 8,
        buildTime: 4,
        requirements: {},
        category: 'religious',
        description: 'مركز روحي يعزز الرضا والوحدة'
    },
    tower: {
        cost: { gold: 250, wood: 60, stone: 120, iron: 40 },
        securityBonus: 25,
        defenseValue: 40,
        upkeep: 12,
        buildTime: 4,
        requirements: {},
        category: 'military',
        description: 'برج مراقبة يكشف الأعداء مبكراً ويدافع عن المنطقة',
        workersRequired: { guards: 2 }
    }
};

// قرارات شهرية محسنة
const MONTHLY_DECISIONS = [
    {
        id: 'trade_caravan',
        title: '🐪 قافلة تجارية من الشرق',
        description: 'وصلت قافلة تجارية محملة بالبضائع النادرة من الأراضي البعيدة. التجار يعرضون صفقات مختلفة ومثيرة.',
        choices: [
            {
                text: 'شراء الأدوات الحديدية المتطورة (+25 حديد، -150 ذهب)',
                effect: { iron: 25, gold: -150 },
                consequences: 'أدوات عالية الجودة تزيد كفاءة العمال بنسبة 15%'
            },
            {
                text: 'شراء خشب الأرز النادر (+35 خشب، -120 ذهب)',
                effect: { wood: 35, gold: -120 },
                consequences: 'خشب فاخر مقاوم للتلف يدوم ضعف المدة العادية'
            },
            {
                text: 'استضافة القافلة مقابل رسوم (+100 ذهب، +3 سمعة)',
                effect: { gold: 100, reputation: 3 },
                consequences: 'كرم الضيافة يعزز سمعة المملكة ويجذب تجاراً آخرين'
            }
        ]
    },
    {
        id: 'worker_strike',
        title: '⚒️ إضراب عمال المناجم',
        description: 'عمال المناجم أوقفوا العمل احتجاجاً على ظروف العمل الخطيرة وقلة الأجور.',
        choices: [
            {
                text: 'زيادة الأجور وتحسين الظروف (+20 رضا، -120 ذهب)',
                effect: { happiness: 20, gold: -120 },
                consequences: 'عمال سعداء ومنتجون، لكن تكلفة أعلى على المدى الطويل'
            },
            {
                text: 'التفاوض لحل وسط (+12 رضا، -60 ذهب)',
                effect: { happiness: 12, gold: -60 },
                consequences: 'حل متوازن يرضي معظم الأطراف'
            }
        ]
    },
    {
        id: 'festival',
        title: '🎉 مهرجان الحصاد الكبير',
        description: 'حان وقت المهرجان السنوي! المحاصيل وفيرة والشعب في مزاج احتفالي.',
        choices: [
            {
                text: 'مهرجان ملكي فاخر (-300 ذهب، +35 رضا)',
                effect: { gold: -300, happiness: 35 },
                consequences: 'احتفال أسطوري يتحدث عنه الناس لسنوات'
            },
            {
                text: 'احتفال شعبي بسيط (-80 ذهب، +20 رضا)',
                effect: { gold: -80, happiness: 20 },
                consequences: 'احتفال مناسب يُسعد الجميع دون إسراف'
            }
        ]
    }
];

// أحداث عشوائية محسنة
const RANDOM_EVENTS = [
    {
        id: 'merchant_offer',
        title: '💼 تاجر الحرير الغامض',
        description: 'تاجر أجنبي غامض وصل بقافلة محملة بالبضائع النادرة من أراضٍ بعيدة.',
        choices: [
            {
                text: 'شراء الحرير والتوابل (-150 ذهب، +60 حديد، +15 رضا)',
                effect: { gold: -150, iron: 60, happiness: 15 },
                consequences: 'بضائع فاخرة تحسن نوعية الحياة'
            },
            {
                text: 'رفض التعامل معه (بدون تأثير)',
                effect: {},
                consequences: 'تجنب المخاطر المجهولة'
            }
        ]
    },
    {
        id: 'natural_disaster',
        title: '🌊 فيضان الربيع',
        description: 'أمطار غزيرة تسببت في فيضان النهر المجاور.',
        choices: [
            {
                text: 'بناء سدود طوارئ (-200 ذهب، -100 خشب)',
                effect: { gold: -200, wood: -100 },
                consequences: 'حل دائم يمنع الفيضانات المستقبلية'
            },
            {
                text: 'إجلاء السكان مؤقتاً (-50 ذهب، -5 رضا)',
                effect: { gold: -50, happiness: -5 },
                consequences: 'حل سريع لكن مؤقت والمشكلة ستعود'
            }
        ]
    }
];

// نظام العمال المحسن
const WORKER_TYPES = {
    woodcutters: {
        name: 'قطاع الأخشاب',
        cost: 60,
        production: { wood: 4 },
        upkeep: 6,
        description: 'خبراء في قطع الأشجار وإنتاج الخشب عالي الجودة'
    },
    miners: {
        name: 'عمال المناجم',
        cost: 80,
        production: { stone: 3, iron: 2 },
        upkeep: 8,
        description: 'عمال شجعان يستخرجون الحجر والمعادن من أعماق الأرض'
    },
    farmers: {
        name: 'مزارعون',
        cost: 50,
        production: { food: 12 },
        upkeep: 5,
        description: 'خبراء زراعة ينتجون طعاماً وفيراً للمملكة'
    },
    builders: {
        name: 'بناة ماهرون',
        cost: 90,
        speedBonus: 0.3,
        upkeep: 9,
        description: 'حرفيون مهرة يسرعون البناء ويحسنون الجودة'
    },
    guards: {
        name: 'حراس النخبة',
        cost: 100,
        securityBonus: 8,
        upkeep: 10,
        description: 'محاربون مدربون يحمون المملكة ليلاً ونهاراً'
    }
};

// متغيرات اللعبة الرئيسية
let game = new GameState();
let gameLoop;
let decisionLoop;
let audioEnabled = true;
let loadingProgress = 0;

// حساب قوة الدفاع - دالة مصححة
function calculateDefenseBonus() {
    let bonus = 0;
    bonus += game.resources.army * 3;
    bonus += (game.buildings.wall || 0) * 12;
    bonus += (game.buildings.tower || 0) * 30;
    bonus += (game.buildings.fortress || 0) * 70;
    bonus += (game.resources.workers.guards || 0) * 8;
    
    if (game.research.militaryTech) bonus = Math.floor(bonus * 1.3);
    if (game.research.fortification) bonus = Math.floor(bonus * 1.2);
    
    return bonus;
}

// نظام الترحيب المحسن
function showWelcomeScreen() {
    if (game.isFirstTime) {
        showLoadingScreen();
        setTimeout(() => {
            hideLoadingScreen();
            showWelcomeModal();
        }, 3000);
    } else {
        showLoadingScreen();
        setTimeout(() => {
            hideLoadingScreen();
            initGame();
        }, 2000);
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    const loadingTip = document.getElementById('loading-tip');
    
    const tips = [
        '💡 ابن منازل أولاً لزيادة عدد السكان',
        '💡 المزارع ضرورية لإطعام شعبك',
        '💡 الأسوار تحميك من الهجمات الليلية',
        '💡 العمال ينتجون الموارد تلقائياً',
        '💡 البحث العلمي يفتح مباني جديدة',
        '💡 راقب مستوى الرضا - الشعب الغاضب خطر',
        '💡 استثمر في الجيش قبل أن يصبح الليل',
        '💡 الموارد المتنوعة أهم من الذهب فقط'
    ];
    
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
    
    const updateProgress = () => {
        loadingProgress += 2;
        if (progressBar) {
            progressBar.style.width = loadingProgress + '%';
        }
        
        if (loadingProgress >= 30 && loadingProgress < 60) {
            if (loadingText) loadingText.textContent = 'تحضير الخريطة...';
        } else if (loadingProgress >= 60 && loadingProgress < 90) {
            if (loadingText) loadingText.textContent = 'تهيئة الموارد...';
        } else if (loadingProgress >= 90) {
            if (loadingText) loadingText.textContent = 'تحميل مكتمل!';
        }
        
        if (loadingProgress % 25 === 0 && loadingTip) {
            loadingTip.textContent = tips[Math.floor(Math.random() * tips.length)];
        }
        
        if (loadingProgress < 100) {
            setTimeout(updateProgress, 50);
        }
    };
    
    updateProgress();
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

function showWelcomeModal() {
    const welcomeModal = document.createElement('div');
    welcomeModal.className = 'modal';
    welcomeModal.style.display = 'block';
    welcomeModal.innerHTML = `
        <div class="modal-content welcome-content">
            <div class="modal-header">
                <h3>👑 مرحباً بك في إمبراطورية الملوك!</h3>
            </div>
            <div class="modal-body">
                <div class="welcome-section">
                    <h4>🏰 أنت الملك الجديد</h4>
                    <p>لقد ورثت مملكة صغيرة وعليك أن تجعلها تزدهر وتصبح إمبراطورية عظيمة تخلدها كتب التاريخ!</p>
                </div>

                <div class="welcome-section">
                    <h4>🎯 أهدافك الملكية:</h4>
                    <ul>
                        <li>🏘️ ابن مدينة مزدهرة ومتطورة</li>
                        <li>😊 أسعد شعبك واكسب حبهم</li>
                        <li>⚔️ احم مملكتك من الأعداء والغزاة</li>
                        <li>🔬 طور التكنولوجيا والعلوم</li>
                        <li>💰 اجمع الثروات واحكم بحكمة</li>
                        <li>👑 اصبح إمبراطوراً أسطورياً</li>
                    </ul>
                </div>

                <div class="difficulty-selection">
                    <h4>⚖️ اختر مستوى التحدي:</h4>
                    <button class="difficulty-btn easy" onclick="startGame('easy')">
                        😊 مبتدئ - للملوك الجدد
                        <small>موارد إضافية • هجمات أقل • كوارث نادرة</small>
                    </button>
                    <button class="difficulty-btn normal" onclick="startGame('normal')">
                        😐 متوسط - تحدي متوازن
                        <small>التجربة المصممة • توازن مثالي</small>
                    </button>
                    <button class="difficulty-btn hard" onclick="startGame('hard')">
                        😤 خبير - للأباطرة المحنكين
                        <small>موارد أقل • هجمات مستمرة • كوارث متكررة</small>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(welcomeModal);
}

function startGame(difficulty) {
    game.difficulty = difficulty;
    game.applyDifficultySettings();
    localStorage.setItem('hasPlayedBefore', 'true');
    document.querySelector('.modal').remove();
    initGame();
}

// نظام القرارات المحسن
function startDecisionLoop() {
    decisionLoop = setInterval(() => {
        if (!game.isPaused && game.gameRunning) {
            game.nextDecisionIn--;
            updateDecisionTimer();

            if (game.nextDecisionIn <= 0) {
                showMonthlyDecision();
                game.nextDecisionIn = 10;
            }
        }
    }, 60000);
}

function showMonthlyDecision() {
    const availableDecisions = MONTHLY_DECISIONS.filter(decision => 
        !game.monthlyDecisions.includes(decision.id) || Math.random() < 0.2
    );

    if (availableDecisions.length === 0) return;

    const decision = availableDecisions[Math.floor(Math.random() * availableDecisions.length)];
    showDecisionModal(decision);
    playSound('decision');
}

function showDecisionModal(decision) {
    const modal = document.createElement('div');
    modal.className = 'modal decision-modal';
    modal.style.display = 'block';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${decision.title}</h3>
                <div class="decision-timer">⏰ قرار ملكي عاجل</div>
            </div>
            <div class="modal-body">
                <p class="decision-description">${decision.description}</p>
                <div class="decision-choices">
                    ${decision.choices.map((choice, index) => `
                        <button class="choice-btn" onclick="makeDecision('${decision.id}', ${index})">
                            <div class="choice-text">${choice.text}</div>
                            <div class="choice-consequence">${choice.consequences}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    game.isPaused = true;
}

function makeDecision(decisionId, choiceIndex) {
    const decision = MONTHLY_DECISIONS.find(d => d.id === decisionId);
    if (!decision) return;

    const choice = decision.choices[choiceIndex];
    if (!choice) return;

    Object.entries(choice.effect).forEach(([resource, value]) => {
        if (game.resources[resource] !== undefined) {
            game.resources[resource] += value;
            if (game.resources[resource] < 0) game.resources[resource] = 0;
        }
    });

    game.monthlyDecisions.push(decisionId);
    game.statistics.decisionsCount++;

    document.querySelector('.decision-modal').remove();
    game.isPaused = false;

    showNotification(`تم اتخاذ القرار: ${choice.consequences}`, 'success');
    addToEventsLog(`📜 قرار ملكي: ${choice.consequences}`);
    updateUI();
    updateScore(50);
}

// إدارة العمال المحسنة
function hireWorker(workerType) {
    const workerData = WORKER_TYPES[workerType];
    if (!workerData) return;

    if (game.resources.gold < workerData.cost) {
        showNotification(`تحتاج ${workerData.cost} ذهب لتوظيف ${workerData.name}!`, 'error');
        return;
    }

    if (game.resources.population < 2) {
        showNotification('تحتاج لسكان أكثر للتوظيف!', 'warning');
        return;
    }

    game.resources.gold -= workerData.cost;
    game.resources.population -= 1;
    game.resources.workers[workerType]++;
    game.statistics.workersHired++;

    showNotification(`تم توظيف ${workerData.name} جديد!`, 'success');
    addToEventsLog(`👷 تم توظيف ${workerData.name} - الكفاءة تزداد`);
    updateUI();
    updateScore(25);
}

// تحديث إنتاج الموارد
function updateResourceProduction() {
    game.resourceProduction = { wood: 0, stone: 0, iron: 0, coal: 0, food: 0 };

    Object.entries(game.resources.workers).forEach(([workerType, count]) => {
        const workerData = WORKER_TYPES[workerType];
        if (workerData && workerData.production && count > 0) {
            Object.entries(workerData.production).forEach(([resource, amount]) => {
                game.resourceProduction[resource] = (game.resourceProduction[resource] || 0) + (amount * count);
            });
        }
    });

    Object.entries(game.buildings).forEach(([buildingType, count]) => {
        const buildingData = BUILDING_DATA[buildingType];
        if (buildingData && count > 0) {
            if (buildingData.woodProduction) {
                game.resourceProduction.wood += buildingData.woodProduction * count;
            }
            if (buildingData.stoneProduction) {
                game.resourceProduction.stone += buildingData.stoneProduction * count;
            }
            if (buildingData.ironProduction) {
                game.resourceProduction.iron += buildingData.ironProduction * count;
            }
            if (buildingData.coalProduction) {
                game.resourceProduction.coal += buildingData.coalProduction * count;
            }
            if (buildingData.foodProduction) {
                game.resourceProduction.food += buildingData.foodProduction * count;
            }
        }
    });

    const weatherEffect = game.weatherEffects[game.weather];
    Object.keys(game.resourceProduction).forEach(resource => {
        game.resourceProduction[resource] = Math.floor(game.resourceProduction[resource] * weatherEffect.production);
    });

    game.resources.wood += Math.floor(game.resourceProduction.wood / 12);
    game.resources.stone += Math.floor(game.resourceProduction.stone / 12);
    game.resources.iron += Math.floor(game.resourceProduction.iron / 12);
    game.resources.coal += Math.floor(game.resourceProduction.coal / 12);
    game.resources.food += Math.floor(game.resourceProduction.food / 12);
}

// فحص إمكانية بناء المبنى
function canAffordBuilding(buildingType) {
    const buildingData = BUILDING_DATA[buildingType];
    if (!buildingData || !buildingData.cost) return false;

    return Object.entries(buildingData.cost).every(([resource, amount]) => 
        (game.resources[resource] || 0) >= amount
    );
}

function payBuildingCost(buildingType) {
    const buildingData = BUILDING_DATA[buildingType];
    if (!buildingData || !buildingData.cost) return;

    Object.entries(buildingData.cost).forEach(([resource, amount]) => {
        if (game.resources[resource] !== undefined) {
            game.resources[resource] -= amount;
        }
    });
}

function checkWorkerRequirements(buildingType) {
    const buildingData = BUILDING_DATA[buildingType];
    if (!buildingData || !buildingData.workersRequired) return true;

    return Object.entries(buildingData.workersRequired).every(([workerType, required]) => 
        (game.resources.workers[workerType] || 0) >= required
    );
}

// تهيئة اللعبة المحسنة
function initGame() {
    console.log('🎮 بدء تحميل إمبراطورية الملوك...');

    try {
        setupEventListeners();
        createMap();
        updateUI();
        startGameLoop();
        startDecisionLoop();
        initializeAudio();
        updateWeather();

        addToEventsLog('🏰 مرحباً بك أيها الملك العظيم! ابدأ رحلتك نحو المجد والعظمة');
        addToEventsLog('💡 نصيحة: ابدأ ببناء المنازل والمزارع لضمان الغذاء والمأوى للشعب');
        addToEventsLog(`🎯 صعوبة اللعبة: ${getDifficultyName(game.difficulty)}`);

        console.log('✅ تم تحميل اللعبة بنجاح!');

    } catch (error) {
        console.error('❌ خطأ في تحميل اللعبة:', error);
        showNotification('حدث خطأ في تحميل اللعبة!', 'error');
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('.building-card').forEach(card => {
        card.addEventListener('click', () => selectBuilding(card.dataset.building));
    });

    const taxSlider = document.getElementById('tax-rate');
    const militarySlider = document.getElementById('military-spending');
    const educationSlider = document.getElementById('education-spending');
    const healthSlider = document.getElementById('health-spending');

    if (taxSlider) taxSlider.addEventListener('input', updateTaxRate);
    if (militarySlider) militarySlider.addEventListener('input', updateMilitarySpending);
    if (educationSlider) educationSlider.addEventListener('input', updateEducationSpending);
    if (healthSlider) healthSlider.addEventListener('input', updateHealthSpending);

    const recruitBtn = document.getElementById('recruit-army');
    const trainBtn = document.getElementById('train-army');
    if (recruitBtn) recruitBtn.addEventListener('click', recruitArmy);
    if (trainBtn) trainBtn.addEventListener('click', trainArmy);

    const pauseBtn = document.getElementById('pause-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    
    if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
    if (saveBtn) saveBtn.addEventListener('click', saveGame);
    if (loadBtn) loadBtn.addEventListener('click', loadGame);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterBuildings(btn.dataset.filter));
    });
}

// تصفية المباني
function filterBuildings(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-filter="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.building-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// وضع المباني على الخريطة
function placeBuilding(row, col, buildingType) {
    const buildingData = BUILDING_DATA[buildingType];

    if (!buildingData) {
        showNotification('بيانات المبنى غير متوفرة!', 'error');
        return;
    }

    if (!canAffordBuilding(buildingType)) {
        const costText = Object.entries(buildingData.cost)
            .map(([res, amt]) => `${amt} ${getResourceName(res)}`)
            .join(', ');
        showNotification(`تحتاج ${costText} لبناء ${getBuildingName(buildingType)}!`, 'error');
        return;
    }

    if (game.map[row][col] !== null) {
        showNotification('هذه المنطقة مشغولة بالفعل!', 'error');
        return;
    }

    if (!checkWorkerRequirements(buildingType)) {
        showNotification('تحتاج لعمال أكثر لبناء هذا المبنى!', 'warning');
        return;
    }

    payBuildingCost(buildingType);
    game.map[row][col] = buildingType;
    game.buildings[buildingType]++;
    game.statistics.buildingsConstructed++;

    const tileElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (tileElement) {
        tileElement.classList.add('building');
        tileElement.textContent = getBuildingIcon(buildingType);
        tileElement.title = getBuildingName(buildingType);
    }

    game.selectedBuilding = null;
    document.querySelectorAll('.building-card').forEach(card => card.classList.remove('selected'));

    updateUI();
    updateScore(100);
    showNotification(`تم بناء ${getBuildingName(buildingType)} بنجاح!`, 'success');
    addToEventsLog(`🏗️ تم بناء ${getBuildingName(buildingType)} جديد`);
    playSound('build');
}

// تحديث الموارد المحسن
function updateResources() {
    let goldIncome = 0;
    let foodProduction = 0;
    let populationGrowth = 0;
    let happinessChange = 0;
    let securityChange = 0;
    let totalUpkeep = 0;

    updateResourceProduction();

    for (const [buildingType, count] of Object.entries(game.buildings)) {
        if (count > 0 && BUILDING_DATA[buildingType]) {
            const data = BUILDING_DATA[buildingType];
            goldIncome += (data.goldIncome || 0) * count;
            foodProduction += (data.foodProduction || 0) * count;
            populationGrowth += (data.populationBonus || 0) * count;
            happinessChange += (data.happinessBonus || 0) * count;
            securityChange += (data.securityBonus || 0) * count;
            totalUpkeep += (data.upkeep || 0) * count;
        }
    }

    Object.entries(game.resources.workers).forEach(([workerType, count]) => {
        const workerData = WORKER_TYPES[workerType];
        if (workerData) {
            totalUpkeep += (workerData.upkeep || 0) * count;
            if (workerData.securityBonus) {
                securityChange += workerData.securityBonus * count;
            }
        }
    });

    const taxIncome = Math.floor(game.resources.population * game.policies.taxRate / 100);
    goldIncome += taxIncome;

    happinessChange -= Math.floor(game.policies.taxRate / 4);
    securityChange += Math.floor(game.policies.militarySpending / 4);
    happinessChange += Math.floor(game.policies.educationSpending / 5);
    happinessChange += Math.floor(game.policies.healthSpending / 6);

    if (game.research.agriculture) foodProduction = Math.floor(foodProduction * 1.5);
    if (game.research.medicine) happinessChange += 8;
    if (game.research.engineering) goldIncome = Math.floor(goldIncome * 1.3);
    if (game.research.militaryTech) securityChange += 15;

    const weatherEffect = game.weatherEffects[game.weather];
    happinessChange += weatherEffect.happiness;

    game.resources.gold += goldIncome - totalUpkeep;
    game.resources.food += foodProduction;
    game.resources.population += Math.floor(populationGrowth / 12);

    game.resources.happiness = Math.max(0, Math.min(100, game.resources.happiness + Math.floor(happinessChange / 12)));
    game.resources.security = Math.max(0, Math.min(100, game.resources.security + Math.floor(securityChange / 12)));

    const foodConsumption = Math.floor(game.resources.population / 1.5);
    game.resources.food -= foodConsumption;

    if (game.resources.food < 0) {
        game.resources.food = 0;
        game.resources.happiness -= 8;
        game.resources.population = Math.max(50, game.resources.population - 15);
        
        if (Math.random() < 0.2) {
            addToEventsLog('🍞 نقص الطعام يسبب جوعاً - انخفاض السكان والرضا');
            showNotification('تحذير: نقص شديد في الطعام!', 'warning');
        }
    }

    Object.keys(game.resources).forEach(key => {
        if (typeof game.resources[key] === 'number' && key !== 'workers') {
            game.resources[key] = Math.max(0, game.resources[key]);
        }
    });
}

// حلقة اللعبة المحسنة
function startGameLoop() {
    gameLoop = setInterval(() => {
        if (!game.isPaused && game.gameRunning) {
            updateResources();
            updateDayNightCycle();
            updateSeason();
            checkNightAttacks();
            checkRandomEvents();
            checkAchievements();
            checkGameOver();
            updateThreatLevel();
            updateUI();

            game.day++;
            if (game.day > 30) {
                game.day = 1;
                game.month++;
                if (game.month > 12) {
                    game.month = 1;
                    game.year++;
                    onNewYear();
                }
            }
        }
    }, game.gameSpeed / 4);
}

// تحديث واجهة المستخدم المحسنة
function updateUI() {
    updateStatWithAnimation('gold', formatNumber(game.resources.gold));
    updateStatWithAnimation('population', formatNumber(game.resources.population));
    updateStatWithAnimation('happiness', game.resources.happiness + '%');
    updateStatWithAnimation('security', game.resources.security + '%');
    updateStatWithAnimation('food', formatNumber(game.resources.food));

    updateStatWithAnimation('wood', formatNumber(game.resources.wood));
    updateStatWithAnimation('stone', formatNumber(game.resources.stone));
    updateStatWithAnimation('iron', formatNumber(game.resources.iron));

    Object.entries(game.resources.workers).forEach(([type, count]) => {
        const element = document.getElementById(`${type}-count`);
        if (element) element.textContent = count;
    });

    updateProductionDisplay();
    updateTimeDisplay();
    updateStatisticsDisplay();
    updateButtonStates();
    updateThreatDisplay();
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'ك';
    return num.toString();
}

function updateTimeDisplay() {
    const yearDisplay = document.getElementById('year-display');
    const dayDisplay = document.getElementById('day-display');
    const monthDisplay = document.getElementById('game-month');
    const seasonDisplay = document.getElementById('season-display');
    const weatherDisplay = document.getElementById('weather');

    if (yearDisplay) yearDisplay.textContent = game.year;
    if (dayDisplay) dayDisplay.textContent = game.day;
    if (monthDisplay) monthDisplay.textContent = game.month;
    if (seasonDisplay) seasonDisplay.textContent = getSeasonName(game.season);
    if (weatherDisplay) weatherDisplay.textContent = getWeatherIcon(game.weather) + ' ' + game.weatherEffects[game.weather].description;
}

function updateProductionDisplay() {
    const productions = [
        { id: 'wood-production', value: game.resourceProduction.wood },
        { id: 'stone-production', value: game.resourceProduction.stone },
        { id: 'iron-production', value: game.resourceProduction.iron },
        { id: 'food-production', value: game.resourceProduction.food }
    ];

    productions.forEach(prod => {
        const element = document.getElementById(prod.id);
        if (element) element.textContent = `+${prod.value}/شهر`;
    });
}

function updateStatisticsDisplay() {
    const stats = [
        { id: 'current-year-stat', value: game.year },
        { id: 'houses-count', value: game.buildings.house || 0 },
        { id: 'farms-count', value: game.buildings.farm || 0 },
        { id: 'game-score', value: formatNumber(game.score) },
        { id: 'score-display', value: formatNumber(game.score) },
        { id: 'battles-won', value: game.statistics.totalBattlesWon },
        { id: 'battles-lost', value: game.statistics.totalBattlesLost },
        { id: 'enemies-defeated', value: game.statistics.totalEnemiesDefeated }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) element.textContent = stat.value;
    });
}

function updateThreatDisplay() {
    const threatDisplay = document.getElementById('threat-level');
    const threatStat = document.getElementById('threat-level-stat');
    
    const threatText = getThreatLevelText(game.threatLevel);
    
    if (threatDisplay) threatDisplay.textContent = threatText;
    if (threatStat) threatStat.textContent = threatText;
}

function getThreatLevelText(level) {
    if (level < 20) return 'منخفض';
    if (level < 40) return 'متوسط';
    if (level < 60) return 'مرتفع';
    if (level < 80) return 'خطير';
    return 'كارثي';
}

// تحديث الطقس والفصول
function updateWeather() {
    const weathers = ['clear', 'rain', 'storm', 'drought', 'snow'];
    
    if (Math.random() < 0.1) {
        game.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }
}

function updateSeason() {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    game.season = seasons[Math.floor((game.month - 1) / 3)];
}

function getSeasonName(season) {
    const names = {
        spring: 'ربيع الازدهار',
        summer: 'صيف الحصاد',
        autumn: 'خريف الذهب',
        winter: 'شتاء الصمود'
    };
    return names[season] || 'فصل مجهول';
}

function getWeatherIcon(weather) {
    const icons = {
        clear: '☀️',
        rain: '🌧️',
        storm: '⛈️',
        drought: '🌵',
        snow: '❄️'
    };
    return icons[weather] || '🌤️';
}

// باقي الوظائف المساعدة
function updateDecisionTimer() {
    const timerElement = document.getElementById('decision-timer');
    if (timerElement) {
        timerElement.textContent = `${game.nextDecisionIn} دقيقة`;
    }
}

function getDifficultyName(difficulty) {
    const names = {
        easy: 'مبتدئ',
        normal: 'متوسط',
        hard: 'خبير'
    };
    return names[difficulty] || 'غير معروف';
}

function getResourceName(resource) {
    const names = {
        gold: 'ذهب',
        wood: 'خشب',
        stone: 'حجر',
        iron: 'حديد',
        coal: 'فحم',
        food: 'طعام'
    };
    return names[resource] || resource;
}

function getBuildingIcon(buildingType) {
    const icons = {
        house: '🏠', farm: '🌾', market: '🏪', hospital: '🏥', school: '🏫',
        barracks: '🏰', mine: '⛏️', wall: '🧱', workshop: '🔨', temple: '⛪',
        library: '📚', port: '🚢', tower: '🗼', fortress: '🏰', lumbermill: '🪓',
        quarry: '⛰️', ironworks: '🔥', warehouse: '📦'
    };
    return icons[buildingType] || '🏗️';
}

function getBuildingName(buildingType) {
    const names = {
        house: 'منزل', farm: 'مزرعة', market: 'سوق', hospital: 'مستشفى', school: 'مدرسة',
        barracks: 'ثكنة', mine: 'منجم', wall: 'حائط دفاعي', workshop: 'ورشة', temple: 'معبد',
        library: 'مكتبة', port: 'ميناء', tower: 'برج مراقبة', fortress: 'قلعة', lumbermill: 'مطحنة خشب',
        quarry: 'محجر', ironworks: 'مصنع حديد', warehouse: 'مستودع'
    };
    return names[buildingType] || 'مبنى';
}

function createMap() {
    const mapContainer = document.getElementById('game-map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = '';

    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            const tile = document.createElement('div');
            tile.className = 'map-tile';
            tile.dataset.row = row;
            tile.dataset.col = col;

            const terrainType = getTerrainType(row, col);
            tile.classList.add(`terrain-${terrainType}`);
            tile.title = getTerrainName(terrainType);

            tile.addEventListener('click', () => selectTile(row, col));

            mapContainer.appendChild(tile);
        }
    }
}

function getTerrainType(row, col) {
    const distance = Math.sqrt((row - 7) ** 2 + (col - 7) ** 2);
    if (distance < 3) return 'city';
    if (distance < 6) return 'plains';
    if (row < 5 || row > 9) return 'mountains';
    if (col < 3 || col > 11) return 'forest';
    return 'plains';
}

function getTerrainName(terrain) {
    const names = {
        city: 'مركز المدينة',
        plains: 'سهول خضراء',
        mountains: 'جبال صخرية',
        forest: 'غابات كثيفة'
    };
    return names[terrain] || 'أرض';
}

function selectTile(row, col) {
    document.querySelectorAll('.map-tile').forEach(tile => tile.classList.remove('selected'));

    const tileElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (tileElement) {
        tileElement.classList.add('selected');
    }

    game.selectedTile = { row, col };

    if (game.selectedBuilding) {
        placeBuilding(row, col, game.selectedBuilding);
    }
}

function selectBuilding(buildingType) {
    document.querySelectorAll('.building-card').forEach(card => card.classList.remove('selected'));
    const selectedCard = document.querySelector(`[data-building="${buildingType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    game.selectedBuilding = buildingType;

    const buildingData = BUILDING_DATA[buildingType];
    if (buildingData) {
        const costText = Object.entries(buildingData.cost)
            .map(([res, amt]) => `${amt} ${getResourceName(res)}`)
            .join(', ');
        showNotification(`تم اختيار ${getBuildingName(buildingType)} - التكلفة: ${costText}`, 'info');
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(`${tabName}-tab`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
}

function updateTaxRate() {
    const element = document.getElementById('tax-rate');
    if (!element) return;
    
    const value = parseInt(element.value);
    game.policies.taxRate = value;
    const displayElement = document.getElementById('tax-display');
    if (displayElement) displayElement.textContent = value + '%';
}

function updateMilitarySpending() {
    const element = document.getElementById('military-spending');
    if (!element) return;
    
    const value = parseInt(element.value);
    game.policies.militarySpending = value;
    const displayElement = document.getElementById('military-display');
    if (displayElement) displayElement.textContent = value + '%';
}

function updateEducationSpending() {
    const element = document.getElementById('education-spending');
    if (!element) return;
    
    const value = parseInt(element.value);
    game.policies.educationSpending = value;
    const displayElement = document.getElementById('education-display');
    if (displayElement) displayElement.textContent = value + '%';
}

function updateHealthSpending() {
    const element = document.getElementById('health-spending');
    if (!element) return;
    
    const value = parseInt(element.value);
    game.policies.healthSpending = value;
    const displayElement = document.getElementById('health-display');
    if (displayElement) displayElement.textContent = value + '%';
}

function recruitArmy() {
    const cost = 150;
    const populationCost = 8;

    if (game.resources.gold < cost) {
        showNotification(`تحتاج ${cost} ذهب للتجنيد!`, 'error');
        return;
    }

    if (game.resources.population < populationCost) {
        showNotification(`تحتاج ${populationCost} سكان للتجنيد!`, 'warning');
        return;
    }

    game.resources.gold -= cost;
    game.resources.population -= populationCost;
    game.resources.army += 8;

    showNotification('تم تجنيد 8 جنود جدد!', 'success');
    addToEventsLog('⚔️ تم تجنيد جنود جدد للجيش الملكي');
    updateUI();
    updateScore(50);
}

function trainArmy() {
    const cost = 80;

    if (game.resources.gold < cost) {
        showNotification(`تحتاج ${cost} ذهب للتدريب!`, 'error');
        return;
    }

    if (game.resources.army < 5) {
        showNotification('تحتاج لجنود أكثر للتدريب!', 'warning');
        return;
    }

    game.resources.gold -= cost;
    game.resources.security += 8;

    showNotification('تم تدريب الجيش وزيادة كفاءته!', 'success');
    addToEventsLog('🎖️ تدريب الجيش يحسن من قدراته القتالية');
    updateUI();
    updateScore(30);
}

function updateDayNightCycle() {
    const cycleDay = game.day % 4;
    game.isNight = cycleDay >= 2;

    const timeElement = document.getElementById('day-night-indicator');
    if (timeElement) {
        timeElement.textContent = game.isNight ? '🌙 ليل' : '☀️ نهار';
        timeElement.className = game.isNight ? 'night-mode' : 'day-mode';
    }
}

function checkNightAttacks() {
    if (!game.isNight || Math.random() > 0.15) return;

    const enemyTypes = Object.keys(game.enemyTypes);
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemyData = game.enemyTypes[enemyType];
    
    const enemyStrength = enemyData.strength + Math.random() * 30;
    simulateAttack(enemyType, enemyStrength);
}

function simulateAttack(enemyType, enemyStrength) {
    const defenseStrength = calculateDefenseBonus();
    const enemyData = game.enemyTypes[enemyType];

    if (defenseStrength > enemyStrength) {
        const enemiesDefeated = Math.floor(enemyStrength / 10);
        game.statistics.totalBattlesWon++;
        game.statistics.totalEnemiesDefeated += enemiesDefeated;
        game.statistics.consecutiveVictories++;
        
        showNotification(`🛡️ تم صد هجوم ${enemyData.name} بنجاح!`, 'success');
        addToEventsLog(`⚔️ انتصار! تم صد هجوم ${enemyData.name} وهزيمة ${enemiesDefeated} عدو`);
        
        game.resources.reputation += 8;
        game.resources.security += 5;
        updateScore(150);
    } else {
        const damage = Math.floor((enemyStrength - defenseStrength) * 0.4);
        const populationLoss = Math.floor(damage / 20);
        
        game.statistics.totalBattlesLost++;
        game.statistics.consecutiveVictories = 0;
        game.statistics.totalResourcesLost += damage;

        game.resources.gold = Math.max(0, game.resources.gold - damage);
        game.resources.population = Math.max(50, game.resources.population - populationLoss);
        game.resources.happiness -= 15;
        game.resources.security -= 5;

        showNotification(`💀 فشل في صد هجوم ${enemyData.name}! خسائر: ${damage} ذهب`, 'error');
        addToEventsLog(`💔 هزيمة مؤلمة! هجوم ${enemyData.name} تسبب في خسائر فادحة`);
    }

    updateUI();
}

function updateThreatLevel() {
    let threat = 0;

    if (game.resources.gold > 5000) threat += 25;
    if (game.resources.security < 30) threat += 40;
    if (game.resources.army < 30) threat += 35;
    if (game.resources.happiness < 40) threat += 20;

    const difficultyMultiplier = game.difficultySettings[game.difficulty].attackFrequency;
    threat = Math.floor(threat * difficultyMultiplier);

    game.threatLevel = Math.max(0, Math.min(100, threat));
}

function checkRandomEvents() {
    if (Math.random() < 0.03) {
        const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        showDecisionModal(randomEvent);
    }
}

function checkAchievements() {
    if (!game.achievements.includes('first_building') && 
        Object.values(game.buildings).some(count => count > 0)) {
        showAchievement('البناء الأول', 'قمت ببناء أول مبنى في مملكتك');
        game.achievements.push('first_building');
    }

    if (!game.achievements.includes('first_victory') && 
        game.statistics.totalBattlesWon > 0) {
        showAchievement('النصر الأول', 'انتصرت في أول معركة!');
        game.achievements.push('first_victory');
    }

    if (!game.achievements.includes('happy_people') && 
        game.resources.happiness >= 90) {
        showAchievement('الشعب السعيد', 'حققت مستوى رضا 90%!');
        game.achievements.push('happy_people');
    }

    if (!game.achievements.includes('millionaire') && 
        game.resources.gold >= 1000000) {
        showAchievement('المليونير الملكي', 'جمعت مليون قطعة ذهب!');
        game.achievements.push('millionaire');
    }
}

function showAchievement(title, description) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">🏆 ${title}</div>
        <div style="font-size: 1rem;">${description}</div>
    `;

    achievement.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37, #b8860b);
        color: #1f2937;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
        z-index: 1002;
        animation: achievementSlide 0.6s ease-out;
        min-width: 320px;
        border: 3px solid #ffd700;
    `;

    document.body.appendChild(achievement);

    setTimeout(() => {
        achievement.remove();
    }, 5000);

    updateScore(500);
    playSound('achievement');
}

function updateScore(points) {
    game.score += points;
    const scoreElements = ['game-score', 'score-display'];
    scoreElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = formatNumber(game.score);
    });
}

function checkGameOver() {
    if (game.resources.gold < -1000 || game.resources.happiness < 5 || game.resources.population < 20) {
        let reason = '';
        if (game.resources.gold < -1000) reason = 'إفلاس المملكة - الديون تفوق قدرة السداد!';
        if (game.resources.happiness < 5) reason = 'ثورة الشعب - الرضا منخفض جداً!';
        if (game.resources.population < 20) reason = 'انهيار السكان - لا يوجد شعب كافي!';
        
        showGameOver(reason, false);
    }
}

function showGameOver(reason, isVictory = false) {
    const modal = document.getElementById('game-over-modal');
    if (!modal) return;

    const title = document.getElementById('game-over-title');
    const text = document.getElementById('game-over-text');

    if (title) title.textContent = isVictory ? '🏆 انتصار عظيم!' : '💀 نهاية العهد';
    if (text) {
        text.textContent = `${reason}

📊 إحصائيات العهد:
🏆 النقاط النهائية: ${formatNumber(game.score)}
👑 سنوات الحكم: ${game.year}
⚔️ معارك انتصرت: ${game.statistics.totalBattlesWon}
💀 معارك خسرت: ${game.statistics.totalBattlesLost}
🏘️ مباني بُنيت: ${game.statistics.buildingsConstructed}
👷 عمال وُظفوا: ${game.statistics.workersHired}`;
    }

    modal.style.display = 'block';
    game.gameRunning = false;
    
    if (gameLoop) clearInterval(gameLoop);
    if (decisionLoop) clearInterval(decisionLoop);
}

function onNewYear() {
    const growthRate = Math.max(0.01, game.resources.happiness / 1000);
    const populationGrowth = Math.floor(game.resources.population * growthRate);
    game.resources.population += populationGrowth;

    const yearlyBonus = game.year * 50;
    game.resources.gold += yearlyBonus;

    addToEventsLog(`📅 تقرير العام ${game.year}: نمو السكان +${populationGrowth}, مكافأة نهاية العام +${yearlyBonus} ذهب`);
    updateScore(100 + game.year * 10);
    
    updateWeather();
    
    showNotification(`🎊 عام جديد سعيد! العام ${game.year + 1} يبدأ`, 'success');
}

function addToEventsLog(eventText) {
    const eventsLog = document.getElementById('events-log');
    if (!eventsLog) return;

    const eventItem = document.createElement('div');
    eventItem.className = 'event-item fade-in';

    const timeString = `السنة ${game.year} - الشهر ${game.month} - اليوم ${game.day}`;

    eventItem.innerHTML = `
        <span class="event-time">${timeString}</span>
        <span class="event-text">${eventText}</span>
    `;

    eventsLog.insertBefore(eventItem, eventsLog.firstChild);

    while (eventsLog.children.length > 20) {
        eventsLog.removeChild(eventsLog.lastChild);
    }
}

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        success: 'linear-gradient(135deg, #059669, #047857)',
        error: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        warning: 'linear-gradient(135deg, #d97706, #b45309)',
        info: 'linear-gradient(135deg, #1e3a8a, #1e40af)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.2rem 2rem;
        border-radius: 12px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        max-width: 350px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        background: ${colors[type] || colors.info};
        border: 2px solid rgba(255, 255, 255, 0.2);
        animation: slideInRight 0.4s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => notification.remove(), 400);
    }, duration);
}

function updateStatWithAnimation(statId, newValue) {
    const element = document.getElementById(statId);
    if (!element) return;

    const oldValue = element.textContent;

    if (oldValue !== newValue.toString()) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        element.textContent = newValue;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }
}

function updateButtonStates() {
    document.querySelectorAll('.building-card').forEach(card => {
        const buildingType = card.dataset.building;
        const buildingData = BUILDING_DATA[buildingType];

        if (!buildingData) return;

        const canAfford = canAffordBuilding(buildingType);
        const hasWorkers = checkWorkerRequirements(buildingType);
        const available = canAfford && hasWorkers;

        card.style.opacity = available ? '1' : '0.6';
        card.style.pointerEvents = available ? 'auto' : 'none';

        if (!available) {
            card.classList.add('disabled');
        } else {
            card.classList.remove('disabled');
        }
    });
}

function initializeAudio() {
    console.log('🔊 تم تهيئة النظام الصوتي');
}

function playSound(type) {
    if (!audioEnabled) return;
    console.log(`🔊 تشغيل صوت: ${type}`);
}

function saveGame() {
    try {
        const gameData = {
            ...game,
            savedAt: new Date().toISOString(),
            version: '4.1'
        };
        localStorage.setItem('kingdomGameEnhanced', JSON.stringify(gameData));
        showNotification('تم حفظ اللعبة بنجاح! 💾', 'success');
        addToEventsLog('💾 تم حفظ حالة المملكة');
    } catch (error) {
        showNotification('فشل في حفظ اللعبة!', 'error');
        console.error('Save error:', error);
    }
}

function loadGame() {
    try {
        const gameData = localStorage.getItem('kingdomGameEnhanced');
        if (gameData) {
            const loadedGame = JSON.parse(gameData);
            
            Object.assign(game, loadedGame);
            
            updateUI();
            showNotification('تم تحميل اللعبة بنجاح! 📂', 'success');
            addToEventsLog('📂 تم استعادة حالة المملكة المحفوظة');
        } else {
            showNotification('لا توجد لعبة محفوظة!', 'warning');
        }
    } catch (error) {
        showNotification('فشل في تحميل اللعبة!', 'error');
        console.error('Load error:', error);
    }
}

function pauseGame() {
    game.isPaused = !game.isPaused;
    const btn = document.getElementById('pause-btn');
    if (btn) {
        btn.textContent = game.isPaused ? 'تشغيل ▶️' : 'إيقاف ⏸️';
    }

    showNotification(
        game.isPaused ? 'تم إيقاف اللعبة مؤقتاً ⏸️' : 'تم استئناف اللعبة ▶️', 
        'info'
    );
}

function restartGame() {
    if (confirm('هل أنت متأكد من إعادة بدء اللعبة؟ ستفقد كل التقدم الحالي!')) {
        if (gameLoop) clearInterval(gameLoop);
        if (decisionLoop) clearInterval(decisionLoop);

        game = new GameState();
        createMap();
        updateUI();

        const modal = document.getElementById('game-over-modal');
        if (modal) modal.style.display = 'none';

        startGameLoop();
        startDecisionLoop();

        showNotification('تم إعادة تشغيل اللعبة! 🎮', 'success');
        addToEventsLog('🏰 بداية عهد جديد - حظاً سعيداً أيها الملك!');
    }
}

// بدء اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 تحميل إمبراطورية الملوك المحسنة...');
    showWelcomeScreen();
});
