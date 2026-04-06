        // Matrix rain loading screen
        (function() {
            const canvas = document.getElementById('loading-canvas');
            const ctx = canvas.getContext('2d');
            let W, H;
            function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
            resize();
            addEventListener('resize', resize);

            const fs = 14;
            const words = [
                'JUSTIN','STRIKOWSKI','SOFTWARE','DEVELOPER',
                'PYTHON','REACT','ACQUIOS','BRANDRADAR','PLATO',
                'MYSQL','MONGODB','TENSORFLOW','BIOINFORMATICS',
                'JAVASCRIPT','TYPESCRIPT','DOCKER','AWS','ANGULAR',
                'NODE','API','GIT','AI','ML','FLORIDA','GATORS',
                'ACM','KYNDRYL','FULLSTACK','CMS','RESEARCH',
                'DATA','CLOUD','DEPLOY','BUILD','QUERY','SCHEMA',
            ];
            const numCols = Math.floor(innerWidth / fs);
            const cols = [];
            for (let i = 0; i < numCols; i++) {
                const col = { x: i * fs, chars: [], speed: 1 + Math.random() * 1.5, queue: [], gap: 0, timer: 0 };
                // Pre-fill screen with characters and occasional words
                let y = Math.random() * fs;
                while (y < H + 50) {
                    if (Math.random() < 0.02) {
                        const w = words[Math.floor(Math.random() * words.length)];
                        for (const c of w) {
                            col.chars.push({ ch: c, y: y, age: Math.floor(Math.random() * 60), isWord: true });
                            y += fs;
                        }
                        y += fs * (Math.floor(Math.random() * 5) + 3);
                    } else {
                        col.chars.push({
                            ch: Math.random() > 0.5 ? '1' : '0',
                            y: y,
                            age: Math.floor(Math.random() * 80),
                            isWord: false,
                        });
                        y += fs;
                    }
                }
                cols.push(col);
            }
            function fillQ(col) {
                if (Math.random() < 0.12) {
                    const w = words[Math.floor(Math.random() * words.length)];
                    const pad = Math.floor(Math.random() * 4) + 1;
                    for (let i = 0; i < pad; i++) col.queue.push({ ch: Math.random() > 0.5 ? '1' : '0', isWord: false });
                    for (const c of w) col.queue.push({ ch: c, isWord: true });
                    const trail = Math.floor(Math.random() * 6) + 2;
                    for (let i = 0; i < trail; i++) col.queue.push({ ch: Math.random() > 0.5 ? '1' : '0', isWord: false });
                    col.gap = Math.floor(Math.random() * 10) + 3;
                } else {
                    const len = Math.floor(Math.random() * 10) + 3;
                    for (let i = 0; i < len; i++) col.queue.push({ ch: Math.random() > 0.5 ? '1' : '0', isWord: false });
                    col.gap = Math.floor(Math.random() * 15) + 5;
                }
            }
            let running = true;
            function draw() {
                if (!running) return;
                ctx.fillStyle = 'rgba(10, 15, 13, 0.55)';
                ctx.fillRect(0, 0, W, H);
                ctx.font = fs + 'px JetBrains Mono, monospace';
                for (const col of cols) {
                    for (let i = col.chars.length - 1; i >= 0; i--) {
                        col.chars[i].y -= col.speed;
                        col.chars[i].age++;
                        if (col.chars[i].y < -20) col.chars.splice(i, 1);
                    }
                    col.timer--;
                    if (col.timer <= 0) {
                        if (col.gap > 0) { col.gap--; col.timer = 1; }
                        else if (col.queue.length > 0) {
                            const next = col.queue.shift();
                            col.chars.push({ ...next, y: H + 10, age: 0 });
                            col.timer = fs / col.speed;
                        } else { fillQ(col); col.timer = 1; }
                    }
                    for (const c of col.chars) {
                        if (!c.isWord && Math.random() < 0.25) c.ch = Math.random() > 0.5 ? '1' : '0';
                    }
                    for (const c of col.chars) {
                        const fade = 1;
                        const isNew = c.age < 3;
                        if (c.isWord) {
                            ctx.fillStyle = isNew ? `rgba(220,245,210,${fade})` : `rgba(150,195,145,${fade*0.8})`;
                        } else {
                            ctx.fillStyle = isNew ? `rgba(170,205,165,${fade*0.7})` : `rgba(120,160,120,${fade*0.45})`;
                        }
                        ctx.fillText(c.ch, col.x, c.y);
                    }
                }
                requestAnimationFrame(draw);
            }
            draw();

            function dismissLoading() {
                if (!running) return;
                const screen = document.getElementById('loading-screen');
                const wrapper = document.getElementById('site-wrapper');

                // Speed up rain dramatically for the resolve effect
                for (const col of cols) {
                    col.speed *= 3;
                }

                // After a beat, start fading loading and showing site
                setTimeout(() => {
                    screen.classList.add('done');
                    wrapper.classList.add('visible');
                    setTimeout(() => {
                        running = false;
                        screen.style.display = 'none';
                    }, 800);
                }, 400);
            }

            document.addEventListener('click', dismissLoading);
            document.addEventListener('keydown', (e) => {
                if (running) {
                    e.preventDefault();
                    dismissLoading();
                }
            });
        })();

        // Particle network
        (function() {
            const canvas = document.getElementById('particles-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const COUNT = 60, DIST = 150;
            let mouse = { x: null, y: null };

            function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
            resize();
            addEventListener('resize', resize);
            document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

            class P {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.4;
                    this.vy = (Math.random() - 0.5) * 0.4;
                    this.r = Math.random() * 1.5 + 0.5;
                }
                update() {
                    this.x += this.vx; this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(124, 144, 130, 0.4)';
                    ctx.fill();
                }
            }
            for (let i = 0; i < COUNT; i++) particles.push(new P());

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                        const d = Math.sqrt(dx*dx + dy*dy);
                        if (d < DIST) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(124,144,130,${0.08*(1-d/DIST)})`;
                            ctx.stroke();
                        }
                    }
                    if (mouse.x !== null) {
                        const dx = particles[i].x - mouse.x, dy = particles[i].y - mouse.y;
                        const d = Math.sqrt(dx*dx + dy*dy);
                        if (d < 200) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.strokeStyle = `rgba(163,184,160,${0.12*(1-d/200)})`;
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(animate);
            }
            animate();
        })();

        // GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Hero
        const tl = gsap.timeline({ delay: 0.3 });
        tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
          .to('.hero-name', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
          .to('.hero-desc', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .to('.hero-links', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .to('.hero-headshot', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.8');

        // Reveals
        gsap.utils.toArray('.reveal').forEach(el => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        });

        // Cards
        gsap.utils.toArray('.project-card, .edu-card, .skill-group, .pub-card').forEach((el, i) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: el, start: 'top 88%' } });
        });

        // Timeline
        gsap.utils.toArray('.timeline-item').forEach((el, i) => {
            gsap.to(el, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.12, scrollTrigger: { trigger: el, start: 'top 85%' } });
        });

        // Contact
        gsap.utils.toArray('.contact-card').forEach((el, i) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: el, start: 'top 90%' } });
        });

        // Nav
        addEventListener('scroll', () => document.querySelector('nav').classList.toggle('scrolled', scrollY > 50));
        document.querySelector('.mobile-toggle').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));

