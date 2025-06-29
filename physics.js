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
        const isOnWall = (fruit.x - fruit.radius <= 3) || (fruit.x + fruit.radius >= CONFIG.canvas.width - 3);
        
        // 地面摩擦（地面に接触している場合のみ）
        if (isOnGround && !isOnWall) {
            fruit.velocity.x *= CONFIG.physics.groundFriction;
        }
        
        // 壁との接触時は垂直方向の摩擦のみ適用
        if (isOnWall && !isOnGround) {
            fruit.velocity.y *= CONFIG.physics.groundFriction;
            // 壁では水平摩擦を軽く
            fruit.velocity.x *= 0.98;
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
        
        // 地面での転がり（慣性重視の自然な転がり）
        if (isOnGround) {
            // 水平速度がある場合は常に転がり処理
            if (velocityMagnitude > CONFIG.physics.rollingThreshold) {
                // 理想的な転がり速度（滑らない物理法則）
                const idealAngularVel = -fruit.velocity.x / fruit.radius;
                
                // スムーズな角速度調整（慣性を考慮）
                const angularDiff = idealAngularVel - fruit.angularVelocity;
                const adjustmentFactor = CONFIG.physics.rotationFactor * CONFIG.physics.rollingAcceleration;
                fruit.angularVelocity += angularDiff * adjustmentFactor;
                
                // 転がり効果の視覚的強化
                fruit.isRolling = true;
                fruit.rollIntensity = Math.min(1.0, velocityMagnitude / 2.0);
                
            } else {
                // 微小な速度でも慣性で回転を続ける
                fruit.angularVelocity *= 0.96; // より緩やかな減衰
                fruit.isRolling = velocityMagnitude > 0.001;
                fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.02);
            }
            
            // 転がり抵抗（速度に比例した軽い抵抗のみ）
            const rollingResistance = CONFIG.physics.rollingResistance * (0.5 + velocityMagnitude * 0.1);
            fruit.angularVelocity *= (1 - rollingResistance);
            
            // 地面での回転減衰は軽く
            fruit.angularVelocity *= CONFIG.physics.angularDamping;
            
        } else {
            // 空中では慣性による回転が長く持続
            fruit.angularVelocity *= 0.998; // 空中でのより緩やかな減衰
            fruit.isRolling = false;
            fruit.rollIntensity = Math.max(0, (fruit.rollIntensity || 0) - 0.01);
        }
        
        // 回転角度の更新
        fruit.rotation += fruit.angularVelocity;
        
        // 回転角度の正規化
        fruit.rotation = fruit.rotation % (Math.PI * 2);
        if (fruit.rotation < 0) fruit.rotation += Math.PI * 2;
        
        // 極小回転の停止処理（閾値を下げる）
        if (Math.abs(fruit.angularVelocity) < 0.0003) {
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
        
        // 古いトレイル情報を削除
        const now = Date.now();
        fruit.rotationTrail = fruit.rotationTrail.filter(trail => 
            now - trail.timestamp < 300 // トレイル時間を延長
        );
    }
    
    static preBoundaryCheck(fruit) {
        // 予測位置での境界チェック
        const nextX = fruit.x + fruit.velocity.x;
        const nextY = fruit.y + fruit.velocity.y;
        
        // X軸境界の予測チェック（壁からの反発を強化）
        if (nextX - fruit.radius <= 0) {
            // 左壁との衝突 - より強い反発で張り付きを防ぐ
            const impactSpeed = Math.abs(fruit.velocity.x);
            fruit.velocity.x = Math.max(0.5, impactSpeed * CONFIG.physics.restitution * 2); // 最小反発速度を保証
            
            // 角運動量の変化（壁との摩擦）
            fruit.angularVelocity += impactSpeed * 0.15;
            
        } else if (nextX + fruit.radius >= CONFIG.canvas.width) {
            // 右壁との衝突
            const impactSpeed = Math.abs(fruit.velocity.x);
            fruit.velocity.x = -Math.max(0.5, impactSpeed * CONFIG.physics.restitution * 2); // 最小反発速度を保証
            
            // 角運動量の変化
            fruit.angularVelocity -= impactSpeed * 0.15;
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
        // 強制的な位置補正（張り付き防止）
        const margin = 2; // 安全マージンを増加
        
        // 左境界 - 張り付き防止のための押し出し
        if (fruit.x - fruit.radius < margin) {
            fruit.x = fruit.radius + margin;
            // 張り付き防止のための最小速度
            if (fruit.velocity.x < 0.3) {
                fruit.velocity.x = 0.3;
            }
        }
        
        // 右境界 - 張り付き防止のための押し出し
        if (fruit.x + fruit.radius > CONFIG.canvas.width - margin) {
            fruit.x = CONFIG.canvas.width - fruit.radius - margin;
            // 張り付き防止のための最小速度
            if (fruit.velocity.x > -0.3) {
                fruit.velocity.x = -0.3;
            }
        }
        
        // 上境界（念のため）
        if (fruit.y - fruit.radius < margin) {
            fruit.y = fruit.radius + margin;
            fruit.velocity.y = Math.max(0.2, fruit.velocity.y); // 最小下向き速度
        }
        
        // 下境界
        if (fruit.y + fruit.radius > CONFIG.canvas.height - margin) {
            fruit.y = CONFIG.canvas.height - fruit.radius - margin;
            fruit.velocity.y = Math.min(0, fruit.velocity.y); // 下向きの速度を無効化
            // 地面摩擦は適度に
            fruit.velocity.x *= CONFIG.physics.groundFriction;
        }
    }
    
    static checkStatic(fruit) {
        const speed = Math.sqrt(fruit.velocity.x ** 2 + fruit.velocity.y ** 2);
        const angularSpeed = Math.abs(fruit.angularVelocity);
        const isNearBottom = fruit.y + fruit.radius >= CONFIG.canvas.height - 5;
        const isNearWall = (fruit.x - fruit.radius <= 5) || (fruit.x + fruit.radius >= CONFIG.canvas.width - 5);
        
        // 壁に張り付いている場合は静止判定を厳しくしない
        if (isNearWall && !isNearBottom) {
            // 壁では重力で自然に落下させる
            return;
        }
        
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
        const minDistance = fruit1.radius + fruit2.radius;
        
        // より厳密な接触判定
        if (distance >= minDistance) return false;
        if (distance === 0) {
            // 完全に重なっている場合の処理
            const separationDistance = 0.1;
            fruit1.x -= separationDistance;
            fruit2.x += separationDistance;
            return true;
        }
        
        // 質量とイナーシャの計算
        const mass1 = fruit1.mass || 1;
        const mass2 = fruit2.mass || 1;
        const totalMass = mass1 + mass2;
        const reducedMass = (mass1 * mass2) / totalMass;
        
        // 衝突法線ベクトル
        const nx = dx / distance;
        const ny = dy / distance;
        
        // 重なり解消（より確実な分離）
        const overlap = minDistance - distance + CONFIG.physics.separationBuffer;
        const correction1 = overlap * (mass2 / totalMass) * 0.6; // 分離を強化
        const correction2 = overlap * (mass1 / totalMass) * 0.6;
        
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