# 榜单制作工具
仅本地客户端部分

## 收录辅助
* 需要服务端存储 黑名单/收录/pickup 信息
## 素材制作
* CSV -> PNG、YML
## 视频制作
* 需服务端提供脚本生成能力
* YML -> AVS


# TODO
~~1. [20170517] 黑名单~~
~~2. [20170517] pickup~~
~~3. [20170524]服务端接口请求权限~~
~~4. 排行数据获取&导出~~
~~5. 命令行工具规划~~
~~6. 副榜图片生成bug~~
7. 增加一键打开所有详情
8. 自动更新
9. 按权限显示页面与元素
10. filter维护
11. rule维护
12. part维护


```sql
CREATE TABLE t_member(
   id            int PRIMARY KEY NOT NULL,
   avatar        CHAR(255) NOT NULL,
   avatar_real   CHAR(255) NOT NULL,
   name          CHAR(255) NOT NULL,
   create_date   timestamp NOT NULL,
   update_date   timestamp NOT NULL
);

CREATE TABLE t_illust(
   id            int PRIMARY KEY NOT NULL,
   member_id     int NOT NULL,
   title         CHAR(255)  NOT NULL,
   cover         CHAR(255)  NOT NULL,
   cover_real    CHAR(255)  NOT NULL,
   type          int NOT NULL,
   create_date   timestamp  NOT NULL,
   update_date   timestamp  NOT NULL
);

CREATE INDEX idx_illust_member_id ON t_illust (member_id);

CREATE TABLE t_illust_item(
   id            int PRIMARY KEY NOT NULL,
   illust_id     int NOT NULL,
   name          CHAR(255)  NOT NULL,
   status        int NOT NULL,
   create_date   timestamp  NOT NULL,
   update_date   timestamp  NOT NULL
);
CREATE INDEX idx_illust_item_illust_id ON t_illust_item (illust_id);

```





