"use strict";

const STORAGE_KEY = "kaiju-roguelight-prototype-save-v1";
const KAIJU_VISUAL_MANIFEST_PATH = "./assets/kaiju/manifest.json";
const DEFAULT_KAIJU_VISUALS = [
  {
    id: "radiation",
    name: "熔核装甲型",
    theme: "黒鉄の厚い外殻と青緑の放射発光を備えた、結晶背びれの重装型怪獣。",
    battleImage: "./assets/kaiju/radiation/battle.png",
    portraitImage: "./assets/kaiju/radiation/portrait.png",
    iconImage: "./assets/kaiju/radiation/icon.png",
    tags: ["放射能", "熔核装甲", "結晶背びれ", "熱線器官"],
  },
  {
    id: "faith",
    name: "神域侵蝕型",
    theme: "神具と石像を思わせる外装に、青白い霊光と呪印を帯びた荘厳な怪獣。",
    battleImage: "./assets/kaiju/faith/battle.png",
    portraitImage: "./assets/kaiju/faith/portrait.png",
    iconImage: "./assets/kaiju/faith/icon.png",
    tags: ["古代信仰", "神具外装", "呪印", "霊光"],
  },
  {
    id: "abyss",
    name: "深海侵食型",
    theme: "湿潤な甲殻と発光胞子、鰭と触手を併せ持つ海溝由来の重量級怪獣。",
    battleImage: "./assets/kaiju/abyss/battle.png",
    portraitImage: "./assets/kaiju/abyss/portrait.png",
    iconImage: "./assets/kaiju/abyss/icon.png",
    tags: ["深海異変", "生体発光", "触手", "海溝圧"],
  },
];

