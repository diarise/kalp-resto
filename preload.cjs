const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  writeSariFile: (content, filename) => ipcRenderer.invoke('write-sari-file', content, filename),
  printReceipt: (htmlContent) => ipcRenderer.invoke('print-receipt', htmlContent),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printSilent: (htmlContent, deviceName) => ipcRenderer.invoke('print-silent', htmlContent, deviceName),
});