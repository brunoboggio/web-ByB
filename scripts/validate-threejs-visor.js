const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Bruno\\.gemini\\antigravity\\brain\\d5531a97-81a8-4f90-9f01-236ff64225d1';
const TARGET_URL = 'http://127.0.0.1:8080/casas-steel-framing/etapas-construccion/';
const DEBUG_PORT = 9225;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

class CdpClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.ws = null;
        this.id = 1;
        this.callbacks = new Map();
        this.consoleErrors = [];
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.wsUrl);
            this.ws.onopen = () => resolve();
            this.ws.onerror = (err) => reject(err);
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.id && this.callbacks.has(msg.id)) {
                    const cb = this.callbacks.get(msg.id);
                    this.callbacks.delete(msg.id);
                    if (msg.error) cb.reject(msg.error);
                    else cb.resolve(msg.result);
                }
                if (msg.method === 'Runtime.consoleAPICalled') {
                    const type = msg.params.type;
                    const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
                    if (type === 'error') {
                        console.error(' [BROWSER CONSOLE ERROR]:', text);
                        this.consoleErrors.push(text);
                    } else if (type === 'warning') {
                        console.warn(' [BROWSER CONSOLE WARN]:', text);
                    }
                }
            };
        });
    }

    send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const reqId = this.id++;
            this.callbacks.set(reqId, { resolve, reject });
            this.ws.send(JSON.stringify({ id: reqId, method, params }));
        });
    }

    async eval(expr) {
        const res = await this.send('Runtime.evaluate', {
            expression: expr,
            returnByValue: true,
            awaitPromise: true
        });
        if (res.exceptionDetails) {
            throw new Error(res.exceptionDetails.text || 'Eval error');
        }
        return res.result ? res.result.value : undefined;
    }

    async captureScreenshot(outputPath, clip = null) {
        const params = { format: 'png' };
        if (clip) params.clip = clip;
        const res = await this.send('Page.captureScreenshot', params);
        const buffer = Buffer.from(res.data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`📸 Screenshot guardado en: ${outputPath}`);
    }

    close() {
        if (this.ws) this.ws.close();
    }
}

