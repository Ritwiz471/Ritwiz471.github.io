// Simple Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Get stored theme or default to light
        const stored = localStorage.getItem('theme');
        if (stored) {
            this.currentTheme = stored;
        }
        
        this.applyTheme();
        this.setupToggle();
    }

    applyTheme() {
        // Remove all theme classes
        document.body.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        
        // Add current theme class
        document.body.classList.add(this.currentTheme + '-theme');
        document.documentElement.classList.add(this.currentTheme + '-theme');
        
        // Update toggle button
        this.updateToggleIcon();
        
        console.log('Applied theme:', this.currentTheme);
    }

    updateToggleIcon() {
        if (!this.themeToggle) return;
        
        const sunIcon = this.themeToggle.querySelector('.sun-icon');
        const moonIcon = this.themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        } else {
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        
        // Animation
        this.themeToggle.style.transform = 'rotate(360deg) scale(0.8)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    }

    setupToggle() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

// Counter Animation for Stats
class CounterAnimation {
    constructor() {
        // No stats section anymore, so this class is empty
    }
}

// Proficiency Bar Animation
class ProficiencyAnimation {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.proficiency-fill');
                    const level = fill.dataset.level;
                    setTimeout(() => {
                        fill.style.width = `${level}%`;
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    }
}

// Interactive Project Cards
class ProjectInteraction {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.project-card').forEach(card => {
            this.addCardInteractions(card);
        });
    }

    addCardInteractions(card) {
        const actionBtn = card.querySelector('.action-btn');
        
        if (actionBtn) {
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showProjectDetails(card);
            });
        }

        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }

    showProjectDetails(card) {
        const projectName = card.dataset.project;
        
        // Create modal-like overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: var(--bg-card);
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            margin: 2rem;
            box-shadow: var(--shadow-hover);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        const projectDetails = this.getProjectDetails(projectName);
        modal.innerHTML = `
            <h3 style="color: var(--text-primary); margin-bottom: 1rem;">${projectDetails.title}</h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${projectDetails.description}</p>
            <div style="display: flex; gap: 1rem;">
                <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                        style="flex: 1; padding: 0.8rem; background: var(--gradient); color: white; border: none; border-radius: 25px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animate in
        setTimeout(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    getProjectDetails(projectName) {
        const details = {
            'math-reasoning': {
                title: 'Mathematical Reasoning with Enhanced Attention',
                description: 'This project focuses on modifying the attention mechanism in transformer models to better handle mathematical reasoning tasks. By scaling attention weights for operators and numbers, we achieved a 4x improvement in pass@1 scores. The approach is inference-only, making it practical for real-world deployment without requiring model retraining.'
            },
            'waybuddy': {
                title: 'WayBuddy: AI-Powered Navigation for Accessibility',
                description: 'WayBuddy is an iOS application designed to help visually-impaired users navigate indoor spaces. Using Apple CoreML and Vision frameworks, combined with SLAM reconstruction, the app creates a detailed map of the environment and provides step-by-step audio guidance. The system uses crowdsourced data and anchor points for accurate positioning.'
            },
            'chunked-rag': {
                title: 'ChunkedCodeRAG: Semantic Code Retrieval',
                description: 'This project enhanced the CodeRAG-Bench by introducing both fixed-size and semantic pre-retrieval chunking strategies. The semantic chunking approach analyzes code structure and meaning to create more meaningful chunks, resulting in a 31% improvement on the ODEX open-domain coding tasks dataset.'
            }
        };
        return details[projectName] || { title: 'Project Details', description: 'More details coming soon!' };
    }
}

// Skills Radar Chart
class SkillsChart {
    constructor() {
        this.canvas = document.getElementById('skillsChart');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.drawChart();
                    observer.unobserve(entry.target);
                }
            });
        });

        if (this.canvas) {
            observer.observe(this.canvas);
        }
    }

    drawChart() {
        const skills = [
            { name: 'AI/ML', value: 95 },
            { name: 'Computer Vision', value: 85 },
            { name: 'Cloud & DevOps', value: 80 },
            { name: 'Programming', value: 90 },
            { name: 'Research', value: 88 }
        ];

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 100;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background circles
        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
            this.ctx.strokeStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--border-color');
            this.ctx.stroke();
        }

        // Draw skill lines and fill
        this.ctx.beginPath();
        skills.forEach((skill, index) => {
            const angle = (2 * Math.PI * index) / skills.length - Math.PI / 2;
            const skillRadius = (skill.value / 100) * radius;
            const x = centerX + Math.cos(angle) * skillRadius;
            const y = centerY + Math.sin(angle) * skillRadius;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            // Draw skill labels
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            
            this.ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-primary');
            this.ctx.font = '12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(skill.name, labelX, labelY);
        });

        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#3498db';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw skill points
        skills.forEach((skill, index) => {
            const angle = (2 * Math.PI * index) / skills.length - Math.PI / 2;
            const skillRadius = (skill.value / 100) * radius;
            const x = centerX + Math.cos(angle) * skillRadius;
            const y = centerY + Math.sin(angle) * skillRadius;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#3498db';
            this.ctx.fill();
        });
    }
}

// Particle System Enhancement
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        // Add click-to-create particles
        document.addEventListener('click', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            animation: particleBurst 0.8s ease-out forwards;
        `;

        // Add CSS animation keyframes if not already added
        if (!document.querySelector('#particleAnimations')) {
            const style = document.createElement('style');
            style.id = 'particleAnimations';
            style.textContent = `
                @keyframes particleBurst {
                    0% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0) translateY(-50px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

// Smooth Scrolling and Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to any future internal links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Enhanced UI Interactions
class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addKeyboardNavigation();
        this.addCursorEffects();
        this.initializeProgressiveLoading();
    }

    addHoverEffects() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.contact-link, .project-card, .skill-tag, .experience-item, .research-item'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });

        // Add ripple effect to buttons
        document.querySelectorAll('.action-btn, .cta-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRipple(e, btn);
            });
        });
    }

    createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#rippleAnimation')) {
            const style = document.createElement('style');
            style.id = 'rippleAnimation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addKeyboardNavigation() {
        // Enhanced keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid var(--accent-primary)';
                el.style.outlineOffset = '3px';
                el.style.borderRadius = '5px';
            });

            el.addEventListener('blur', () => {
                el.style.outline = 'none';
                el.style.outlineOffset = 'initial';
            });
        });
    }

    addCursorEffects() {
        // Custom cursor for interactive elements
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '0.8';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Enlarge cursor on hover over interactive elements
        document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    initializeProgressiveLoading() {
        // Add loading states and progressive enhancement
        document.body.classList.add('loaded');
        
        // Add a subtle fade-in effect to the entire page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease';
        
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            this.triggerEntryAnimations();
        });
    }

    triggerEntryAnimations() {
        // Trigger staggered animations for header elements
        const headerElements = document.querySelectorAll('.profile-section, .stats-container');
        headerElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
}

// Performance Analytics
class Analytics {
    constructor() {
        this.startTime = performance.now();
        this.interactions = 0;
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackScrollDepth();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`🚀 Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Track performance metrics
            if ('PerformanceObserver' in window) {
                this.observePerformance();
            }
        });
    }

    trackUserInteractions() {
        // Track theme toggle usage
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            console.log('🌓 Theme toggled');
            this.interactions++;
        });

        // Track project interactions
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                console.log(`📊 Project ${index + 1} viewed`);
                this.interactions++;
            });
        });

        // Track section visibility for engagement
        const sections = document.querySelectorAll('.section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.querySelector('.section-title')?.textContent;
                    console.log(`👁️ Section viewed: ${sectionName}`);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    console.log(`📜 Scroll depth: ${maxScroll}%`);
                }
            }
        });
    }

    observePerformance() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log(`⚡ Navigation timing: ${entry.duration.toFixed(2)}ms`);
                } else if (entry.entryType === 'largest-contentful-paint') {
                    console.log(`🎨 LCP: ${entry.startTime.toFixed(2)}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
    }
}

// Easter Egg - Enhanced Konami Code
class EasterEgg {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.join(',') === this.konamiCode.join(',')) {
                this.activateEasterEgg();
                this.userInput = [];
            }
        });
    }

    activateEasterEgg() {
        // Enhanced easter egg with multiple effects
        this.matrixEffect();
        this.projectCardDance();
        this.showMessage();
    }

    matrixEffect() {
        // Create matrix-like falling code effect
        const matrix = document.createElement('div');
        matrix.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 9998;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: monospace;
            font-size: 14px;
            overflow: hidden;
        `;

        for (let i = 0; i < 50; i++) {
            const column = document.createElement('div');
            column.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                animation: matrixFall ${2 + Math.random() * 3}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            column.textContent = Math.random().toString(36).substring(2, 15);
            matrix.appendChild(column);
        }

        // Add matrix animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes matrixFall {
                0% { transform: translateY(-100vh); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(matrix);
        
        setTimeout(() => {
            matrix.remove();
            style.remove();
        }, 8000);
    }

    projectCardDance() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'cardDance 2s ease-in-out';
                
                // Add dance animation
                if (!document.querySelector('#danceAnimation')) {
                    const style = document.createElement('style');
                    style.id = 'danceAnimation';
                    style.textContent = `
                        @keyframes cardDance {
                            0%, 100% { transform: translateY(0) rotate(0deg); }
                            25% { transform: translateY(-20px) rotate(5deg); }
                            50% { transform: translateY(0) rotate(0deg); }
                            75% { transform: translateY(-10px) rotate(-5deg); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                setTimeout(() => {
                    card.style.animation = '';
                }, 2000);
            }, index * 300);
        });
    }

    showMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <h3 style="margin-bottom: 1rem; color: white;">Welcome to the Matrix!</h3>
                <p style="margin-bottom: 1.5rem; opacity: 0.9;">You've unlocked the secret developer mode!</p>
                <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">🤖 AI Enthusiast</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">🧠 ML Researcher</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">💻 Code Wizard</span>
                </div>
            </div>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: var(--shadow-hover);
            animation: messageAppear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            text-align: center;
            min-width: 300px;
        `;

        // Add message animation
        if (!document.querySelector('#messageAnimation')) {
            const style = document.createElement('style');
            style.id = 'messageAnimation';
            style.textContent = `
                @keyframes messageAppear {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(180deg);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => message.remove(), 500);
        }, 5000);
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addScreenReaderSupport();
        this.handleReducedMotion();
        this.addSkipLinks();
        this.setupFocusManagement();
    }

    addScreenReaderSupport() {
        // Add aria-labels and roles where needed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle between light and dark theme');
            themeToggle.setAttribute('role', 'button');
        }

        // Add semantic roles to sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.setAttribute('role', 'region');
            const title = section.querySelector('.section-title');
            if (title) {
                const id = title.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                title.id = id;
                section.setAttribute('aria-labelledby', id);
            }
        });

        // Add alt text to dynamic content
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.setAttribute('aria-label', `Project ${index + 1}: ${card.querySelector('.project-title').textContent}`);
        });
    }

    handleReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            
            // Disable all animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addSkipLinks() {
        // Add skip navigation for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 100000;
            transition: top 0.3s;
            font-weight: bold;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const main = document.querySelector('.main');
        if (main) {
            main.id = 'main';
        }
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('[style*="position: fixed"][style*="z-index: 10000"]');
                if (modal) {
                    modal.remove();
                }
            }
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Rithvik\'s Portfolio...');
    
    // Core functionality
    const themeManager = new ThemeManager();
    new CounterAnimation();
    new ProficiencyAnimation();
    new ProjectInteraction();
    new SkillsChart();
    new SmoothScroll();
    new UIEnhancements();
    new AccessibilityManager();
    
    // Fun enhancements
    new ParticleSystem();
    new Analytics();
    new EasterEgg();
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards and items that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.education-item, .experience-item, .research-item, .project-card, .skill-category, .contact-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Add a completion indicator
    setTimeout(() => {
        document.body.classList.add('fully-loaded');
        console.log('✨ Portfolio fully loaded and interactive!');
    }, 1000);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 Thanks for visiting!');
    } else {
        console.log('🎉 Welcome back!');
    }
});

// Add some fun console messages
console.log(`
🚀 Welcome to Rithvik's Interactive Portfolio!
🎯 Built with HTML, CSS, and JavaScript
🌟 Try the Konami Code: ↑↑↓↓←→←→BA
🎨 Click anywhere to create particles!
🔧 Check out the source code on GitHub
`);

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`📊 Navigation timing: ${entry.duration.toFixed(2)}ms`);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
        this.initializeAnimations();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.setStoredTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard accessibility
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    initializeAnimations() {
        // Stagger animations for sections
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });

        // Initialize intersection observer for scroll animations
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and items that should animate on scroll
        const animatedElements = document.querySelectorAll(
            '.education-item, .experience-item, .research-item, .project-card, .skill-category'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Smooth Scrolling for Internal Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to any future internal links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Performance and User Experience Enhancements
class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addKeyboardNavigation();
        this.initializeProgressiveLoading();
    }

    addHoverEffects() {
        // Add subtle hover effects to interactive elements
        const interactiveElements = document.querySelectorAll(
            '.contact-link, .project-card, .skill-tag'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'all 0.3s ease';
            });
        });
    }

    addKeyboardNavigation() {
        // Enhance keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid var(--accent-primary)';
                el.style.outlineOffset = '2px';
            });

            el.addEventListener('blur', () => {
                el.style.outline = 'none';
            });
        });
    }

    initializeProgressiveLoading() {
        // Add loading states and progressive enhancement
        document.body.classList.add('loaded');
        
        // Add a subtle fade-in effect to the entire page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Analytics and Performance Tracking (Privacy-Friendly)
class Analytics {
    constructor() {
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
    }

    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    trackUserInteractions() {
        // Track theme toggle usage
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            console.log('Theme toggled');
        });

        // Track section visibility for engagement
        const sections = document.querySelectorAll('.section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.querySelector('.section-title')?.textContent;
                    console.log(`Section viewed: ${sectionName}`);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => sectionObserver.observe(section));
    }
}

// Easter Egg - Konami Code
class EasterEgg {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.join(',') === this.konamiCode.join(',')) {
                this.activateEasterEgg();
                this.userInput = [];
            }
        });
    }

    activateEasterEgg() {
        // Add a fun animation to all project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'rotateY(360deg) scale(1.1)';
                card.style.transition = 'transform 1s ease';
                
                setTimeout(() => {
                    card.style.transform = 'rotateY(0deg) scale(1)';
                }, 1000);
            }, index * 200);
        });

        // Show a fun message
        const message = document.createElement('div');
        message.textContent = '🎉 You found the easter egg! Welcome to the matrix of ML! 🤖';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: var(--shadow-hover);
            animation: fadeInUp 0.5s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) translateY(-20px)';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }
}

// Responsive Image Loading (for future use)
class ResponsiveImages {
    constructor() {
        this.init();
    }

    init() {
        // Placeholder for future image optimization
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addScreenReaderSupport();
        this.handleReducedMotion();
        this.addSkipLinks();
    }

    addScreenReaderSupport() {
        // Add aria-labels and roles where needed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Toggle between light and dark theme');
            themeToggle.setAttribute('role', 'button');
        }

        // Add semantic roles to sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.setAttribute('role', 'region');
            const title = section.querySelector('.section-title');
            if (title) {
                const id = title.textContent.toLowerCase().replace(/\s+/g, '-');
                title.id = id;
                section.setAttribute('aria-labelledby', id);
            }
        });
    }

    handleReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            
            // Disable all animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    addSkipLinks() {
        // Add skip navigation for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 100000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const main = document.querySelector('.main');
        if (main) {
            main.id = 'main';
        }
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new ThemeManager();
    new SmoothScroll();
    new UIEnhancements();
    new AccessibilityManager();
    
    // Optional enhancements
    new ResponsiveImages();
    new Analytics();
    new EasterEgg();
    
    // Add a subtle loading completion indicator
    setTimeout(() => {
        document.body.classList.add('fully-loaded');
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log(`Navigation timing: ${entry.duration.toFixed(2)}ms`);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}