const DATA = {
  causes: [
    {
      id: "radiation",
      name: "放射能",
      short: "核熱暴走",
      blurb: "被曝が生体構造を飽和させ、熱線と装甲を獲得する。",
      statMods: { maxHp: 8, power: 2, menace: 1, mobility: -1 },
      tags: ["熱線", "装甲"],
      starterCards: ["heat-ray", "molten-hide", "crush-step", "fallout-bloom"],
    },
    {
      id: "faith",
      name: "古代信仰",
      short: "神域覚醒",
      blurb: "祭祀と禁忌が怪獣を呼び戻し、呪印と反響で戦う。",
      statMods: { maxHp: 2, power: 1, menace: 2, mobility: 1 },
      tags: ["呪印", "召喚"],
      starterCards: ["omen-chant", "sacred-barrier", "worship-frenzy", "idol-gaze"],
    },
    {
      id: "abyss",
      name: "深海異変",
      short: "海溝侵食",
      blurb: "深海圧と未知の器官が増殖し、浸食と再生を繰り返す。",
      statMods: { maxHp: 5, power: 1, menace: 1, mobility: 2 },
      tags: ["浸食", "再生"],
      starterCards: ["tidal-rend", "brine-regrowth", "abyssal-spores", "undertow"],
    },
  ],
  environments: [
    {
      id: "city",
      name: "町",
      blurb: "人口密度が高く、混乱と隠蔽が歪みを育てる。",
      statMods: { power: 1, menace: 2, cityPressure: -1 },
      tags: ["群衆", "偽装"],
      bonusCards: ["stampede", "signal-jam"],
      cityProfile: { power: 4, port: 1, commerce: 3, morale: 4, alerts: 3 },
    },
    {
      id: "coast",
      name: "沿岸都市",
      blurb: "海運と港湾設備が豊富。浸水と物流破壊が有効。",
      statMods: { mobility: 1, menace: 1, cityPressure: 0 },
      tags: ["浸水", "港湾"],
      bonusCards: ["storm-surge", "harbor-collapse"],
      cityProfile: { power: 3, port: 4, commerce: 3, morale: 3, alerts: 2 },
    },
    {
      id: "industrial",
      name: "工業地帯",
      blurb: "施設密集地。燃料、煙害、重機が怪獣の成長に作用する。",
      statMods: { maxHp: 3, power: 1, cityPressure: 1 },
      tags: ["煙害", "重工"],
      bonusCards: ["reactor-breach", "steel-maw"],
      cityProfile: { power: 5, port: 2, commerce: 2, morale: 2, alerts: 4 },
    },
  ],
  amplifiers: [
    {
      id: "terror",
      name: "恐慌",
      blurb: "混乱が恐怖を増幅し、脅威値と手札圧を伸ばす。",
      statMods: { menace: 2 },
      mutation: "恐慌波動",
      bonusCard: "panic-feed",
    },
    {
      id: "adaptation",
      name: "適応",
      blurb: "局地的な対策に反応し、怪獣部位が戦闘中に変質する。",
      statMods: { maxHp: 4, power: 1 },
      mutation: "適応装甲",
      bonusCard: "adaptive-shell",
    },
    {
      id: "breach",
      name: "封印破壊",
      blurb: "封じられていた部位が露出し、決戦用の一撃を得る。",
      statMods: { power: 2 },
      mutation: "封印解放",
      bonusCard: "sealed-core",
    },
    {
      id: "pollution",
      name: "汚染拡散",
      blurb: "継続ダメージと都市状態異常を広く撒き散らす。",
      statMods: { menace: 1, mobility: 1 },
      mutation: "濃霧毒胞",
      bonusCard: "toxic-fog",
    },
    {
      id: "awakening",
      name: "群衆暴走",
      blurb: "群衆が怪獣側の触媒となり、イベント報酬が増える。",
      statMods: { mobility: 1, menace: 1 },
      mutation: "群体共鳴",
      bonusCard: "riot-wave",
    },
    {
      id: "resonance",
      name: "嵐共振",
      blurb: "天候と怪獣の器官が同期し、広域攻撃が強化される。",
      statMods: { power: 1, mobility: 1 },
      mutation: "雷嵐背びれ",
      bonusCard: "thunder-lattice",
    },
  ],
  cards: [
    {
      id: "heat-ray",
      name: "放射熱線",
      type: "attack",
      cost: 2,
      text: "防衛ユニットに 8 ダメージ。都市の電力に 1 ダメージ。",
      tags: ["熱線", "単体"],
      play(state, battle) {
        damagePreferredUnit(battle, 8, "power", 1);
      },
    },
    {
      id: "molten-hide",
      name: "溶融甲皮",
      type: "mutation",
      cost: 1,
      text: "シールドを 7 得る。次の敵ターンのダメージを 1 軽減。",
      tags: ["装甲"],
      play(state, battle) {
        state.run.kaiju.shield += 7;
        addTempEffect(battle, "enemyWeaken", 1);
        log(battle, "甲皮が硬化し、怪獣の表皮が熱を弾く。");
      },
    },
    {
      id: "crush-step",
      name: "踏み潰し",
      type: "attack",
      cost: 1,
      text: "都市中枢に 6 ダメージ。士気に 1 ダメージ。",
      tags: ["近接"],
      play(state, battle) {
        damageCity(battle, 6, { morale: 1 });
      },
    },
    {
      id: "fallout-bloom",
      name: "降灰増殖",
      type: "status",
      cost: 1,
      text: "汚染を 2 付与し、山札に『微細胞子』を 1 枚加える。",
      tags: ["汚染"],
      play(state, battle) {
        battle.cityStatuses.pollution += 2;
        battle.discard.push("micro-spores");
        log(battle, "汚染灰が都市へ降り積もる。");
      },
    },
    {
      id: "omen-chant",
      name: "予兆詠唱",
      type: "tactic",
      cost: 1,
      text: "カードを 2 枚引く。脅威が 1 上がる。",
      tags: ["呪印"],
      play(state, battle) {
        drawCards(battle, 2);
        state.run.kaiju.menace += 1;
        log(battle, "禁忌の詠唱が街の不安を掻き立てる。");
      },
    },
    {
      id: "sacred-barrier",
      name: "神域障壁",
      type: "mutation",
      cost: 1,
      text: "シールドを 5 得る。次に使う攻撃カードのダメージ +3。",
      tags: ["加護"],
      play(state, battle) {
        state.run.kaiju.shield += 5;
        addTempEffect(battle, "attackBoost", 3);
        log(battle, "神域の残滓が怪獣を包む。");
      },
    },
    {
      id: "worship-frenzy",
      name: "信奉暴走",
      type: "attack",
      cost: 2,
      text: "都市中枢に 5 ダメージ。警戒に 2 ダメージ。恐慌 +1。",
      tags: ["群衆"],
      play(state, battle) {
        damageCity(battle, 5, { alerts: 2 });
        battle.cityStatuses.panic += 1;
      },
    },
    {
      id: "idol-gaze",
      name: "偶像凝視",
      type: "status",
      cost: 1,
      text: "次の敵ターン、防衛ユニット 1 体を無力化する。",
      tags: ["凝視"],
      play(state, battle) {
        addTempEffect(battle, "stunUnit", 1);
        log(battle, "視線を受けた防衛線が一瞬停止する。");
      },
    },
    {
      id: "tidal-rend",
      name: "潮砕き",
      type: "attack",
      cost: 2,
      text: "全防衛ユニットに 4 ダメージ。港湾に 2 ダメージ。",
      tags: ["範囲", "浸水"],
      play(state, battle) {
        battle.enemyUnits.forEach((unit) => {
          unit.hp = Math.max(0, unit.hp - 4);
        });
        damageCity(battle, 0, { port: 2 });
        cleanupUnits(battle);
      },
    },
    {
      id: "brine-regrowth",
      name: "塩水再生",
      type: "mutation",
      cost: 1,
      text: "HP を 9 回復し、再生を 2 得る。",
      tags: ["再生"],
      play(state, battle) {
        healKaiju(state.run.kaiju, 9);
        addTempEffect(battle, "regen", 2);
      },
    },
    {
      id: "abyssal-spores",
      name: "深海胞子",
      type: "status",
      cost: 1,
      text: "浸水 +2、汚染 +1。カードを 1 枚引く。",
      tags: ["胞子"],
      play(state, battle) {
        battle.cityStatuses.flood += 2;
        battle.cityStatuses.pollution += 1;
        drawCards(battle, 1);
      },
    },
    {
      id: "undertow",
      name: "引き波",
      type: "tactic",
      cost: 0,
      text: "次に使う攻撃カードのダメージ +4。カードを 1 枚捨ててもよい。",
      tags: ["補助"],
      play(state, battle) {
        addTempEffect(battle, "attackBoost", 4);
        log(battle, "海溝の圧が次の一撃を押し上げる。");
      },
    },
    {
      id: "stampede",
      name: "群衆雪崩",
      type: "attack",
      cost: 1,
      text: "士気に 2 ダメージ。恐慌 +2。防衛ユニットに 4 ダメージ。",
      tags: ["群衆"],
      play(state, battle) {
        damageCity(battle, 0, { morale: 2 });
        battle.cityStatuses.panic += 2;
        damagePreferredUnit(battle, 4);
      },
    },
    {
      id: "signal-jam",
      name: "通信攪乱",
      type: "status",
      cost: 1,
      text: "警戒に 2 ダメージ。次の敵ターンの総攻撃力 -3。",
      tags: ["妨害"],
      play(state, battle) {
        damageCity(battle, 0, { alerts: 2 });
        addTempEffect(battle, "enemyWeaken", 3);
      },
    },
    {
      id: "storm-surge",
      name: "暴潮上陸",
      type: "attack",
      cost: 2,
      text: "港湾に 3 ダメージ。都市中枢に 7 ダメージ。",
      tags: ["浸水"],
      play(state, battle) {
        damageCity(battle, 7, { port: 3 });
      },
    },
    {
      id: "harbor-collapse",
      name: "港湾崩落",
      type: "attack",
      cost: 2,
      text: "港湾に 4 ダメージ。最も HP の低い防衛ユニットを撃破する。",
      tags: ["物流"],
      play(state, battle) {
        damageCity(battle, 0, { port: 4 });
        const target = [...battle.enemyUnits].sort((a, b) => a.hp - b.hp)[0];
        if (target) {
          target.hp = 0;
          cleanupUnits(battle);
          log(battle, `${target.name} が港湾機能の巻き添えで沈黙。`);
        }
      },
    },
    {
      id: "reactor-breach",
      name: "炉心暴露",
      type: "attack",
      cost: 3,
      text: "電力に 4 ダメージ。都市中枢に 9 ダメージ。自傷 4。",
      tags: ["炉心"],
      play(state, battle) {
        damageCity(battle, 9, { power: 4 });
        applyKaijuDamage(state.run.kaiju, 4);
      },
    },
    {
      id: "steel-maw",
      name: "鋼鉄咬砕",
      type: "attack",
      cost: 1,
      text: "防衛ユニットに 7 ダメージ。撃破時、エナジー +1。",
      tags: ["重工"],
      play(state, battle) {
        const target = getPrimaryUnit(battle);
        if (!target) {
          damageCity(battle, 5);
          return;
        }
        target.hp = Math.max(0, target.hp - 7);
        log(battle, `${target.name} に咬砕攻撃。`);
        if (target.hp === 0) {
          battle.energy += 1;
        }
        cleanupUnits(battle);
      },
    },
    {
      id: "panic-feed",
      name: "恐慌捕食",
      type: "tactic",
      cost: 1,
      text: "恐慌 1 ごとに都市中枢へ 2 ダメージ。最大 8。",
      tags: ["恐慌"],
      play(state, battle) {
        const damage = Math.min(8, battle.cityStatuses.panic * 2);
        damageCity(battle, damage);
      },
    },
    {
      id: "adaptive-shell",
      name: "適応甲殻",
      type: "mutation",
      cost: 1,
      text: "シールド 4。全都市ステータスに 1 ダメージ。",
      tags: ["適応"],
      play(state, battle) {
        state.run.kaiju.shield += 4;
        damageCity(battle, 0, { power: 1, port: 1, commerce: 1, morale: 1, alerts: 1 });
      },
    },
    {
      id: "sealed-core",
      name: "封印核解放",
      type: "attack",
      cost: 3,
      text: "都市中枢に 14 ダメージ。次の敵ターン、怪獣は 4 ダメージ受ける。",
      tags: ["決戦"],
      play(state, battle) {
        damageCity(battle, 14);
        addTempEffect(battle, "selfVulnerable", 4);
      },
    },
    {
      id: "toxic-fog",
      name: "毒霧災群",
      type: "status",
      cost: 2,
      text: "汚染 +3。全防衛ユニットに 3 ダメージ。カードを 1 枚引く。",
      tags: ["毒霧"],
      play(state, battle) {
        battle.cityStatuses.pollution += 3;
        battle.enemyUnits.forEach((unit) => {
          unit.hp = Math.max(0, unit.hp - 3);
        });
        cleanupUnits(battle);
        drawCards(battle, 1);
      },
    },
    {
      id: "riot-wave",
      name: "暴徒波",
      type: "attack",
      cost: 1,
      text: "士気に 3 ダメージ。カードを 1 枚引く。エナジー +1。",
      tags: ["暴走"],
      play(state, battle) {
        damageCity(battle, 0, { morale: 3 });
        battle.energy += 1;
        drawCards(battle, 1);
      },
    },
    {
      id: "thunder-lattice",
      name: "雷嵐背びれ",
      type: "attack",
      cost: 2,
      text: "全防衛ユニットに 5 ダメージ。警戒に 2 ダメージ。",
      tags: ["雷嵐"],
      play(state, battle) {
        battle.enemyUnits.forEach((unit) => {
          unit.hp = Math.max(0, unit.hp - 5);
        });
        damageCity(battle, 0, { alerts: 2 });
        cleanupUnits(battle);
      },
    },
    {
      id: "micro-spores",
      name: "微細胞子",
      type: "status",
      cost: 0,
      text: "汚染 +1。都市中枢に 2 ダメージ。",
      tags: ["胞子"],
      play(state, battle) {
        battle.cityStatuses.pollution += 1;
        damageCity(battle, 2);
      },
    },
    {
      id: "aftershock",
      name: "余震爪撃",
      type: "attack",
      cost: 1,
      text: "都市中枢に 6 ダメージ。ランダムな都市ステータスに 1 ダメージ。",
      tags: ["衝撃"],
      play(state, battle) {
        const keys = ["power", "port", "commerce", "morale", "alerts"];
        const key = keys[Math.floor(Math.random() * keys.length)];
        damageCity(battle, 6, { [key]: 1 });
      },
    },
    {
      id: "predator-posture",
      name: "捕食姿勢",
      type: "tactic",
      cost: 1,
      text: "次に使う攻撃カードのダメージ +5。HP を 4 回復。",
      tags: ["構え"],
      play(state, battle) {
        addTempEffect(battle, "attackBoost", 5);
        healKaiju(state.run.kaiju, 4);
      },
    },
    {
      id: "shred-armor",
      name: "装甲裂断",
      type: "attack",
      cost: 1,
      text: "防衛ユニットに 6 ダメージ。撃破時、都市中枢に 4 ダメージ。",
      tags: ["部位破壊"],
      play(state, battle) {
        const target = getPrimaryUnit(battle);
        if (!target) {
          damageCity(battle, 4);
          return;
        }
        target.hp = Math.max(0, target.hp - 6);
        if (target.hp === 0) {
          damageCity(battle, 4);
        }
        cleanupUnits(battle);
      },
    },
  ],
  nodeTemplates: [
    {
      id: "survey",
      type: "観測",
      title: "観測網の亀裂",
      text: "監視盲点を探り、怪獣顕現の条件を整える。",
      reward: "カード 1 枚獲得",
      effect(state) {
        gainRandomCard(state, ["tactic", "status"]);
        state.run.city.alerts = Math.max(0, state.run.city.alerts - 1);
      },
    },
    {
      id: "riot",
      type: "イベント",
      title: "暴徒の増殖",
      text: "都市の恐慌が高まり、群衆が怪獣側の触媒となる。",
      reward: "脅威 +1 / 士気 -1",
      effect(state) {
        state.run.kaiju.menace += 1;
        state.run.city.morale = Math.max(0, state.run.city.morale - 1);
      },
    },
    {
      id: "mutation",
      type: "イベント",
      title: "器官の変質",
      text: "怪獣部位が突然変異し、新たなカードを得る。",
      reward: "変異カード獲得 / 最大HP +3",
      effect(state) {
        gainRandomCard(state, ["mutation"]);
        state.run.kaiju.maxHp += 3;
        state.run.kaiju.hp += 3;
      },
    },
    {
      id: "shelter",
      type: "休息",
      title: "地下水脈で潜伏",
      text: "しばし身を隠し、表皮と器官を再構成する。",
      reward: "HP 12 回復 / シールド +4",
      effect(state) {
        healKaiju(state.run.kaiju, 12);
        state.run.kaiju.shield += 4;
      },
    },
    {
      id: "breach",
      type: "危機",
      title: "封鎖線突破",
      text: "軍の封鎖網を荒らし、都市中枢への進路を開く。",
      reward: "攻撃カード獲得 / 警戒 -1",
      effect(state) {
        gainRandomCard(state, ["attack"]);
        state.run.city.alerts = Math.max(0, state.run.city.alerts - 1);
      },
    },
    {
      id: "industrial-spill",
      type: "イベント",
      title: "工場群の破損",
      text: "燃料と薬液が怪獣成長の触媒として噴き出す。",
      reward: "パワー +1 / 電力 -1",
      effect(state) {
        state.run.kaiju.power += 1;
        state.run.city.power = Math.max(0, state.run.city.power - 1);
      },
    },
    {
      id: "elite-scout",
      type: "エリート",
      title: "対怪獣特殊部隊",
      text: "精鋭部隊が現れ、顕現前の怪獣を狩ろうとする。",
      reward: "防衛ユニット情報を入手 / エナジー上限 +1",
      effect(state) {
        state.run.kaiju.energyMax += 1;
        state.run.intel.push("精鋭部隊は士気低下で崩れやすい");
      },
    },
    {
      id: "cult",
      type: "イベント",
      title: "密儀の再演",
      text: "信奉者たちが儀式を再開し、怪獣の輪郭を補強する。",
      reward: "手札補助カード獲得 / 脅威 +1",
      effect(state) {
        gainSpecificCard(state, "predator-posture");
        state.run.kaiju.menace += 1;
      },
    },
    {
      id: "port-chaos",
      type: "危機",
      title: "港湾物流の錯乱",
      text: "輸送線が乱れ、防衛資材が届かなくなる。",
      reward: "港湾 -1 / 商業 -1 / 浸水付与",
      effect(state) {
        state.run.city.port = Math.max(0, state.run.city.port - 1);
        state.run.city.commerce = Math.max(0, state.run.city.commerce - 1);
        state.run.battlePrep.flood += 1;
      },
    },
    {
      id: "omen-cache",
      type: "観測",
      title: "前兆資料の奪取",
      text: "対策本部の解析資料を奪い、戦闘の準備を整える。",
      reward: "次戦初手 +1 / カード獲得",
      effect(state) {
        state.run.battlePrep.extraDraw += 1;
        gainRandomCard(state, ["attack", "tactic"]);
      },
    },
  ],
  bosses: [
    {
      id: "garrison-alpha",
      name: "巨砲要塞都市",
      title: "対怪獣砲座群",
      cityHp: 56,
      units: [
        { id: "railgun", name: "電磁砲台", hp: 15, attack: 6 },
        { id: "airwing", name: "制空中隊", hp: 12, attack: 5 },
        { id: "garrison", name: "機甲守備隊", hp: 18, attack: 4 },
      ],
      passive: "毎ターン、警戒が 1 以上なら追加で 2 ダメージ。",
    },
    {
      id: "titan-lab",
      name: "ロボ兵器研究特区",
      title: "人型迎撃機構",
      cityHp: 60,
      units: [
        { id: "walker", name: "迎撃歩行機", hp: 20, attack: 6 },
        { id: "drone", name: "分析ドローン群", hp: 10, attack: 4 },
        { id: "artillery", name: "試製砲塔", hp: 14, attack: 5 },
      ],
      passive: "防衛ユニットが撃破されるたび警戒 +1。",
    },
    {
      id: "citadel-prime",
      name: "世界防衛中枢",
      title: "最終防衛線",
      cityHp: 64,
      units: [
        { id: "orbital", name: "軌道砲リンク", hp: 18, attack: 7 },
        { id: "mech", name: "決戦兵器", hp: 22, attack: 6 },
        { id: "shield", name: "防衛障壁塔", hp: 16, attack: 3 },
      ],
      passive: "商業が 0 でない限り、毎ターン都市中枢を 4 回復。",
    },
  ],
};

