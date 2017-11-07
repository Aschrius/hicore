"use strict";
try {
    Ext.define('Tool.base.util.AtKitchen', {});
} catch (e) {
    console.log(e)
}

// // 启动
// async function toOrder(){
//     try{
//         let course = await AtKitchen.order({
//             name:'桂花鱼',
//             service:'cook',
//             data:''
//         });
//         console.log('-------------')
//         console.log(course)
//     }catch(e){
//         console.log('error')
//             console.log(e);
//     }
// }
// toOrder();
//
//
// // 回掉
// function callback(){
//     let id = window.id;
//     console.log('doCallback id='+id) ;
//     let data = {success:true,data:{abc:123}};
//     AtKitchen.serving(id,data);
// }
//


class AtKitchen {
    static call(atWaiter) {
        AtKitchen.map.set(atWaiter.id, atWaiter);
    }

    static serving(id, course) {
        let atWaiter = AtKitchen.map.get(id);
        if (atWaiter == null) {
            console.error('未找到atWaiter');
            return
        }
        atWaiter.callback(course);
        AtKitchen.map.delete(id);
    }

    static order(props) {
        let {name, service, data} = props;
        return new Promise(function (resolve, reject) {
            // 1. 创建回掉
            let atWaiter = new AtWaiter({
                name: name,
                service: service,
                data: data,
                resolve: resolve,
                reject: reject
            });
            AtKitchen.call(atWaiter);
        });

    }

}

AtKitchen.map = new Map();

class AtWaiter {
    //构造函数
    constructor(props) {
        let {name, service, data, resolve, reject} = props;
        if (name == null || resolve == null || reject == null) {
            throw new Error('Waiter构建错误')
        }
        this.name = name;
        this.service = service;
        this.data = data;
        this.resolve = resolve;
        this.reject = reject;
        this.date = new Date();
        this.id = name + this.date.getTime();

    }

    callback(course) {
        if (course.success) {
            this.resolve(course)
        } else {
            this.reject(course)
        }


    }
}
