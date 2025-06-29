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
        groundFriction: 0.88,            // 地面摩擦を強化（転がりやすく）
        restitution: 0.15,               // 反発を抑える
        separationBuffer: 1.0,
        maxCollisionIterations: 6,
        angularDamping: 0.96,            // 回転減衰を調整
        rotationFactor: 0.6,             // 回転強度を上げる（より転がりやすく）
        rollingResistance: 0.008,        // 転がり抵抗を下げる（より滑らかに）
        inertiaFactor: 0.4,              // 慣性の強さ
        rollingThreshold: 0.02,          // 転がり開始閾値
        rollingAcceleration: 0.85        // 転がり加速度
    },
    game: {
        gameOverLine: 100,
        staticFrameCount: 20,            // 静止判定フレーム数
        dropProtectionFrames: 30,
        comboTimeWindow: 2000,
        staticThreshold: 0.03,           // 静止速度閾値
        microMovementThreshold: 0.01,    // 微小動作閾値
        stabilityFrames: 10              // 安定性確認フレーム
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

// 表情とアニメーションシステム
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

// 可愛い描画システム
class CuteDrawingSystem {
    static drawFruit(ctx, fruit) {
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        
        // 影の描画
        this.drawShadow(ctx, fruit);
        
        // 果物本体
        this.drawBody(ctx, fruit);
        
        // 表情
        this.drawFace(ctx, fruit);
        
        // 特殊効果
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
    
    static drawBody(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        
        // 回転を適用（転がり効果強化）
        const rotation = fruit.rotation || 0;
        ctx.rotate(rotation);
        
        // 転がり効果の追加視覚表現
        if (fruit.isRolling && fruit.rollIntensity > 0) {
            this.drawRollingEffects(ctx, fruit);
        }
        
        // より柔らかい質感のグラデーション
        const gradient = ctx.createRadialGradient(
            -fruit.radius * 0.3, -fruit.radius * 0.3, 0,
            0, 0, fruit.radius * 1.2
        );
        
        // より温かみのある色調
        const baseColor = fruitData.color;
        const lightColor = this.lightenColor(baseColor, 35);
        const darkColor = this.darkenColor(baseColor, 25);
        
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, darkColor);
        
        // メイン円（より丸みを帯びた表現）
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 柔らかいハイライト（回転に応じて動く）
        const highlightAngle = rotation * 0.3; // 回転の30%の速度で動く
        const highlightX = -fruit.radius * 0.2 + Math.cos(highlightAngle) * fruit.radius * 0.1;
        const highlightY = -fruit.radius * 0.2 + Math.sin(highlightAngle) * fruit.radius * 0.1;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(highlightX, highlightY, fruit.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 小さな光沢（より動的に）
        const glossX = -fruit.radius * 0.3 + Math.cos(highlightAngle * 1.2) * fruit.radius * 0.05;
        const glossY = -fruit.radius * 0.3 + Math.sin(highlightAngle * 1.2) * fruit.radius * 0.05;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(glossX, glossY, fruit.radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // 果物の模様や特徴（回転と一緒に動く）
        this.drawFruitPatterns(ctx, fruit);
    }
    
    static drawFruitPatterns(ctx, fruit) {
        const fruitData = FRUITS[fruit.type];
        
        // 果物の種類に応じた模様を追加
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
        
        // 転がりトレイル効果（微細な軌跡）
        if (fruit.rotationTrail && fruit.rotationTrail.length > 1) {
            ctx.save();
            ctx.globalAlpha = intensity * 0.3;
            
            // 過去の回転位置を淡く表示
            for (let i = 0; i < fruit.rotationTrail.length - 1; i++) {
                const trail = fruit.rotationTrail[i];
                const age = Date.now() - trail.timestamp;
                const trailAlpha = Math.max(0, 1 - age / 200) * intensity * 0.2;
                
                if (trailAlpha > 0.01) {
                    ctx.save();
                    ctx.globalAlpha = trailAlpha;
                    ctx.rotate(trail.angle - (fruit.rotation || 0));
                    
                    // 微細な回転軌跡を描画
                    ctx.strokeStyle = FRUITS[fruit.type].color;
                    ctx.lineWidth = 1;
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
}

// 物理エンジン
class PhysicsEngine {
    static update(fruit) {
        if (fruit.isStatic) {
            // 静止時も微小な回転減衰
            fruit.angularVelocity *= CONFIG.physics.angularDamping;
            if (Math.abs(fruit.angularVelocity) < 0.001) {
                fruit.angularVelocity = 0;
            }
            fruit.rotation += fruit.angularVelocity;
            return;
        }
        
        // 重力適用（よりリアルな慣性）
        const mass = fruit.mass || 1;
        // 重力は質量に関係なく一定（ガリレイの法則）
        fruit.velocity.y += CONFIG.physics.gravity;
        
        // 空気抵抗と摩擦適用
        fruit.velocity.x *= CONFIG.physics.airResistance;
        fruit.velocity.y *= CONFIG.physics.friction;
        
        // 地面との接触判定
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        
        // 地面摩擦（地面に接触している場合）
        if (isOnGround) {
            fruit.velocity.x *= CONFIG.physics.groundFriction;
        }
        
        // 回転の更新（転がり効果）
        this.updateRotation(fruit, isOnGround);
        
        // 境界チェック（位置更新前）
        this.preBoundaryCheck(fruit);
        
        // 位置更新
        fruit.x += fruit.velocity.x;
        fruit.y += fruit.velocity.y;
        
        // 境界チェック（位置更新後）
        this.postBoundaryCheck(fruit);
        
        // 静止判定
        this.checkStatic(fruit);
    }
    
    static updateRotation(fruit, isOnGround) {
        const velocityMagnitude = Math.abs(fruit.velocity.x);
        
        // 地面での転がり（より自然で見た目に美しい転がり）
        if (isOnGround && velocityMagnitude > CONFIG.physics.rollingThreshold) {
            // 理想的な転がり速度（滑らない物理法則）
            const idealAngularVel = -fruit.velocity.x / fruit.radius;
            
            // スムーズな角速度調整（転がり開始時の加速を改善）
            const angularDiff = idealAngularVel - fruit.angularVelocity;
            const adjustmentFactor = CONFIG.physics.rotationFactor * CONFIG.physics.rollingAcceleration;
            fruit.angularVelocity += angularDiff * adjustmentFactor;
            
            // 転がり抵抗を速度に応じて動的に調整
            const dynamicResistance = CONFIG.physics.rollingResistance * (1 + velocityMagnitude * 0.1);
            fruit.angularVelocity *= (1 - dynamicResistance);
            
            // 転がり効果の視覚的強化
            fruit.isRolling = true;
            fruit.rollIntensity = Math.min(1.0, velocityMagnitude / 3.0);
            
        } else if (isOnGround && velocityMagnitude <= CONFIG.physics.rollingThreshold) {
            // 微小な速度での転がり停止処理
            fruit.angularVelocity *= 0.85;
            fruit.isRolling = false;
            fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.05);
            
        } else if (!isOnGround) {
            // 空中では慣性による回転が持続
            fruit.angularVelocity *= 0.995;
            fruit.isRolling = false;
            fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.02);
        }
        
        // 地面での追加の減衰効果
        if (isOnGround) {
            fruit.angularVelocity *= CONFIG.physics.angularDamping;
        }
        
        // 回転角度の更新（より滑らかに）
        fruit.rotation += fruit.angularVelocity;
        
        // 回転角度の正規化
        fruit.rotation = fruit.rotation % (Math.PI * 2);
        if (fruit.rotation < 0) fruit.rotation += Math.PI * 2;
        
        // 極小回転の停止処理
        if (Math.abs(fruit.angularVelocity) < 0.0008) {
            fruit.angularVelocity = 0;
            fruit.isRolling = false;
        }
        
        // 転がり効果のためのトレイル情報更新
        if (!fruit.rotationTrail) fruit.rotationTrail = [];
        fruit.rotationTrail.push({
            angle: fruit.rotation,
            timestamp: Date.now(),
            intensity: fruit.rollIntensity || 0
        });
        
        // 古いトレイル情報を削除（パフォーマンス最適化）
        const now = Date.now();
        fruit.rotationTrail = fruit.rotationTrail.filter(trail => 
            now - trail.timestamp < 200
        );
    }
    
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
    
    // 旧メソッドは削除
    static handleBoundaries(fruit) {
        // このメソッドは上記の新しいメソッドに統合されました
    }
    
    static checkStatic(fruit) {
        const speed = Math.sqrt(fruit.velocity.x ** 2 + fruit.velocity.y ** 2);
        const angularSpeed = Math.abs(fruit.angularVelocity);
        const isNearBottom = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        
        // 第1段階: 極小動作の即座停止
        if (speed < CONFIG.game.microMovementThreshold) {
            fruit.velocity.x = 0;
            fruit.velocity.y = 0;
        }
        
        if (angularSpeed < CONFIG.game.microMovementThreshold) {
            fruit.angularVelocity = 0;
        }
        
        // 第2段階: 不自然な振動の検出と強制停止
        const hasMinimalMovement = speed < CONFIG.game.staticThreshold && 
                                  angularSpeed < CONFIG.game.staticThreshold;
        const isAtRest = speed === 0 && angularSpeed === 0;
        
        // 底面近くでの微小振動を完全停止
        if (isNearBottom && hasMinimalMovement && !isAtRest) {
            // 振動と判定される条件での強制停止
            const vibrationThreshold = CONFIG.game.microMovementThreshold * 0.5;
            if (speed < vibrationThreshold || angularSpeed < vibrationThreshold) {
                fruit.velocity.x = 0;
                fruit.velocity.y = 0;
                fruit.angularVelocity = 0;
                fruit.isStatic = true;
                
                // 位置を完全に安定化
                fruit.y = CONFIG.canvas.height - fruit.radius;
                fruit.x = Math.max(fruit.radius, Math.min(CONFIG.canvas.width - fruit.radius, fruit.x));
                fruit.rotation = Math.round(fruit.rotation / (Math.PI / 6)) * (Math.PI / 6);
                
                return; // 早期終了で追加処理をスキップ
            }
        }
        
        // 第3段階: 通常の静止判定
        const isCompletelyStill = speed < CONFIG.game.staticThreshold && 
                                 angularSpeed < CONFIG.game.staticThreshold && 
                                 isNearBottom;
        
        if (isCompletelyStill) {
            fruit.staticFrames = (fruit.staticFrames || 0) + 1;
            fruit.stabilityFrames = (fruit.stabilityFrames || 0) + 1;
            
            // 段階的な停止プロセス（より厳格）
            if (fruit.staticFrames >= CONFIG.game.staticFrameCount) {
                fruit.isStatic = true;
                fruit.velocity.x = 0;
                fruit.velocity.y = 0;
                fruit.angularVelocity = 0;
                
                // 位置の完全安定化
                fruit.y = CONFIG.canvas.height - fruit.radius;
                fruit.x = Math.max(fruit.radius, Math.min(CONFIG.canvas.width - fruit.radius, fruit.x));
                fruit.rotation = Math.round(fruit.rotation / (Math.PI / 6)) * (Math.PI / 6);
            } else if (fruit.staticFrames >= CONFIG.game.staticFrameCount / 2) {
                // 準静止状態：強力な減衰
                fruit.velocity.x *= 0.3;
                fruit.velocity.y *= 0.3;
                fruit.angularVelocity *= 0.2;
            }
        } else {
            // 動きがある場合はカウンターをリセット
            fruit.staticFrames = 0;
            fruit.stabilityFrames = 0;
        }
        
        // 第4段階: 追加の振動抑制処理
        if (!fruit.isStatic && isNearBottom) {
            // 底面近くでの極小動作を段階的に減衰
            if (speed < CONFIG.game.microMovementThreshold * 3) {
                fruit.velocity.x *= 0.5;
                fruit.velocity.y *= 0.5;
            }
            
            if (angularSpeed < CONFIG.game.microMovementThreshold * 3) {
                fruit.angularVelocity *= 0.6;
            }
            
            // 非常に小さな動きは即座に停止
            if (speed < 0.005) fruit.velocity.x = fruit.velocity.y = 0;
            if (angularSpeed < 0.005) fruit.angularVelocity = 0;
        }
    }
    
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
        
        // 重なり解消（慣性に基づく分配）
        const overlap = minDistance - distance;
        const correction1 = overlap * (mass2 / totalMass) * 0.5;
        const correction2 = overlap * (mass1 / totalMass) * 0.5;
        
        fruit1.x -= nx * correction1;
        fruit1.y -= ny * correction1;
        fruit2.x += nx * correction2;
        fruit2.y += ny * correction2;
        
        // 位置補正後に境界チェック
        this.constrainToBoundaries(fruit1);
        this.constrainToBoundaries(fruit2);
        
        // 相対速度の計算
        const relativeVelX = fruit1.velocity.x - fruit2.velocity.x;
        const relativeVelY = fruit1.velocity.y - fruit2.velocity.y;
        const relativeSpeed = relativeVelX * nx + relativeVelY * ny;
        
        // 離れる方向に動いている場合は処理しない
        if (relativeSpeed > 0) return true;
        
        // 反発係数を考慮した衝突impulse
        const restitution = CONFIG.physics.restitution;
        const impulseMagnitude = -(1 + restitution) * relativeSpeed / totalMass;
        
        // 慣性の法則に基づく速度変化
        const impulseX = impulseMagnitude * nx;
        const impulseY = impulseMagnitude * ny;
        
        // ニュートンの第二法則：F = ma より a = F/m
        fruit1.velocity.x += impulseX * mass2;
        fruit1.velocity.y += impulseY * mass2;
        fruit2.velocity.x -= impulseX * mass1;
        fruit2.velocity.y -= impulseY * mass1;
        
        // 質量差による効果（重い物体は軽い物体より動きにくい）
        const massRatio1 = mass2 / (mass1 + mass2);
        const massRatio2 = mass1 / (mass1 + mass2);
        
        // エネルギー損失（非弾性衝突の要素）
        const energyLoss = 0.85; // エネルギー保存係数
        fruit1.velocity.x *= energyLoss;
        fruit1.velocity.y *= energyLoss;
        fruit2.velocity.x *= energyLoss;
        fruit2.velocity.y *= energyLoss;
        
        // 慣性による回転効果
        this.applyInertialRotation(fruit1, fruit2, nx, ny, impulseX, impulseY);
        
        // 静止状態解除
        fruit1.isStatic = false;
        fruit2.isStatic = false;
        fruit1.staticFrames = 0;
        fruit2.staticFrames = 0;
        
        return true;
    }
    
    static applyInertialRotation(fruit1, fruit2, nx, ny, impulseX, impulseY) {
        // 慣性モーメント（球体の場合 I = 2/5 * m * r²）
        const inertia1 = 0.4 * fruit1.mass * fruit1.radius * fruit1.radius;
        const inertia2 = 0.4 * fruit2.mass * fruit2.radius * fruit2.radius;
        
        // 衝突点から重心までの距離ベクトル（回転軸計算用）
        const r1 = fruit1.radius;
        const r2 = fruit2.radius;
        
        // 接触点での接線速度成分を計算
        const tangentialImpulse1 = (-ny * impulseX + nx * impulseY) * r1;
        const tangentialImpulse2 = (ny * impulseX - nx * impulseY) * r2;
        
        // 角運動量の変化（トルク = r × F）
        const angularImpulse1 = tangentialImpulse1 / inertia1;
        const angularImpulse2 = tangentialImpulse2 / inertia2;
        
        // 慣性に基づく角速度変化
        fruit1.angularVelocity += angularImpulse1;
        fruit2.angularVelocity += angularImpulse2;
        
        // 摩擦による回転（より現実的）
        const frictionFactor = 0.3;
        const relativeVelMagnitude = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
        
        if (nx > 0) {
            fruit1.angularVelocity -= relativeVelMagnitude * frictionFactor / fruit1.radius;
            fruit2.angularVelocity += relativeVelMagnitude * frictionFactor / fruit2.radius;
        } else {
            fruit1.angularVelocity += relativeVelMagnitude * frictionFactor / fruit1.radius;
            fruit2.angularVelocity -= relativeVelMagnitude * frictionFactor / fruit2.radius;
        }
        
        // 角速度の制限（現実的な範囲内）
        const maxAngularVel = 0.4;
        fruit1.angularVelocity = Math.max(-maxAngularVel, Math.min(maxAngularVel, fruit1.angularVelocity));
        fruit2.angularVelocity = Math.max(-maxAngularVel, Math.min(maxAngularVel, fruit2.angularVelocity));
    }
    
    // 旧メソッドの置き換え
    static applyCollisionRotation(fruit1, fruit2, nx, ny) {
        // この関数は applyInertialRotation に統合されました
        console.warn("applyCollisionRotation is deprecated, use applyInertialRotation instead");
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

// 果物クラス
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
        
        // 静止管理
        this.stabilityFrames = 0;                     // 安定性フレーム
        this.lastPosition = { x: this.x, y: this.y }; // 前フレームの位置
    }
    
    update() {
        this.animationTimer++;
        
        // 前フレームの位置を保存
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        
        // 投下保護
        if (this.dropProtection > 0) {
            this.dropProtection--;
        }
        
        // 物理更新
        PhysicsEngine.update(this);
        
        // 微小移動のチェックと強制停止
        this.checkMicroMovements();
        
        // 感情の更新
        this.updateEmotion();
    }
    
    checkMicroMovements() {
        // 位置変化の詳細分析
        const positionDelta = Math.sqrt(
            Math.pow(this.x - this.lastPosition.x, 2) + 
            Math.pow(this.y - this.lastPosition.y, 2)
        );
        
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const angularSpeed = Math.abs(this.angularVelocity);
        const isNearGround = this.y + this.radius >= CONFIG.canvas.height - 5;
        
        // 極小移動の即座停止（より厳格な条件）
        if (positionDelta < CONFIG.game.microMovementThreshold * 0.5 && isNearGround && !this.isStatic) {
            if (speed < CONFIG.game.microMovementThreshold * 2) {
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.angularVelocity = 0;
                this.stopVibration();
                return;
            }
        }
        
        // 不自然な持続的微動の検出
        if (isNearGround && !this.isStatic) {
            // 速度はあるが位置変化が極小な場合（ぐにゃぐにゃ状態）
            if (positionDelta < CONFIG.game.microMovementThreshold && 
                (speed > 0 || angularSpeed > 0)) {
                this.velocity.x *= 0.1;
                this.velocity.y *= 0.1;
                this.angularVelocity *= 0.1;
            }
            
            // 連続的な微小振動の累積チェック
            if (positionDelta < CONFIG.game.microMovementThreshold * 2) {
                this.stabilityFrames = (this.stabilityFrames || 0) + 1;
                
                if (this.stabilityFrames >= 5) {
                    this.stopVibration();
                    return;
                }
            } else {
                this.stabilityFrames = 0;
            }
        }
        
        // 振動の検出と即座停止
        if (this.detectVibration()) {
            this.stopVibration();
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

// エフェクトシステム
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

// メインゲームクラス
class CuteWatermelonGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextFruitCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
        
        this.fruits = [];
        this.nextFruit = null;
        this.score = 0;
        this.combo = 0;
        this.lastMergeTime = 0;
        this.gameOver = false;
        this.isPaused = false;
        
        this.effects = new EffectSystem();
        this.achievedFruits = new Set();
        
        this.init();
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

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new CuteWatermelonGame();
});