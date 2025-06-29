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
        this.emotionTimer = 0; // 感情の持続時間
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
        
        // 活動時間管理
        this.activeTime = 0;                          // 動作開始からの時間
        this.lastContactTime = 0;                     // 最後の接触時間
        this.isForceStatic = false;                   // 強制静止フラグ
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
        
        // 活動時間管理
        this.updateActiveTime();
        
        // 強制静止でない場合のみ物理更新
        if (!this.isForceStatic) {
            // エネルギーベース物理エンジンを使用
            EnergyPhysicsEngine.update(this);
            
            // エネルギーベースでは微小移動チェックは不要
            // （エネルギー閾値で自動停止するため）
        }
        
        // 感情の更新
        this.updateEmotion();
    }
    
    updateActiveTime() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const angularSpeed = Math.abs(this.angularVelocity);
        const isMoving = speed > CONFIG.game.microMovementThreshold || angularSpeed > CONFIG.game.microMovementThreshold;
        
        if (isMoving && !this.isStatic && !this.isForceStatic) {
            this.activeTime++;
            
            // 最大活動時間を超えた場合は強制停止
            if (this.activeTime >= CONFIG.game.maxActiveTime) {
                this.forceStop();
            }
        } else {
            // 静止中は活動時間をリセット
            this.activeTime = Math.max(0, this.activeTime - 2);
        }
    }
    
    forceStop() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.angularVelocity = 0;
        this.isStatic = true;
        this.isForceStatic = true;
        this.staticFrames = CONFIG.game.staticFrameCount;
        this.activeTime = 0;
        
        // 位置を安定化
        const isNearGround = this.y + this.radius >= CONFIG.canvas.height - 5;
        if (isNearGround) {
            this.y = CONFIG.canvas.height - this.radius;
            this.x = Math.max(this.radius, Math.min(CONFIG.canvas.width - this.radius, this.x));
        }
        
        // 感情をリセット
        this.emotion = 'neutral';
        this.emotionTimer = 0;
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
        
        // 転がり中は振動チェックを緩く
        if (this.isRolling) {
            // 転がり中は強制停止しない
            return;
        }
        
        // 極小移動の即座停止（条件を厳しく）
        if (positionDelta < CONFIG.game.microMovementThreshold * 0.2 && 
            isNearGround && 
            !this.isStatic && 
            speed < CONFIG.game.microMovementThreshold) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.angularVelocity = 0;
            this.stopVibration();
            return;
        }
        
        // 不自然な持続的微動の検出（転がり以外）
        if (isNearGround && !this.isStatic && !this.isRolling) {
            // 連続的な微小振動の累積チェック
            if (positionDelta < CONFIG.game.microMovementThreshold * 0.5) {
                this.stabilityFrames = (this.stabilityFrames || 0) + 1;
                
                if (this.stabilityFrames >= 20) { // 閾値を上げる
                    this.stopVibration();
                    return;
                }
            } else {
                this.stabilityFrames = 0;
            }
        }
        
        // 振動の検出（転がり以外で）
        if (!this.isRolling && this.detectVibration()) {
            this.stabilityFrames = (this.stabilityFrames || 0) + 1;
            if (this.stabilityFrames >= 30) { // より多くのフレームを要求
                this.stopVibration();
            }
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
        // 感情タイマーがある場合は優先
        if (this.emotionTimer > 0) {
            this.emotionTimer--;
            return; // 現在の感情を維持
        }
        
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const angularSpeed = Math.abs(this.angularVelocity);
        
        // 速度と回転速度の両方を考慮した感情
        if (speed > 4 || angularSpeed > 0.2) {
            this.emotion = 'excited';
        } else if (speed > 1.5 || angularSpeed > 0.1) {
            this.emotion = 'happy';
        } else if (this.isRolling && this.rollIntensity > 0.3) {
            this.emotion = 'happy'; // 転がり中は楽しそう
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