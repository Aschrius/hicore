# 接口

1. 用户信息接口
userInfo { ->
    id,name
}

2. 签名
doSign { url,method,requestBody ->
    appKey + timestamp + versionCode + requestBody + signSecret
}

3. 解析视频参数
analysisVideo{ path ->
    参数
}

4. verify
5. login





