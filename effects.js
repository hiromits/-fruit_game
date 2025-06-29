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
    
    addContactEffect(x, y) {
        // 接触時の小さなエフェクト
        this.effects.push({
            x, y, type: 'contact',
            timer: 0,
            duration: 15,
            particles: [
                {
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 15,
                    size: Math.random() * 2 + 1
                },
                {
                    x: x + (Math.random() - 0.5) * 10,
                    y: y + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 15,
                    size: Math.random() * 2 + 1
                }
            ]
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
            } else if (effect.type === 'contact') {
                effect.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vx *= 0.95;
                    particle.vy *= 0.95;
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
            } else if (effect.type === 'contact') {
                // 接触エフェクトの描画
                effect.particles.forEach(particle => {
                    ctx.save();
                    ctx.globalAlpha = particle.life / 15;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }
        });
    }
}