const state = {
  screen: "title",
  setup: {
    causeId: DATA.causes[0].id,
    environmentId: DATA.environments[0].id,
    amplifierId: DATA.amplifiers[0].id,
  },
  run: null,
  save: loadSave(),
  kaijuVisuals: createVisualIndex(DEFAULT_KAIJU_VISUALS),
};

const app = document.getElementById("app");
const metaPanel = document.getElementById("metaPanel");

document.addEventListener("click", handleClick);

render();
loadKaijuVisualManifest();

function render() {
  renderMeta();

  switch (state.screen) {
    case "title":
      mountTemplate("screen-title");
      break;
    case "setup":
      mountTemplate("screen-setup");
      renderSetup();
      break;
    case "map":
      mountTemplate("screen-map");
      renderMap();
      break;
    case "battle":
      mountTemplate("screen-battle");
      renderBattle();
      break;
    case "result":
      mountTemplate("screen-result");
      renderResult();
      break;
    case "codex":
      mountTemplate("screen-codex");
      renderCodex();
      break;
    default:
      mountTemplate("screen-title");
      break;
  }
}

function mountTemplate(id) {
  const template = document.getElementById(id);
  app.replaceChildren(template.content.cloneNode(true));
}

function renderMeta() {
  const history = state.save.history;
  const bestiaryCount = state.save.bestiary.length;
  metaPanel.innerHTML = `
    <div class="pill">発見怪獣 ${bestiaryCount}</div>
    <div class="pill">試行回数 ${history.length}</div>
    <div class="pill">勝利 ${history.filter((entry) => entry.outcome === "victory").length}</div>
  `;
}

