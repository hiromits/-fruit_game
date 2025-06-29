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
        
        // 王冠は最上位果物のみ
        if (expression.crown && fruit.type === FRUITS.length - 1) {
            this.drawCrown(ctx, fruit);
        }
    }
    
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