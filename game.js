// ========================
// ゲーム設定・定数
// ========================

const CONFIG = {
    // キャンバス設定
    canvas: {
        width: 400,
        height: 600,
        backgroundColor: '#ffeaa7'
    },
    
    // 物理エンジン設定（自然な重力・慣性法則）
    physics: {
        gravity: 0.4,                    // 重力加速度（自然界基準）
        friction: 0.998,                 // 空気摩擦
        airResistance: 0.999,            // 空気抵抗
        groundFriction: 0.94,            // 地面摩擦（わずかに増加）
        restitution: 0.25,               // 反発係数（わずかに増加）
        separationBuffer: 0.5,           // 果物分離バッファ（視覚的接触のため縮小）
        maxCollisionIterations: 8,       // 最大衝突反復
        angularDamping: 0.985,           // 角速度減衰（自然な停止）
        rotationFactor: 0.18,            // 回転収束係数（より遅く）
        rollingResistance: 0.018,        // 転がり抵抗（増加で減速）
        inertiaFactor: 0.4,              // 慣性係数（球体標準）
        rollingThreshold: 0.08,          // 転がり開始閾値（より敏感に）
        rollingAcceleration: 0.45        // 転がり加速係数（より遅く）
    },
    
    // ゲームロジック設定
    game: {
        gameOverLine: 100,
        staticFrameCount: 20,
        dropProtectionFrames: 30,
        comboTimeWindow: 2000,
        staticThreshold: 0.02,           // より厳格な静止判定
        microMovementThreshold: 0.005,   // より厳格な微動判定
        stabilityFrames: 15,             // より長い安定化期間
        vibrationThreshold: 0.008,       // プルプル振動検出閾値
        contactStabilization: 5          // 接触安定化フレーム
    }
};

// 果物データ定義
const FRUITS = [
    { 
        id: 0, 
        name: 'さくらんぼ', 
        emoji: '🍒', 
        radius: 16, 
        color: '#ff6b9d', 
        points: 5,
        personality: 'shy' // 恥ずかしがり屋
    },
    { 
        id: 1, 
        name: 'いちご', 
        emoji: '🍓', 
        radius: 22, 
        color: '#ff6b6b', 
        points: 10,
        personality: 'happy' // 元気
    },
    { 
        id: 2, 
        name: 'ぶどう', 
        emoji: '🍇', 
        radius: 30, 
        color: '#a29bfe', 
        points: 20,
        personality: 'cool' // クール
    },
    { 
        id: 3, 
        name: 'みかん', 
        emoji: '🍊', 
        radius: 40, 
        color: '#fdcb6e', 
        points: 35,
        personality: 'cheerful' // 陽気
    },
    { 
        id: 4, 
        name: 'りんご', 
        emoji: '🍎', 
        radius: 53, 
        color: '#e17055', 
        points: 55,
        personality: 'gentle' // 優しい
    },
    { 
        id: 5, 
        name: 'なし', 
        emoji: '🍐', 
        radius: 70, 
        color: '#a4de6c', 
        points: 80,
        personality: 'calm' // 穏やか
    },
    { 
        id: 6, 
        name: 'もも', 
        emoji: '🍑', 
        radius: 92, 
        color: '#ffb3d9', 
        points: 110,
        personality: 'sweet' // 甘えん坊
    },
    { 
        id: 7, 
        name: 'パイナップル', 
        emoji: '🍍', 
        radius: 105, 
        color: '#f39c12', 
        points: 150,
        personality: 'energetic' // エネルギッシュ
    },
    { 
        id: 8, 
        name: 'メロン', 
        emoji: '🍈', 
        radius: 135, 
        color: '#7ed6df', 
        points: 200,
        personality: 'elegant' // エレガント
    },
    { 
        id: 9, 
        name: 'スイカ', 
        emoji: '🍉', 
        radius: 170, 
        color: '#55a3ff', 
        points: 300,
        personality: 'royal' // 王様
    }
];

// ========================
// 表情・アニメーションシステム
// ========================

class ExpressionSystem {
    static getExpression(personality, emotion = 'neutral') {
        const expressions = {
            shy: {
                neutral: { eyes: '•ᴗ•', mouth: 'ᵕ', blush: true },
                happy: { eyes: '◕ᴗ◕', mouth: 'ᵕ', blush: true },
                excited: { eyes: '✧ᴗ✧', mouth: 'ᵕ', blush: true }
            },
            happy: {
                neutral: { eyes: '◕‿◕', mouth: 'ᵕ', sparkle: true },
                happy: { eyes: '◕▿◕', mouth: 'ᵕ', sparkle: true },
                excited: { eyes: '★‿★', mouth: 'ᵕ', sparkle: true }
            },
            cool: {
                neutral: { eyes: '◔_◔', mouth: '‿', cool: true },
                happy: { eyes: '◕‿◔', mouth: '‿', cool: true },
                excited: { eyes: '◕‿◕', mouth: '‿', cool: true }
            },
            cheerful: {
                neutral: { eyes: '◕‿◕', mouth: 'ᵕ', bounce: true },
                happy: { eyes: '◕▿◕', mouth: 'ᵕ', bounce: true },
                excited: { eyes: '✧▿✧', mouth: 'ᵕ', bounce: true }
            },
            gentle: {
                neutral: { eyes: '◕ᴗ◕', mouth: 'ᵕ', gentle: true },
                happy: { eyes: '◕‿◕', mouth: 'ᵕ', gentle: true },
                excited: { eyes: '◕▿◕', mouth: 'ᵕ', gentle: true }
            },
            calm: {
                neutral: { eyes: '◔‿◔', mouth: '‿', calm: true },
                happy: { eyes: '◕‿◕', mouth: '‿', calm: true },
                excited: { eyes: '◕▿◕', mouth: '‿', calm: true }
            },
            sweet: {
                neutral: { eyes: '◕ᴗ◕', mouth: 'ᵕ', heart: true },
                happy: { eyes: '◕‿◕', mouth: 'ᵕ', heart: true },
                excited: { eyes: '♡‿♡', mouth: 'ᵕ', heart: true }
            },
            energetic: {
                neutral: { eyes: '◕‿◕', mouth: 'ᵕ', energy: true },
                happy: { eyes: '◕▿◕', mouth: 'ᵕ', energy: true },
                excited: { eyes: '✧▿✧', mouth: 'ᵕ', energy: true }
            },
            elegant: {
                neutral: { eyes: '◔‿◔', mouth: '‿', elegant: true },
                happy: { eyes: '◕‿◕', mouth: '‿', elegant: true },
                excited: { eyes: '◕▿◕', mouth: '‿', elegant: true }
            },
            royal: {
                neutral: { eyes: '◔‿◔', mouth: '‿', crown: true },
                happy: { eyes: '◕‿◕', mouth: '‿', crown: true },
                excited: { eyes: '◕▿◕', mouth: '‿', crown: true }
            }
        };
        
        return expressions[personality]?.[emotion] || expressions.happy.neutral;
    }
}

// ========================
// 描画システム
// ========================

class CuteDrawingSystem {
    // メイン描画メソッド
    static drawFruit(ctx, fruit) {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        
        this.drawShadow(ctx, fruit);
        this.drawBody(ctx, fruit);
        this.drawFace(ctx, fruit);
        this.drawSpecialEffects(ctx, fruit);
        
        ctx.restore();
    }
    
