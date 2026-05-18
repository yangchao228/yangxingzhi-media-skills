#!/usr/bin/env python3
"""
通过 Playwright 浏览器自动化发布到小红书创作者后台草稿箱。

依赖安装:
  pip install playwright
  playwright install chromium

用法:
  python3 publish_xiaohongshu.py --title "标题" --content "正文" \
    --images img1.jpg img2.jpg [--headless]

注意:
  - 小红书没有官方开放 API，此脚本通过创作者后台自动化实现
  - 首次运行需要手动登录，脚本会等待登录完成
  - 建议先手动登录 creators.xiaohongshu.com 保存 cookie
  - 小红书后台可能改版导致选择器失效，需维护
"""

import argparse
import json
import os
import sys
import time

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("错误: 请安装 playwright")
    print("  pip install playwright")
    print("  playwright install chromium")
    sys.exit(1)

CREATOR_URL = "https://creator.xiaohongshu.com/"
LOGIN_TIMEOUT = 120  # 等待登录的超时时间(秒)


def save_cookies(page, cookie_path):
    cookies = page.context.cookies()
    with open(cookie_path, "w") as f:
        json.dump(cookies, f, indent=2)
    print(f"Cookie 已保存到 {cookie_path}")


def load_cookies(context, cookie_path):
    if not os.path.exists(cookie_path):
        return False
    with open(cookie_path, "r") as f:
        cookies = json.load(f)
    context.add_cookies(cookies)
    return True


def publish(browser, title, content, images, headless=False, cookie_path=None):
    if cookie_path is None:
        cookie_path = os.path.join(os.path.dirname(__file__), "xhs_cookies.json")

    page = browser.new_page()

    # 尝试加载已有 cookie
    if load_cookies(page.context, cookie_path):
        page.goto(CREATOR_URL, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(2000)
    else:
        page.goto(CREATOR_URL, wait_until="domcontentloaded", timeout=30000)
        print("请先在浏览器中完成登录...")
        # 等待用户登录完成（检测特定元素）
        try:
            page.wait_for_selector('button:has-text("发布笔记")', timeout=LOGIN_TIMEOUT * 1000)
            print("登录成功!")
        except Exception:
            print("登录超时，请手动完成登录后重试")
            return

    # 保存 cookie 供下次使用
    save_cookies(page, cookie_path)

    # 点击发布笔记按钮
    # 注意: 小红书后台可能改版，需要根据实际 DOM 调整选择器
    try:
        publish_btn = page.wait_for_selector('button:has-text("发布笔记"), .publish-btn', timeout=10000)
        publish_btn.click()
        page.wait_for_timeout(2000)
    except Exception:
        # 如果已经在发布笔记页面，直接继续
        pass

    # 填写标题
    try:
        title_input = page.wait_for_selector('input[placeholder*="标题"], .title-input', timeout=10000)
        title_input.fill(title)
        page.wait_for_timeout(500)
    except Exception as e:
        print(f"填写标题失败: {e}")
        print("提示: 小红书后台可能已改版，需要更新选择器")

    # 填写正文
    try:
        content_editor = page.wait_for_selector('div[contenteditable="true"], .content-editor', timeout=10000)
        content_editor.click()
        content_editor.fill(content)
        page.wait_for_timeout(500)
    except Exception as e:
        print(f"填写正文失败: {e}")

    # 上传图片
    for img_path in images:
        if not os.path.exists(img_path):
            print(f"图片不存在: {img_path}")
            continue
        try:
            file_input = page.query_selector('input[type="file"]')
            if file_input:
                file_input.set_input_files(img_path)
                page.wait_for_timeout(2000)
        except Exception as e:
            print(f"上传图片失败 {img_path}: {e}")

    # 保存到草稿（不直接发布）
    try:
        save_draft_btn = page.wait_for_selector('button:has-text("存草稿"), button:has-text("保存")', timeout=10000)
        save_draft_btn.click()
        page.wait_for_timeout(3000)
        print("已保存到草稿箱!")
    except Exception as e:
        print(f"保存草稿失败: {e}")
        print("提示: 页面内容已填写，请手动保存")


def main():
    parser = argparse.ArgumentParser(description='发布到小红书创作者后台草稿')
    parser.add_argument('--title', required=True, help='笔记标题')
    parser.add_argument('--content', required=True, help='正文内容')
    parser.add_argument('--images', nargs='+', default=[], help='图片路径列表')
    parser.add_argument('--headless', action='store_true', help='无头模式')
    parser.add_argument('--cookies', default=None, help='Cookie 文件路径')
    args = parser.parse_args()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=args.headless,
            slow_mo=500 if not args.headless else 0,  # 可视化模式下减速方便观察
        )
        publish(browser, args.title, args.content, args.images, args.headless, args.cookies)
        browser.close()


if __name__ == '__main__':
    main()
