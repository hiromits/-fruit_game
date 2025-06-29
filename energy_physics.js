// エネルギーベース物理エンジン
class EnergyPhysicsEngine {
    static update(fruit) {
        if (fruit.isStatic) return;
        
        // エネルギー計算
        const kineticEnergy = this.calculateKineticEnergy(fruit);
        const potentialEnergy = this.calculatePotentialEnergy(fruit);
        const totalEnergy = kineticEnergy + potentialEnergy;
        
        // エネルギー閾値による自動停止
        if (totalEnergy < CONFIG.physics.energyThreshold) {
            this.setStaticState(fruit);
            return;
        }
        
        // 通常の物理更新
        this.updatePhysics(fruit);
        
        // エネルギー散逸（最重要）
        this.dissipateEnergy(fruit);
        
        // 境界処理
        this.handleBoundaries(fruit);
    }
    
    static calculateKineticEnergy(fruit) {
        const linearKE = 0.5 * fruit.mass * (fruit.velocity.x ** 2 + fruit.velocity.y ** 2);
        // 回転エネルギーの重みを下げる（回転が支配的になるのを防ぐ）
        const rotationalKE = 0.2 * fruit.momentOfInertia * (fruit.angularVelocity ** 2);
        return linearKE + rotationalKE;
    }
    
    static calculatePotentialEnergy(fruit) {
        // 重力ポテンシャルエネルギー（地面を基準点0とする）
        const height = CONFIG.canvas.height - fruit.y - fruit.radius;
        return fruit.mass * CONFIG.physics.gravity * height;
    }
    
    static updatePhysics(fruit) {
        // 重力適用
        fruit.velocity.y += CONFIG.physics.gravity;
        
        // 位置更新前の境界予測チェック
        this.preBoundaryCheck(fruit);
        
        // 位置更新
        fruit.x += fruit.velocity.x;
        fruit.y += fruit.velocity.y;
        
        // 回転更新
        fruit.rotation += fruit.angularVelocity;
        
        // 回転角度正規化
        fruit.rotation = fruit.rotation % (Math.PI * 2);
        if (fruit.rotation < 0) fruit.rotation += Math.PI * 2;
        
        // 位置更新後の強制境界制約
        this.enforceBoundaries(fruit);
    }
    
    static preBoundaryCheck(fruit) {
        // 予測位置での境界チェック
        const nextX = fruit.x + fruit.velocity.x;
        const nextY = fruit.y + fruit.velocity.y;
        const margin = 3;
        
        // X軸境界の予測チェック
        if (nextX - fruit.radius <= margin) {
            // 左壁との衝突予測
            fruit.velocity.x = Math.max(0.1, Math.abs(fruit.velocity.x) * CONFIG.physics.restitution);
            fruit.angularVelocity += fruit.velocity.x * 0.1;
        } else if (nextX + fruit.radius >= CONFIG.canvas.width - margin) {
            // 右壁との衝突予測
            fruit.velocity.x = -Math.max(0.1, Math.abs(fruit.velocity.x) * CONFIG.physics.restitution);
            fruit.angularVelocity -= fruit.velocity.x * 0.1;
        }
        
        // Y軸境界の予測チェック
        if (nextY + fruit.radius >= CONFIG.canvas.height - margin) {
            // 床との衝突予測
            const impactSpeed = Math.abs(fruit.velocity.y);
            fruit.velocity.y = -impactSpeed * CONFIG.physics.restitution;
            fruit.velocity.x *= CONFIG.physics.groundFriction;
        }
        
        if (nextY - fruit.radius <= margin) {
            // 天井との衝突予測
            fruit.velocity.y = Math.max(0.1, Math.abs(fruit.velocity.y) * CONFIG.physics.restitution);
        }
    }
    
    static enforceBoundaries(fruit) {
        // 強制的境界制約（絶対にはみ出さない）
        const strictMargin = 1;
        let wasConstrained = false;
        
        // X軸制約
        if (fruit.x - fruit.radius < strictMargin) {
            fruit.x = fruit.radius + strictMargin;
            fruit.velocity.x = Math.max(0, fruit.velocity.x);
            wasConstrained = true;
        } else if (fruit.x + fruit.radius > CONFIG.canvas.width - strictMargin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - strictMargin;
            fruit.velocity.x = Math.min(0, fruit.velocity.x);
            wasConstrained = true;
        }
        
        // Y軸制約
        if (fruit.y - fruit.radius < strictMargin) {
            fruit.y = fruit.radius + strictMargin;
            fruit.velocity.y = Math.max(0, fruit.velocity.y);
            wasConstrained = true;
        } else if (fruit.y + fruit.radius > CONFIG.canvas.height - strictMargin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - strictMargin;
            fruit.velocity.y = Math.min(0, fruit.velocity.y);
            wasConstrained = true;
        }
        
        // 制約された場合は回転も減衰
        if (wasConstrained) {
            fruit.angularVelocity *= 0.7;
        }
    }
    
