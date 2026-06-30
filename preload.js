const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  writeSariFile: (content, filename) => ipcRenderer.invoke('write-sari-file', content, filename),
});