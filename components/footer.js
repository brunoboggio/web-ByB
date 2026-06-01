// Footer Compartido / Pie de Página Universal para Constructora ByB
(function() {
    // Determinar dinámicamente el path base según la ubicación del script actual
    const scripts = document.getElementsByTagName('script');
    let basePath = './';
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('components/footer')) {
            const parts = src.split(/components\/footer(?:\.min)?\.js/);
            if (parts.length > 0 && parts[0] !== '') {
                basePath = parts[0];
            }
            break;
        }
    }

    const renderFooter = () => {
        const footerContainer = document.getElementById('main-footer');
        if (!footerContainer) return;

        // Estructura HTML unificada con fidelidad del 100% al diseño premium original
        footerContainer.innerHTML = `
        <!-- Location & Contact Section -->
        <section id="contacto" class="py-section-gap bg-tertiary text-on-tertiary relative overflow-hidden transition-colors">
            <div class="absolute inset-0 bg-primary/20 bg-blueprint opacity-20 dark:opacity-10"></div>
            <div class="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    
                    <div>
                        <span class="text-xs font-label-bold text-inverse-primary px-3 py-1 bg-surface-container-lowest/10 rounded-full mb-4 inline-block uppercase tracking-widest">
                            Contacto Directo
                        </span>
                        <h2 class="font-headline-md text-headline-md text-on-tertiary mb-8 uppercase tracking-wider">
                            OFICINAS EN TUCUMAN
                        </h2>
                        
                        <ul class="space-y-5 font-body-md text-body-md text-on-tertiary/90 mb-8">
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-surface-container-lowest/10 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-inverse-primary">location_on</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-on-tertiary-container uppercase font-label-bold">Dirección Oficial</span>
                                    <span>Crisóstomo Alvarez 1584, San Miguel de Tucumán</span>
                                </div>
                            </li>
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-surface-container-lowest/10 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-inverse-primary">phone</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-on-tertiary-container uppercase font-label-bold">Teléfono Directo</span>
                                    <a href="tel:03813604822" class="hover:underline">0381 360-4822</a>
                                </div>
                            </li>
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-surface-container-lowest/10 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-inverse-primary">schedule</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-on-tertiary-container uppercase font-label-bold">Horarios de Atención</span>
                                    <span>Lunes a Viernes de 9:00 a 18:00 hs</span>
                                </div>
                            </li>
                            <li class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-surface-container-lowest/10 rounded-lg flex items-center justify-center">
                                    <span class="material-symbols-outlined text-inverse-primary">mail</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-on-tertiary-container uppercase font-label-bold">Correo Electrónico</span>
                                    <a href="mailto:construccionesbybsrl@gmail.com" class="hover:underline">construccionesbybsrl@gmail.com</a>
                                </div>
                            </li>
                        </ul>

                        <div class="flex flex-wrap gap-4">
                            <a href="tel:03813604822" class="bg-surface-container-lowest text-tertiary px-8 py-3.5 font-label-bold text-label-bold rounded-DEFAULT hover:bg-surface-variant transition-colors shadow-lg inline-flex items-center gap-2">
                                <span class="material-symbols-outlined text-base">call</span>
                                Llamar Ahora
                            </a>
                            <a href="https://wa.me/5493813604822?text=Hola%20Constructora%20ByB,%20deseo%20consultar%20sobre%20un%20proyecto%20de%20construcción" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 text-white px-6 py-3.5 font-label-bold text-label-bold rounded-DEFAULT hover:bg-emerald-700 transition-colors shadow-lg inline-flex items-center gap-2">
                                <span class="material-symbols-outlined text-base">chat</span>
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    <!-- Interfaz de Mapa Digital Estilizado -->
                    <div class="bg-surface-container-lowest rounded-xl overflow-hidden h-[280px] md:h-[450px] border border-outline/20 shadow-2xl relative flex flex-col justify-between" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqZCKsEQuYk1WQTCRX5bdkXLEjM__n6zhSPE9GuYyodLTOIzxXeNGVwptYj4wg5EsKLLEBhDd9I-PI4oEULA6ThYmSH6IGCYa65t9revCZMVspfXNnJy9IsOOpjglUbfJH6UnHV-gGBSTWhmwCe_KA2s6oIC_KV3O4EF0htqYZ3GAQqy2tCIgn-m_A1DAr-GNOYLQ6OJO8C_kA3d6nIDXH2ouX2VzUIIYjW3BsYU3cryUrdBss81t0BI8gLltIPFNOj6lnfQk9_IQN=w800-rw'); background-size: cover; background-position: center;">
                        
                        <div class="p-4 bg-gradient-to-b from-black/60 to-transparent text-white">
                            <span class="font-label-bold text-xs uppercase tracking-wider opacity-90 block">Ubicación Estratégica</span>
                            <span class="text-sm font-bold">San Miguel de Tucumán</span>
                        </div>

                        <!-- Overlay de Pin Exacto -->
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div class="flex flex-col items-center animate-bounce">
                                <span class="bg-primary text-on-primary text-xs font-label-bold px-3 py-1 rounded-full shadow-lg border border-inverse-primary mb-1">
                                    ByB SRL
                                </span>
                                <span class="material-symbols-outlined text-error text-4xl drop-shadow-md fill">location_on</span>
                            </div>
                        </div>

                        <div class="p-4 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/30 text-center relative z-20">
                            <p class="font-label-bold text-label-bold text-on-surface mb-0.5">Crisóstomo Alvarez 1584</p>
                            <p class="text-xs text-on-surface-variant">A pasos de las principales avenidas de la capital tucumana.</p>
                            <a href="https://maps.google.com/?q=Crisostomo+Alvarez+1584+San+Miguel+de+Tucuman" target="_blank" rel="noopener noreferrer" class="mt-2.5 inline-block text-xs font-label-bold text-primary dark:text-inverse-primary hover:underline">
                                Abrir en Google Maps →
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="w-full py-16 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto bg-tertiary text-on-tertiary border-t border-outline/10 transition-colors">
            <div class="flex flex-col gap-4 md:col-span-2">
                <span class="text-headline-md font-headline-md font-black text-on-tertiary tracking-tight">Constructora ByB SRL</span>
                <p class="text-on-tertiary-container font-body-md text-sm leading-relaxed max-w-sm">
                    Empresa líder en diseño arquitectónico, refacciones y construcción de viviendas de primer nivel. Optimizamos su capital con desarrollos duraderos y de alta plusvalía en Tucumán.
                </p>
                <p class="text-on-tertiary-container font-body-md text-xs mt-4">
                    © <span id="current-year">2026</span> Constructora ByB SRL. Todos los derechos reservados. San Miguel de Tucumán.
                </p>
            </div>

            <div>
                <h4 class="font-label-bold text-label-bold text-on-tertiary mb-6 uppercase tracking-wider text-xs border-l-2 border-inverse-primary pl-2">
                    PÁGINAS LEGALES
                </h4>
                <ul class="space-y-3">
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}politica-privacidad/"><span class="w-1.5 h-1.5 bg-inverse-primary rounded-full"></span> Políticas de Privacidad</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}politica-privacidad/#cookies"><span class="w-1.5 h-1.5 bg-inverse-primary rounded-full"></span> Políticas de Cookies</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}aviso-legal/"><span class="w-1.5 h-1.5 bg-inverse-primary rounded-full"></span> Aviso Legal</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-label-bold text-label-bold text-on-tertiary mb-6 uppercase tracking-wider text-xs border-l-2 border-inverse-primary pl-2">
                    ENLACES RÁPIDOS
                </h4>
                <ul class="space-y-3">
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}#nosotros"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Quiénes Somos</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}#servicios"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Modelos y Servicios</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}blog/"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Blog de Construcción</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}construccion-en-seco/"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Construcción en Seco</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}credito-hipotecario/"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Crédito Hipotecario</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}precio-construccion-m2/"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Cotizador Online</a></li>
                    <li><a class="text-on-tertiary-container hover:text-on-tertiary transition-colors font-body-md text-sm flex items-center gap-2" href="${basePath}contacto/"><span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> Contactar Asesor</a></li>
                </ul>
            </div>
        </footer>
        `;

        // Inyección de Año Dinámico
        const yearElem = footerContainer.querySelector('#current-year');
        if (yearElem) yearElem.textContent = new Date().getFullYear();
    };

    // Ejecutar inmediatamente o esperar al DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFooter);
    } else {
        renderFooter();
    }
})();
