const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function getSageExportDir() {
  const isWin = process.platform === 'win32';
  const base = isWin ? 'C:' : os.homedir();
  return path.join(base, 'KalpeResto', 'SageExports');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Kalpé Resto POS",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    }
  });

  // Load local build file or fallback dev port
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
  }

  // INTELLECTUAL PROPERTY LOCKDOWN: Disable DevTools in production
  win.webContents.on('devtools-opened', () => {
    if (app.isPackaged) {
      win.webContents.closeDevTools();
    }
  });
}

// IPC: native SARI file deposit — silently creates the export directory if needed
ipcMain.handle('write-sari-file', (event, content, filename) => {
  try {
    const dir = getSageExportDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC: silent thermal receipt printing — hidden window injected with HTML, sent to default printer
ipcMain.handle('print-receipt', async (event, htmlContent) => {
  let workerWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true } });
  workerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

  workerWindow.webContents.on('did-finish-load', () => {
    workerWindow.webContents.print({
      silent: true,
      printBackground: true,
      margins: { marginType: 'none' }
    }, () => {
      workerWindow.destroy();
    });
  });
  return { success: true };
});

// White-label: force app name for macOS menu bar
app.setName('Kalpé Resto POS');

// Custom application menu — ensures "About" and "Quit" show brand name, not folder name
const menuTemplate = [
  {
    label: 'Kalpé Resto POS',
    submenu: [
      { role: 'about', label: 'À propos de Kalpé Resto POS' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide', label: 'Masquer Kalpé Resto POS' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit', label: 'Quitter Kalpé Resto POS' }
    ]
  },
  {
    label: 'Édition',
    submenu: [
      { role: 'undo', label: 'Annuler' },
      { role: 'redo', label: 'Rétablir' },
      { type: 'separator' },
      { role: 'cut', label: 'Couper' },
      { role: 'copy', label: 'Copier' },
      { role: 'paste', label: 'Coller' },
      { role: 'selectAll', label: 'Tout sélectionner' }
    ]
  },
  {
    label: 'Affichage',
    submenu: [
      { role: 'reload', label: 'Recharger' },
      { role: 'forceReload', label: 'Forcer le rechargement' },
      { role: 'toggleDevTools', label: 'Outils de développement' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Taille réelle' },
      { role: 'zoomIn', label: 'Zoom avant' },
      { role: 'zoomOut', label: 'Zoom arrière' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Plein écran' }
    ]
  },
  {
    label: 'Fenêtre',
    submenu: [
      { role: 'minimize', label: 'Réduire' },
      { role: 'close', label: 'Fermer' }
    ]
  }
];
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});