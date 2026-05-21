// Header Compartido / Navegación Dinámica Universal para Constructora ByB
(function() {
    // Determinar dinámicamente el path base según la ubicación del script actual
    const scripts = document.getElementsByTagName('script');
    let basePath = './';
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('components/header.js')) {
            const parts = src.split('components/header.js');
            if (parts.length > 0 && parts[0] !== '') {
                basePath = parts[0];
            }
            break;
        }
    }

    // Restaurar preferencia de tema oscuro/claro inmediatamente para evitar destellos
    const htmlRoot = document.documentElement;
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlRoot.classList.add('dark');
        htmlRoot.classList.remove('light');
    }

    const renderHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return;

        // Asegurar las clases del contenedor principal
        headerContainer.className = "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/60 bg-surface-container-lowest";

        // Estructura HTML unificada con fidelidad del 100% al diseño premium y SEO original
        headerContainer.innerHTML = `
        <nav class="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-7xl mx-auto">
            <div class="flex items-center gap-3">
                <a href="${basePath}#inicio" class="flex items-center gap-2 group" aria-label="Constructora ByB">
                    <img src="${basePath}Logo%201.jpg" alt="Constructora ByB Logo" class="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                </a>
            </div>

            <!-- Navegación de Escritorio -->
            <div class="hidden md:flex items-center gap-8">
                <a class="desktop-nav-link text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-label-bold font-label-bold" href="${basePath}#inicio">Inicio</a>
                
                <!-- Menú Desplegable Servicios -->
                <div class="relative group py-2">
                    <a href="${basePath}#servicios" class="desktop-nav-link text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-label-bold font-label-bold flex items-center gap-1">
                        Servicios
                        <span class="material-symbols-outlined text-sm transition-transform duration-200 group-hover:rotate-180">expand_more</span>
                    </a>
                    <div class="absolute top-full left-0 mt-1 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-2 z-50 flex flex-col gap-1 before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:content-['']">
                        <a href="${basePath}casas-steel-framing/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">precision_manufacturing</span>
                                Casas Steel Framing
                            </span>
                            <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                        </a>
                        <a href="${basePath}casa-moderna/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">villa</span>
                                Casas Modernas
                            </span>
                        </a>
                        <a href="${basePath}duplex/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">layers</span>
                                Dúplex Modernos
                            </span>
                        </a>
                        <a href="${basePath}casa-con-pileta/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">pool</span>
                                Casas con Pileta
                            </span>
                        </a>
                        <a href="${basePath}casa-ladrillo/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">holiday_village</span>
                                Casas de Ladrillo Visto
                            </span>
                        </a>
                        <a href="${basePath}refacciones-inmobiliarias/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">home_repair_service</span>
                                Refacciones del Hogar
                            </span>
                        </a>
                        <a href="${basePath}#servicios" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">grid_view</span>
                            Todos los Modelos
                        </a>
                        <a href="${basePath}contacto/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">calculate</span>
                            Cotizador de Proyectos
                        </a>
                    </div>
                </div>

                <a class="desktop-nav-link text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-label-bold font-label-bold" href="${basePath}credito-hipotecario/">Crédito Hipotecario</a>
                
                <!-- Menú Desplegable Blog -->
                <div class="relative group py-2">
                    <a href="#" class="desktop-nav-link text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-label-bold font-label-bold flex items-center gap-1">
                        Blog
                        <span class="material-symbols-outlined text-sm transition-transform duration-200 group-hover:rotate-180">expand_more</span>
                    </a>
                    <div class="absolute top-full left-0 mt-1 w-64 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 p-2 z-50 flex flex-col gap-1 before:absolute before:-top-6 before:left-0 before:w-full before:h-6 before:content-['']">
                        <a href="${basePath}mejores-tipos-de-techos/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">roofing</span>
                                Tipos de Techos
                            </span>
                            <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                        </a>
                        <a href="${basePath}tipos-de-suelos/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">landscape</span>
                                Tipos de Suelos
                            </span>
                            <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                        </a>
                        <a href="${basePath}calculos-de-estructura/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">engineering</span>
                                Cálculos de Estructura
                            </span>
                            <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                        </a>
                        <a href="${basePath}empieza-diseno-de-tu-casa/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center justify-between group/item">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">architecture</span>
                                Diseña tu casa
                            </span>
                            <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                        </a>
                        <a href="${basePath}contacto/" class="px-3 py-2 rounded-lg text-sm font-label-bold text-on-surface hover:bg-surface-container-low hover:text-primary dark:hover:text-inverse-primary transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">calculate</span>
                            Calculadora de Presupuestos
                        </a>
                    </div>
                </div>

                <a class="desktop-nav-link text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-label-bold font-label-bold" href="${basePath}contacto/">Contacto</a>
            </div>

            <div class="hidden md:flex items-center gap-4">
                <!-- Toggle Modo Oscuro -->
                <button id="theme-toggle" class="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 transition-colors" aria-label="Alternar modo claro y oscuro">
                    <span class="material-symbols-outlined dark:hidden">dark_mode</span>
                    <span class="material-symbols-outlined hidden dark:block text-inverse-primary">light_mode</span>
                </button>

                <a href="${basePath}contacto/" class="bg-primary text-on-primary px-5 py-2.5 font-label-bold text-label-bold rounded-DEFAULT hover:bg-primary-container transition-colors border-b-2 border-primary-container flex items-center gap-2 shadow-sm hover:shadow">
                    <span class="material-symbols-outlined text-sm">request_quote</span>
                    Presupuesto
                </a>
            </div>

            <!-- Botón Menú Móvil -->
            <div class="flex items-center gap-2 md:hidden">
                <button id="mobile-theme-toggle" class="p-2 rounded-lg text-on-surface-variant" aria-label="Alternar modo">
                    <span class="material-symbols-outlined dark:hidden">dark_mode</span>
                    <span class="material-symbols-outlined hidden dark:block text-inverse-primary">light_mode</span>
                </button>
                <button id="mobile-menu-btn" class="p-2 text-on-surface" aria-label="Abrir menú">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
            </div>
        </nav>

        <!-- Menú Móvil Desplegable -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-margin-mobile py-6 flex flex-col gap-4 shadow-lg animate-fade-in">
            <a class="text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-label-bold text-base block py-1" href="${basePath}#inicio">Inicio</a>
            
            <!-- Submenú Móvil Servicios -->
            <div class="flex flex-col gap-2">
                <button id="mobile-services-btn" class="text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-label-bold text-base flex items-center justify-between py-1 w-full text-left">
                    <span>Servicios</span>
                    <span class="material-symbols-outlined text-xl transition-transform duration-200">expand_more</span>
                </button>
                <div id="mobile-services-submenu" class="hidden flex flex-col gap-3 pl-4 border-l-2 border-outline-variant/30 mt-1">
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}casas-steel-framing/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">precision_manufacturing</span>
                            Casas Steel Framing
                        </span>
                        <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}casa-moderna/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">villa</span>
                            Casas Modernas
                        </span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}duplex/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">layers</span>
                            Dúplex Modernos
                        </span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}casa-con-pileta/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">pool</span>
                            Casas con Pileta
                        </span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}casa-ladrillo/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">holiday_village</span>
                            Casas de Ladrillo Visto
                        </span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}refacciones-inmobiliarias/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">home_repair_service</span>
                            Refacciones del Hogar
                        </span>
                    </a>
                    <a class="text-on-surface-variant font-label-bold text-sm flex items-center gap-2 py-1" href="${basePath}#servicios">
                        <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">grid_view</span>
                        Todos los Modelos
                    </a>
                    <a class="text-on-surface-variant font-label-bold text-sm flex items-center gap-2 py-1" href="${basePath}contacto/">
                        <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">calculate</span>
                        Cotizador de Proyectos
                    </a>
                </div>
            </div>

            <a class="text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-label-bold text-base block py-1" href="${basePath}credito-hipotecario/">Crédito Hipotecario</a>
            
            <!-- Submenú Móvil Blog -->
            <div class="flex flex-col gap-2">
                <button id="mobile-blog-btn" class="text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-label-bold text-base flex items-center justify-between py-1 w-full text-left">
                    <span>Blog</span>
                    <span class="material-symbols-outlined text-xl transition-transform duration-200">expand_more</span>
                </button>
                <div id="mobile-blog-submenu" class="hidden flex flex-col gap-3 pl-4 border-l-2 border-outline-variant/30 mt-1">
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}mejores-tipos-de-techos/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">roofing</span>
                            Tipos de Techos
                        </span>
                        <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}tipos-de-suelos/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">landscape</span>
                            Tipos de Suelos
                        </span>
                        <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}calculos-de-estructura/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">engineering</span>
                            Cálculos de Estructura
                        </span>
                        <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center justify-between py-1" href="${basePath}empieza-diseno-de-tu-casa/">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">architecture</span>
                            Diseña tu casa
                        </span>
                        <span class="text-[10px] bg-primary/10 dark:bg-inverse-primary/10 text-primary dark:text-inverse-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nuevo</span>
                    </a>
                    <a class="text-on-surface font-label-bold text-sm flex items-center gap-2 py-1" href="${basePath}contacto/">
                        <span class="material-symbols-outlined text-base text-primary dark:text-inverse-primary">calculate</span>
                        Calculadora de Presupuestos
                    </a>
                </div>
            </div>

            <a class="text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-label-bold text-base block py-1" href="${basePath}contacto/">Contacto</a>
            <a href="${basePath}contacto/" class="mt-2 bg-primary text-on-primary text-center py-3 font-label-bold rounded-DEFAULT block shadow">
                Solicitar Presupuesto
            </a>
        </div>
        `;

        // Resaltar enlace activo según la página actual
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const desktopLinks = headerContainer.querySelectorAll('.desktop-nav-link');

        desktopLinks.forEach(link => {
            const href = link.getAttribute('href');
            let isActive = false;

            // Lógica de detección de página activa mejorada
            if (currentPath.includes('/casa-moderna') || currentPath.includes('/casas-steel-framing') || currentPath.includes('/casa-con-pileta') || currentPath.includes('/duplex') || currentPath.includes('/casa-ladrillo') || currentPath.includes('/refacciones-inmobiliarias')) {
                // Si estamos en una página de servicio, resaltamos el botón "Servicios"
                if (href && href.includes('#servicios')) isActive = true;
            } else if (currentPath.includes('/mejores-tipos-de-techos') || currentPath.includes('/tipos-de-suelos') || currentPath.includes('/calculos-de-estructura') || currentPath.includes('/empieza-diseno-de-tu-casa') || currentPath.includes('/precio-construccion-m2')) {
                // Si estamos en la página de tipos de techos, de suelos o la calculadora, resaltamos el botón "Blog"
                if (link.textContent.includes('Blog')) isActive = true;
            } else if (currentPath.includes('/credito-hipotecario') && href && href.includes('credito-hipotecario')) {
                isActive = true;
            } else if (currentPath.includes('/contacto') && href && href.includes('contacto')) {
                isActive = true;
            } else if (href && href.endsWith('#inicio') && (currentPath === '/' || currentPath.endsWith('index.html')) && (!currentHash || currentHash === '#inicio')) {
                isActive = true;
            }

            if (isActive) {
                link.classList.add('text-primary', 'dark:text-inverse-primary', 'border-b-2', 'border-primary', 'dark:border-inverse-primary', 'pb-1');
                link.classList.remove('text-on-surface-variant');
            }
        });

        initHeaderInteractions(headerContainer);
    };

    const initHeaderInteractions = (header) => {
        // 1. Control de Glassmorphism en Header al hacer scroll
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('glass-header', 'shadow-md');
                header.classList.remove('bg-surface-container-lowest');
            } else {
                header.classList.remove('glass-header', 'shadow-md');
                header.classList.add('bg-surface-container-lowest');
            }
        };
        window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // 2. Gestión de Menú Móvil
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.onclick = () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('span');
                if (icon) {
                    icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
                }
            };

            // Control del submenú de servicios en versión móvil
            const mobileServicesBtn = document.getElementById('mobile-services-btn');
            const mobileServicesSubmenu = document.getElementById('mobile-services-submenu');
            if (mobileServicesBtn && mobileServicesSubmenu) {
                mobileServicesBtn.onclick = (e) => {
                    e.stopPropagation();
                    mobileServicesSubmenu.classList.toggle('hidden');
                    const icon = mobileServicesBtn.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.classList.toggle('rotate-180');
                    }
                };
            }

            // Control del submenú de blog en versión móvil
            const mobileBlogBtn = document.getElementById('mobile-blog-btn');
            const mobileBlogSubmenu = document.getElementById('mobile-blog-submenu');
            if (mobileBlogBtn && mobileBlogSubmenu) {
                mobileBlogBtn.onclick = (e) => {
                    e.stopPropagation();
                    mobileBlogSubmenu.classList.toggle('hidden');
                    const icon = mobileBlogBtn.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.classList.toggle('rotate-180');
                    }
                };
            }

            // Cerrar al hacer click en enlaces móviles
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.onclick = () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('span');
                    if (icon) icon.textContent = 'menu';
                };
            });
        }

        // 3. Alternancia de Modo Oscuro / Claro
        const themeToggleBtn = document.getElementById('theme-toggle');
        const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
        const htmlRoot = document.documentElement;

        const toggleTheme = () => {
            if (htmlRoot.classList.contains('dark')) {
                htmlRoot.classList.remove('dark');
                htmlRoot.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                htmlRoot.classList.remove('light');
                htmlRoot.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        };

        if (themeToggleBtn) themeToggleBtn.onclick = toggleTheme;
        if (mobileThemeToggleBtn) mobileThemeToggleBtn.onclick = toggleTheme;
    };

    // Ejecutar inmediatamente o esperar al DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderHeader);
    } else {
        renderHeader();
    }
})();
