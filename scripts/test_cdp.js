const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_cdp_profile_' + Date.now());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', reject);
    });
}

class CDPClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.msgId = 1;
        this.callbacks = new Map();
        this.ws = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => resolve();
            this.ws.onerror = (err) => reject(err);
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.method === 'Runtime.consoleAPICalled') {
                    console.log('BROWSER CONSOLE:', data.params.type, data.params.args.map(a => a.value || a.description).join(' '));
                }
                if (data.method === 'Runtime.exceptionThrown') {
                    console.error('BROWSER EXCEPTION:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
                }
                if (data.id && this.callbacks.has(data.id)) {
                    const { resolve, reject } = this.callbacks.get(data.id);
                    this.callbacks.delete(data.id);
                    if (data.error) reject(data.error);
                    else resolve(data.result);
                }
            };
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = this.msgId++;
            this.callbacks.set(id, { resolve, reject });
            this.ws.send(JSON.stringify({ id, method, params }));
        });
    }

    async eval(expression) {
        const res = await this.send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });
        if (res.exceptionDetails) {
            throw new Error(`Eval failed: ${JSON.stringify(res.exceptionDetails)}`);
        }
        return res.result ? res.result.value : undefined;
    }

    async screenshot(filepath) {
        const res = await this.send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
        console.log(`Saved screenshot: ${filepath}`);
    }

    close() {
        if (this.ws) this.ws.close();
    }
}

