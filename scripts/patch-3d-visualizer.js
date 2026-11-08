const fs = require('fs');

const filePath = 'casas-steel-framing/capas-muro-tabique-3d/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add placeholder into #canvas3d-container if not present
if (!content.includes('id="canvas3d-placeholder"')) {
  const containerNeedle = '<div id="canvas3d-container" class="relative w-full h-[480px] sm:h-[580px] lg:h-[700px] xl:h-[760px] rounded-3xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10192e] via-[#090e1a] to-[#04060a] border border-outline-variant/30 dark:border-white/10 shadow-2xl scroll-mt-24 select-none touch-none" style="touch-action: none !important;">';
  
  const placeholderHtml = `${containerNeedle}
                    
                    <!-- Placeholder de Carga Diferida (Lazy Init) para eliminar TBT/INP -->
                    <div id="canvas3d-placeholder" class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#070b14]/90 backdrop-blur-md p-6 text-center transition-opacity duration-500">
                        <div class="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-inverse-primary mb-4 shadow-xl">
                            <span class="material-symbols-outlined text-3xl">view_in_ar</span>
                        </div>
                        <h3 class="text-white text-xl sm:text-2xl font-bold font-headline mb-2 uppercase tracking-wide">
                            Simulador 3D Interactivo
                        </h3>
                        <p class="text-slate-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                            Inspecciona el corte escalonado de las 8 capas de Steel Framing con iluminación PBR en tiempo real.
                        </p>
                        <button id="btn-load-3d" type="button" class="cursor-pointer bg-primary hover:bg-primary-hover active:scale-95 text-white font-label-bold text-sm px-6 py-3.5 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">play_arrow</span>
                            <span id="btn-load-3d-text">Iniciar Visualizador 3D</span>
                        </button>
                        <span class="text-slate-400 text-[11px] mt-3 opacity-70">O se iniciará automáticamente al acercarte</span>
                    </div>`;

  if (content.includes(containerNeedle)) {
    content = content.replace(containerNeedle, placeholderHtml);
    console.log('Added placeholder to #canvas3d-container');
  } else {
    console.error('Could not find container needle in HTML!');
    process.exit(1);
  }
}

// 2. Refactor script to lazy load Three.js and initialize on demand
const moduleStartNeedle = '<script type="module" data-cfasync="false">';
const moduleEndNeedle = '</script>\n</body>';

const scriptStartIndex = content.indexOf(moduleStartNeedle);
const scriptEndIndex = content.indexOf('</script>', scriptStartIndex);

if (scriptStartIndex === -1 || scriptEndIndex === -1) {
  console.error('Could not find module script tags');
  process.exit(1);
}

const originalScript = content.substring(scriptStartIndex + moduleStartNeedle.length, scriptEndIndex);

// Extract LAYERS_DATA
const layersDataMatch = originalScript.match(/const LAYERS_DATA = \[\s*\{[\s\S]*?\}\s*\];/);
if (!layersDataMatch) {
  console.error('Could not extract LAYERS_DATA');
  process.exit(1);
}
const layersDataCode = layersDataMatch[0];

// Extract from function createProceduralTexture to end of originalScript
const createTextureIndex = originalScript.indexOf('function createProceduralTexture(');
if (createTextureIndex === -1) {
  console.error('Could not find createProceduralTexture');
  process.exit(1);
}

let threeBodyCode = originalScript.substring(createTextureIndex);

// Optimize texture size from 2048 to 1024 for speed & memory
threeBodyCode = threeBodyCode.replace(
  "const size = isReduced ? 1024 : 2048;",
  "const size = isReduced ? 512 : 1024;"
);

