function JQueryUtil() {
    this.ajaxCo = function(url, data, method, dataType) {
        return function(callback) {
            jQuery.ajax({
                url: url,
                data: data,
                type: method,
                cache: false,
                dataType: dataType,
                success: function(data, textStatus, jqXHR) {
                    callback(false, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    callback(errorThrown);
                }
            });
        };

    };
}