// Gator easter egg — walks across edu cards
(function() {
    const grid = document.getElementById('edu-grid-wrap');
    if (!grid) return;
    const canvas = document.getElementById('gator-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let cW;

    function resizeCanvas() {
        const rect = grid.getBoundingClientRect();
        cW = rect.width;
        canvas.width = cW * dpr;
        canvas.height = 50 * dpr;
        canvas.style.width = cW + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    addEventListener('resize', resizeCanvas);

    function getCardPositions() {
        const cards = grid.querySelectorAll('.edu-card');
        const gridRect = grid.getBoundingClientRect();
        return Array.from(cards).map(c => {
            const r = c.getBoundingClientRect();
            return { left: r.left - gridRect.left, right: r.right - gridRect.left, width: r.width };
        });
    }

    const g = {
        x: 0, y: 38,
        dir: -1,
        speed: 0.35,
        state: 'walk',
        legPhase: 0, tailPhase: 0,
        jumpT: 0, jumpStartX: 0, jumpEndX: 0,
        startedOnRight: true,
        turnTimer: 0,
        crouchTimer: 0,
        crouchAmount: 0,
    };

    function drawGator(x, y, dir, legP, tailP, crouch) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(dir, 1);

        const squash = crouch || 0; // 0-1, how crouched

        // Tail — muscular S-curve, wags more when crouching
        const tailSpeed = squash > 0 ? 3 : 1;
        const tw1 = Math.sin(tailP * tailSpeed) * (1.5 + squash * 3);
        const tw2 = Math.sin(tailP * tailSpeed + 1) * (2 + squash * 2);
        ctx.fillStyle = '#2B5A32';
        ctx.beginPath();
        ctx.moveTo(-12, -2.5 + squash);
        ctx.quadraticCurveTo(-20, -2.5 + tw1 + squash, -28, -1 + tw2);
        ctx.quadraticCurveTo(-30, tw2 + 1, -28, 1.5 + tw2);
        ctx.quadraticCurveTo(-20, 3 + tw1 + squash, -12, 3 + squash);
        ctx.closePath();
        ctx.fill();

        // Tail ridges — interpolate along the tail curve
        ctx.fillStyle = '#1E4225';
        for (let i = 0; i < 4; i++) {
            const t = 0.15 + i * 0.22; // 0-1 along tail
            // Lerp the quadratic curve: base(-12) -> mid(-20,tw1) -> tip(-28,tw2)
            const bx = -12, by = -2.5 + squash;
            const mx = -20, my = -2.5 + tw1 + squash;
            const ex = -28, ey = -1 + tw2;
            // Quadratic bezier at t
            const rx = (1-t)*(1-t)*bx + 2*(1-t)*t*mx + t*t*ex;
            const ry = (1-t)*(1-t)*by + 2*(1-t)*t*my + t*t*ey;
            ctx.beginPath();
            ctx.moveTo(rx, ry - 1.5);
            ctx.lineTo(rx - 0.8, ry - 0.3);
            ctx.lineTo(rx + 0.8, ry - 0.3);
            ctx.fill();
        }

        // Body — squashes down when crouching
        ctx.fillStyle = '#2B5A32';
        ctx.beginPath();
        ctx.moveTo(-12, -3.5 + squash * 1.5);
        ctx.bezierCurveTo(-8, -5.5 + squash * 2, 4, -5.5 + squash * 2, 10, -3.5 + squash * 1.5);
        ctx.bezierCurveTo(11, -1.5 + squash, 11, 2.5 + squash * 0.5, 10, 3.5 + squash * 0.5);
        ctx.bezierCurveTo(4, 5 + squash * 0.5, -8, 5 + squash * 0.5, -12, 3.5 + squash * 0.5);
        ctx.closePath();
        ctx.fill();

        // Scutes
        ctx.fillStyle = '#1E4225';
        for (let i = -9; i <= 8; i += 2.5) {
            ctx.beginPath();
            ctx.moveTo(i, -5.5 + squash * 2);
            ctx.lineTo(i - 1, -4 + squash * 1.5);
            ctx.lineTo(i + 1, -4 + squash * 1.5);
            ctx.closePath();
            ctx.fill();
        }

        // Belly
        ctx.fillStyle = 'rgba(160, 190, 130, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 3 + squash * 0.5, 8, 1.5, 0, 0, Math.PI);
        ctx.fill();

        // Head
        ctx.fillStyle = '#2D5E35';
        ctx.beginPath();
        ctx.moveTo(10, -3.5 + squash);
        ctx.bezierCurveTo(13, -5 + squash, 18, -4.5 + squash * 0.5, 24, -3.5 + squash * 0.5);
        ctx.bezierCurveTo(26, -3 + squash * 0.5, 26, -0.5 + squash * 0.5, 25, 0.5 + squash * 0.5);
        ctx.bezierCurveTo(22, 2 + squash * 0.5, 16, 2.5 + squash * 0.5, 10, 1.5 + squash * 0.5);
        ctx.closePath();
        ctx.fill();

        // Snout
        ctx.fillStyle = '#2B5A32';
        ctx.beginPath();
        ctx.moveTo(18, -4 + squash * 0.5);
        ctx.bezierCurveTo(22, -4.5 + squash * 0.3, 26, -4 + squash * 0.3, 27, -2.5 + squash * 0.5);
        ctx.bezierCurveTo(27, -1.5 + squash * 0.5, 25, -1 + squash * 0.5, 22, -1 + squash * 0.5);
        ctx.bezierCurveTo(20, -1 + squash * 0.5, 18, -1.5 + squash * 0.5, 18, -2.5 + squash * 0.5);
        ctx.closePath();
        ctx.fill();

        // Nostril
        ctx.fillStyle = '#1E4225';
        ctx.beginPath();
        ctx.arc(25.5, -3.5 + squash * 0.3, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Eye ridge
        ctx.fillStyle = '#234D28';
        ctx.beginPath();
        ctx.ellipse(17, -5 + squash * 0.5, 2, 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye — smaller
        ctx.fillStyle = '#C8A832';
        ctx.beginPath();
        ctx.arc(17, -5 + squash * 0.5, 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.ellipse(17.1, -5 + squash * 0.5, 0.3, 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouth line
        ctx.strokeStyle = '#1A3A1F';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(12, 0.5 + squash * 0.5);
        ctx.bezierCurveTo(16, 0 + squash * 0.5, 22, -0.5 + squash * 0.5, 26, -1.5 + squash * 0.5);
        ctx.stroke();

        // Teeth
        ctx.fillStyle = 'rgba(220,220,200,0.4)';
        [14, 17, 20, 23].forEach(tx => {
            ctx.beginPath();
            ctx.moveTo(tx, 0.2 + squash * 0.5);
            ctx.lineTo(tx - 0.3, 1.2 + squash * 0.5);
            ctx.lineTo(tx + 0.3, 1.2 + squash * 0.5);
            ctx.fill();
        });

        // Legs — shorter
        const l1 = Math.sin(legP) * 2.5;
        const l2 = Math.sin(legP + Math.PI) * 2.5;

        function drawLeg(baseX, lift) {
            const footX = baseX + lift * 0.4;
            const footY = 7 + squash * 0.3 - Math.abs(lift) * 0.3;

            ctx.strokeStyle = '#2B5A32';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(baseX, 3 + squash * 0.5);
            ctx.lineTo(footX, footY);
            ctx.stroke();

            // Toes + claws
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = '#1E4225';
            for (let t = -1; t <= 1; t += 1) {
                ctx.beginPath();
                ctx.moveTo(footX + t * 0.6, footY);
                ctx.lineTo(footX + t * 0.9, footY + 1.3);
                ctx.stroke();
            }
        }

        drawLeg(7, l1);
        drawLeg(5, l2);
        drawLeg(-7, l2);
        drawLeg(-9, l1);

        ctx.restore();
    }

    function update() {
        g.tailPhase += 0.05;

        if (g.state === 'walk') {
            g.legPhase += 0.07;
            g.x += g.speed * g.dir;
            g.crouchAmount *= 0.9;

            const cards = getCardPositions();
            if (cards.length < 2) return;

            // Walking left, approaching the gap — stop and crouch
            if (g.dir === -1 && g.startedOnRight && g.x < cards[1].left + 20) {
                g.state = 'crouch';
                g.crouchTimer = 0;
            }

            // Walked off left edge
            if (g.dir === -1 && !g.startedOnRight && g.x < cards[0].left - 30) {
                g.state = 'turn';
                g.turnTimer = 0;
            }

            // Walking right, reached right edge
            if (g.dir === 1 && g.x > cards[1].right + 30) {
                g.state = 'turn';
                g.turnTimer = 0;
            }

            // Walking right, approaching gap from left card
            if (g.dir === 1 && !g.startedOnRight && g.x > cards[0].right - 20) {
                g.state = 'crouch';
                g.crouchTimer = 0;
            }

        } else if (g.state === 'crouch') {
            // Immediately start backing up while crouching and wagging
            g.state = 'backup';
            g.backupTimer = 0;
            g.backupStartX = g.x;

        } else if (g.state === 'backup') {
            g.backupTimer++;
            g.legPhase += 0.05;
            g.crouchAmount = Math.min(g.backupTimer / 30, 1) * 1;

            // Back up in opposite direction of travel
            const backDist = 25;
            const t = Math.min(g.backupTimer / 30, 1);
            g.x = g.backupStartX + (-g.dir) * backDist * t;

            if (g.backupTimer > 45) {
                // Now charge forward and jump
                g.state = 'runup';
                g.runupTimer = 0;
                g.runupStartX = g.x;
            }

        } else if (g.state === 'runup') {
            g.runupTimer++;
            g.legPhase += 0.15; // fast legs
            g.crouchAmount *= 0.9;

            // Run forward fast
            g.x += g.dir * 1.5;

            // Once past the original crouch point, launch
            if (g.runupTimer > 20) {
                g.state = 'jump';
                g.jumpT = 0;
                g.jumpStartX = g.x;

                const cards = getCardPositions();
                if (g.dir === -1 && g.startedOnRight) {
                    g.jumpEndX = cards[0].right - 20;
                } else if (g.dir === 1 && !g.startedOnRight) {
                    g.jumpEndX = cards[1].left + 20;
                }
                g.startedOnRight = !g.startedOnRight;
            }

        } else if (g.state === 'jump') {
            g.jumpT += 0.035;
            g.legPhase += 0.2;
            g.crouchAmount *= 0.9;

            const t = Math.min(g.jumpT, 1);
            g.x = g.jumpStartX + (g.jumpEndX - g.jumpStartX) * t;
            g.y = 38 - Math.sin(t * Math.PI) * 24;

            if (g.jumpT >= 1) {
                g.y = 38;
                g.crouchAmount = 0;
                g.state = 'walk';
            }

        } else if (g.state === 'turn') {
            g.turnTimer++;
            g.legPhase += 0.01;
            g.crouchAmount *= 0.9;
            if (g.turnTimer > 40) {
                g.dir *= -1;
                g.state = 'walk';
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, cW, 50);
        drawGator(g.x, g.y, g.dir, g.legPhase, g.tailPhase, g.crouchAmount);
    }

    function initPosition() {
        const cards = getCardPositions();
        if (cards.length >= 2) {
            g.x = cards[1].right - 10;
            g.startedOnRight = true;
        }
    }

    let isVisible = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isVisible) {
            isVisible = true;
            initPosition();
        }
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(grid);

    function loop() {
        if (isVisible) { update(); render(); }
        requestAnimationFrame(loop);
    }
    loop();
})();