// We need selectLayer to be accessible when pills are clicked
const newScript = `
        /* =========================================================================
           1. BASE DE DATOS TÉCNICA DE LAS 8 CAPAS DEL MURO STEEL FRAMING
           ========================================================================= */
        ${layersDataCode}

        // Estado global del visualizador diferido
        let is3DInitialized = false;
        let is3DLoading = false;
        let activeLayerId = 0;
        let externalSelectLayer = null;

        // Función para actualizar textos del panel técnico inmediatamente (sin esperar a 3D)
        function updateLayerPanelText(id) {
            activeLayerId = id;
            const data = LAYERS_DATA[id];
            if (!data) return;

            // HUD sobre canvas (si existe)
            const hudNum = document.getElementById('hud-badge-num');
            const hudType = document.getElementById('hud-badge-type');
            const hudThickness = document.getElementById('hud-thickness');
            const hudTitle = document.getElementById('hud-title');
            if (hudNum) hudNum.innerText = data.num;
            if (hudType) hudType.innerText = data.badge;
            if (hudThickness) hudThickness.innerText = data.thickness;
            if (hudTitle) hudTitle.innerText = data.name.split(' (')[0];

            // Dashboard horizontal inferior
            const elBadgeNum = document.getElementById('layer-badge-num');
            const elBadgeType = document.getElementById('layer-badge-type');
            const elTitle = document.getElementById('layer-title');
            const elSubtitle = document.getElementById('layer-subtitle');
            const elThick = document.getElementById('stat-thickness');
            const elLambda = document.getElementById('stat-lambda');
            const elR = document.getElementById('stat-r');
            const elNorm = document.getElementById('stat-norm');
            const elFunc = document.getElementById('layer-function');
            const elClimate = document.getElementById('layer-climate');
            const elFixing = document.getElementById('layer-fixing');

            if (elBadgeNum) elBadgeNum.innerText = data.num;
            if (elBadgeType) elBadgeType.innerText = data.badge;
            if (elTitle) elTitle.innerText = data.name;
            if (elSubtitle) elSubtitle.innerText = data.subtitle;
            if (elThick) elThick.innerText = data.thickness;
            if (elLambda) elLambda.innerText = data.lambda;
            if (elR) elR.innerText = data.r;
            if (elNorm) elNorm.innerText = data.norm;
            if (elFunc) elFunc.innerText = data.func;
            if (elClimate) elClimate.innerText = data.climate;
            if (elFixing) elFixing.innerText = data.fixing;

            // Píldoras
            LAYERS_DATA.forEach((_, idx) => {
                const pill = document.getElementById(\`pill-layer-\${idx}\`);
                if (!pill) return;
                const numSpan = pill.querySelector('span:first-child');
                if (idx === id) {
                    pill.className = 'px-3.5 py-2 rounded-xl text-xs font-label-bold whitespace-nowrap transition-all border flex items-center gap-1.5 bg-primary text-white border-primary shadow-md scale-105';
                    if (numSpan) numSpan.className = 'w-4 h-4 rounded-full bg-white text-primary text-[10px] flex items-center justify-center font-bold';
                } else {
                    pill.className = 'px-3.5 py-2 rounded-xl text-xs font-label-bold whitespace-nowrap transition-all border flex items-center gap-1.5 bg-surface-container-lowest dark:bg-[#121822] text-secondary dark:text-outline-variant border-outline-variant/30 hover:border-primary/50';
                    if (numSpan) numSpan.className = 'w-4 h-4 rounded-full bg-primary/20 text-primary dark:text-inverse-primary text-[10px] flex items-center justify-center font-bold';
                }
            });
        }

        // Renderizar píldoras horizontales inmediatamente en DOM
        const pillsContainer = document.getElementById('layer-pills');
        if (pillsContainer) {
            pillsContainer.innerHTML = '';
            LAYERS_DATA.forEach((item, idx) => {
                const pill = document.createElement('button');
                pill.id = \`pill-layer-\${idx}\`;
                pill.className = \`px-3.5 py-2 rounded-xl text-xs font-label-bold whitespace-nowrap transition-all border flex items-center gap-1.5 \${
                    idx === 0 
                    ? 'bg-primary text-white border-primary shadow-md' 
                    : 'bg-surface-container-lowest dark:bg-[#121822] text-secondary dark:text-outline-variant border-outline-variant/30 hover:border-primary/50'
                }\`;
                pill.innerHTML = \`
                    <span class="w-4 h-4 rounded-full \${idx === 0 ? 'bg-white text-primary' : 'bg-primary/20 text-primary dark:text-inverse-primary'} text-[10px] flex items-center justify-center font-bold">\${item.num}</span>
                    <span>\${item.name.split(' (')[0]}</span>
                \`;
                pill.onclick = () => {
                    updateLayerPanelText(idx);
                    if (externalSelectLayer) {
                        externalSelectLayer(idx);
                    } else {
                        triggerInit3D(idx);
                    }
                };
                pillsContainer.appendChild(pill);
            });
        }

        // Trigger para inicialización perezosa de Three.js
        async function triggerInit3D(targetLayer = activeLayerId) {
            if (is3DInitialized || is3DLoading) {
                if (externalSelectLayer) externalSelectLayer(targetLayer);
                return;
            }
            is3DLoading = true;
            const btnText = document.getElementById('btn-load-3d-text');
            if (btnText) btnText.innerHTML = '<span class="inline-block animate-spin mr-1">⌛</span>Cargando simulador...';

            try {
                await init3DViewer();
                is3DInitialized = true;
                is3DLoading = false;
                if (externalSelectLayer) externalSelectLayer(targetLayer);
            } catch (err) {
                console.error('Error al iniciar 3D:', err);
                is3DLoading = false;
            }
        }

        // Listeners para iniciar el visor 3D bajo demanda
        const btnLoad3D = document.getElementById('btn-load-3d');
        if (btnLoad3D) btnLoad3D.addEventListener('click', (e) => { e.stopPropagation(); triggerInit3D(); });

        const placeholder3D = document.getElementById('canvas3d-placeholder');
        if (placeholder3D) placeholder3D.addEventListener('click', () => triggerInit3D());

        document.querySelectorAll('a[href="#canvas3d-container"]').forEach(a => {
            a.addEventListener('click', () => setTimeout(() => triggerInit3D(), 50));
        });

        // IntersectionObserver para precargar cuando el usuario scrollea cerca del visor
        if ('IntersectionObserver' in window) {
            const loadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadObserver.disconnect();
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(() => triggerInit3D(), { timeout: 2500 });
                        } else {
                            setTimeout(() => triggerInit3D(), 400);
                        }
                    }
                });
            }, { rootMargin: '300px' });
            const containerEl = document.getElementById('canvas3d-container');
            if (containerEl) loadObserver.observe(containerEl);
        }

        // Motor 3D completo encapsulado (Three.js dinámico)
        async function init3DViewer() {
            // Importación dinámica para eliminar 100% del bloqueo en el hilo principal
            const [THREE, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
                import('https://esm.sh/three@0.160.0'),
                import('https://esm.sh/three@0.160.0/addons/controls/OrbitControls.js'),
                import('https://esm.sh/three@0.160.0/addons/environments/RoomEnvironment.js')
            ]);

            ${threeBodyCode}
        }
`;

