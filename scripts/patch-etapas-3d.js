const fs = require('fs');

const filePath = 'casas-steel-framing/etapas-construccion/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add placeholder into #canvas3d-container if not present
if (!content.includes('id="canvas3d-placeholder"')) {
  const containerNeedle = `<div id="canvas3d-container" class="relative w-full h-[480px] sm:h-[580px] lg:h-[700px] xl:h-[760px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10192e] via-[#090e1a] to-[#04060a] border border-slate-700/80 shadow-2xl scroll-mt-24 select-none touch-none" style="touch-action: none !important;">`;
  
  const placeholderHtml = `${containerNeedle}
                    
                    <!-- Placeholder de Carga Diferida (Lazy Init) para eliminar TBT/INP -->
                    <div id="canvas3d-placeholder" class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#070b14]/90 backdrop-blur-md p-6 text-center transition-opacity duration-500">
                        <div class="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-inverse-primary mb-4 shadow-xl">
                            <span class="material-symbols-outlined text-3xl">view_in_ar</span>
                        </div>
                        <h3 class="text-white text-xl sm:text-2xl font-bold font-headline mb-2 uppercase tracking-wide">
                            Simulador 3D: 8 Etapas Constructivas
                        </h3>
                        <p class="text-slate-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                            Inspecciona la casa completa en 3D: Platea, Perfilería PGC/PGU, Rigidización, Techo e Instalaciones con animación paso a paso.
                        </p>
                        <button id="btn-load-3d" type="button" class="cursor-pointer bg-primary hover:bg-primary-hover active:scale-95 text-white font-label-bold text-sm px-6 py-3.5 rounded-xl shadow-lg border border-white/20 transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">play_arrow</span>
                            <span id="btn-load-3d-text">Iniciar Visualizador 3D</span>
                        </button>
                        <span class="text-slate-400 text-[11px] mt-3 opacity-70">O se iniciará automáticamente al acercarte</span>
                    </div>`;

  if (content.includes(containerNeedle)) {
    content = content.replace(containerNeedle, placeholderHtml);
    console.log('Added placeholder to #canvas3d-container in etapas-construccion');
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

// Extract STAGES_DATA
const stagesDataMatch = originalScript.match(/const STAGES_DATA = \[\s*\{[\s\S]*?\}\s*\];/);
if (!stagesDataMatch) {
  console.error('Could not extract STAGES_DATA');
  process.exit(1);
}
const stagesDataCode = stagesDataMatch[0];

// Extract from function createProceduralTexture to end of originalScript
const createTextureIndex = originalScript.indexOf('function createProceduralTexture(');
if (createTextureIndex === -1) {
  console.error('Could not find createProceduralTexture');
  process.exit(1);
}

let threeBodyCode = originalScript.substring(createTextureIndex);

// Optimize texture size from 2048 to 1024 for speed & memory
threeBodyCode = threeBodyCode.replace(
  "function createProceduralTexture(type, size = 2048, maxAnisotropy = 16) {",
  "function createProceduralTexture(type, size = 1024, maxAnisotropy = 8) {"
);

const newScript = `
        /* =========================================================================
           1. BASE DE DATOS TÉCNICA DE LAS 8 ETAPAS CONSTRUCTIVAS EN STEEL FRAMING
           ========================================================================= */
        ${stagesDataCode}

        // Estado global del visualizador diferido
        let is3DInitialized = false;
        let is3DLoading = false;
        let activeStageId = 0;
        let externalSelectStage = null;

        // Función para actualizar textos del panel técnico inmediatamente (sin esperar a 3D)
        function updateStagePanelText(id) {
            activeStageId = id;
            const data = STAGES_DATA[id];
            if (!data) return;

            // HUD sobre canvas (si existe)
            const hudNum = document.getElementById('hud-stage-num');
            const hudBadge = document.getElementById('hud-stage-badge');
            const hudDuration = document.getElementById('hud-stage-duration');
            const hudProgress = document.getElementById('hud-stage-progress');
            const hudTitle = document.getElementById('hud-stage-title');
            if (hudNum) hudNum.innerText = data.stageNum;
            if (hudBadge) hudBadge.innerText = data.badge;
            if (hudDuration) hudDuration.innerText = data.duration;
            if (hudProgress) hudProgress.innerText = data.progress + '%';
            if (hudTitle) hudTitle.innerText = data.name;

            // Dashboard lateral / horizontal
            const elBadgeNum = document.getElementById('stage-badge-num');
            const elBadgeType = document.getElementById('stage-badge-type');
            const elTitle = document.getElementById('stage-title');
            const elSubtitle = document.getElementById('stage-subtitle');
            const elDuration = document.getElementById('stat-duration');
            const elCrew = document.getElementById('stat-crew');
            const elNorm = document.getElementById('stat-norm');
            const elDesc = document.getElementById('stage-desc');
            const elQuality = document.getElementById('stage-quality');
            const elMaterials = document.getElementById('stage-materials');
            const elMilestone = document.getElementById('stage-milestone');

            if (elBadgeNum) elBadgeNum.innerText = data.stageNum;
            if (elBadgeType) elBadgeType.innerText = data.badge;
            if (elTitle) elTitle.innerText = data.name;
            if (elSubtitle) elSubtitle.innerText = data.subtitle;
            if (elDuration) elDuration.innerText = data.duration;
            if (elCrew) elCrew.innerText = data.crew;
            if (elNorm) elNorm.innerText = data.norm;
            if (elDesc) elDesc.innerText = data.desc;
            if (elQuality) elQuality.innerText = data.quality;
            if (elMaterials) elMaterials.innerText = data.materials;
            if (elMilestone) elMilestone.innerText = data.milestone;

            // Dock numérico
            STAGES_DATA.forEach((s, idx) => {
                const btn = document.getElementById(\`dock-stage-btn-\${idx}\`);
                if (!btn) return;
                if (idx === id) {
                    btn.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-xs sm:text-sm font-label-bold flex items-center justify-center transition-all duration-200 cursor-pointer select-none bg-primary text-white shadow-lg ring-2 ring-blue-400/70 scale-110 font-black';
                } else {
                    btn.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-xs sm:text-sm font-label-bold flex items-center justify-center transition-all duration-200 cursor-pointer select-none bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white';
                }
            });
        }

        // Renderizar dock numérico inmediatamente
        const stageNumericDock = document.getElementById('stage-numeric-dock');
        if (stageNumericDock) {
            stageNumericDock.innerHTML = '';
            STAGES_DATA.forEach((s, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.id = \`dock-stage-btn-\${idx}\`;
                btn.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-xs sm:text-sm font-label-bold flex items-center justify-center transition-all duration-200 cursor-pointer select-none ' +
                    (idx === 0 ? 'bg-primary text-white shadow-lg ring-2 ring-blue-400/70 scale-110 font-black' : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white');
                btn.title = \`Fase \${s.stageNum}: \${s.name}\`;
                btn.setAttribute('aria-label', \`Fase constructiva \${s.stageNum}: \${s.name}\`);
                btn.innerText = \`\${s.stageNum}\`;
                btn.onclick = () => {
                    updateStagePanelText(idx);
                    if (externalSelectStage) {
                        externalSelectStage(idx);
                    } else {
                        triggerInit3D(idx);
                    }
                };
                stageNumericDock.appendChild(btn);
            });
        }

        // Trigger para inicialización perezosa de Three.js
        async function triggerInit3D(targetStage = activeStageId) {
            if (is3DInitialized || is3DLoading) {
                if (externalSelectStage) externalSelectStage(targetStage);
                return;
            }
            is3DLoading = true;
            const btnText = document.getElementById('btn-load-3d-text');
            if (btnText) btnText.innerHTML = '<span class="inline-block animate-spin mr-1">⌛</span>Cargando simulador...';

            try {
                await init3DViewer();
                is3DInitialized = true;
                is3DLoading = false;
                if (externalSelectStage) externalSelectStage(targetStage);
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

        document.querySelectorAll('a[href="#canvas3d-container"], a[href="#simulador-3d-completo"]').forEach(a => {
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
            const [THREE, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
                import('https://esm.sh/three@0.160.0'),
                import('https://esm.sh/three@0.160.0/addons/controls/OrbitControls.js'),
                import('https://esm.sh/three@0.160.0/addons/environments/RoomEnvironment.js')
            ]);

            ${threeBodyCode}
        }
`;

let patchedScript = newScript.replace(
  'function selectStage(id, animateCam = true) {',
  'externalSelectStage = selectStage;\n        function selectStage(id, animateCam = true) {'
);

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

const finalHtml = content.substring(0, scriptStartIndex + moduleStartNeedle.length) +
                  patchedScript +
                  content.substring(scriptEndIndex);

fs.writeFileSync(filePath, finalHtml, 'utf8');
console.log('Successfully patched casas-steel-framing/etapas-construccion/index.html with Lazy-Init 3D!');