    static dissipateEnergy(fruit) {
        // エネルギー散逸率（これが振動を止める鍵）
        const energyDissipationRate = 0.005; // 散逸率を上げる
        const currentEnergy = this.calculateKineticEnergy(fruit);
        
        if (currentEnergy > 0) {
            // エネルギーに比例した減衰
            const dissipationFactor = Math.max(0.92, 1 - energyDissipationRate);
            
            fruit.velocity.x *= dissipationFactor;
            fruit.velocity.y *= dissipationFactor;
            // 回転エネルギーの散逸を強化
            fruit.angularVelocity *= dissipationFactor * 0.95; // 回転は更に強く減衰
        }
        
        // 地面接触時の追加散逸
        const isOnGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 3;
        if (isOnGround) {
            fruit.velocity.x *= CONFIG.physics.groundFriction;
            
            // 転がり条件のチェック
            this.updateRolling(fruit);
        }
        
        // --- Rolling Resistance ---
        const ROLLING_RESISTANCE = CONFIG.physics.rollingResistanceCoeff;
        if (isOnGround) {
            // 距離に比例して角速度を減衰（v = ωr なので r で割る）
            const rollingDrag = ROLLING_RESISTANCE / fruit.radius;
            fruit.angularVelocity *= (1 - rollingDrag);
        } else {
            fruit.angularVelocity *= 0.98;          // 空中は従来どおり
        }
        
        // ★ 角度スナップ試行
        this.tryAngleSnap(fruit);
    }
    
    static updateRolling(fruit) {
        const velocityMagnitude = Math.abs(fruit.velocity.x);
        
        if (velocityMagnitude > 0.05) { // 転がり開始の閾値を上げる
            // 理想的な転がり（滑らない条件）
            const idealAngularVel = -fruit.velocity.x / fruit.radius;
            
            // 現在の角速度と理想角速度の差を制限
            const maxAngularVel = Math.abs(idealAngularVel) * 1.2; // 理想値の120%まで
            
            // 滑りと転がりの混合（より保守的に）
            const slipFactor = Math.min(0.3, velocityMagnitude / 5); // 混合率を下げる
            const newAngularVel = fruit.angularVelocity * (1 - slipFactor) + 
                                 idealAngularVel * slipFactor;
            
            // 角速度を制限
            fruit.angularVelocity = Math.sign(newAngularVel) * 
                                   Math.min(Math.abs(newAngularVel), maxAngularVel);
            
            fruit.isRolling = true;
            fruit.rollIntensity = Math.min(1, velocityMagnitude / 3);
        } else {
            // 低速時は転がりを停止
            fruit.angularVelocity *= 0.8; // 強い減衰
            fruit.isRolling = false;
            fruit.rollIntensity = 0;
        }
        
        // 角速度の絶対制限
        const maxAbsoluteAngularVel = 0.3; // 最大角速度を制限
        if (Math.abs(fruit.angularVelocity) > maxAbsoluteAngularVel) {
            fruit.angularVelocity = Math.sign(fruit.angularVelocity) * maxAbsoluteAngularVel;
        }
        
        // 極小角速度の停止
        if (Math.abs(fruit.angularVelocity) < 0.005) {
            fruit.angularVelocity = 0;
        }
    }
    
    static handleBoundaries(fruit) {
        const margin = 2;
        let hasCollision = false;
        
        // 左壁
        if (fruit.x - fruit.radius <= margin) {
            fruit.x = fruit.radius + margin;
            fruit.velocity.x = Math.abs(fruit.velocity.x) * CONFIG.physics.restitution;
            hasCollision = true;
        }
        
        // 右壁
        if (fruit.x + fruit.radius >= CONFIG.canvas.width - margin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - margin;
            fruit.velocity.x = -Math.abs(fruit.velocity.x) * CONFIG.physics.restitution;
            hasCollision = true;
        }
        
        // 床
        if (fruit.y + fruit.radius >= CONFIG.canvas.height - margin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - margin;
            
            // 床衝突でのエネルギー損失
            const impactEnergy = Math.abs(fruit.velocity.y);
            fruit.velocity.y = -impactEnergy * CONFIG.physics.restitution;
            
            // 水平速度への影響
            fruit.velocity.x *= CONFIG.physics.groundFriction;
            
            hasCollision = true;
        }
        
        // 天井（念のため）
        if (fruit.y - fruit.radius <= margin) {
            fruit.y = fruit.radius + margin;
            fruit.velocity.y = Math.abs(fruit.velocity.y) * CONFIG.physics.restitution;
            hasCollision = true;
        }
        
        // 衝突時の角速度調整
        if (hasCollision) {
            fruit.angularVelocity *= 0.6; // 衝突で回転エネルギーを大幅に失う
            
            // 角速度の絶対値制限
            if (Math.abs(fruit.angularVelocity) > 0.2) {
                fruit.angularVelocity = Math.sign(fruit.angularVelocity) * 0.2;
            }
        }
    }
    
