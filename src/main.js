const {ipcMain, app, BrowserWindow, protocol} = require('electron');
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
    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    if (fs.existsSync(process.cwd().replace(/\\/g, "/") + '/../debug')) {
        mainWindow.openDevTools();
    }

    // // app 协议注册拦截
    // protocol.registerFileProtocol('app', function (request, callback) {
    //     callback(null);
    // }, function (error) {
    //     if (error)
    //         console.error('Failed to register protocol')
    // });

    // will-navigate
    mainWindow.webContents.on('will-navigate', function (event, url) {
        if (url.startsWith('APP://') || url.startsWith('app://')) {
            event.preventDefault();

            let jsonStr = url.substr(6);
            try {
                jsonStr = JSON.parse(jsonStr);
                let {id, service, data} = dataStr;
                

            } catch (e) {
            }
        }

    });

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




