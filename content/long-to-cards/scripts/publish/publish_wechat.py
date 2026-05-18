#!/usr/bin/env python3
"""
发布图文到微信公众号草稿箱。

依赖: pip install requests

用法:
  python3 publish_wechat.py --app-id YOUR_APP_ID --app-secret YOUR_APP_SECRET \
    --title "文章标题" --content "<p>正文HTML</p>" \
    --thumb media_id_or_path

微信公众号 API 文档: https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
"""

import argparse
import json
import os
import requests

BASE_URL = "https://api.weixin.qq.com/cgi-bin"


def get_access_token(app_id, app_secret):
    """获取 access_token"""
    url = f"{BASE_URL}/token"
    params = {
        "grant_type": "client_credential",
        "appid": app_id,
        "secret": app_secret,
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    data = resp.json()
    if "access_token" not in data:
        raise Exception(f"获取 token 失败: {data}")
    return data["access_token"]


def upload_media(app_id, app_secret, media_type, file_path):
    """上传临时素材（用于封面图等）"""
    token = get_access_token(app_id, app_secret)
    url = f"{BASE_URL}/media/upload"
    params = {"access_token": token, "type": media_type}
    with open(file_path, "rb") as f:
        files = {"media": f}
        resp = requests.post(url, params=params, files=files)
    resp.raise_for_status()
    data = resp.json()
    if "media_id" not in data:
        raise Exception(f"上传素材失败: {data}")
    return data["media_id"]


def upload_permanent_media(app_id, app_secret, file_path):
    """上传永久素材（封面图）"""
    token = get_access_token(app_id, app_secret)
    url = f"{BASE_URL}/material/add_material"
    params = {"access_token": token, "type": "image"}
    with open(file_path, "rb") as f:
        files = {"media": f}
        resp = requests.post(url, params=params, files=files)
    resp.raise_for_status()
    data = resp.json()
    if "media_id" not in data:
        raise Exception(f"上传永久素材失败: {data}")
    return data["media_id"]


def draft_add(app_id, app_secret, articles):
    """
    添加草稿。

    articles 列表格式:
    [
      {
        "title": "标题",
        "content": "正文 HTML",
        "thumb_media_id": "封面图 media_id",
        "author": "作者名",          # 可选
        "digest": "摘要",            # 可选，不填自动从正文提取
        "show_cover_pic": 1,         # 0 或 1
        "need_open_comment": 0,      # 是否打开评论
        "only_fans_can_comment": 0,  # 仅粉丝可评论
      },
    ]
    """
    token = get_access_token(app_id, app_secret)
    url = f"{BASE_URL}/draft/add"
    params = {"access_token": token}
    payload = {"articles": articles}

    resp = requests.post(url, params=params, json=payload)
    resp.raise_for_status()
    data = resp.json()

    if "media_id" in data:
        print(f"草稿创建成功! media_id: {data['media_id']}")
        return data["media_id"]
    else:
        raise Exception(f"草稿创建失败: {data}")


def main():
    parser = argparse.ArgumentParser(description='发布到微信公众号草稿箱')
    parser.add_argument('--app-id', required=True, help='公众号 AppID')
    parser.add_argument('--app-secret', required=True, help='公众号 AppSecret')
    parser.add_argument('--title', required=True, help='文章标题')
    parser.add_argument('--content', required=True, help='正文 HTML 内容')
    parser.add_argument('--thumb', required=True, help='封面图路径或 media_id')
    parser.add_argument('--author', default='', help='作者名')
    parser.add_argument('--digest', default='', help='摘要')
    parser.add_argument('--config', help='从 JSON 配置文件读取参数（覆盖其他参数）')
    args = parser.parse_args()

    # 如果指定了配置文件，优先使用配置文件
    if args.config and os.path.exists(args.config):
        with open(args.config, 'r', encoding='utf-8') as f:
            cfg = json.load(f)
        args.app_id = cfg.get('app_id', args.app_id)
        args.app_secret = cfg.get('app_secret', args.app_secret)
        args.title = cfg.get('title', args.title)
        args.content = cfg.get('content', args.content)
        args.thumb = cfg.get('thumb', args.thumb)
        args.author = cfg.get('author', args.author)
        args.digest = cfg.get('digest', args.digest)

    # 处理封面图
    thumb_media_id = args.thumb
    if os.path.isfile(args.thumb):
        print(f"上传封面图: {args.thumb}")
        thumb_media_id = upload_permanent_media(args.app_id, args.app_secret, args.thumb)
        print(f"封面图 media_id: {thumb_media_id}")

    articles = [{
        "title": args.title,
        "content": args.content,
        "thumb_media_id": thumb_media_id,
        "author": args.author,
        "digest": args.digest,
        "show_cover_pic": 1,
        "need_open_comment": 0,
        "only_fans_can_comment": 0,
    }]

    draft_add(args.app_id, args.app_secret, articles)


if __name__ == '__main__':
    main()
