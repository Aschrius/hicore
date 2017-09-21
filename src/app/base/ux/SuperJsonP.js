/**
 * Created by K.sr on 2017/3/15.
 */
Ext.define('Tool.base.ux.SuperJsonP', {
    singleton: true,
    requestCount: 0,
    requests: {},
    timeout: 30000,
    disableCaching: true,
    disableCachingParam: '_dc',
    callbackKey: 'callback',
    request: function (options) {
        options = Ext.apply({}, options);
        if (!options.url) {
            Ext.raise('A url must be specified for a JSONP request.');
        }

        var me = this,
            disableCaching = Ext.isDefined(options.disableCaching) ? options.disableCaching : me.disableCaching,
            cacheParam = options.disableCachingParam || me.disableCachingParam,
            id = ++me.requestCount,
            callbackName = options.callbackName || 'callback' + id,
            callbackKey = options.callbackKey || me.callbackKey,
            timeout = Ext.isDefined(options.timeout) ? options.timeout : me.timeout,
            params = Ext.apply({}, options.params),
            url = options.url,
            name = Ext.name,
            request,
            script;


        // Add cachebuster param unless it has already been done
        if (disableCaching && !params[cacheParam]) {
            params[cacheParam] = Ext.Date.now();
        }
        options.params = params;

        params[callbackKey] = callbackName;// 修改了回掉名称
        script = me.createScript(url, params, options);

        me.requests[id] = request = {
            url: url,
            params: params,
            script: script,
            id: id,
            scope: options.scope,
            success: options.success,
            failure: options.failure,
            callback: options.callback,
            callbackKey: callbackKey,
            callbackName: callbackName
        };

        if (timeout > 0) {
            request.timeout = Ext.defer(me.handleTimeout, timeout, me, [request]);
        }
        me.setupErrorHandling(request);
        window[callbackName] = Ext.bind(me.handleResponse, me, [request], true);// 修改了毁掉函数放的位置
        me.loadScript(request);
        return request;
    },

    abort: function (request) {
        var me = this,
            requests = me.requests,
            key;

        if (request) {
            if (!request.id) {
                request = requests[request];
            }
            me.handleAbort(request);
        } else {
            for (key in requests) {
                if (requests.hasOwnProperty(key)) {
                    me.abort(requests[key]);
                }
            }
        }
    },

    setupErrorHandling: function (request) {
        request.script.onerror = Ext.bind(this.handleError, this, [request]);
    },

    handleAbort: function (request) {
        request.errorType = 'abort';
        this.handleResponse(null, request);
    },

    handleError: function (request) {
        request.errorType = 'error';
        this.handleResponse(null, request);
    },

    cleanupErrorHandling: function (request) {
        request.script.onerror = null;
    },

    handleTimeout: function (request) {
        request.errorType = 'timeout';
        this.handleResponse(null, request);
    },

    handleResponse: function (result, request) {

        var success = true,
            globalEvents = Ext.GlobalEvents;

        if (request.timeout) {
            clearTimeout(request.timeout);
        }
        delete window[request.callbackName];
        delete this.requests[request.id];
        this.cleanupErrorHandling(request);
        Ext.fly(request.script).destroy();

        if (request.errorType) {
            success = false;
            Ext.callback(request.failure, request.scope, [request.errorType]);
        } else {
            Ext.callback(request.success, request.scope, [result]);
        }
        Ext.callback(request.callback, request.scope, [success, result, request.errorType]);
        if (globalEvents.hasListeners.idle) {
            globalEvents.fireEvent('idle');
        }

    },

    createScript: function (url, params, options) {
        var script = document.createElement('script');
        script.setAttribute("src", Ext.urlAppend(url, Ext.Object.toQueryString(params)));
        script.setAttribute("async", true);
        script.setAttribute("type", "text/javascript");
        return script;
    },

    loadScript: function (request) {
        Ext.getHead().appendChild(request.script);
    }
});