    static setStaticState(fruit) {
        // 角速度と線速度の両方をチェック
        const ANGULAR_SLEEP_THRESHOLD = CONFIG.physics.angularSleepThreshold;
        const linV2 = fruit.velocity.x**2 + fruit.velocity.y**2;
        const angOk = Math.abs(fruit.angularVelocity) < ANGULAR_SLEEP_THRESHOLD;
        
        if (!angOk || linV2 > 0.0004) return;
        
        fruit.velocity.x = 0;
        fruit.velocity.y = 0;
        fruit.angularVelocity = 0;
        fruit.isStatic = true;
        fruit.isRolling = false;
        fruit.rollIntensity = 0;
        
        // 完全停止前にスナップして見た目を整える
        this.tryAngleSnap(fruit);
        
        // 地面に正確に配置
        const isNearGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 10;
        if (isNearGround) {
            fruit.y = CONFIG.canvas.height - fruit.radius;
        }
    }
    
    static resolveCollision(fruit1, fruit2) {
        // どちらも静止中なら何もしない
        if (fruit1.isStatic && fruit2.isStatic) return false;
        
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = fruit1.radius + fruit2.radius;
        
        if (distance >= minDistance) return false;
        if (distance === 0) return false;
        
        // 衝突前のエネルギー
        const energy1Before = this.calculateKineticEnergy(fruit1);
        const energy2Before = this.calculateKineticEnergy(fruit2);
        const totalEnergyBefore = energy1Before + energy2Before;
        
        // 従来の衝突処理
        const nx = dx / distance;
        const ny = dy / distance;
        
        // 重なり解消
        const overlap = minDistance - distance;
        const separation = overlap * 0.50; // 必要最小限
        
        fruit1.x -= nx * separation;
        fruit1.y -= ny * separation;
        fruit2.x += nx * separation;
        fruit2.y += ny * separation;
        
        // 分離後の境界制約（衝突時の境界はみ出し防止）
        this.constrainToBoundaries(fruit1);
        this.constrainToBoundaries(fruit2);
        
        // 相対速度
        const relVelX = fruit1.velocity.x - fruit2.velocity.x;
        const relVelY = fruit1.velocity.y - fruit2.velocity.y;
        const relVelAlongNormal = relVelX * nx + relVelY * ny;
        
        if (relVelAlongNormal > 0) return true; // 分離中
        
        // ── 低速ならくっ付けて終了 ──
        const CONTACT_EPS = 0.03;   // ≒2px/Frame 程度
        if (Math.abs(relVelAlongNormal) < CONTACT_EPS) {
            // ① 位置だけ分離（後述）
            const overlap = minDistance - distance;
            const separation = overlap * 0.5;
            fruit1.x -= nx * separation;
            fruit1.y -= ny * separation;
            fruit2.x += nx * separation;
            fruit2.y += ny * separation;

            // ② 速度を平均化＝完全非弾性
            const avgVX = (fruit1.velocity.x + fruit2.velocity.x) * 0.5;
            const avgVY = (fruit1.velocity.y + fruit2.velocity.y) * 0.5;
            fruit1.velocity.x = fruit2.velocity.x = avgVX;
            fruit1.velocity.y = fruit2.velocity.y = avgVY;

            // ③ 低角速度なら寝かせる
            const ANG_SLEEP = CONFIG.physics.angleSnap?.angularSleep ?? 0.04;
            if (Math.abs(fruit1.angularVelocity) < ANG_SLEEP) fruit1.angularVelocity = 0;
            if (Math.abs(fruit2.angularVelocity) < ANG_SLEEP) fruit2.angularVelocity = 0;
            return true;          // 反発計算スキップ
        }
        
        // 衝突応答
        const mass1 = fruit1.mass;
        const mass2 = fruit2.mass;
        const totalMass = mass1 + mass2;
        
        const REST_MIN_SPEED = 0.6;               // これ未満の衝突では反発を弱める
        const velFactor = Math.min(1, Math.abs(relVelAlongNormal) / REST_MIN_SPEED);
        const effRest   = CONFIG.physics.restitution * velFactor;   // 低速 ⇒ restitution ↓
        const impulse   = -(1 + effRest) * relVelAlongNormal / totalMass;
        const WAKE_THRESHOLD = CONFIG.physics.wakeThreshold;
        
        // ほんのかすり傷なら動きをゼロにして終了
        if (Math.abs(impulse) < WAKE_THRESHOLD) {
            fruit1.velocity.x = fruit2.velocity.x = 0;
            fruit1.velocity.y = fruit2.velocity.y = 0;
            return true;                      // 静止のまま
        }
        
        fruit1.velocity.x += impulse * mass2 * nx;
        fruit1.velocity.y += impulse * mass2 * ny;
        fruit2.velocity.x -= impulse * mass1 * nx;
        fruit2.velocity.y -= impulse * mass1 * ny;
        
        // エネルギー保存チェックと散逸
        const energy1After = this.calculateKineticEnergy(fruit1);
        const energy2After = this.calculateKineticEnergy(fruit2);
        const totalEnergyAfter = energy1After + energy2After;
        
        // エネルギー散逸（衝突による摩擦とエネルギー損失）
        const energyLoss = 0.85; // 15%のエネルギー損失
        if (totalEnergyAfter > totalEnergyBefore * energyLoss) {
            const correctionFactor = Math.sqrt((totalEnergyBefore * energyLoss) / totalEnergyAfter);
            
            fruit1.velocity.x *= correctionFactor;
            fruit1.velocity.y *= correctionFactor;
            fruit2.velocity.x *= correctionFactor;
            fruit2.velocity.y *= correctionFactor;
        }
        
        // 回転への影響（大幅に削減）
        const rotationInfluence = 0.003; // 回転への影響を大幅削減
        fruit1.angularVelocity += (fruit2.x - fruit1.x) * rotationInfluence;
        fruit2.angularVelocity += (fruit1.x - fruit2.x) * rotationInfluence;
        
        // 回転速度制限
        const maxCollisionAngularVel = 0.15;
        fruit1.angularVelocity = Math.sign(fruit1.angularVelocity) * 
                                Math.min(Math.abs(fruit1.angularVelocity), maxCollisionAngularVel);
        fruit2.angularVelocity = Math.sign(fruit2.angularVelocity) * 
                                Math.min(Math.abs(fruit2.angularVelocity), maxCollisionAngularVel);
        
        // 十分大きい衝撃だけ眠りを解除
        fruit1.isStatic = fruit2.isStatic = true;        // デフォルトは寝かせ
        if (Math.abs(impulse) >= WAKE_THRESHOLD) {
            fruit1.isStatic = fruit2.isStatic = false;   // 本当に動くときだけ起こす
        }
        
        return true;
    }
    
