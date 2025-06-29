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
        this.animationTimer = 0; // ゲーム全体のタイマー
        
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
        
        // 厳格な境界制約（投下時と同じマージン）
        const safeMargin = 8;
        const minX = this.nextFruit.radius + safeMargin;
        const maxX = CONFIG.canvas.width - this.nextFruit.radius - safeMargin;
        
        this.nextFruit.x = Math.max(minX, Math.min(maxX, x));
    }
    
    dropFruit() {
        if (!this.nextFruit || this.gameOver || this.isPaused) return;
        
        // 投下時の厳格な境界制約
        const safeMargin = 8; // より大きなマージン
        const minX = this.nextFruit.radius + safeMargin;
        const maxX = CONFIG.canvas.width - this.nextFruit.radius - safeMargin;
        
        // X座標を安全範囲内に強制
        this.nextFruit.x = Math.max(minX, Math.min(maxX, this.nextFruit.x));
        this.nextFruit.y = this.nextFruit.radius + 10;
        
        // 投下時の初期速度を制限
        this.nextFruit.velocity.x = 0;
        this.nextFruit.velocity.y = 0;
        this.nextFruit.angularVelocity = 0;
        
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
            let hadMerge = false;
            
            for (let i = 0; i < this.fruits.length; i++) {
                for (let j = i + 1; j < this.fruits.length; j++) {
                    const fruit1 = this.fruits[i];
                    const fruit2 = this.fruits[j];
                    
                    const dx = fruit2.x - fruit1.x;
                    const dy = fruit2.y - fruit1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // より精密な接触判定（わずかな重なりでも検出）
                    const collisionBuffer = 0.5; // 接触判定バッファ
                    const minDistance = fruit1.radius + fruit2.radius + collisionBuffer;
                    
                    if (distance <= minDistance) {
                        // マージ可能かチェック
                        if (fruit1.canMergeWith(fruit2)) {
                            this.mergeFruits(fruit1, fruit2);
                            hadMerge = true;
                            break; // マージしたらループを抜ける
                        } else {
                            // 衝突処理（エネルギーベース）
                            if (EnergyPhysicsEngine.resolveCollision(fruit1, fruit2)) {
                                hadCollision = true;
                                
                                // 接触反応（感情変化）
                                this.handleContactReaction(fruit1, fruit2);
                                
                                // 接触エフェクト（クールダウン制御）
                                this.addContactEffectWithCooldown(fruit1, fruit2);
                            }
                        }
                    }
                }
                if (hadMerge) break; // マージした場合は外側のループも抜ける
            }
            
            if (hadMerge) break; // マージした場合は反復も終了
            if (!hadCollision) break;
        }
    }
    
    handleContactReaction(fruit1, fruit2) {
        const currentTime = this.animationTimer || 0;
        
        // 接触時の感情反応
        const speed1 = Math.sqrt(fruit1.velocity.x ** 2 + fruit1.velocity.y ** 2);
        const speed2 = Math.sqrt(fruit2.velocity.x ** 2 + fruit2.velocity.y ** 2);
        
        // 高速衝突の場合は驚く
        if (speed1 > 2 || speed2 > 2) {
            fruit1.emotion = 'excited';
            fruit2.emotion = 'excited';
            fruit1.emotionTimer = 60; // 60フレーム感情を保持
            fruit2.emotionTimer = 60;
        } else {
            // 軽い接触は嬉しい反応
            fruit1.emotion = 'happy';
            fruit2.emotion = 'happy';
            fruit1.emotionTimer = 30;
            fruit2.emotionTimer = 30;
        }
        
        // 接触時間を記録
        fruit1.lastContactTime = currentTime;
        fruit2.lastContactTime = currentTime;
        
        // 活動時間をリセット（接触で新たな動きが始まる）
        fruit1.activeTime = 0;
        fruit2.activeTime = 0;
        
        // 静止状態を解除
        fruit1.isStatic = false;
        fruit2.isStatic = false;
        fruit1.isForceStatic = false;
        fruit2.isForceStatic = false;
        fruit1.staticFrames = 0;
        fruit2.staticFrames = 0;
    }
    
    addContactEffectWithCooldown(fruit1, fruit2) {
        const currentTime = this.animationTimer;
        const timeSinceLastContact1 = currentTime - (fruit1.lastContactTime || 0);
        const timeSinceLastContact2 = currentTime - (fruit2.lastContactTime || 0);
        
        // 両方の果物がクールダウン期間を超えている場合のみエフェクト表示
        if (timeSinceLastContact1 >= CONFIG.game.contactEffectCooldown && 
            timeSinceLastContact2 >= CONFIG.game.contactEffectCooldown) {
            
            const contactX = (fruit1.x + fruit2.x) / 2;
            const contactY = (fruit1.y + fruit2.y) / 2;
            this.effects.addContactEffect(contactX, contactY);
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
        this.animationTimer = 0; // タイマーもリセット
        
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
            // ゲームタイマー更新
            this.animationTimer++;
            
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