async function run() {
    console.log('1. Verificando directorio de artefactos...');
    if (!fs.existsSync(ARTIFACT_DIR)) {
        fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    }

    console.log('2. Iniciando Chrome Headless...');
    const chrome = spawn(CHROME_PATH, [
        `--remote-debugging-port=${DEBUG_PORT}`,
        '--headless=new',
        '--disable-gpu-watchdog',
        '--enable-webgl',
        '--ignore-gpu-blocklist',
        '--window-size=1440,960',
        '--no-sandbox',
        'about:blank'
    ], { stdio: 'ignore' });

    await sleep(1500);

    const list = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const page = list.find(t => t.type === 'page') || list[0];
    if (!page || !page.webSocketDebuggerUrl) {
        throw new Error('No se encontró página con WebSocket');
    }

    const cdp = new CdpClient(page.webSocketDebuggerUrl);
    await cdp.connect();
    console.log(' Conectado a Chrome DevTools Protocol');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log(`3. Navegando a ${TARGET_URL}...`);
    await cdp.send('Page.navigate', { url: TARGET_URL });

    console.log('4. Esperando carga del simulador 3D...');
    await sleep(4000);

    // Verificar que Three.js cargó
    const isThreeLoaded = await cdp.eval(`typeof window.__threeScene !== 'undefined'`);
    console.log(`¿Three.js Scene inicializada?: ${isThreeLoaded}`);

    if (!isThreeLoaded) {
        console.log('Esperando 3 segundos adicionales...');
        await sleep(3000);
    }

    // Comprobar estado de la escena y grupos de etapas
    const sceneInfo = await cdp.eval(`(() => {
        return {
            hasScene: !!window.__threeScene,
            groupsCount: window.__stageGroups ? window.__stageGroups.length : 0,
            childrenCount: window.__threeScene ? window.__threeScene.children.length : 0,
            rendererClipping: !!document.getElementById('webgl-canvas')
        };
    })()`);
    console.log('Información de la escena:', sceneInfo);

    // Seleccionar Etapa 8 para ver la casa con todos los materiales de entrega final y activar rayos X o acumulativa
    console.log('5. Activando Fase 8 y modo acumulativo...');
    await cdp.eval(`(() => {
        window.__selectStage(7, false);
        const container = document.getElementById('simulador-3d-completo');
        if (container) container.scrollIntoView({ block: 'center' });
    })()`);
    await sleep(1500);

    // Captura 1: Vista BIM Mejorada (Modelo completo de cuerpo entero con acabados PBR, contornos CAD y botones HUD visibles)
    console.log('6. Verificando botones HUD (#btn-clip-hud, #btn-env-hud) y encuadre completo...');
    const hudButtonsStatus = await cdp.eval(`(() => {
        const btnClip = document.getElementById('btn-clip-hud');
        const btnEnv = document.getElementById('btn-env-hud');
        return {
            hasBtnClipHud: !!btnClip && btnClip.offsetParent !== null,
            hasBtnEnvHud: !!btnEnv && btnEnv.offsetParent !== null
        };
    })()`);
    console.log('Estado botones HUD:', hudButtonsStatus);

    const vistaBimPath = path.join(ARTIFACT_DIR, 'vista_bim_mejorada.png');
    console.log('7. Tomando captura de Vista BIM Mejorada (cuerpo entero)...');
    await cdp.captureScreenshot(vistaBimPath);

    // Activar Corte Seccional BIM abriendo desde el botón HUD (#btn-clip-hud) en Planta Cenital (Eje Y) al 50%
    console.log('8. Abriendo panel de Corte BIM desde #btn-clip-hud y aplicando Corte Y al 50%...');
    await cdp.eval(`(() => {
        const btnHud = document.getElementById('btn-clip-hud');
        if (btnHud) btnHud.click();
        const btnY = document.getElementById('btn-cut-y');
        if (btnY) btnY.click();
        const slider = document.getElementById('cut-depth-slider');
        if (slider) {
            slider.value = 50;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
    })()`);
    await sleep(1500);

    // Captura 2: Vista Corte Seccional BIM (Muros cortados, caños embutidos, montantes y platea)
    const vistaCortePath = path.join(ARTIFACT_DIR, 'vista_corte_seccional.png');
    console.log('9. Tomando captura de Corte Seccional BIM...');
    await cdp.captureScreenshot(vistaCortePath);

    // Cerrar panel de corte, restablecer corte y activar Ambiente Atardecer Golden Hour desde #btn-env-hud
    console.log('10. Restableciendo corte y activando Ambiente Golden Hour desde #btn-env-hud...');
    await cdp.eval(`(() => {
        const btnClose = document.getElementById('btn-close-bim-cut');
        if (btnClose) btnClose.click();
        const btnCutOff = document.getElementById('btn-cut-off');
        if (btnCutOff) btnCutOff.click();
        
        const btnEnvHud = document.getElementById('btn-env-hud');
        if (btnEnvHud) btnEnvHud.click();
        const btnGolden = document.getElementById('btn-env-golden');
        if (btnGolden) btnGolden.click();
    })()`);
    await sleep(1500);

    const vistaGoldenPath = path.join(ARTIFACT_DIR, 'vista_ambiente_golden_hour.png');
    console.log('11. Tomando captura de Ambiente Golden Hour...');
    await cdp.captureScreenshot(vistaGoldenPath);

    // Validación de errores de consola
    console.log(`12. Errores de consola registrados: ${cdp.consoleErrors.length}`);
    if (cdp.consoleErrors.length > 0) {
        console.error('DETALLE ERRORES:', cdp.consoleErrors);
    }

    cdp.close();
    chrome.kill();
    console.log(' Validación finalizada con éxito.');
}

run().catch(err => {
    console.error('Error durante la validación:', err);
    process.exit(1);
});