    static drawShadow(ctx, fruit) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.ellipse(fruit.radius * 0.1, fruit.radius * 0.2, fruit.radius * 0.8, fruit.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // 果物本体の描画
    static drawBody(ctx, fruit) {
        const rotation = fruit.rotation || 0;
        ctx.rotate(rotation);
        
        if (fruit.isRolling && fruit.rollIntensity > 0) {
            this.drawRollingEffects(ctx, fruit);
        }
        
        this.drawMainBody(ctx, fruit);
        this.drawHighlights(ctx, fruit, rotation);
        this.drawFruitPatterns(ctx, fruit);
    }
    
    // メイン本体の描画
    static drawMainBody(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        const gradient = this.createBodyGradient(ctx, fruit, fruitData);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 本体グラデーションの作成
    static createBodyGradient(ctx, fruit, fruitData) {
        const gradient = ctx.createRadialGradient(
            -fruit.radius * 0.3, -fruit.radius * 0.3, 0,
            0, 0, fruit.radius * 1.2
        );
        
        const baseColor = fruitData.color;
        const lightColor = this.lightenColor(baseColor, 35);
        const darkColor = this.darkenColor(baseColor, 25);
        
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, darkColor);
        
        return gradient;
    }
    
    // ハイライト効果の描画
    static drawHighlights(ctx, fruit, rotation) {
        const highlightAngle = rotation * 0.3;
        
        // メインハイライト
        const highlightX = -fruit.radius * 0.2 + Math.cos(highlightAngle) * fruit.radius * 0.1;
        const highlightY = -fruit.radius * 0.2 + Math.sin(highlightAngle) * fruit.radius * 0.1;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, fruit.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 小さな光沢
        const glossX = -fruit.radius * 0.3 + Math.cos(highlightAngle * 1.2) * fruit.radius * 0.05;
        const glossY = -fruit.radius * 0.3 + Math.sin(highlightAngle * 1.2) * fruit.radius * 0.05;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(glossX, glossY, fruit.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 果物固有のパターン描画
    static drawFruitPatterns(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        
        switch(fruitData.name) {
            case 'いちご':
                this.drawStrawberrySeeds(ctx, fruit);
                break;
            case 'みかん':
                this.drawOrangeSegments(ctx, fruit);
                break;
            case 'スイカ':
                this.drawWatermelonStripes(ctx, fruit);
                break;
        }
    }
    
    static drawStrawberrySeeds(ctx, fruit) {
        ctx.fillStyle = '#2d3436';
        // より自然な種の配置
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8 + Math.sin(i) * 0.3;
            const distance = fruit.radius * (0.5 + Math.sin(i * 1.3) * 0.15);
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.ellipse(x, y, fruit.radius * 0.04, fruit.radius * 0.06, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // いちごのヘタ
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.ellipse(0, -fruit.radius * 0.8, fruit.radius * 0.2, fruit.radius * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static drawOrangeSegments(ctx, fruit) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = fruit.radius * 0.02;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * fruit.radius * 0.7, Math.sin(angle) * fruit.radius * 0.7);
            ctx.stroke();
        }
        
        // みかんの中心部
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static drawWatermelonStripes(ctx, fruit) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = fruit.radius * 0.05;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const startRadius = fruit.radius * 0.3;
            const endRadius = fruit.radius * 0.9;
            
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * startRadius, Math.sin(angle) * startRadius);
            ctx.lineTo(Math.cos(angle) * endRadius, Math.sin(angle) * endRadius);
            ctx.stroke();
        }
        
        // スイカの種
        ctx.fillStyle = '#2d3436';
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4 + Math.PI / 4;
            const x = Math.cos(angle) * fruit.radius * 0.5;
            const y = Math.sin(angle) * fruit.radius * 0.5;
            
            ctx.beginPath();
            ctx.ellipse(x, y, fruit.radius * 0.03, fruit.radius * 0.05, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    static drawFace(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        const expression = ExpressionSystem.getExpression(fruitData.personality, fruit.emotion || 'neutral');
        
        const scale = fruit.radius / 30; // スケールを調整
        const eyeSize = 3 * scale;
        const eyeOffset = fruit.radius * 0.3;
        const mouthY = fruit.radius * 0.35;
        
        // 頬の赤らみ（より可愛く）
        if (expression.blush) {
            ctx.fillStyle = 'rgba(255, 192, 203, 0.7)';
            ctx.beginPath();
            ctx.arc(-fruit.radius * 0.4, fruit.radius * 0.15, fruit.radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(fruit.radius * 0.4, fruit.radius * 0.15, fruit.radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // より大きくて親しみやすい目
        ctx.fillStyle = '#2d3436';
        
        // 左目（楕円形でより可愛く）
        ctx.beginPath();
        ctx.ellipse(-eyeOffset, -eyeOffset * 0.2, eyeSize * 1.2, eyeSize * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 右目
        ctx.beginPath();
        ctx.ellipse(eyeOffset, -eyeOffset * 0.2, eyeSize * 1.2, eyeSize * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト（より可愛く）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(-eyeOffset + eyeSize * 0.3, -eyeOffset * 0.2 - eyeSize * 0.3, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset + eyeSize * 0.3, -eyeOffset * 0.2 - eyeSize * 0.3, eyeSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // より親しみやすい口
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = scale * 1.5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(0, mouthY, fruit.radius * 0.2, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // 小さな鼻（点）
        if (fruit.radius > 20) {
            ctx.fillStyle = 'rgba(45, 52, 54, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, scale * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    static drawSpecialEffects(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        const expression = ExpressionSystem.getExpression(fruitData.personality, fruit.emotion || 'neutral');
        
        // 光る演出は除去 - スパークルやハートは削除
        
        // 王冠は最上位果物のみ
        if (expression.crown && fruit.type === FRUITS.length - 1) {
            this.drawCrown(ctx, fruit);
        }
    }
    
    // スパークルとハートの描画メソッドは削除
    
    static drawCrown(ctx, fruit) {
        ctx.fillStyle = '#ffd700';
        const crownY = -fruit.radius * 1.1;
        const crownSize = fruit.radius * 0.3;
        
        ctx.font = `${crownSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', 0, crownY);
    }
    
    static lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    static darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    static drawRollingEffects(ctx, fruit) {
        // 転がり中の視覚効果
        const intensity = fruit.rollIntensity || 0;
        const isCollisionRolling = fruit.collisionRollingFrames > 0;
        
        // 衝突による転がりの特別な効果
        if (isCollisionRolling) {
            this.drawCollisionRollingEffects(ctx, fruit, intensity);
        }
        
        // 転がりトレイル効果（微細な軌跡）
        if (fruit.rotationTrail && fruit.rotationTrail.length > 1) {
            ctx.save();
            ctx.globalAlpha = intensity * (isCollisionRolling ? 0.5 : 0.3); // 衝突時はより濃く
            
            // 過去の回転位置を淡く表示
            for (let i = 0; i < fruit.rotationTrail.length - 1; i++) {
                const trail = fruit.rotationTrail[i];
                const age = Date.now() - trail.timestamp;
                const baseAlpha = isCollisionRolling ? 0.4 : 0.2;
                const trailAlpha = Math.max(0, 1 - age / 200) * intensity * baseAlpha;
                
                if (trailAlpha > 0.01) {
                    ctx.save();
                    ctx.globalAlpha = trailAlpha;
                    ctx.rotate(trail.angle - (fruit.rotation || 0));
                    
                    // 微細な回転軌跡を描画
                    ctx.strokeStyle = FRUITS[fruit.type].color;
                    ctx.lineWidth = isCollisionRolling ? 2 : 1; // 衝突時は太く
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    ctx.arc(0, 0, fruit.radius * 0.95, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    ctx.restore();
                }
            }
            ctx.restore();
        }
        
        // 転がり方向のモーションブラー効果
        if (intensity > 0.3) {
            ctx.save();
            ctx.globalAlpha = intensity * 0.15;
            
            // 方向性のあるブラー効果
            const blurAngle = Math.atan2(fruit.velocity.y, fruit.velocity.x);
            const blurDistance = intensity * 3;
            
            ctx.translate(Math.cos(blurAngle) * blurDistance, Math.sin(blurAngle) * blurDistance);
            ctx.fillStyle = FRUITS[fruit.type].color;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.radius * 0.9, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // 地面との接触点での転がり表現
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        if (isOnGround && intensity > 0.2) {
            ctx.save();
            ctx.globalAlpha = intensity * 0.4;
            
            // 接触点での圧迫効果
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.ellipse(0, fruit.radius * 0.8, fruit.radius * 0.8 * intensity, fruit.radius * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // 衝突時の特別な転がり効果
    static drawCollisionRollingEffects(ctx, fruit, intensity) {
        // 衝突による回転の視覚的強調
        const collisionIntensity = fruit.collisionRollingFrames / 60; // 0-1の強度
        
        // 回転軌跡のパルス効果
        if (collisionIntensity > 0.5) {
            ctx.save();
            ctx.globalAlpha = collisionIntensity * 0.3;
            
            // パルスする回転リング
            const pulseScale = 1 + Math.sin(Date.now() * 0.02) * 0.1;
            ctx.strokeStyle = FRUITS[fruit.type].color;
            ctx.lineWidth = 3;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, fruit.radius * 1.1 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.restore();
        }
        
        // 衝突による回転方向インジケーター
        if (Math.abs(fruit.angularVelocity) > 0.1) {
            ctx.save();
            ctx.globalAlpha = intensity * 0.6;
            
            // 回転方向を示す矢印的な効果
            const rotationDirection = Math.sign(fruit.angularVelocity);
            const arrowAngle = fruit.rotation + rotationDirection * Math.PI * 0.25;
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            
            for (let i = 0; i < 3; i++) {
                const angle = arrowAngle + i * Math.PI * 0.67;
                const innerRadius = fruit.radius * 0.7;
                const outerRadius = fruit.radius * 0.9;
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
                ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }
}

// ========================
// 物理エンジン
// ========================

class PhysicsEngine {
    // == 基本物理更新 ==
    static update(fruit) {
        if (fruit.isStatic) {
            this.updateStaticFruit(fruit);
            return;
        }
        
        this.applyForces(fruit);
        this.updateRotation(fruit);
        this.updatePosition(fruit);
        this.suppressVibration(fruit); // プルプル振動抑制
        this.checkStatic(fruit);
    }
    
    // 静止中の果物の更新
    static updateStaticFruit(fruit) {
        fruit.angularVelocity *= CONFIG.physics.angularDamping;
        if (Math.abs(fruit.angularVelocity) < 0.001) {
            fruit.angularVelocity = 0;
        }
        fruit.rotation += fruit.angularVelocity;
    }
    
    // 力の適用（重力・摩擦・空気抵抗）
    static applyForces(fruit) {
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        
        // 重力適用
        fruit.velocity.y += CONFIG.physics.gravity;
        
        // 空気抵抗と摩擦
        fruit.velocity.x *= CONFIG.physics.airResistance;
        fruit.velocity.y *= CONFIG.physics.friction;
        
        // 地面摩擦
        if (isOnGround) {
            fruit.velocity.x *= CONFIG.physics.groundFriction;
        }
    }
    
    // 位置更新と境界チェック
    static updatePosition(fruit) {
        this.preBoundaryCheck(fruit);
        
        fruit.x += fruit.velocity.x;
        fruit.y += fruit.velocity.y;
        
        this.postBoundaryCheck(fruit);
    }
    
    // == プルプル振動抑制システム ==
    static suppressVibration(fruit) {
        const speed = Math.sqrt(fruit.velocity.x ** 2 + fruit.velocity.y ** 2);
        const angularSpeed = Math.abs(fruit.angularVelocity);
        
        // 微細振動の検出
        const isMicroVibrating = speed > 0 && speed < CONFIG.game.vibrationThreshold;
        const isMicroRotating = angularSpeed > 0 && angularSpeed < CONFIG.game.vibrationThreshold;
        
        // 位置の安定性チェック
        if (!fruit.positionHistory) fruit.positionHistory = [];
        fruit.positionHistory.push({ x: fruit.x, y: fruit.y, time: Date.now() });
        
        // 古い位置履歴を削除
        const now = Date.now();
        fruit.positionHistory = fruit.positionHistory.filter(pos => now - pos.time < 300);
        
        // 位置変化の小ささを判定
        if (fruit.positionHistory.length >= 10) {
            const recent = fruit.positionHistory.slice(-10);
            const maxDelta = Math.max(
                ...recent.map((pos, i) => i === 0 ? 0 : 
                    Math.sqrt((pos.x - recent[i-1].x)**2 + (pos.y - recent[i-1].y)**2))
            );
            
            // 極小範囲での振動を検出
            if (maxDelta < CONFIG.game.vibrationThreshold && (isMicroVibrating || isMicroRotating)) {
                // 振動抑制処理
                this.applyVibrationDamping(fruit);
            }
        }
        
        // 接触中の果物同士の相互振動抑制
        this.suppressContactVibration(fruit);
    }
    
    // 振動減衰処理
    static applyVibrationDamping(fruit) {
        const dampingFactor = 0.3; // 強い減衰
        
        fruit.velocity.x *= dampingFactor;
        fruit.velocity.y *= dampingFactor;
        fruit.angularVelocity *= dampingFactor;
        
        // 極小値は完全に停止
        if (Math.abs(fruit.velocity.x) < 0.001) fruit.velocity.x = 0;
        if (Math.abs(fruit.velocity.y) < 0.001) fruit.velocity.y = 0;
        if (Math.abs(fruit.angularVelocity) < 0.001) fruit.angularVelocity = 0;
        
        // 安定化カウンタを増加
        fruit.stabilizationFrames = (fruit.stabilizationFrames || 0) + 1;
        
        // 一定フレーム続いたら完全静止
        if (fruit.stabilizationFrames > CONFIG.game.contactStabilization) {
            this.forceStatic(fruit);
        }
    }
    
    // 接触振動抑制
    static suppressContactVibration(fruit) {
        // この処理は checkCollisions で他の果物との関係で実行される
        // ここでは個別の果物の接触状態を記録
        if (!fruit.contactFrames) fruit.contactFrames = 0;
        
        // 地面接触時の特別な安定化
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        if (isOnGround) {
            const speed = Math.sqrt(fruit.velocity.x ** 2 + fruit.velocity.y ** 2);
            if (speed < CONFIG.game.vibrationThreshold) {
                fruit.contactFrames++;
                
                if (fruit.contactFrames > 3) {
                    // 地面接触による強制安定化
                    fruit.velocity.y = Math.min(0, fruit.velocity.y); // 上向き速度を無効化
                    fruit.velocity.x *= 0.7; // 水平速度を減衰
                    fruit.angularVelocity *= 0.7; // 回転速度を減衰
                }
            } else {
                fruit.contactFrames = 0;
            }
        } else {
            fruit.contactFrames = 0;
        }
    }
    
    // == 自然な転がり物理（重力・慣性法則に準拠） ==
    static updateRotation(fruit) {
        const velocityMagnitude = Math.abs(fruit.velocity.x);
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        
        // 重力による自然な転がり（実世界の物理法則）
        if (isOnGround && velocityMagnitude > CONFIG.physics.rollingThreshold) {
            // 真の物理転がり条件: v = ωr (滑らない転がり)
            const naturalAngularVel = -fruit.velocity.x / fruit.radius;
            
            // 慣性力による段階的な角速度収束（急激な変化を避ける）
            const inertiaResistance = fruit.mass / (fruit.mass + 15); // より強い慣性効果
            const angularDiff = naturalAngularVel - fruit.angularVelocity;
            const convergenceRate = CONFIG.physics.rotationFactor * inertiaResistance * 0.8; // 収束率を下げて遅くする
            
            // 重力加速度に比例した自然な角速度調整
            fruit.angularVelocity += angularDiff * convergenceRate;
            
            // 地表摩擦による現実的な転がり抵抗（強化）
            const rollingMu = CONFIG.physics.rollingResistance; // 転がり摩擦係数
            const gravityEffect = CONFIG.physics.gravity / 9.8; // 重力正規化
            const frictionTorque = rollingMu * gravityEffect * Math.sign(fruit.velocity.x) * 1.2; // 摩擦トルクを増加
            fruit.angularVelocity -= frictionTorque / fruit.radius;
            
            // 慣性モーメントによる角運動量保存
            const momentOfInertia = 0.4 * fruit.mass * fruit.radius * fruit.radius; // 球体の慣性モーメント
            fruit.angularVelocity *= (1 - rollingMu / momentOfInertia);
            
            // 転がり状態の管理
            fruit.isRolling = true;
            fruit.rollIntensity = Math.min(1.0, velocityMagnitude / 6.0); // 転がり強度を下げる
            
        } else if (isOnGround && velocityMagnitude <= CONFIG.physics.rollingThreshold) {
            // 静止摩擦による転がり停止（現実的な減衰）
            const staticFriction = 0.9; // 静止摩擦係数
            fruit.angularVelocity *= staticFriction;
            fruit.isRolling = false;
            fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.03);
            
        } else if (!isOnGround) {
            // 空中での角運動量保存（慣性の法則）
            const airResistance = 0.998; // 空気抵抗による微小な減衰
            fruit.angularVelocity *= airResistance;
            fruit.isRolling = false;
            fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.01);
        }
        
        // 地面接触時の動摩擦効果
        if (isOnGround) {
            fruit.angularVelocity *= CONFIG.physics.angularDamping;
        }
        
        // 物理的な回転角度更新
        fruit.rotation += fruit.angularVelocity;
        
        // 回転角度の正規化
        fruit.rotation = fruit.rotation % (Math.PI * 2);
        if (fruit.rotation < 0) fruit.rotation += Math.PI * 2;
        
        // 極小角速度の物理的停止
        if (Math.abs(fruit.angularVelocity) < 0.0005) {
            fruit.angularVelocity = 0;
            fruit.isRolling = false;
        }
        
        // 転がり軌跡の物理的記録
        if (!fruit.rotationTrail) fruit.rotationTrail = [];
        fruit.rotationTrail.push({
            angle: fruit.rotation,
            timestamp: Date.now(),
            intensity: fruit.rollIntensity || 0,
            angularVelocity: fruit.angularVelocity
        });
        
        // 軌跡データの効率的管理
        const now = Date.now();
        fruit.rotationTrail = fruit.rotationTrail.filter(trail => 
            now - trail.timestamp < 150
        );
    }
    
    // == 境界処理 ==
    static preBoundaryCheck(fruit) {
        // 予測位置での境界チェック
        const nextX = fruit.x + fruit.velocity.x;
        const nextY = fruit.y + fruit.velocity.y;
        
        // X軸境界の予測チェック（慣性を考慮した衝突）
        if (nextX - fruit.radius <= 0) {
            // 左壁との衝突 - 慣性の法則に基づく反射
            const impactSpeed = Math.abs(fruit.velocity.x);
            fruit.velocity.x = impactSpeed * CONFIG.physics.restitution;
            
            // 角運動量の変化（壁との摩擦）
            fruit.angularVelocity += impactSpeed * 0.1;
            
        } else if (nextX + fruit.radius >= CONFIG.canvas.width) {
            // 右壁との衝突
            const impactSpeed = Math.abs(fruit.velocity.x);
            fruit.velocity.x = -impactSpeed * CONFIG.physics.restitution;
            
            // 角運動量の変化
            fruit.angularVelocity -= impactSpeed * 0.1;
        }
        
        // Y軸境界の予測チェック（底面のみ）
        if (nextY + fruit.radius >= CONFIG.canvas.height) {
            const impactSpeed = Math.abs(fruit.velocity.y);
            
            // 床との衝突 - エネルギー損失を考慮
            fruit.velocity.y = -impactSpeed * CONFIG.physics.restitution;
            
            // 水平方向の慣性に床摩擦を適用
            const horizontalImpact = Math.abs(fruit.velocity.x);
            fruit.velocity.x *= CONFIG.physics.groundFriction;
            
            // 床との衝突による回転変化
            fruit.angularVelocity += fruit.velocity.x * 0.05;
        }
    }
    
    static postBoundaryCheck(fruit) {
        // 強制的な位置補正（安全ネット）
        const margin = 1; // 安全マージン
        
        // 左境界
        if (fruit.x - fruit.radius < margin) {
            fruit.x = fruit.radius + margin;
            fruit.velocity.x = Math.max(0, fruit.velocity.x); // 左向きの速度を無効化
        }
        
        // 右境界
        if (fruit.x + fruit.radius > CONFIG.canvas.width - margin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - margin;
            fruit.velocity.x = Math.min(0, fruit.velocity.x); // 右向きの速度を無効化
        }
        
        // 上境界（念のため）
        if (fruit.y - fruit.radius < margin) {
            fruit.y = fruit.radius + margin;
            fruit.velocity.y = Math.max(0, fruit.velocity.y); // 上向きの速度を無効化
        }
        
        // 下境界
        if (fruit.y + fruit.radius > CONFIG.canvas.height - margin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - margin;
            fruit.velocity.y = Math.min(0, fruit.velocity.y); // 下向きの速度を無効化
            fruit.velocity.x *= CONFIG.physics.friction; // 床摩擦
        }
    }
    
    // == 静止判定・振動抑制 ==
    static checkStatic(fruit) {
        const motionData = this.getMotionData(fruit);
        
        // 段階的な静止判定処理
        this.stopMicroMovements(fruit, motionData);
        
        if (this.detectAndStopVibration(fruit, motionData)) {
            return; // 振動停止した場合は早期終了
        }
        
        this.processNormalStatic(fruit, motionData);
        this.suppressAdditionalVibration(fruit, motionData);
    }
    
    // 動作データの取得
    static getMotionData(fruit) {
        return {
            speed: Math.sqrt(fruit.velocity.x ** 2 + fruit.velocity.y ** 2),
            angularSpeed: Math.abs(fruit.angularVelocity),
            isNearBottom: fruit.y + fruit.radius >= CONFIG.canvas.height - 5
        };
    }
    
    // 極小動作の即座停止
    static stopMicroMovements(fruit, motionData) {
        if (motionData.speed < CONFIG.game.microMovementThreshold) {
            fruit.velocity.x = 0;
            fruit.velocity.y = 0;
        }
        
        if (motionData.angularSpeed < CONFIG.game.microMovementThreshold) {
            fruit.angularVelocity = 0;
        }
    }
    
    // 振動検出と強制停止
    static detectAndStopVibration(fruit, motionData) {
        const hasMinimalMovement = motionData.speed < CONFIG.game.staticThreshold && 
                                  motionData.angularSpeed < CONFIG.game.staticThreshold;
        const isAtRest = motionData.speed === 0 && motionData.angularSpeed === 0;
        
        if (motionData.isNearBottom && hasMinimalMovement && !isAtRest) {
            const vibrationThreshold = CONFIG.game.microMovementThreshold * 0.5;
            if (motionData.speed < vibrationThreshold || motionData.angularSpeed < vibrationThreshold) {
                this.forceStatic(fruit);
                return true;
            }
        }
        return false;
    }
    
    // 通常の静止判定処理
    static processNormalStatic(fruit, motionData) {
        const isCompletelyStill = motionData.speed < CONFIG.game.staticThreshold && 
                                 motionData.angularSpeed < CONFIG.game.staticThreshold && 
                                 motionData.isNearBottom;
        
        if (isCompletelyStill) {
            fruit.staticFrames = (fruit.staticFrames || 0) + 1;
            fruit.stabilityFrames = (fruit.stabilityFrames || 0) + 1;
            
            if (fruit.staticFrames >= CONFIG.game.staticFrameCount) {
                this.forceStatic(fruit);
            } else if (fruit.staticFrames >= CONFIG.game.staticFrameCount / 2) {
                // 準静止状態：強力な減衰
                fruit.velocity.x *= 0.3;
                fruit.velocity.y *= 0.3;
                fruit.angularVelocity *= 0.2;
            }
        } else {
            fruit.staticFrames = 0;
            fruit.stabilityFrames = 0;
        }
    }
    
    // 追加の振動抑制処理
    static suppressAdditionalVibration(fruit, motionData) {
        if (!fruit.isStatic && motionData.isNearBottom) {
            if (motionData.speed < CONFIG.game.microMovementThreshold * 3) {
                fruit.velocity.x *= 0.5;
                fruit.velocity.y *= 0.5;
            }
            
            if (motionData.angularSpeed < CONFIG.game.microMovementThreshold * 3) {
                fruit.angularVelocity *= 0.6;
            }
            
            if (motionData.speed < 0.005) fruit.velocity.x = fruit.velocity.y = 0;
            if (motionData.angularSpeed < 0.005) fruit.angularVelocity = 0;
        }
    }
    
    // 強制的に静止状態にする
    static forceStatic(fruit) {
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
        fruit.angularVelocity = 0;
        fruit.isStatic = true;
        
        // 位置を完全に安定化
        fruit.y = CONFIG.canvas.height - fruit.radius;
        fruit.x = Math.max(fruit.radius, Math.min(CONFIG.canvas.width - fruit.radius, fruit.x));
        fruit.rotation = Math.round(fruit.rotation / (Math.PI / 6)) * (Math.PI / 6);
    }
    
    // == 衝突処理 ==
    static resolveCollision(fruit1, fruit2) {
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = fruit1.radius + fruit2.radius + CONFIG.physics.separationBuffer;
        
        if (distance >= minDistance) return false;
        if (distance === 0) return false; // ゼロ除算回避
        
        // 質量とイナーシャの計算
        const mass1 = fruit1.mass || 1;
        const mass2 = fruit2.mass || 1;
        const totalMass = mass1 + mass2;
        const reducedMass = (mass1 * mass2) / totalMass;
        
        // 衝突法線ベクトル
        const nx = dx / distance;
        const ny = dy / distance;
        
        // 積み重ね状況を先に判定（分離処理のため）
        const isStackingForSeparation = this.detectStackingScenario(fruit1, fruit2, nx, ny);
        
        // 重なり解消（視覚的接触を維持しつつ物理的分離）
        const overlap = minDistance - distance;
        const contactBuffer = CONFIG.physics.separationBuffer;
        
        // 視覚的接触のための最小分離距離
        const visualContactDistance = fruit1.radius + fruit2.radius - 1.0; // 1ピクセル重なりを許可
        const actualMinDistance = Math.max(visualContactDistance, fruit1.radius + fruit2.radius + contactBuffer);
        
        const actualOverlap = actualMinDistance - distance;
        const totalCorrection = Math.max(0, actualOverlap);
        
        if (isStackingForSeparation) {
            // 積み重ね時は垂直方向の分離を制限
            const maxVerticalSeparation = Math.min(totalCorrection, overlap * 0.8);
            const separationRatio = maxVerticalSeparation / totalCorrection;
            
            const correction1 = totalCorrection * (mass2 / totalMass) * separationRatio;
            const correction2 = totalCorrection * (mass1 / totalMass) * separationRatio;
            
            // 主に垂直方向に分離（水平分離を最小化）
            if (Math.abs(ny) > 0.6) {
                fruit1.x -= nx * correction1 * 0.3; // 水平分離を減らす
                fruit1.y -= ny * correction1;
                fruit2.x += nx * correction2 * 0.3;
                fruit2.y += ny * correction2;
            } else {
                fruit1.x -= nx * correction1;
                fruit1.y -= ny * correction1;
                fruit2.x += nx * correction2;
                fruit2.y += ny * correction2;
            }
        } else {
            // 通常の分離処理
            const correction1 = totalCorrection * (mass2 / totalMass);
            const correction2 = totalCorrection * (mass1 / totalMass);
            
            fruit1.x -= nx * correction1;
            fruit1.y -= ny * correction1;
            fruit2.x += nx * correction2;
            fruit2.y += ny * correction2;
        }
        
        // 位置補正後に境界チェック
        this.constrainToBoundaries(fruit1);
        this.constrainToBoundaries(fruit2);
        
        // 分離確認：まだ重なっている場合は追加分離
        this.ensureProperSeparation(fruit1, fruit2);
        
        // 相対速度の計算
        const relativeVelX = fruit1.velocity.x - fruit2.velocity.x;
        const relativeVelY = fruit1.velocity.y - fruit2.velocity.y;
        const relativeSpeed = relativeVelX * nx + relativeVelY * ny;
        
        // 離れる方向に動いている場合は処理しない
        if (relativeSpeed > 0) return true;
        
        // 積み重ね状況の判定（飛び上がり防止）
        const isStacking = this.detectStackingScenario(fruit1, fruit2, nx, ny);
        
        // 反発係数を考慮した衝突impulse（積み重ね時は低減）
        const baseRestitution = CONFIG.physics.restitution;
        const restitution = isStacking ? baseRestitution * 0.3 : baseRestitution; // 積み重ね時は反発を大幅に低減
        const impulseMagnitude = -(1 + restitution) * relativeSpeed / totalMass;
        
        // 慣性の法則に基づく速度変化
        const impulseX = impulseMagnitude * nx;
        const impulseY = impulseMagnitude * ny;
        
        // 積み重ね時の特別処理
        if (isStacking) {
            // 垂直方向の衝突力を大幅に制限
            const verticalLimit = 0.2; // 垂直方向の最大衝突力
            const limitedImpulseY = Math.sign(impulseY) * Math.min(Math.abs(impulseY), verticalLimit);
            
            // ニュートンの第二法則（制限付き）
            fruit1.velocity.x += impulseX * mass2 * 0.8; // 水平方向も減衰
            fruit1.velocity.y += limitedImpulseY * mass2; // 垂直方向制限
            fruit2.velocity.x -= impulseX * mass1 * 0.8;
            fruit2.velocity.y -= limitedImpulseY * mass1;
        } else {
            // 通常の衝突処理
            fruit1.velocity.x += impulseX * mass2;
            fruit1.velocity.y += impulseY * mass2;
            fruit2.velocity.x -= impulseX * mass1;
            fruit2.velocity.y -= impulseY * mass1;
        }
        
        // エネルギー損失（非弾性衝突の要素）
        const energyLoss = isStacking ? 0.65 : 0.85; // 積み重ね時はより多くのエネルギー損失
        fruit1.velocity.x *= energyLoss;
        fruit1.velocity.y *= energyLoss;
        fruit2.velocity.x *= energyLoss;
        fruit2.velocity.y *= energyLoss;
        
        // 強化された回転効果
        this.applyEnhancedCollisionRotation(fruit1, fruit2, nx, ny, impulseX, impulseY);
        
        // 衝突による転がり効果の開始
        this.initiateRollingFromCollision(fruit1, fruit2, impulseX, impulseY);
        
        // 静止状態解除（積み重ね時は下の果物の静止を維持）
        if (!isStacking) {
            fruit1.isStatic = false;
            fruit2.isStatic = false;
            fruit1.staticFrames = 0;
            fruit2.staticFrames = 0;
        } else {
            // 積み重ね時は下の果物の安定性を保持
            const bottomFruit = fruit1.y > fruit2.y ? fruit1 : fruit2;
            const topFruit = fruit1.y > fruit2.y ? fruit2 : fruit1;
            
            topFruit.isStatic = false;
            topFruit.staticFrames = 0;
            
            // 下の果物は部分的に静止状態を維持
            if (bottomFruit.isStatic) {
                bottomFruit.staticFrames = Math.max(0, bottomFruit.staticFrames - 5);
            }
        }
        
        return true;
    }
    
    // 積み重ね状況の検出（飛び上がり防止）
    static detectStackingScenario(fruit1, fruit2, nx, ny) {
        // 垂直方向の衝突かどうか判定
        const verticalCollision = Math.abs(ny) > 0.6; // 法線ベクトルが主に垂直
        
        // 下の果物が地面近くにあるかどうか
        const bottomFruit = fruit1.y > fruit2.y ? fruit1 : fruit2;
        const topFruit = fruit1.y > fruit2.y ? fruit2 : fruit1;
        const isBottomNearGround = bottomFruit.y + bottomFruit.radius >= CONFIG.canvas.height - 10;
        
        // 重なり具合の判定
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = (fruit1.radius + fruit2.radius) - distance;
        const significantOverlap = overlap > Math.max(fruit1.radius, fruit2.radius) * 0.3;
        
        // 上の果物の速度が小さい（落下中ではない）
        const topFruitSpeed = Math.sqrt(topFruit.velocity.x ** 2 + topFruit.velocity.y ** 2);
        const lowSpeed = topFruitSpeed < 2.0;
        
        // 積み重ね状況の判定
        return verticalCollision && isBottomNearGround && significantOverlap && lowSpeed;
    }
    
    // 強化された衝突回転効果
    static applyEnhancedCollisionRotation(fruit1, fruit2, nx, ny, impulseX, impulseY) {
        // 慣性モーメント（球体の場合 I = 2/5 * m * r²）
        const inertia1 = 0.4 * fruit1.mass * fruit1.radius * fruit1.radius;
        const inertia2 = 0.4 * fruit2.mass * fruit2.radius * fruit2.radius;
        
        // 衝突強度に応じた回転強化係数
        const impactMagnitude = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
        const rotationEnhancement = 1.5 + Math.min(impactMagnitude * 0.5, 1.0); // 1.5〜2.5倍
        
        // 接触点での接線速度成分を計算（強化版）
        const tangentialImpulse1 = (-ny * impulseX + nx * impulseY) * fruit1.radius * rotationEnhancement;
        const tangentialImpulse2 = (ny * impulseX - nx * impulseY) * fruit2.radius * rotationEnhancement;
        
        // 角運動量の変化（トルク = r × F）
        const angularImpulse1 = tangentialImpulse1 / inertia1;
        const angularImpulse2 = tangentialImpulse2 / inertia2;
        
        // 慣性に基づく角速度変化
        fruit1.angularVelocity += angularImpulse1;
        fruit2.angularVelocity += angularImpulse2;
        
        // 強化された摩擦による回転
        const frictionFactor = 0.6; // より強い摩擦
        const relativeVelMagnitude = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
        
        // 衝突方向に基づく回転方向の決定
        const collisionAngle = Math.atan2(ny, nx);
        const rotationDirection1 = Math.sign(Math.sin(collisionAngle));
        const rotationDirection2 = -rotationDirection1;
        
        // より現実的な回転力の適用
        fruit1.angularVelocity += rotationDirection1 * relativeVelMagnitude * frictionFactor / fruit1.radius;
        fruit2.angularVelocity += rotationDirection2 * relativeVelMagnitude * frictionFactor / fruit2.radius;
        
        // 角速度の制限（より大きな値を許可）
        const maxAngularVel = 0.8; // 従来の2倍
        fruit1.angularVelocity = Math.max(-maxAngularVel, Math.min(maxAngularVel, fruit1.angularVelocity));
        fruit2.angularVelocity = Math.max(-maxAngularVel, Math.min(maxAngularVel, fruit2.angularVelocity));
    }
    
    // 衝突による転がり効果の開始
    static initiateRollingFromCollision(fruit1, fruit2, impulseX, impulseY) {
        const impactStrength = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
        const rollingThreshold = 0.1; // 転がり開始の閾値
        
        if (impactStrength > rollingThreshold) {
            // 果物1の転がり効果
            fruit1.isRolling = true;
            fruit1.rollIntensity = Math.min(1.0, impactStrength * 2.0);
            fruit1.collisionRollingFrames = 60; // 60フレーム（約1秒）継続
            
            // 果物2の転がり効果
            fruit2.isRolling = true;
            fruit2.rollIntensity = Math.min(1.0, impactStrength * 2.0);
            fruit2.collisionRollingFrames = 60;
            
            // 感情を興奮状態に
            fruit1.emotion = 'excited';
            fruit2.emotion = 'excited';
        }
    }
    
    
    // 分離確認と追加分離処理（振動抑制対応）
    static ensureProperSeparation(fruit1, fruit2) {
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 視覚的接触を考慮した分離距離
        const visualContactDistance = fruit1.radius + fruit2.radius - 0.8; // より近い接触
        const physicalSeparation = CONFIG.physics.separationBuffer;
        const requiredDistance = visualContactDistance + physicalSeparation;
        
        if (distance < requiredDistance && distance > 0) {
            // 段階的な分離処理（振動を避ける）
            const separationDeficit = requiredDistance - distance;
            
            // 分離が必要な場合でも控えめに調整
            const gentleSeparation = Math.min(separationDeficit, 0.3); // 最大0.3ピクセルずつ
            const nx = dx / distance;
            const ny = dy / distance;
            
            const mass1 = fruit1.mass || 1;
            const mass2 = fruit2.mass || 1;
            const totalMass = mass1 + mass2;
            
            const push1 = gentleSeparation * (mass2 / totalMass);
            const push2 = gentleSeparation * (mass1 / totalMass);
            
            // 分離時の速度減衰（振動抑制）
            const currentSpeed1 = Math.sqrt(fruit1.velocity.x ** 2 + fruit1.velocity.y ** 2);
            const currentSpeed2 = Math.sqrt(fruit2.velocity.x ** 2 + fruit2.velocity.y ** 2);
            
            if (currentSpeed1 < CONFIG.game.vibrationThreshold) {
                fruit1.velocity.x *= 0.5; // 微動時は速度を大幅減衰
                fruit1.velocity.y *= 0.5;
            }
            if (currentSpeed2 < CONFIG.game.vibrationThreshold) {
                fruit2.velocity.x *= 0.5;
                fruit2.velocity.y *= 0.5;
            }
            
            fruit1.x -= nx * push1;
            fruit1.y -= ny * push1;
            fruit2.x += nx * push2;
            fruit2.y += ny * push2;
            
            // 境界内に強制的に収める
            this.constrainToBoundaries(fruit1);
            this.constrainToBoundaries(fruit2);
            
            // 分離後の安定化
            fruit1.stabilizationFrames = (fruit1.stabilizationFrames || 0) + 1;
            fruit2.stabilizationFrames = (fruit2.stabilizationFrames || 0) + 1;
        } else {
            // 適切な距離の場合は安定化カウンタをリセット
            if (fruit1.stabilizationFrames) fruit1.stabilizationFrames = 0;
            if (fruit2.stabilizationFrames) fruit2.stabilizationFrames = 0;
        }
    }
    
    static constrainToBoundaries(fruit) {
        // 衝突解決後の安全な境界制約
        const margin = 2;
        
        if (fruit.x - fruit.radius < margin) {
            fruit.x = fruit.radius + margin;
        } else if (fruit.x + fruit.radius > CONFIG.canvas.width - margin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - margin;
        }
        
        if (fruit.y - fruit.radius < margin) {
            fruit.y = fruit.radius + margin;
        } else if (fruit.y + fruit.radius > CONFIG.canvas.height - margin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - margin;
        }
    }
}

// ========================
// 果物クラス
// ========================

class Fruit {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = FRUITS[type].radius;
        this.velocity = { x: 0, y: 0 };
        this.isStatic = false;
        this.staticFrames = 0;
        this.dropProtection = CONFIG.game.dropProtectionFrames;
        this.emotion = 'neutral';
        this.animationTimer = 0;
        
        // 物理プロパティ
        this.mass = Math.pow(this.radius / 15, 3) * CONFIG.physics.inertiaFactor; // 体積に比例した質量
        this.rotation = Math.random() * Math.PI * 2;  // ランダムな初期回転
        this.angularVelocity = 0;                     // 角速度
        this.momentOfInertia = 0.4 * this.mass * this.radius * this.radius; // 球体の慣性モーメント
        
        // 転がり効果プロパティ
        this.isRolling = false;                       // 転がり状態
        this.rollIntensity = 0;                       // 転がり強度（0-1）
        this.rotationTrail = [];                      // 回転軌跡
        this.collisionRollingFrames = 0;              // 衝突による転がり継続フレーム
        
        // 静止管理
        this.stabilityFrames = 0;                     // 安定性フレーム
        this.lastPosition = { x: this.x, y: this.y }; // 前フレームの位置
    }
    
    // メイン更新処理
    update() {
        this.updateTimer();
        this.savePosition();
        this.updateDropProtection();
        
        PhysicsEngine.update(this);
        
        this.updateCollisionRolling(); // 衝突転がり効果の管理
        this.checkMicroMovements();
        this.updateEmotion();
    }
    
    // タイマーと位置の更新
    updateTimer() {
        this.animationTimer++;
    }
    
    savePosition() {
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
    }
    
    updateDropProtection() {
        if (this.dropProtection > 0) {
            this.dropProtection--;
        }
    }
    
    // 衝突による転がり効果の管理
    updateCollisionRolling() {
        if (this.collisionRollingFrames > 0) {
            this.collisionRollingFrames--;
            
            // 衝突転がりフレームが残っている間は強制的に転がり状態を維持
            this.isRolling = true;
            
            // フレーム数に応じて転がり強度を減衰
            const remainingRatio = this.collisionRollingFrames / 60;
            this.rollIntensity = Math.max(0.3, this.rollIntensity * 0.98); // 最低0.3は維持
            
            // 衝突転がりが終了に近づいたら感情をクールダウン
            if (this.collisionRollingFrames < 15) {
                this.emotion = 'happy';
            }
        } else if (this.collisionRollingFrames === 0 && this.isRolling) {
            // 衝突による転がりが終了した場合の処理
            const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            if (speed < CONFIG.physics.rollingThreshold) {
                this.isRolling = false;
                this.rollIntensity = 0;
                this.emotion = 'neutral';
            }
        }
    }
    
    // 微小動作のチェックと制御
    checkMicroMovements() {
        const motionData = this.getMotionAnalysis();
        
        if (this.shouldStopImmediately(motionData)) {
            this.stopVibration();
            return;
        }
        
        this.handlePersistentMicroMovements(motionData);
        
        if (this.detectVibration()) {
            this.stopVibration();
        }
    }
    
    // 動作解析データの取得
    getMotionAnalysis() {
        const positionDelta = Math.sqrt(
            Math.pow(this.x - this.lastPosition.x, 2) + 
            Math.pow(this.y - this.lastPosition.y, 2)
        );
        
        return {
            positionDelta,
            speed: Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2),
            angularSpeed: Math.abs(this.angularVelocity),
            isNearGround: this.y + this.radius >= CONFIG.canvas.height - 5
        };
    }
    
    // 即座停止すべきかの判定
    shouldStopImmediately(motionData) {
        return motionData.positionDelta < CONFIG.game.microMovementThreshold * 0.5 && 
               motionData.isNearGround && 
               !this.isStatic && 
               motionData.speed < CONFIG.game.microMovementThreshold * 2;
    }
    
    // 持続的微動の処理
    handlePersistentMicroMovements(motionData) {
        if (!motionData.isNearGround || this.isStatic) return;
        
        // 速度はあるが位置変化が極小な場合
        if (motionData.positionDelta < CONFIG.game.microMovementThreshold && 
            (motionData.speed > 0 || motionData.angularSpeed > 0)) {
            this.velocity.x *= 0.1;
            this.velocity.y *= 0.1;
            this.angularVelocity *= 0.1;
        }
        
        // 連続的な微小振動の累積チェック
        if (motionData.positionDelta < CONFIG.game.microMovementThreshold * 2) {
            this.stabilityFrames = (this.stabilityFrames || 0) + 1;
            if (this.stabilityFrames >= 5) {
                this.stopVibration();
            }
        } else {
            this.stabilityFrames = 0;
        }
    }
    
    detectVibration() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const angularSpeed = Math.abs(this.angularVelocity);
        const isNearGround = this.y + this.radius >= CONFIG.canvas.height - 5;
        
        // より厳格な振動検出
        const hasMinisculeMovement = speed > 0 && speed < CONFIG.game.microMovementThreshold * 2;
        const hasMinisculeRotation = angularSpeed > 0 && angularSpeed < CONFIG.game.microMovementThreshold * 2;
        const isEffectivelyStationary = speed < CONFIG.game.staticThreshold && angularSpeed < CONFIG.game.staticThreshold;
        
        // 振動の判定条件を強化
        return isNearGround && 
               !this.isStatic &&
               isEffectivelyStationary &&
               (hasMinisculeMovement || hasMinisculeRotation);
    }
    
    stopVibration() {
        // 完全停止処理
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.angularVelocity = 0;
        this.isStatic = true;
        this.staticFrames = CONFIG.game.staticFrameCount;
        
        // 位置と回転の安定化
        this.y = CONFIG.canvas.height - this.radius;
        this.x = Math.max(this.radius, Math.min(CONFIG.canvas.width - this.radius, this.x));
        this.rotation = Math.round(this.rotation / (Math.PI / 6)) * (Math.PI / 6);
        
        // 安定状態をマーク
        this.stabilityFrames = CONFIG.game.stabilityFrames;
    }
    
    updateEmotion() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const angularSpeed = Math.abs(this.angularVelocity);
        
        // 速度と回転速度の両方を考慮した感情
        if (speed > 4 || angularSpeed > 0.2) {
            this.emotion = 'excited';
        } else if (speed > 1.5 || angularSpeed > 0.1) {
            this.emotion = 'happy';
        } else {
            this.emotion = 'neutral';
        }
    }
    
    draw(ctx) {
        CuteDrawingSystem.drawFruit(ctx, this);
    }
    
    canMergeWith(other) {
        return this.type === other.type &&
               this.dropProtection === 0 &&
               other.dropProtection === 0 &&
               this.type < FRUITS.length - 1;
    }
}

// ========================
// エフェクトシステム
// ========================

class EffectSystem {
    constructor() {
        this.effects = [];
    }
    
    addMergeEffect(x, y, type) {
        const effect = {
            x, y, type: 'merge',
            particles: [],
            timer: 0,
            duration: 30
        };
        
        // パーティクル生成
        for (let i = 0; i < 8; i++) {
            effect.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: FRUITS[type].color
            });
        }
        
        this.effects.push(effect);
    }
    
    addScoreEffect(x, y, score) {
        this.effects.push({
            x, y, type: 'score',
            score, timer: 0,
            duration: 60
        });
    }
    
    update() {
        this.effects = this.effects.filter(effect => {
            effect.timer++;
            
            if (effect.type === 'merge') {
                effect.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vx *= 0.98;
                    particle.vy *= 0.98;
                    particle.life--;
                });
                effect.particles = effect.particles.filter(p => p.life > 0);
            }
            
            return effect.timer < effect.duration;
        });
    }
    
    draw(ctx) {
        this.effects.forEach(effect => {
            if (effect.type === 'merge') {
                effect.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life / 30;
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            } else if (effect.type === 'score') {
                ctx.save();
                ctx.globalAlpha = 1 - (effect.timer / effect.duration);
                ctx.fillStyle = '#e17055';
                ctx.font = 'bold 20px Nunito';
                ctx.textAlign = 'center';
                ctx.fillText(`+${effect.score}`, effect.x, effect.y - effect.timer);
                ctx.restore();
            }
        });
    }
}

// ========================
// メインゲームクラス
// ========================

class CuteWatermelonGame {
    // == 初期化・設定 ==
    constructor() {
        this.initializeCanvas();
        this.initializeGameState();
        this.initializeComponents();
        this.init();
    }
    
    initializeCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextFruitCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
    }
    
    initializeGameState() {
        this.fruits = [];
        this.nextFruit = null;
        this.score = 0;
        this.combo = 0;
        this.lastMergeTime = 0;
        this.gameOver = false;
        this.isPaused = false;
    }
    
    initializeComponents() {
        this.effects = new EffectSystem();
        this.achievedFruits = new Set();
    }
    
    init() {
        this.setupEventListeners();
        this.generateNextFruit();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', () => this.dropFruit());
        
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.restart());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }
    
    // == 入力処理 ==
    handleMouseMove(e) {
        if (!this.nextFruit || this.gameOver || this.isPaused) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        // より厳密な境界制約
        const margin = 5; // 安全マージンを追加
        this.nextFruit.x = Math.max(this.nextFruit.radius + margin, 
                                  Math.min(CONFIG.canvas.width - this.nextFruit.radius - margin, x));
    }
    
    dropFruit() {
        if (!this.nextFruit || this.gameOver || this.isPaused) return;
        
        // 投下時も境界内に確実に配置
        const margin = 5;
        this.nextFruit.x = Math.max(this.nextFruit.radius + margin, 
                                  Math.min(CONFIG.canvas.width - this.nextFruit.radius - margin, this.nextFruit.x));
        this.nextFruit.y = this.nextFruit.radius + 10;
        
        this.fruits.push(this.nextFruit);
        this.nextFruit = null;
        this.generateNextFruit();
    }
    
    // == ゲーム制御 ==
    generateNextFruit() {
        const allowedTypes = [0, 1, 2, 3, 4]; // 最初の5種類のみ
        const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
        this.nextFruit = new Fruit(CONFIG.canvas.width / 2, 0, type);
        this.updateNextFruitDisplay();
    }
    
    updateNextFruitDisplay() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextFruit) {
            this.nextCtx.save();
            this.nextCtx.translate(this.nextCanvas.width / 2, this.nextCanvas.height / 2);
            
            const scale = Math.min(
                this.nextCanvas.width / (this.nextFruit.radius * 2.5),
                this.nextCanvas.height / (this.nextFruit.radius * 2.5)
            );
            this.nextCtx.scale(scale, scale);
            
            const tempFruit = { ...this.nextFruit, x: 0, y: 0 };
            CuteDrawingSystem.drawFruit(this.nextCtx, tempFruit);
            
            this.nextCtx.restore();
        }
    }
    
    // == 物理・衝突処理 ==
    checkCollisions() {
        for (let iteration = 0; iteration < CONFIG.physics.maxCollisionIterations; iteration++) {
            let hadCollision = false;
            
            for (let i = 0; i < this.fruits.length; i++) {
                for (let j = i + 1; j < this.fruits.length; j++) {
                    const fruit1 = this.fruits[i];
                    const fruit2 = this.fruits[j];
                    
                    const dx = fruit2.x - fruit1.x;
                    const dy = fruit2.y - fruit1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < fruit1.radius + fruit2.radius) {
                        if (fruit1.canMergeWith(fruit2)) {
                            this.mergeFruits(fruit1, fruit2);
                            return;
                        } else {
                            PhysicsEngine.resolveCollision(fruit1, fruit2);
                            hadCollision = true;
                        }
                    }
                }
            }
            
            if (!hadCollision) break;
        }
    }
    
    mergeFruits(fruit1, fruit2) {
        const newType = fruit1.type + 1;
        const newX = (fruit1.x + fruit2.x) / 2;
        const newY = Math.min(fruit1.y, fruit2.y);
        
        // エフェクト
        this.effects.addMergeEffect(newX, newY, newType);
        
        // スコア計算
        const points = FRUITS[newType].points;
        const comboBonus = this.updateCombo();
        const totalPoints = points + comboBonus;
        
        this.score += totalPoints;
        this.effects.addScoreEffect(newX, newY - 50, totalPoints);
        
        // 新しい果物作成
        const newFruit = new Fruit(newX, newY, newType);
        newFruit.emotion = 'excited';
        
        // 古い果物を削除
        this.fruits = this.fruits.filter(f => f !== fruit1 && f !== fruit2);
        this.fruits.push(newFruit);
        
        // 達成記録
        this.achievedFruits.add(newType);
        
        this.updateUI();
    }
    
    updateCombo() {
        const now = Date.now();
        if (now - this.lastMergeTime < CONFIG.game.comboTimeWindow) {
            this.combo++;
        } else {
            this.combo = 1;
        }
        this.lastMergeTime = now;
        
        return Math.max(0, (this.combo - 1) * 10);
    }
    
    // == UI管理 ==
    checkGameOver() {
        return this.fruits.some(fruit => 
            fruit.dropProtection === 0 && 
            fruit.y - fruit.radius <= CONFIG.game.gameOverLine
        );
    }
    
    updateUI() {
        document.getElementById('scoreValue').textContent = this.score.toLocaleString();
        document.getElementById('comboValue').textContent = this.combo;
        
        // 進化リスト更新
        this.updateEvolutionList();
    }
    
    updateEvolutionList() {
        const container = document.getElementById('evolutionList');
        container.innerHTML = '';
        
        FRUITS.forEach((fruit, index) => {
            const item = document.createElement('div');
            item.className = `evolution-item ${this.achievedFruits.has(index) ? 'achieved' : ''}`;
            
            item.innerHTML = `
                <div class="evolution-icon" style="background-color: ${fruit.color}">
                    ${fruit.emoji}
                </div>
                <div class="evolution-name">${fruit.name}</div>
            `;
            
            container.appendChild(item);
        });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.querySelector('.btn-text').textContent = this.isPaused ? '再開' : '一時停止';
        pauseBtn.querySelector('.btn-icon').textContent = this.isPaused ? '▶️' : '⏸️';
    }
    
    restart() {
        this.fruits = [];
        this.score = 0;
        this.combo = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.achievedFruits.clear();
        this.effects = new EffectSystem();
        
        document.getElementById('gameOverScreen').style.display = 'none';
        this.generateNextFruit();
        this.updateUI();
    }
    
    showGameOver() {
        this.gameOver = true;
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    // == 描画・表示 ==
    gameLoop() {
        if (!this.isPaused && !this.gameOver) {
            // 果物更新
            this.fruits.forEach(fruit => fruit.update());
            
            // 衝突処理
            this.checkCollisions();
            
            // エフェクト更新
            this.effects.update();
            
            // ゲームオーバーチェック
            if (this.checkGameOver()) {
                this.showGameOver();
                return;
            }
            
            // コンボタイマー
            if (Date.now() - this.lastMergeTime > CONFIG.game.comboTimeWindow) {
                this.combo = 0;
                document.getElementById('comboValue').textContent = this.combo;
            }
        }
        
        // 描画
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // 背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        gradient.addColorStop(0, '#ffeaa7');
        gradient.addColorStop(1, '#fdcb6e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
        
        // ゲームオーバーライン
        this.ctx.strokeStyle = 'rgba(231, 112, 85, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, CONFIG.game.gameOverLine);
        this.ctx.lineTo(CONFIG.canvas.width, CONFIG.game.gameOverLine);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 果物描画
        this.fruits.forEach(fruit => fruit.draw(this.ctx));
        
        // 落下中の果物
        if (this.nextFruit && this.nextFruit.y > 0) {
            this.nextFruit.draw(this.ctx);
        }
        
        // エフェクト描画
        this.effects.draw(this.ctx);
        
        // 投下ガイド
        if (this.nextFruit && this.nextFruit.y <= 0 && !this.gameOver && !this.isPaused) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.nextFruit.x, 0);
            this.ctx.lineTo(this.nextFruit.x, CONFIG.canvas.height);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }
}

// ========================
// ゲーム初期化・開始
// ========================

document.addEventListener('DOMContentLoaded', () => {
    new CuteWatermelonGame();
});