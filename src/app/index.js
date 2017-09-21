"use strict";
window.AT = {
    isAsar: true,
    ipcRenderer: require('electron').ipcRenderer,
    // subsystem: 'sys',
    // subsystem: 'trend',
    subsystem: 'box',
    app: {
        name: 'Tool',
        version: '6.0.0',
        versionCode: '600',
        folder: '',
        path: process.cwd().replace(/\\/g, "/"),
        server: 'http://api.eylsun.com/',
        time_difference: 0,
        theme: 1
    },
    auth: {
        uiData: null,
        interfaceIdSet: new Set(),
        id: null,// 用户ID
        password: null,// 用户密码(获取verifyCode用)
        token: null,//根据 ID、verifyCode，验证签发，包含ip、path 签名
    },
    cache: {}
};

try {
    (async function (AT) {
        let fs = require('fs');
        let yaml = require('js-yaml');
        let content = fs.readFileSync(AT.app.path + '/../app.yml');
        let config = yaml.safeLoad(content);
        if (config == null) return;

        AT.app.id = config.id;
        AT.app.email = config.email;
        AT.app.password = config.password;
        AT.app.appKey = config.appKey;
        AT.app.appSecret = config.appSecret;
        AT.app.theme = config.theme;
        if (typeof config.server != 'undefined' && config.server != null) {
            AT.app.server = config.server;
        }
    })(AT);
} catch (e) {
    console.error(e);
}

if (AT.app.theme == 1) {
    Ext.util.CSS.swapStyleSheet("theme", "../../render_modules/ext-6.2.0/classic/theme-triton/resources/theme-triton-all.css");
} else {
    Ext.util.CSS.swapStyleSheet("theme", "../../render_modules/ext-6.2.0/classic/theme-crisp/resources/theme-crisp-all.css");
}


/**
 * 动态加载
 * 需要自己去重新获取组件
 */
Ext.Loader.setConfig({enabled: true});
Ext.app.Application.addMembers({
    //加载Controller后触发事件,加载子controller
    newControllerAdded: function (idx, cntr) {
        console.info('[newControllerAdded] - ' + cntr._moduleClassName);
        // let me = Tool.getApplication();
        let me = this;
        if (cntr.controllers != null)
            cntr.controllers.forEach(function (value) {
                me.getController(value);
            });
    }
});
/*** extjs 程序入口***/
Ext.application({
    name: AT.app.name,
    id: AT.app.version,
    appFolder: AT.app.folder,
    controllers: [
        'Tool.base.controller.MvcController',
        'Tool.base.controller.LoginController',
        // 'Tool.base.controller.IndexController',
        'Tool.box.IndexController',
    ],
    launch: function () {
        Ext.tip.QuickTipManager.init();

        this.controllers.addListener('add', this.newControllerAdded, this);


        let mvcview = Ext.widget('mvcview');
        let tabpanel = Ext.ComponentQuery.query('mvcview tabpanel')[0];
        tabpanel.removeAll();

        let pan = null;
        // pan = Ext.widget('base-index-pan');
        // tabpanel.add(pan);
        // tabpanel.setActiveTab(pan.id);

        pan = Ext.widget('box-index-pan');
        tabpanel.add(pan);
        tabpanel.setActiveTab(pan.id);

        // 隐藏loading
        let loadingIframes = document.getElementsByClassName('loading');
        for (let i = 0; i < loadingIframes.length; i++) {
            loadingIframes[i].style.display = 'none';
        }

    }
});