// In threeBodyCode, we need selectLayer to assign to externalSelectLayer
// Let's replace the definition of selectLayer to update externalSelectLayer
let patchedScript = newScript.replace(
  'function selectLayer(id) {',
  'externalSelectLayer = selectLayer;\n        function selectLayer(id) {'
);

// In threeBodyCode, when first frame is rendered, hide placeholder
patchedScript = patchedScript.replace(
  'animate();',
  `animate();
        // Ocultar placeholder con fade suave
        const ph = document.getElementById('canvas3d-placeholder');
        if (ph) {
            ph.style.opacity = '0';
            ph.style.pointerEvents = 'none';
            setTimeout(() => { try { ph.remove(); } catch(e){} }, 500);
        }`
);

// Also add visibility pause to animate() to stop burning GPU when scrolled away
patchedScript = patchedScript.replace(
  'function animate() {',
  `let isCanvasInView = true;
        let isRafActive = true;
        if ('IntersectionObserver' in window && container) {
            const visObs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    isCanvasInView = e.isIntersecting;
                    if (isCanvasInView && !isRafActive) {
                        isRafActive = true;
                        requestAnimationFrame(animate);
                    }
                });
            });
            visObs.observe(container);
        }

        function animate() {
            if (!isCanvasInView) {
                isRafActive = false;
                return;
            }`
);

const finalHtml = content.substring(0, scriptStartIndex + moduleStartNeedle.length) +
                  patchedScript +
                  content.substring(scriptEndIndex);

fs.writeFileSync(filePath, finalHtml, 'utf8');
console.log('Successfully patched casas-steel-framing/capas-muro-tabique-3d/index.html with Lazy-Init 3D!');
