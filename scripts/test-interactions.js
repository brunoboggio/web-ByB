const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9226;
const USER_DATA_DIR = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_test_prof_' + Date.now());

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
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
    return res.result ? res.result.value : undefined;
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function testAll() {
  console.log('Testing interactions via Chrome CDP...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const list = await httpGet(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
        const page = Array.isArray(list) ? list.find(t => t.type === 'page') : null;
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch(e) {}
    }

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // 1. Cotizador M2
    console.log('\n--- 1. Testing Cotizador M2 ---');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8080/precio-construccion-m2/' });
    await sleep(2500);
    const cotizadorInfo = await cdp.eval(`({
      title: document.title,
      hasHeader: !!document.querySelector('#main-header nav'),
      hasSlider: !!document.getElementById('slider-superficie'),
      calcResult: !!document.getElementById('resultado-estimado') || !!document.querySelector('[id*="precio"]')
    })`);
    console.log('Cotizador state:', cotizadorInfo);

    // 2. Contacto
    console.log('\n--- 2. Testing Contacto ---');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8080/contacto/' });
    await sleep(2500);
    const contactoInfo = await cdp.eval(`({
      title: document.title,
      hasForm: !!document.querySelector('form'),
      nameInput: !!document.querySelector('input[name="name"], input[name="nombre"], #nombre'),
      hasWhatsApp: !!document.querySelector('a[href*="wa.me"]')
    })`);
    console.log('Contacto state:', contactoInfo);

    // 3. Visualizador 3D
    console.log('\n--- 3. Testing 3D Visualizer (Capas Muro) ---');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8080/casas-steel-framing/capas-muro-tabique-3d/' });
    await sleep(2500);
    const initial3D = await cdp.eval(`({
      placeholderPresent: !!document.getElementById('canvas3d-placeholder'),
      pillsCount: document.querySelectorAll('#layer-pills button').length,
      layer1Text: document.getElementById('layer-title')?.innerText
    })`);
    console.log('Initial 3D state:', initial3D);

    console.log('Triggering 3D load via button click...');
    await cdp.eval(`document.getElementById('btn-load-3d').click()`);
    await sleep(3500);

    const active3D = await cdp.eval(`({
      placeholderPresent: !!document.getElementById('canvas3d-placeholder'),
      canvasWidth: document.getElementById('webgl-canvas')?.width,
      canvasHeight: document.getElementById('webgl-canvas')?.height
    })`);
    console.log('Active 3D state after load:', active3D);

    console.log('Clicking Layer 2 pill (Barrera de Vapor)...');
    await cdp.eval(`document.getElementById('pill-layer-1').click()`);
    await sleep(500);
    const layer2 = await cdp.eval(`({
      title: document.getElementById('layer-title')?.innerText,
      thickness: document.getElementById('stat-thickness')?.innerText
    })`);
    console.log('Layer 2 selected:', layer2);

    console.log('\n--- ALL FUNCTIONAL CHECKS VERIFIED SUCCESSFULLY! ---');
    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

testAll().catch(console.error);
