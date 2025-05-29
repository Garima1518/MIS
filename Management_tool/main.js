const { app, BrowserWindow } = require('electron');
const http = require('http');

// Replace with your actual IP and port
const SERVER_URL = 'http://172.16.101.127:3000';

function waitForServer(url, callback) {
  const tryConnect = () => {
    http.get(url, () => {
      console.log("✅ Server is up. Launching app...");
      callback();
    }).on('error', () => {
      console.log("🔁 Waiting for server at", url);
      setTimeout(tryConnect, 1000);
    });
  };
  tryConnect();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(SERVER_URL);
}

app.whenReady().then(() => {
  waitForServer(SERVER_URL, createWindow);
});
