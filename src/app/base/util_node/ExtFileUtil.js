"use strict";
try {
    Ext.define('Tool.base.util_node.ExtFileUtil', {});
} catch (e) {
    console.log(e)
}

class ExtFileUtil {

    static checkParentNode(node, checked) {
        node.set('checked', checked);
        // 父节点
        if (node.parentNode != null) {
            ExtFileUtil.checkParentNode(node.parentNode, checked);
        }
        // 这里是测试，不包含extjs框架中的root
        else {
            node.set('checked', false);
        }
    };

    static checkChildrenNode(node, checked) {
        node.set('checked', checked);
        if (node.childNodes.length != 0) {
            let i;
            let l = node.childNodes.length;
            for (i = 0; i < l; i++) {
                ExtFileUtil.checkChildrenNode(node.childNodes[i], checked);
            }
        }
    };

    static checkEqualNode(node) {
        if (node.parentNode == null)
            return;
        let equalNodeList = node.parentNode.childNodes;
        if (equalNodeList.length != 0) {
            let i;
            let flag = false;
            for (i = 0; i < equalNodeList.length; i++) {
                if (equalNodeList[i].get('checked'))
                    flag = true;

            }
            ExtFileUtil.checkParentNode(node.parentNode, flag);
        }
        ExtFileUtil.checkEqualNode(node.parentNode);
    };

    static expandFileTreeById(store, id) {
        let idArray = id.split('/');
        id = '';
        for (let i = 1; i < idArray.length; i++) {
            id = id + '/' + idArray[i];
            let node = store.getById(id);
            if(node!=null){
                node.expand();
            }


        }

    }

    static changeTreeState(node, checked) {
        // 三态树的实现
        // TODO 三态树的实现
        ExtFileUtil.checkChildrenNode(node, checked);
        ExtFileUtil.checkEqualNode(node);
    };

    static getTreeData(rootPath) {
        return new Promise(function (resolve, reject) {
            (function (rootPath, resolve, reject) {

                let fs = require('fs');
                let path = require('path');

                let me = {
                    tempPaths: []
                };

                // console.log(me.tempPaths.length)

                // 取出目录下所有文件
                function getFilesFromPath(dir, done) {
                    let results = [];
                    fs.readdir(dir,
                        function (err, list) {
                            if (err) return done(err);
                            let pending = list.length;
                            if (!pending) return done(null, results);
                            list.forEach(function (file) {
                                file = path.resolve(dir, file);
                                fs.stat(file,
                                    function (err, stat) {
                                        if (stat && stat.isDirectory()) {
                                            // 回掉
                                            getFilesFromPath(file,
                                                function (err, res) {
                                                    results = results.concat(res);
                                                    if (!--pending) done(null, results);
                                                });
                                        } else {
                                            results.push(file);
                                            if (!--pending) done(null, results);
                                        }
                                    });
                            });
                        });
                }

                function dgSortPathObj(pathObj) {
                    if (pathObj.children != null) {

                        pathObj.children.sort(function (a, b) {

                            let s = a.text[0];
                            let e = b.text[0];
                            if (s > e) {
                                return 1
                            } else if (s < e) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });

                        for (let i = 0; i < pathObj.children.length; i++) {
                            dgSortPathObj(pathObj.children[i]);
                        }

                    }

                }

                function dgGetPathObj(pathObj, paths) {
                    let path_ = paths.shift();

                    // 判断是否有子节点
                    if (pathObj.children == null) {
                        pathObj.children = [];
                    }

                    let flag = false;
                    // 判断是否已经存在
                    //console.log("=========================")
                    //console.log(pathObj.children.length);
                    //console.log(path)
                    //console.log(paths);
                    let i = 0;
                    for (; i < pathObj.children.length; i++) {
                        let text = pathObj.children[i].text;
                        //console.log(text)
                        if (text == path_) {
                            flag = true;
                            break;
                        }

                    }

                    // create id;
                    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    // console.log(me.tempPaths);
                    // console.log(paths);
                    let id = '';
                    for (let j = 0; j < me.tempPaths.length - paths.length; j++) {

                        id += '/' + me.tempPaths[j];

                    }
                    // console.log('===============')
                    // console.log(id);

                    // 不存在,创建节点
                    if (!flag) {
                        //console.log("create node"+path);
                        //pathObj.children.push({text: path});
                        // TODO test
                        pathObj.leaf = false;
                        pathObj.children.push({
                            text: path_,
                            leaf: true,
                            checked: false,
                            id: id // id节点
                        });
                    }


                    if (paths.length != 0) {

                        flag = false;
                        for (i = 0; i < pathObj.children.length; i++) {
                            let text = pathObj.children[i].text;
                            //console.log(text)
                            if (text == path_) {
                                flag = true;
                                break;
                            }
                        }
                        //console.log(flag);
                        dgGetPathObj(pathObj.children[i], paths);

                        //if (!flag)
                        //    me.dgGetPathObj(pathObj.children[0], paths);
                        //else
                        //    me.dgGetPathObj(pathObj.children[i], paths);
                        /// {text:"",children[]

                    }

                }

                getFilesFromPath(rootPath,
                    function (e, paths) {

                        rootPath = rootPath.replace(/\//g, "\\");
                        let finPaths = [];

                        let pathObj = {
                            text: "proPath"
                        };

                        for (let i = 0; i < paths.length; i++) {
                            let path_ = paths[i];
                            //var p = path_;
                            let p = paths[i].replace(rootPath, "");
                            finPaths.push(p);
                            //console.log(p)
                        }

                        for (let i = 0; i < finPaths.length; i++) {
                            let ps = finPaths[i].split(/\\/g);
                            me.tempPaths = ps.concat();
                            dgGetPathObj(pathObj, ps);
                        }

                        dgSortPathObj(pathObj);
                        //console.log(JSON.stringify(pathObj));
                        if (e) {
                            reject(e);
                        } else {
                            resolve(pathObj)
                        }

                    });

            })(rootPath, resolve, reject);

        });
    }
}