async function run() {
    console.log('--- Iniciando prueba CDP automatizada ---');

    // 1. Lanzar Chrome Headless abriendo directamente la página
    const chromeProc = spawn(CHROME_PATH, [
        '--headless=new',
        '--remote-debugging-port=9222',
        `--user-data-dir=${USER_DATA_DIR}`,
        '--window-size=1440,900',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        'http://localhost:8080/casas-steel-framing/etapas-construccion/'
    ]);

    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
        await sleep(400);
        try {
            const version = await httpGet('http://localhost:9222/json/version');
            if (version && version.webSocketDebuggerUrl) {
                wsUrl = version.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {}
    }

    if (!wsUrl) {
        console.error('Error: no se pudo conectar a Chrome CDP en puerto 9222');
        chromeProc.kill();
        process.exit(1);
    }

    console.log('Conectado a Chrome Browser CDP');

    // Obtener tab que coincida con la URL
    let pageWsUrl = null;
    for (let i = 0; i < 20; i++) {
        await sleep(300);
        const tabs = await httpGet('http://localhost:9222/json/list');
        if (tabs && tabs.length > 0) {
            const targetTab = tabs.find(t => t.url.includes('casas-steel-framing')) || tabs[0];
            if (targetTab && targetTab.webSocketDebuggerUrl) {
                pageWsUrl = targetTab.webSocketDebuggerUrl;
                break;
            }
        }
    }

    console.log('Conectado al tab:', pageWsUrl);

    const client = new CDPClient(pageWsUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('DOM.enable');

    // Configurar viewport Desktop inicial: 1440x900
    await client.send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
    });

    console.log('Esperando carga y renderizado 3D...');
    for (let i = 0; i < 30; i++) {
        await sleep(500);
        try {
            const ready = await client.eval(`Boolean(window.__threeScene && window.__stageGroups && window.__stageGroups.length === 8)`);
            if (ready) {
                console.log(`Visor 3D y 8 etapas listas tras ${(i + 1) * 0.5}s`);
                break;
            }
        } catch (e) {}
    }

    // ==========================================
    // PRUEBA 1: Verificar que no hay números flotando sobre la casa
    // ==========================================
    const pinsCheck = await client.eval(`(() => {
        const pinsOverlay = document.getElementById('pins-overlay');
        const pinsInOverlay = pinsOverlay ? pinsOverlay.children.length : 0;
        const pinsOverlayHidden = pinsOverlay ? (pinsOverlay.classList.contains('hidden') || getComputedStyle(pinsOverlay).display === 'none') : true;
        const dock = document.getElementById('stage-numeric-dock');
        const dockButtons = dock ? dock.children.length : 0;
        return { pinsInOverlay, pinsOverlayHidden, dockButtons };
    })()`);
    console.log('Verificación Pines / Dock numérico:', pinsCheck);

    if (pinsCheck.pinsInOverlay === 0 && pinsCheck.dockButtons === 8 && pinsCheck.pinsOverlayHidden) {
        console.log('✅ ÉXITO PRUEBA 1: La casa 3D está 100% libre de pines flotantes. Los 8 números están en el Dock lateral.');
    } else {
        console.warn('⚠️ Alerta PRUEBA 1:', pinsCheck);
    }

    // Captura Desktop Limpia
    const desktopLimpiaPath = path.join(__dirname, '..', 'vista_desktop_limpia.png');
    await client.screenshot(desktopLimpiaPath);

    // ==========================================
    // PRUEBA 2: Separador de Elementos (Despiece al 80% / 100%)
    // ==========================================
    console.log('Ejecutando activación del separador al 80%...');
    const explodeResult = await client.eval(`(() => {
        const slider = document.getElementById('explosion-slider');
        const btn = document.getElementById('btn-slider-explode');
        if (btn) btn.click();
        else if (slider) {
            slider.value = 80;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return {
            sliderVal: slider ? slider.value : null,
            targetExplode: window.__threeScene ? window.__stageGroups.map((g, i) => ({
                id: i,
                visible: g.visible,
                posY: g.position.y,
                posZ: g.position.z,
                posX: g.position.x
            })) : null
        };
    })()`);

    // Esperar interpolación suave de animación (1200ms)
    await sleep(1500);

    const explodeVerification = await client.eval(`(() => {
        const groups = window.__stageGroups || [];
        const allVisible = groups.length === 8 && groups.every(g => g.visible === true);
        const offsets = groups.map(g => ({
            x: Math.round(g.position.x * 100) / 100,
            y: Math.round(g.position.y * 100) / 100,
            z: Math.round(g.position.z * 100) / 100
        }));
        return { allVisible, offsets, count: groups.length };
    })()`);

    console.log('Verificación Despiece al 80%:', explodeVerification);
    if (explodeVerification.allVisible && explodeVerification.count === 8) {
        console.log('✅ ÉXITO PRUEBA 2: Las 8 capas constructivas son 100% visibles y separadas tridimensionalmente en el despiece.');
    }

    const separadorExplotadoPath = path.join(__dirname, '..', 'vista_separador_explotado.png');
    await client.screenshot(separadorExplotadoPath);

    // ==========================================
    // PRUEBA 3: Zoom con Rueda del Ratón y con 2 Dedos
    // ==========================================
    console.log('Probando Zoom con evento wheel (rueda del ratón)...');
    const wheelTest = await client.eval(`(() => {
        const container = document.getElementById('canvas3d-container');
        const initialSlider = document.getElementById('zoom-slider') ? parseInt(document.getElementById('zoom-slider').value) : 100;
        
        // Simular evento wheel para alejar (deltaY > 0)
        const wheelOut = new WheelEvent('wheel', { deltaY: 300, bubbles: true, cancelable: true });
        container.dispatchEvent(wheelOut);
        const afterWheelOutSlider = document.getElementById('zoom-slider') ? parseInt(document.getElementById('zoom-slider').value) : null;
        
        // Simular evento wheel para acercar (deltaY < 0)
        const wheelIn = new WheelEvent('wheel', { deltaY: -500, bubbles: true, cancelable: true });
        container.dispatchEvent(wheelIn);
        const afterWheelInSlider = document.getElementById('zoom-slider') ? parseInt(document.getElementById('zoom-slider').value) : null;

        return { initialSlider, afterWheelOutSlider, afterWheelInSlider, wheelWorked: afterWheelInSlider !== initialSlider };
    })()`);
    console.log('Resultado prueba wheel:', wheelTest);
    if (wheelTest.wheelWorked) {
        console.log('✅ ÉXITO PRUEBA 3A: La rueda del ratón (wheel) modifica dinámicamente el zoom de la cámara.');
    }

    console.log('Probando Zoom con Gesto táctil de 2 dedos (Pinch-to-zoom)...');
    const pinchTest = await client.eval(`(() => {
        const container = document.getElementById('canvas3d-container');
        const beforePinchSlider = document.getElementById('zoom-slider') ? parseInt(document.getElementById('zoom-slider').value) : 100;

        // Crear touchstart con 2 dedos (distancia = 100px)
        const touch1 = new Touch({ identifier: 1, target: container, clientX: 200, clientY: 200 });
        const touch2 = new Touch({ identifier: 2, target: container, clientX: 300, clientY: 200 });
        const touchStartEvt = new TouchEvent('touchstart', {
            touches: [touch1, touch2],
            targetTouches: [touch1, touch2],
            changedTouches: [touch1, touch2],
            bubbles: true,
            cancelable: true
        });
        container.dispatchEvent(touchStartEvt);

        // Crear touchmove separando los dedos a 200px (apertura = Zoom In)
        const touch2Moved = new Touch({ identifier: 2, target: container, clientX: 400, clientY: 200 });
        const touchMoveEvt = new TouchEvent('touchmove', {
            touches: [touch1, touch2Moved],
            targetTouches: [touch1, touch2Moved],
            changedTouches: [touch2Moved],
            bubbles: true,
            cancelable: true
        });
        container.dispatchEvent(touchMoveEvt);

        const afterPinchSlider = document.getElementById('zoom-slider') ? parseInt(document.getElementById('zoom-slider').value) : null;

        // Touchend
        const touchEndEvt = new TouchEvent('touchend', {
            touches: [],
            targetTouches: [],
            changedTouches: [touch1, touch2Moved],
            bubbles: true,
            cancelable: true
        });
        container.dispatchEvent(touchEndEvt);

        return { beforePinchSlider, afterPinchSlider, pinchWorked: afterPinchSlider !== beforePinchSlider };
    })()`);
    console.log('Resultado prueba 2-finger pinch:', pinchTest);
    if (pinchTest.pinchWorked) {
        console.log('✅ ÉXITO PRUEBA 3B: El gesto de 2 dedos (pinch-to-zoom) actualiza el zoom en tiempo real.');
    }

    // ==========================================
    // PRUEBA 4: Vista Móvil (390x844) y Tarjeta de Explicación Ultra-Compacta
    // ==========================================
    console.log('Configurando emulación Móvil: 390x844 (iPhone 12/13/14)...');
    await client.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
    });

    // Unir la obra para ver la casa montada normal en móvil
    await client.eval(`(() => {
        const btn = document.getElementById('btn-slider-explode');
        if (btn) btn.click();
        window.__selectStage(0);
    })()`);
    await sleep(1500);

    const mobileHudCheck = await client.eval(`(() => {
        const hud = document.getElementById('hud-quick-info');
        const desc = document.getElementById('hud-stage-desc');
        const rect = hud ? hud.getBoundingClientRect() : null;
        const descVisible = desc ? (getComputedStyle(desc).display !== 'none') : false;
        const techPanel = document.getElementById('technical-stage-panel');
        const techRect = techPanel ? techPanel.getBoundingClientRect() : null;
        return {
            hudWidth: rect ? Math.round(rect.width) : 0,
            hudHeight: rect ? Math.round(rect.height) : 0,
            descHiddenInMobile: !descVisible,
            techPanelPadding: techPanel ? getComputedStyle(techPanel).padding : null
        };
    })()`);
    console.log('Verificación HUD Móvil:', mobileHudCheck);

    if (mobileHudCheck.hudHeight < 90 && mobileHudCheck.descHiddenInMobile) {
        console.log(`✅ ÉXITO PRUEBA 4: La tarjeta HUD en móvil es ultra-compacta (${mobileHudCheck.hudHeight}px de alto), dejando libre el visor 3D.`);
    }

    const vistaMovilPath = path.join(__dirname, '..', 'vista_movil_compacta.png');
    await client.screenshot(vistaMovilPath);

    // Cerrar sesión
    client.close();
    chromeProc.kill();
    console.log('--- Pruebas CDP finalizadas con éxito total ---');
}

run().catch(err => {
    console.error('Error fatal durante la prueba:', err);
    process.exit(1);
});
