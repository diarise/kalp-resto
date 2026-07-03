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
    title: "SAPPHIRE RESTAURANT POS",
    autoHideMenuBar: true,
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

// IPC: thermal receipt printing — hidden worker window injected with HTML, triggers system print dialog
ipcMain.handle('print-receipt', async (event, htmlContent) => {
  let workerWindow = null;
  try {
    workerWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await workerWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    const result = await new Promise((resolve) => {
      workerWindow.webContents.print({
        silent: false,
        printBackground: true,
        margins: { marginType: 'none' }
      }, (success, failureReason) => {
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: failureReason || 'Print cancelled or failed' });
        }
      });
    });

    if (workerWindow && !workerWindow.isDestroyed()) {
      workerWindow.destroy();
    }
    return result;
  } catch (error) {
    if (workerWindow && !workerWindow.isDestroyed()) {
      workerWindow.destroy();
    }
    return { success: false, error: error.message };
  }
});

// IPC: get system installed hardware printers
ipcMain.handle('get-printers', (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return [];
    return win.webContents.getPrinters();
  } catch (error) {
    return [];
  }
});

// IPC: silent background print to a specific hardware printer (prep tickets)
ipcMain.handle('print-silent', async (event, htmlContent, deviceName) => {
  let workerWindow = null;
  try {
    workerWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    await workerWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    const result = await new Promise((resolve) => {
      workerWindow.webContents.print({
        silent: true,
        deviceName: deviceName || undefined,
        printBackground: true,
        margins: { marginType: 'none' }
      }, (success, failureReason) => {
        if (success) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: failureReason || 'Print failed' });
        }
      });
    });

    if (workerWindow && !workerWindow.isDestroyed()) {
      workerWindow.destroy();
    }
    return result;
  } catch (error) {
    if (workerWindow && !workerWindow.isDestroyed()) {
      workerWindow.destroy();
    }
    return { success: false, error: error.message };
  }
});

// White-label: force app name for macOS menu bar
app.setName('SAPPHIRE RESTAURANT POS');

// Custom application menu — ensures "About" and "Quit" show brand name, not folder name
const menuTemplate = [
  {
    label: 'SAPPHIRE RESTAURANT POS',
    submenu: [
      { role: 'about', label: 'À propos de SAPPHIRE RESTAURANT POS' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide', label: 'Masquer SAPPHIRE RESTAURANT POS' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit', label: 'Quitter SAPPHIRE RESTAURANT POS' }
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
if (process.platform === 'win32') {
  Menu.setApplicationMenu(null);
} else {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});