function renderSetup() {
  renderOptions("causeOptions", DATA.causes, state.setup.causeId);
  renderOptions("environmentOptions", DATA.environments, state.setup.environmentId);
  renderOptions("amplifierOptions", DATA.amplifiers, state.setup.amplifierId);

  const preview = buildRunBlueprint();
  const visual = getKaijuVisual(preview.cause.id);
  const previewTags = [...new Set([...visual.tags, ...preview.tags])];
  const previewEl = document.getElementById("setupPreview");
  previewEl.innerHTML = `
    <div class="preview-stack">
      <div class="info-block">
        <p class="eyebrow accent">Kaiju Seed</p>
        ${renderPortrait(visual, preview.name, "kaiju-preview-portrait")}
        <span class="preview-title">${preview.name}</span>
        <p>${preview.profile}</p>
      </div>
      <div class="info-block">
        <p class="eyebrow accent">Visual Theme</p>
        <strong>${visual.name}</strong>
        <p>${visual.theme}</p>
      </div>
      <div class="info-block">
        <p class="eyebrow accent">特性</p>
        <div class="tag-row">
          ${previewTags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="info-block">
        <p class="eyebrow accent">基礎能力</p>
        <div class="status-grid">
          ${statTile("HP", preview.kaiju.maxHp)}
          ${statTile("パワー", preview.kaiju.power)}
          ${statTile("脅威", preview.kaiju.menace)}
          ${statTile("機動", preview.kaiju.mobility)}
        </div>
      </div>
      <div class="info-block">
        <p class="eyebrow accent">初期デッキ</p>
        <div class="small-card-list">
          ${preview.deckPreview.map(renderSmallCard).join("")}
        </div>
      </div>
      <div class="footer-note">開始時にボス都市はランダム選出され、前兆マップは 4 層で生成されます。</div>
    </div>
  `;
}

function renderOptions(targetId, items, selectedId) {
  const root = document.getElementById(targetId);
  root.innerHTML = items
    .map(
      (item) => `
        <button
          class="option-button ${item.id === selectedId ? "selected" : ""}"
          data-action="select-option"
          data-group="${targetId}"
          data-id="${item.id}"
        >
          <strong>${item.name}</strong>
          <small>${item.blurb}</small>
        </button>
      `,
    )
    .join("");
}

