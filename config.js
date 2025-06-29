// ゲーム設定
const CONFIG = {
    canvas: {
        width: 400,
        height: 600,
        backgroundColor: '#ffeaa7'
    },
    physics: {
        gravity: 0.3,                    // より自然な重力
        friction: 0.995,                 // 空気摩擦
        airResistance: 0.999,            // 空気抵抗
        groundFriction: 0.94,            // 地面摩擦を緩く（転がりやすく）
        restitution: 0.25,               // 反発を適度に（張り付き防止）
        separationBuffer: 1.0,
        maxCollisionIterations: 6,
        angularDamping: 0.98,            // 回転減衰を緩く
        rotationFactor: 0.8,             // 回転強度を上げる（より転がりやすく）
        rollingResistance: 0.003,        // 転がり抵抗をさらに下げる
        inertiaFactor: 0.4,              // 慣性の強さ
        rollingThreshold: 0.005,         // 転がり開始閾値を下げる
        rollingAcceleration: 0.95,       // 転がり加速度を上げる
        energyThreshold: 0.005,          // エネルギー閾値を下げて早期停止
        energyDissipation: 0.998,        // エネルギー散逸率
        wakeThreshold: 0.02,             // 覚醒に必要な衝撃の閾値
        microCollisionThreshold: 0.001,  // 微小衝突の閾値
        rollingResistanceCoeff: 0.015,   // 転がり抵抗係数
        angularSleepThreshold: 0.02,     // 角速度による静止閾値
        angleSnap: {                     // 角度スナップ設定
            targets: [0, Math.PI/2, Math.PI, 3*Math.PI/2], // 0°, 90°, 180°, 270°にスナップ
            threshold: 0.15,             // 差がこれ未満ならスナップ (約8.6°)
            angularSleep: 0.04,          // この角速度以下でスナップ判定有効
        }
    },
    game: {
        gameOverLine: 100,
        staticFrameCount: 40,            // 静止判定フレーム数を延長
        dropProtectionFrames: 30,
        comboTimeWindow: 2000,
        staticThreshold: 0.015,          // 静止速度閾値を下げる（より厳格に）
        microMovementThreshold: 0.005,   // 微小動作閾値を下げる
        stabilityFrames: 15,             // 安定性確認フレーム数を増加
        maxActiveTime: 120,              // 最大活動時間（2秒 = 120フレーム）
        contactEffectCooldown: 30        // 接触エフェクトのクールダウン（0.5秒）
    }
};

// 果物の定義（可愛いキャラクター設定）
const FRUITS = [
    { 
        id: 0, 
        name: 'さくらんぼ', 
        emoji: '🍒', 
        radius: 14, 
        color: '#ff6b9d', 
        points: 5,
        personality: 'shy' // 恥ずかしがり屋
    },
    { 
        id: 1, 
        name: 'いちご', 
        emoji: '🍓', 
        radius: 18, 
        color: '#ff6b6b', 
        points: 10,
        personality: 'happy' // 元気
    },
    { 
        id: 2, 
        name: 'ぶどう', 
        emoji: '🍇', 
        radius: 22, 
        color: '#a29bfe', 
        points: 20,
        personality: 'cool' // クール
    },
    { 
        id: 3, 
        name: 'みかん', 
        emoji: '🍊', 
        radius: 26, 
        color: '#fdcb6e', 
        points: 35,
        personality: 'cheerful' // 陽気
    },
    { 
        id: 4, 
        name: 'りんご', 
        emoji: '🍎', 
        radius: 30, 
        color: '#e17055', 
        points: 55,
        personality: 'gentle' // 優しい
    },
    { 
        id: 5, 
        name: 'なし', 
        emoji: '🍐', 
        radius: 36, 
        color: '#a4de6c', 
        points: 80,
        personality: 'calm' // 穏やか
    },
    { 
        id: 6, 
        name: 'もも', 
        emoji: '🍑', 
        radius: 42, 
        color: '#ffb3d9', 
        points: 110,
        personality: 'sweet' // 甘えん坊
    },
    { 
        id: 7, 
        name: 'パイナップル', 
        emoji: '🍍', 
        radius: 50, 
        color: '#f39c12', 
        points: 150,
        personality: 'energetic' // エネルギッシュ
    },
    { 
        id: 8, 
        name: 'メロン', 
        emoji: '🍈', 
        radius: 58, 
        color: '#7ed6df', 
        points: 200,
        personality: 'elegant' // エレガント
    },
    { 
        id: 9, 
        name: 'スイカ', 
        emoji: '🍉', 
        radius: 66, 
        color: '#55a3ff', 
        points: 300,
        personality: 'royal' // 王様
    }
];