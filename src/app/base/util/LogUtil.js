function LogUtil() {
    var fs = require('fs');

    this.log = function (content) {
        var d = new Date();
        var timeStamp = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
        var errFile = AT.path + "../../console.log";
        if (fs.existsSync(errFile)) {
            fs.appendFileSync(errFile, timeStamp);
            fs.appendFileSync(errFile, "\r\n");
            fs.appendFileSync(errFile, content);
            fs.appendFileSync(errFile, "\r\n");
        }
        else {
            fs.writeFileSync(errFile, timeStamp);
            fs.appendFileSync(errFile, "\r\n");
            fs.appendFileSync(errFile, content);
            fs.appendFileSync(errFile, "\r\n");
        }

    }


}