    static tryAngleSnap(fruit) {
        const { targets, threshold, angularSleep } = CONFIG.physics.angleSnap;

        // 条件：接地 or 他オブジェクト上 + 角速度が充分小さい
        const onGround = fruit.y + fruit.radius >= CONFIG.canvas.height - 3;
        const slowEnough = Math.abs(fruit.angularVelocity) < angularSleep;
        if (!onGround || !slowEnough) return false;

        // 現在角度と最も近い target を探す
        let nearest = null, minDiff = Infinity;
        for (const t of targets) {
            const diff = Math.abs(((fruit.rotation - t + Math.PI) % (2 * Math.PI)) - Math.PI);
            if (diff < minDiff) { minDiff = diff; nearest = t; }
        }

        // 閾値内ならスナップ
        if (minDiff < threshold) {
            fruit.rotation = nearest;
            fruit.angularVelocity = 0;
            return true;
        }
        return false;
    }
    
    static constrainToBoundaries(fruit) {
        // 衝突処理中の境界制約（より厳格）
        const safeMargin = 2;
        
        // X軸制約
        if (fruit.x - fruit.radius < safeMargin) {
            fruit.x = fruit.radius + safeMargin;
        } else if (fruit.x + fruit.radius > CONFIG.canvas.width - safeMargin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - safeMargin;
        }
        
        // Y軸制約
        if (fruit.y - fruit.radius < safeMargin) {
            fruit.y = fruit.radius + safeMargin;
        } else if (fruit.y + fruit.radius > CONFIG.canvas.height - safeMargin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - safeMargin;
        }
    }
}