function renderMap() {
  const run = state.run;
  document.getElementById("runSummary").innerHTML = `
    <div class="info-stack">
      <div class="info-block">
        <p class="eyebrow accent">Current Kaiju</p>
        <span class="preview-title">${run.kaiju.name}</span>
        <p>${run.kaiju.profile}</p>
      </div>
      <div class="metric-grid">
        ${metricCard("HP", `${run.kaiju.hp}/${run.kaiju.maxHp}`, run.kaiju.hp <= run.kaiju.maxHp * 0.35 ? "warn" : "good")}
        ${metricCard("デッキ", `${run.deck.length} 枚`)}
        ${metricCard("脅威", run.kaiju.menace)}
        ${metricCard("機動", run.kaiju.mobility)}
      </div>
      <div class="info-block">
        <p class="eyebrow accent">都市圧力</p>
        <div class="status-grid">
          ${statusTile("電力", run.city.power)}
          ${statusTile("港湾", run.city.port)}
          ${statusTile("商業", run.city.commerce)}
          ${statusTile("士気", run.city.morale)}
          ${statusTile("警戒", run.city.alerts)}
        </div>
      </div>
      <div class="info-block">
        <p class="eyebrow accent">部位 / 変異</p>
        <div class="small-card-list">
          ${run.kaiju.parts.map((part) => `<span class="small-card mutation">${part}</span>`).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("tierIndicator").textContent = `前兆層 ${Math.min(run.mapProgress + 1, run.map.length)} / ${run.map.length}`;

  const board = document.getElementById("mapBoard");
  board.innerHTML = run.map
    .map((tier, tierIndex) => {
      return `
        <div class="map-tier">
          ${tier
            .map((node) => {
              const classes = [
                "map-node",
                node.completed ? "completed" : "",
                node.available ? "available" : "",
                !node.available && !node.completed && tierIndex !== run.mapProgress ? "locked" : "",
                tierIndex === run.mapProgress ? "current" : "",
              ].join(" ");
              return `
                <article class="${classes}" data-action="pick-node" data-node-id="${node.id}">
                  <span class="node-type">${node.type}</span>
                  <h3>${node.title}</h3>
                  <p>${node.text}</p>
                  <span class="node-reward">${node.reward}</span>
                </article>
              `;
            })
            .join("")}
        </div>
      `;
    })
    .join("");

  const detail = document.getElementById("nodeDetail");
  if (run.lastNodeResult) {
    detail.innerHTML = `
      <div class="info-stack">
        <div class="info-block">
          <p class="eyebrow accent">直近の異変</p>
          <span class="preview-title">${run.lastNodeResult.title}</span>
          <p>${run.lastNodeResult.summary}</p>
        </div>
        <div class="info-block">
          <p class="eyebrow accent">追加カード</p>
          <div class="small-card-list">
            ${
              run.lastNodeResult.cards.length
                ? run.lastNodeResult.cards.map(renderSmallCardById).join("")
                : "<span class='muted'>獲得なし</span>"
            }
          </div>
        </div>
        <div class="info-block">
          <p class="eyebrow accent">敵情</p>
          <div class="mini-list">
            ${
              run.intel.length
                ? run.intel.map((entry) => `<span class="small-card">${entry}</span>`).join("")
                : "<span class='muted'>情報なし</span>"
            }
          </div>
        </div>
      </div>
    `;
  } else {
    detail.innerHTML = `
      <div class="info-stack">
        <div class="info-block">
          <p class="eyebrow accent">概要</p>
          <p>怪獣顕現前に 4 回の異変を選択します。イベントは都市状態とデッキ構成へ反映され、最終戦の手触りを変えます。</p>
        </div>
        <div class="info-block">
          <p class="eyebrow accent">今回の最終都市</p>
          <span class="preview-title">${run.boss.name}</span>
          <p>${run.boss.title}</p>
          <p class="subtle">${run.boss.passive}</p>
        </div>
      </div>
    `;
  }

  document.getElementById("enterBattleButton").classList.toggle("hidden", run.mapProgress < run.map.length);
}

function renderBattle() {
  const run = state.run;
  const battle = run.battle;
  const visual = getKaijuVisual(run.cause.id);

  document.getElementById("battleHeading").textContent = `${run.boss.name} を攻略する`;
  document.getElementById("kaijuPanel").innerHTML = renderKaijuPanel(run.kaiju, battle);
  document.getElementById("cityPanel").innerHTML = renderCityPanel(run.city, run.boss, battle);

  document.getElementById("battleStatus").innerHTML = `
    ${stageMetric("都市中枢", battle.cityHp, run.boss.cityHp)}
    ${stageMetric("防衛ユニット", battle.enemyUnits.length, run.boss.units.length)}
    ${stageMetric("経過ターン", battle.turn, null)}
  `;

  const handMeta = document.getElementById("handMeta");
  handMeta.innerHTML = `
    <span class="pill">エナジー ${battle.energy}/${run.kaiju.energyMax}</span>
    <span class="pill">山札 ${battle.deck.length}</span>
    <span class="pill">捨札 ${battle.discard.length}</span>
    <span class="pill">シールド ${run.kaiju.shield}</span>
  `;

  document.getElementById("handGrid").innerHTML = battle.hand.length
    ? battle.hand
        .map((cardId, index) => {
          const card = getCard(cardId);
          return `
            <article class="card-chip ${card.type}">
              <header>
                <div>
                  <h4>${card.name}</h4>
                  <div class="card-tags">${card.tags.join(" / ")}</div>
                </div>
                <span class="card-cost">${card.cost}</span>
              </header>
              <p>${card.text}</p>
              <button
                class="secondary"
                data-action="play-card"
                data-card-index="${index}"
                ${battle.energy < card.cost ? "disabled" : ""}
              >
                使用
              </button>
            </article>
          `;
        })
        .join("")
    : "<div class='info-block'><p>手札がありません。ターン終了で再補充します。</p></div>";

  document.getElementById("battleLog").innerHTML = battle.log
    .slice()
    .reverse()
    .map((entry) => `<div class="log-entry">${entry}</div>`)
    .join("");

  const silhouette = document.querySelector(".monster-silhouette");
  if (silhouette) {
    silhouette.innerHTML = renderBattleMonsterVisual(visual, run.kaiju.name);
  }
}

function renderResult() {
  const result = state.run.result;
  const run = state.run;
  const visual = getKaijuVisual(run.cause.id);
  document.getElementById("resultTitle").textContent =
    result.outcome === "victory" ? "都市中枢は崩壊した" : "怪獣は沈黙した";

  document.getElementById("resultSummary").innerHTML = `
    <p class="eyebrow accent">Run Summary</p>
    ${renderPortrait(visual, run.kaiju.name, "result-portrait")}
    <div class="result-callout">${run.kaiju.name}</div>
    <div class="list-stack">
      <div class="result-item info-block">
        <strong>結果</strong>
        <p>${result.outcome === "victory" ? "都市攻略成功" : "迎撃により敗北"}</p>
      </div>
      <div class="result-item info-block">
        <strong>使用した構成</strong>
        <p>${run.cause.name} / ${run.environment.name} / ${run.amplifier.name}</p>
      </div>
      <div class="result-item info-block">
        <strong>最終ステータス</strong>
        <p>HP ${run.kaiju.hp}/${run.kaiju.maxHp}, パワー ${run.kaiju.power}, 脅威 ${run.kaiju.menace}, 機動 ${run.kaiju.mobility}</p>
      </div>
      <div class="result-item info-block">
        <strong>戦闘記録</strong>
        <p>${result.turns} ターン / ノード ${run.mapProgress} 件踏破 / デッキ ${run.deck.length} 枚</p>
      </div>
    </div>
  `;

  document.getElementById("unlockSummary").innerHTML = `
    <p class="eyebrow accent">記録反映</p>
    <div class="list-stack">
      <div class="info-block">
        <strong>図鑑登録</strong>
        <p>${result.bestiaryRegistered ? "新規怪獣を図鑑へ追加" : "既存怪獣の記録を更新"}</p>
      </div>
      <div class="info-block">
        <strong>ラン履歴</strong>
        <p>${state.save.history.length} 件の試行を保存済み</p>
      </div>
      <div class="info-block">
        <strong>ボス解析</strong>
        <p>${run.boss.name} / ${run.boss.passive}</p>
      </div>
      <div class="info-block">
        <strong>獲得した部位</strong>
        <div class="small-card-list">${run.kaiju.parts.map((part) => `<span class="small-card mutation">${part}</span>`).join("")}</div>
      </div>
    </div>
  `;
}

function renderCodex() {
  const historyPanel = document.getElementById("historyPanel");
  const bestiaryPanel = document.getElementById("bestiaryPanel");

  const history = state.save.history.slice().reverse();
  historyPanel.innerHTML = `
    <p class="eyebrow accent">Run History</p>
    <div class="list-stack">
      ${
        history.length
          ? history
              .map(
                (entry) => {
                  const visual = getKaijuVisual(entry.visualId || guessVisualId(entry.cause || entry.profile || entry.name));
                  return `
                  <article class="history-entry">
                    <div class="history-metric">
                      ${renderIcon(visual, entry.name, "history-icon")}
                      <strong>${entry.name}</strong>
                      <span class="pill">${entry.outcome === "victory" ? "勝利" : "敗北"}</span>
                    </div>
                    <p>${entry.date}</p>
                    <p>${entry.cause} / ${entry.environment} / ${entry.amplifier}</p>
                    <p class="muted">ボス: ${entry.boss} / ${entry.turns} ターン</p>
                  </article>
                `;
                },
              )
              .join("")
          : "<p class='muted'>まだ履歴がありません。</p>"
      }
    </div>
  `;

  bestiaryPanel.innerHTML = `
    <p class="eyebrow accent">Bestiary</p>
    <div class="list-stack">
      ${
        state.save.bestiary.length
          ? state.save.bestiary
              .map(
                (entry) => {
                  const visual = getKaijuVisual(entry.visualId || guessVisualId(entry.name + entry.profile));
                  return `
                  <article class="bestiary-entry info-block">
                    ${renderPortrait(visual, entry.name, "bestiary-portrait")}
                    <strong>${entry.name}</strong>
                    <p>${entry.profile}</p>
                    <div class="small-card-list">
                      ${renderIcon(visual, `${entry.name} icon`, "bestiary-icon")}
                      ${entry.parts.map((part) => `<span class="small-card mutation">${part}</span>`).join("")}
                    </div>
                    <p class="muted">最大被害: ${entry.bestOutcome}</p>
                  </article>
                `;
                },
              )
              .join("")
          : "<p class='muted'>図鑑データはまだありません。</p>"
      }
    </div>
  `;
}

function handleClick(event) {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) {
    return;
  }

  const action = trigger.dataset.action;
  switch (action) {
    case "goto-setup":
      state.screen = "setup";
      render();
      return;
    case "back-title":
      state.screen = "title";
      render();
      return;
    case "goto-codex":
      state.screen = "codex";
      render();
      return;
    case "select-option":
      handleSelectOption(trigger);
      return;
    case "start-run":
      startRun();
      return;
    case "pick-node":
      resolveNode(trigger.dataset.nodeId);
      return;
    case "enter-battle":
      enterBattle();
      return;
    case "play-card":
      playCard(Number(trigger.dataset.cardIndex));
      return;
    case "end-turn":
      endTurn();
      return;
    case "draw-info":
      pushLog(state.run.battle, `山札 ${state.run.battle.deck.length} / 捨札 ${state.run.battle.discard.length}`);
      renderBattle();
      return;
    case "abandon-run":
    case "retreat-run":
      abandonRun();
      return;
    default:
      return;
  }
}

function handleSelectOption(trigger) {
  const { group, id } = trigger.dataset;
  if (group === "causeOptions") {
    state.setup.causeId = id;
  }
  if (group === "environmentOptions") {
    state.setup.environmentId = id;
  }
  if (group === "amplifierOptions") {
    state.setup.amplifierId = id;
  }
  renderSetup();
}

function startRun() {
  const blueprint = buildRunBlueprint();
  const boss = cloneBoss(DATA.bosses[Math.floor(Math.random() * DATA.bosses.length)]);

  state.run = {
    cause: blueprint.cause,
    environment: blueprint.environment,
    amplifier: blueprint.amplifier,
    kaiju: blueprint.kaiju,
    deck: blueprint.deck,
    city: blueprint.city,
    battlePrep: { flood: 0, pollution: 0, extraDraw: 0 },
    boss,
    map: generateMap(),
    mapProgress: 0,
    lastNodeResult: null,
    intel: [],
    battle: null,
    result: null,
  };

  state.screen = "map";
  render();
}

function resolveNode(nodeId) {
  const run = state.run;
  const tier = run.map[run.mapProgress];
  const node = tier.find((entry) => entry.id === nodeId);
  if (!node || !node.available || node.completed) {
    return;
  }

  const previousDeckSize = run.deck.length;
  const previousParts = run.kaiju.parts.length;

  node.effect(state);
  node.completed = true;
  tier.forEach((entry) => {
    entry.available = false;
  });

  run.mapProgress += 1;
  if (run.mapProgress < run.map.length) {
    run.map[run.mapProgress].forEach((entry) => {
      entry.available = true;
    });
  }

  const cardsGained = run.deck.slice(previousDeckSize);
  const partsGained = run.kaiju.parts.slice(previousParts);
  run.lastNodeResult = {
    title: node.title,
    summary: `${node.text} 報酬: ${node.reward}`,
    cards: cardsGained,
    parts: partsGained,
  };

  renderMap();
}

function enterBattle() {
  const run = state.run;
  run.battle = createBattleState(run);
  state.screen = "battle";
  render();
}

function playCard(index) {
  const run = state.run;
  const battle = run.battle;
  const cardId = battle.hand[index];
  const card = getCard(cardId);
  if (!card || battle.energy < card.cost) {
    return;
  }

  battle.energy -= card.cost;
  battle.hand.splice(index, 1);
  const tempAttackBoost = battle.tempEffects.attackBoost || 0;
  const powerBonus = Math.max(0, run.kaiju.power - 4);
  if (card.type === "attack") {
    battle.lastAttackBoost = tempAttackBoost + powerBonus;
    battle.tempEffects.attackBoost = 0;
  } else {
    battle.lastAttackBoost = 0;
  }
  card.play(state, battle);
  if (card.type === "attack" && battle.lastAttackBoost) {
    log(battle, `怪獣の出力補正により攻撃が +${battle.lastAttackBoost} 強化された。`);
  }
  battle.lastAttackBoost = 0;
  battle.discard.push(cardId);
  cleanupUnits(battle);
  renderBattle();
  checkBattleEnd();
}

function endTurn() {
  const run = state.run;
  const battle = run.battle;
  resolveEnemyTurn(run, battle);
  if (checkBattleEnd()) {
    return;
  }

  battle.turn += 1;
  battle.energy = run.kaiju.energyMax;
  discardHand(battle);
  drawCards(battle, 4 + run.battlePrep.extraDraw + (run.kaiju.mobility >= 4 ? 1 : 0));
  applyRegen(run, battle);
  applyOngoingCityEffects(battle);
  decrementTempEffects(battle);
  renderBattle();
  checkBattleEnd();
}

function abandonRun() {
  if (!state.run) {
    state.screen = "title";
    render();
    return;
  }

  state.run.result = finalizeRun("defeat", state.run.battle ? state.run.battle.turn : 0);
  state.screen = "result";
  render();
}

function createBattleState(run) {
  const deck = shuffle([...run.deck]);
  const battle = {
    turn: 1,
    deck,
    discard: [],
    hand: [],
    energy: run.kaiju.energyMax,
    cityHp: run.boss.cityHp - run.city.power,
    enemyUnits: run.boss.units.map((unit) => ({ ...unit })),
    cityStatuses: {
      flood: run.battlePrep.flood,
      pollution: run.battlePrep.pollution,
      panic: Math.max(0, run.kaiju.menace - 1),
    },
    tempEffects: {},
    log: [],
    lastAttackBoost: 0,
  };

  drawCards(battle, 4 + run.battlePrep.extraDraw + (run.kaiju.mobility >= 4 ? 1 : 0));
  pushLog(battle, `${run.kaiju.name} が ${run.boss.name} へ上陸。`);
  if (run.kaiju.mobility >= 4) {
    pushLog(battle, "高機動により初手が拡張された。");
  }
  return battle;
}

function resolveEnemyTurn(run, battle) {
  const stunned = battle.tempEffects.stunUnit || 0;
  const enemyWeaken = battle.tempEffects.enemyWeaken || 0;
  const selfVulnerable = battle.tempEffects.selfVulnerable || 0;

  let totalDamage = 0;
  battle.enemyUnits.forEach((unit, index) => {
    if (index < stunned) {
      pushLog(battle, `${unit.name} は妨害され行動不能。`);
      return;
    }
    totalDamage += unit.attack;
  });

  totalDamage += battle.cityStatuses.panic;
  totalDamage += run.city.alerts > 0 && run.boss.id === "garrison-alpha" ? 2 : 0;
  totalDamage = Math.max(0, totalDamage - enemyWeaken + selfVulnerable);

  applyKaijuDamage(run.kaiju, totalDamage);
  pushLog(battle, `防衛側の反撃で ${totalDamage} ダメージ。`);

  if (run.boss.id === "citadel-prime" && run.city.commerce > 0) {
    battle.cityHp = Math.min(run.boss.cityHp, battle.cityHp + 4);
    pushLog(battle, "中枢経済圏が稼働し、都市中枢が再建された。");
  }
}

function checkBattleEnd() {
  const run = state.run;
  const battle = run.battle;
  if (battle.cityHp <= 0 || isCityCollapsed(run, battle)) {
    run.result = finalizeRun("victory", battle.turn);
    state.screen = "result";
    render();
    return true;
  }
  if (run.kaiju.hp <= 0) {
    run.result = finalizeRun("defeat", battle.turn);
    state.screen = "result";
    render();
    return true;
  }
  return false;
}

function finalizeRun(outcome, turns) {
  const run = state.run;
  const entry = {
    date: new Date().toLocaleString("ja-JP"),
    name: run.kaiju.name,
    cause: run.cause.name,
    visualId: run.cause.id,
    environment: run.environment.name,
    amplifier: run.amplifier.name,
    boss: run.boss.name,
    outcome,
    turns,
  };

  state.save.history.push(entry);
  const existing = state.save.bestiary.find((item) => item.name === run.kaiju.name);
  let bestiaryRegistered = false;
  if (existing) {
    existing.profile = run.kaiju.profile;
    existing.parts = [...new Set([...existing.parts, ...run.kaiju.parts])];
    existing.visualId = run.cause.id;
    existing.bestOutcome = existing.bestOutcome === "勝利" ? existing.bestOutcome : outcome === "victory" ? "勝利" : "敗北";
  } else {
    state.save.bestiary.push({
      name: run.kaiju.name,
      profile: run.kaiju.profile,
      visualId: run.cause.id,
      parts: [...run.kaiju.parts],
      bestOutcome: outcome === "victory" ? "勝利" : "敗北",
    });
    bestiaryRegistered = true;
  }
  saveState();

  return {
    outcome,
    turns,
    bestiaryRegistered,
  };
}

function buildRunBlueprint() {
  const cause = DATA.causes.find((item) => item.id === state.setup.causeId);
  const environment = DATA.environments.find((item) => item.id === state.setup.environmentId);
  const amplifier = DATA.amplifiers.find((item) => item.id === state.setup.amplifierId);

  const deck = [
    ...cause.starterCards,
    ...environment.bonusCards,
    amplifier.bonusCard,
    "aftershock",
    "shred-armor",
    "predator-posture",
  ];

  const kaiju = {
    name: generateKaijuName(cause, environment, amplifier),
    profile: `${cause.short} と ${environment.name} を起点に ${amplifier.name} で増幅された災厄。`,
    visualId: cause.id,
    maxHp: 48 + (cause.statMods.maxHp || 0) + (environment.statMods.maxHp || 0) + (amplifier.statMods.maxHp || 0),
    hp: 48 + (cause.statMods.maxHp || 0) + (environment.statMods.maxHp || 0) + (amplifier.statMods.maxHp || 0),
    power: 4 + (cause.statMods.power || 0) + (environment.statMods.power || 0) + (amplifier.statMods.power || 0),
    menace: 2 + (cause.statMods.menace || 0) + (environment.statMods.menace || 0) + (amplifier.statMods.menace || 0),
    mobility: 2 + (cause.statMods.mobility || 0) + (environment.statMods.mobility || 0) + (amplifier.statMods.mobility || 0),
    shield: 0,
    energyMax: 3,
    parts: [cause.tags[0], environment.tags[0], amplifier.mutation],
  };

  const city = {
    ...environment.cityProfile,
    power: Math.max(0, environment.cityProfile.power + (environment.statMods.cityPressure || 0)),
    alerts: Math.max(0, environment.cityProfile.alerts + (environment.statMods.cityPressure || 0)),
  };

  return {
    cause,
    environment,
    amplifier,
    kaiju,
    city,
    deck,
    deckPreview: deck.map((cardId) => getCard(cardId)),
    tags: [...cause.tags, ...environment.tags, amplifier.mutation],
    name: kaiju.name,
    profile: kaiju.profile,
  };
}

function generateKaijuName(cause, environment, amplifier) {
  const prefixes = {
    radiation: "熔核",
    faith: "神蝕",
    abyss: "海禍",
  };
  const cores = {
    city: "ガイオス",
    coast: "レヴィアン",
    industrial: "ギガンテック",
  };
  const suffixes = {
    terror: "・パニック",
    adaptation: "・ミメシス",
    breach: "・アンシール",
    pollution: "・ミアズマ",
    awakening: "・スタンピード",
    resonance: "・テンペスト",
  };
  return `${prefixes[cause.id]}${cores[environment.id]}${suffixes[amplifier.id]}`;
}

function generateMap() {
  const pool = shuffle([...DATA.nodeTemplates]);
  return Array.from({ length: 4 }, (_, tierIndex) =>
    pool.slice(tierIndex * 3, tierIndex * 3 + 3).map((node, nodeIndex) => ({
      ...node,
      id: `${node.id}-${tierIndex}-${nodeIndex}`,
      available: tierIndex === 0,
      completed: false,
    })),
  );
}

function renderKaijuPanel(kaiju, battle) {
  return `
    <p class="eyebrow accent">Kaiju</p>
    <div class="info-block">
      <span class="preview-title">${kaiju.name}</span>
      <p>${kaiju.profile}</p>
    </div>
    <div class="metric-grid">
      ${metricCard("HP", `${kaiju.hp}/${kaiju.maxHp}`, kaiju.hp <= kaiju.maxHp * 0.35 ? "warn" : "good")}
      ${metricCard("シールド", kaiju.shield)}
      ${metricCard("パワー", kaiju.power)}
      ${metricCard("脅威", kaiju.menace)}
    </div>
    <div class="info-block">
      <p class="eyebrow accent">部位</p>
      <div class="small-card-list">${kaiju.parts.map((part) => `<span class="small-card mutation">${part}</span>`).join("")}</div>
    </div>
    <div class="info-block">
      <p class="eyebrow accent">継続効果</p>
      <div class="small-card-list">
        ${Object.entries(battle.tempEffects)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => `<span class="small-card">${tempEffectLabel(key)} ${value}</span>`)
          .join("") || "<span class='muted'>なし</span>"}
      </div>
    </div>
  `;
}

function renderCityPanel(city, boss, battle) {
  return `
    <p class="eyebrow accent">City</p>
    <div class="info-block">
      <span class="preview-title">${boss.name}</span>
      <p>${boss.title}</p>
      <p class="subtle">${boss.passive}</p>
      <div class="progress danger"><span style="width:${Math.max(0, (battle.cityHp / boss.cityHp) * 100)}%"></span></div>
    </div>
    <div class="status-grid">
      ${statusTile("電力", city.power)}
      ${statusTile("港湾", city.port)}
      ${statusTile("商業", city.commerce)}
      ${statusTile("士気", city.morale)}
      ${statusTile("警戒", city.alerts)}
    </div>
    <div class="info-block">
      <p class="eyebrow accent">都市状態異常</p>
      <div class="small-card-list">
        <span class="small-card status">浸水 ${battle.cityStatuses.flood}</span>
        <span class="small-card status">汚染 ${battle.cityStatuses.pollution}</span>
        <span class="small-card status">恐慌 ${battle.cityStatuses.panic}</span>
      </div>
    </div>
    <div class="unit-list">
      ${battle.enemyUnits
        .map(
          (unit) => `
            <article class="unit-card">
              <div class="metric-row">
                <strong>${unit.name}</strong>
                <span class="pill">攻撃 ${unit.attack}</span>
              </div>
              <div class="progress"><span style="width:${(unit.hp / getBossUnitMaxHp(boss, unit.id)) * 100}%"></span></div>
              <p class="muted">HP ${unit.hp}/${getBossUnitMaxHp(boss, unit.id)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function drawCards(battle, amount) {
  for (let i = 0; i < amount; i += 1) {
    if (!battle.deck.length) {
      if (!battle.discard.length) {
        return;
      }
      battle.deck = shuffle([...battle.discard]);
      battle.discard = [];
      pushLog(battle, "捨札を再編成し、山札を再構築。");
    }
    const card = battle.deck.pop();
    if (card) {
      battle.hand.push(card);
    }
  }
}

function discardHand(battle) {
  while (battle.hand.length) {
    battle.discard.push(battle.hand.pop());
  }
}

function damagePreferredUnit(battle, damage, cityKey, cityDamage = 0) {
  const target = getPrimaryUnit(battle);
  const finalDamage = damage + (battle.lastAttackBoost || 0);
  if (!target) {
    damageCity(battle, finalDamage, cityKey ? { [cityKey]: cityDamage } : undefined);
    return;
  }
  target.hp = Math.max(0, target.hp - finalDamage);
  pushLog(battle, `${target.name} に ${finalDamage} ダメージ。`);
  if (cityKey) {
    damageCity(battle, 0, { [cityKey]: cityDamage });
  }
  cleanupUnits(battle);
}

function damageCity(battle, baseDamage, statDamage) {
  const finalDamage = baseDamage + (battle.lastAttackBoost || 0);
  if (finalDamage > 0) {
    battle.cityHp = Math.max(0, battle.cityHp - finalDamage);
    pushLog(battle, `都市中枢へ ${finalDamage} ダメージ。`);
  }
  if (statDamage) {
    Object.entries(statDamage).forEach(([key, value]) => {
      state.run.city[key] = Math.max(0, state.run.city[key] - value);
    });
  }
}

function cleanupUnits(battle) {
  const before = battle.enemyUnits.length;
  battle.enemyUnits = battle.enemyUnits.filter((unit) => unit.hp > 0);
  const defeated = before - battle.enemyUnits.length;
  if (defeated > 0 && state.run?.boss.id === "titan-lab") {
    state.run.city.alerts += defeated;
    pushLog(battle, `研究特区が防衛データを更新し、警戒が ${defeated} 上昇。`);
  }
  return defeated;
}

function getPrimaryUnit(battle) {
  return [...battle.enemyUnits].sort((a, b) => b.attack - a.attack)[0];
}

function applyKaijuDamage(kaiju, amount) {
  const blocked = Math.min(kaiju.shield, amount);
  kaiju.shield -= blocked;
  kaiju.hp = Math.max(0, kaiju.hp - (amount - blocked));
}

function healKaiju(kaiju, amount) {
  kaiju.hp = Math.min(kaiju.maxHp, kaiju.hp + amount);
}

function applyOngoingCityEffects(battle) {
  if (battle.cityStatuses.flood > 0) {
    battle.cityHp = Math.max(0, battle.cityHp - battle.cityStatuses.flood);
    pushLog(battle, `浸水が広がり、都市中枢へ ${battle.cityStatuses.flood} ダメージ。`);
  }
  if (battle.cityStatuses.pollution > 0) {
    battle.enemyUnits.forEach((unit) => {
      unit.hp = Math.max(0, unit.hp - 1);
    });
    pushLog(battle, "汚染が防衛ユニットを蝕む。");
    cleanupUnits(battle);
  }
}

function addTempEffect(battle, key, value) {
  battle.tempEffects[key] = (battle.tempEffects[key] || 0) + value;
}

function decrementTempEffects(battle) {
  Object.keys(battle.tempEffects).forEach((key) => {
    battle.tempEffects[key] = Math.max(0, battle.tempEffects[key] - 1);
  });
}

function applyRegen(run, battle) {
  if (battle.tempEffects.regen > 0) {
    healKaiju(run.kaiju, 4);
    pushLog(battle, "再生器官が稼働し、HP を 4 回復。");
  }
}

function gainRandomCard(rootState, types) {
  const candidates = DATA.cards.filter((card) => types.includes(card.type));
  const choice = candidates[Math.floor(Math.random() * candidates.length)];
  gainSpecificCard(rootState, choice.id);
}

function gainSpecificCard(rootState, cardId) {
  rootState.run.deck.push(cardId);
  const card = getCard(cardId);
  if (card.type === "mutation" && !rootState.run.kaiju.parts.includes(card.name)) {
    rootState.run.kaiju.parts.push(card.name);
  }
}

function getCard(cardId) {
  return DATA.cards.find((card) => card.id === cardId);
}

function renderSmallCard(card) {
  return `<span class="small-card ${card.type}">${card.name}</span>`;
}

function renderSmallCardById(cardId) {
  return renderSmallCard(getCard(cardId));
}

function statTile(label, value) {
  return `
    <div class="status-chip">
      <span class="meta-label">${label}</span>
      <span class="status-value">${value}</span>
    </div>
  `;
}

function statusTile(label, value) {
  return statTile(label, value);
}

function metricCard(label, value, extraClass = "") {
  return `
    <article class="metric-card ${extraClass}">
      <span class="meta-label">${label}</span>
      <span class="metric-value">${value}</span>
    </article>
  `;
}

function stageMetric(label, value, total) {
  return `
    <article class="stage-card">
      <span class="meta-label">${label}</span>
      <span class="metric-value">${total !== null ? `${value}/${total}` : value}</span>
    </article>
  `;
}

function tempEffectLabel(key) {
  const labels = {
    enemyWeaken: "敵弱体",
    attackBoost: "攻撃上昇",
    stunUnit: "妨害",
    regen: "再生",
    selfVulnerable: "反動",
  };
  return labels[key] || key;
}

function cloneBoss(boss) {
  return {
    ...boss,
    units: boss.units.map((unit) => ({ ...unit })),
  };
}

function getBossUnitMaxHp(boss, unitId) {
  return boss.units.find((unit) => unit.id === unitId)?.hp || 1;
}

function isCityCollapsed(run, battle) {
  const city = run.city;
  const collapsedSystems = ["power", "port", "commerce", "morale", "alerts"].filter((key) => city[key] === 0).length;
  return collapsedSystems >= 3;
}

function pushLog(battle, message) {
  battle.log.push(message);
  if (battle.log.length > 12) {
    battle.log.shift();
  }
}

function log(battle, message) {
  pushLog(battle, message);
}

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { history: [], bestiary: [] };
    }
    return JSON.parse(raw);
  } catch (error) {
    return { history: [], bestiary: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.save));
}

function createVisualIndex(entries) {
  return entries.reduce((acc, entry) => {
    acc[entry.id] = entry;
    return acc;
  }, {});
}

async function loadKaijuVisualManifest() {
  try {
    const response = await fetch(KAIJU_VISUAL_MANIFEST_PATH, { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const manifest = await response.json();
    state.kaijuVisuals = createVisualIndex(manifest);
    render();
  } catch (_error) {
    // Keep bundled defaults when the manifest cannot be fetched.
  }
}

function getKaijuVisual(causeId) {
  return state.kaijuVisuals[causeId] || state.kaijuVisuals.radiation || DEFAULT_KAIJU_VISUALS[0];
}

function renderPortrait(visual, alt, className) {
  return `
    <div class="${className}-frame">
      <img class="${className}" src="${visual.portraitImage}" alt="${alt}" loading="lazy" onerror="this.remove()" />
    </div>
  `;
}

function renderIcon(visual, alt, className) {
  return `<img class="${className}" src="${visual.iconImage}" alt="${alt}" loading="lazy" onerror="this.remove()" />`;
}

function renderBattleMonsterVisual(visual, alt) {
  return visual?.battleImage
    ? `<img class="monster-visual" src="${visual.battleImage}" alt="${alt}" loading="eager" onerror="this.remove()" />`
    : "";
}

function guessVisualId(text) {
  const source = String(text || "");
  if (source.includes("放射能") || source.includes("核熱暴走") || source.includes("熔核")) {
    return "radiation";
  }
  if (source.includes("古代信仰") || source.includes("神域覚醒") || source.includes("神蝕")) {
    return "faith";
  }
  if (source.includes("深海異変") || source.includes("海溝侵食") || source.includes("海禍")) {
    return "abyss";
  }
  return "radiation";
}
