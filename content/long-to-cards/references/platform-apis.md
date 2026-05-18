# 平台发布 API 参考

## 微信公众号

### 前置条件

1. 拥有**已认证的服务号或订阅号**
2. 在 [微信公众平台](https://mp.weixin.qq.com/) → 设置与开发 → 基本配置 中获取：
   - AppID
   - AppSecret
3. 在「IP白名单」中添加服务器 IP

### 核心 API

| 操作 | 方法 | URL | 说明 |
|------|------|-----|------|
| 获取 Token | GET | `/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET` | token 有效期 7200s |
| 上传临时素材 | POST | `/cgi-bin/media/upload?type=TYPE` | 3天后自动删除 |
| 上传永久素材 | POST | `/cgi-bin/material/add_material?type=image` | 图片上限 5000 张 |
| 新建草稿 | POST | `/cgi-bin/draft/add` | 最多 8 篇/次 |
| 获取草稿列表 | POST | `/cgi-bin/draft/batchget` | 分页获取 |
| 删除草稿 | POST | `/cgi-bin/draft/delete` | 根据 media_id |

### 新建草稿请求体

```json
{
  "articles": [
    {
      "title": "文章标题",
      "content": "<p>正文 HTML 内容</p>",
      "thumb_media_id": "封面图 media_id",
      "author": "作者",
      "digest": "摘要(不填自动提取)",
      "show_cover_pic": 1,
      "need_open_comment": 0,
      "only_fans_can_comment": 0
    }
  ]
}
```

### 频率限制

- access_token: 每小时 2000 次
- 草稿操作: 每分钟 100 次
- 素材上传: 每分钟 100 次

### 错误码速查

| 错误码 | 含义 |
|--------|------|
| 40001 | token 无效/过期 |
| 40014 | token 不合法 |
| 45009 | 接口调用频率超限 |
| 40007 | 不合法的 media_id |

---

## 小红书

### 现状

小红书**没有面向内容创作者的开放 API**。内容发布有两种路径：

1. **手动**: 创作者后台 `creator.xiaohongshu.com` 网页端，或手机 App
2. **自动化**: 通过 Playwright 等浏览器自动化工具操作创作者后台

### 自动化方案

- 使用 `scripts/publish/publish_xiaohongshu.py`
- 首次运行需手动登录保存 cookie
- 后续运行自动加载 cookie 登录
- ⚠️ 小红书后台 DOM 结构可能随时变化，需要维护选择器

### 创作者后台发布流程

1. 访问 `https://creator.xiaohongshu.com/`
2. 登录（手机号/微信扫码）
3. 点击「发布笔记」
4. 填写标题（最多 20 字）
5. 填写正文（最多 1000 字）
6. 上传图片（最多 9 张，建议 3:4 比例）
7. 添加话题标签（`#话题名` 格式写在正文中）
8. 发布或保存草稿

### 小红书内容规范

- 标题: 1-20 字
- 正文: 1-1000 字
- 图片: 1-9 张，建议 3:4 (1080x1440) 或 1:1
- 话题标签: 最多 10 个，写在正文末尾

### 小红书 MCN 开放平台（企业级）

- URL: https://open.xiaohongshu.com/
- 面向 MCN 机构，支持达人管理、数据查询
- **不支持**第三方直接发布内容
