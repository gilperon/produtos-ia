/**
 * Animações de Scroll - Reveal on Scroll
 * Detecta elementos com opacity:0 inline e aplica fade-in quando entram na viewport
 */
(function() {
    'use strict';

    // Configuração
    const config = {
        // Porcentagem do elemento visível para disparar (0 = qualquer parte)
        threshold: 0.05,
        // Margem para começar a animar antes do elemento aparecer
        rootMargin: '0px 0px 100px 0px',
        // Duração da animação em ms
        duration: 600,
        // Delay base entre elementos (stagger effect)
        staggerDelay: 80
    };

    // Estilos CSS para animação
    const styles = document.createElement('style');
    styles.textContent = `
        /* Estado inicial - elementos que serão animados */
        .csx-scroll-animate {
            transition: opacity ${config.duration}ms ease-out, transform ${config.duration}ms ease-out !important;
        }
        
        /* Estado visível */
        .csx-scroll-visible {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(styles);

    // Função para inicializar as animações
    function initScrollAnimations() {
        // Encontra TODOS os elementos com opacity no style inline
        const allElements = document.querySelectorAll('*');
        const animatedElements = [];
        
        allElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style && style.includes('opacity')) {
                // Verifica se tem opacity: 0 ou opacity: 1
                if (style.includes('opacity: 0') || style.includes('opacity:0')) {
                    animatedElements.push(el);
                    el.classList.add('csx-scroll-animate');
                } else if (style.includes('opacity: 1') && style.includes('transform: none')) {
                    // Elementos que já estavam como "animados" no original
                    // Remove o style e adiciona classe
                    el.style.opacity = '';
                    el.style.transform = '';
                    el.classList.add('csx-scroll-animate');
                    // Começa invisível para animar
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    animatedElements.push(el);
                }
            }
        });

        console.log(`Found ${animatedElements.length} elements to animate`);

        // Cria o observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona classe para tornar visível
                    entry.target.classList.add('csx-scroll-visible');
                    // Para de observar após animar
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: config.rootMargin
        });

        // Aplica delay escalonado para elementos em grupo
        const groupedElements = new Map();
        
        animatedElements.forEach(el => {
            const parent = el.parentElement;
            if (parent) {
                if (!groupedElements.has(parent)) {
                    groupedElements.set(parent, []);
                }
                groupedElements.get(parent).push(el);
            }
        });

        groupedElements.forEach((children, parent) => {
            children.forEach((child, index) => {
                if (index > 0) {
                    child.style.transitionDelay = `${index * config.staggerDelay}ms`;
                }
            });
        });

        // Observa todos os elementos
        animatedElements.forEach(el => observer.observe(el));

        // Verifica elementos já visíveis na tela (acima da dobra)
        requestAnimationFrame(() => {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    el.classList.add('csx-scroll-visible');
                    observer.unobserve(el);
                }
            });
        });

        console.log(`✓ Scroll animations initialized for ${animatedElements.length} elements`);
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();
