const {ipcMain, app, BrowserWindow} = require('electron');
const fs = require('fs');
// app.commandLine.appendSwitch('js-flags','--harmony')

let mainWindow = null;
app.on('window-all-closed', function () {
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            webSecurity: false, // 去除同源安全策略
            allowRunningInsecureContent: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/demo.html#demo.zip');
    if (fs.existsSync(process.cwd().replace(/\\/g, "/") + '/../debug')) {
    }
        mainWindow.openDevTools();


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

ipcMain.on('change-Host', (event, params) => {
    console.log('[' + params.urls.join() + '] change-Host to ' + params.Host);
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
        let {requestHeaders} = detail;
        requestHeaders = Object.assign(requestHeaders, {Host: params.Host});
        cb({requestHeaders});
    }, {
        urls: [].concat(params.urls),
        types: ['xmlhttprequest']
    });
});

ipcMain.on('change-Cookie', (event, params) => {
    console.log('[' + params.urls.join() + '] change-cookie to ' + params.Cookie);
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
        let {requestHeaders} = detail;
        requestHeaders = Object.assign(requestHeaders, {Cookie: params.Cookie});
        cb({requestHeaders});
    }, {
        urls: [].concat(params.urls),
        types: ['xmlhttprequest']
    });
});

ipcMain.on('change-referer', (event, params) => {
    console.log('[' + params.urls.join() + '] change-referer to ' + params.Referer);
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
        let {requestHeaders} = detail;
        requestHeaders = Object.assign(requestHeaders, {Referer: params.Referer});
        cb({requestHeaders});
    }, {
        // urls: ['<all_urls>'],
        urls: [].concat(params.urls),
        types: ['xmlhttprequest']
    });
});




