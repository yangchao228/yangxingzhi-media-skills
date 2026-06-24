# STORM Research HTML Output Template

这个模板用于把 `storm-research` 的研究结构转成可直接浏览的 HTML 页面。

适用触发语：

- “生成 HTML”
- “做一个可浏览页面”
- “做成 demo 页面”
- “做成研究看板”
- “方便用户查看”
- “给客户/团队看”

## 输出原则

- HTML 是研究结果的可视化呈现，不是公众号正文、知乎正文或营销页。
- 先完成 `storm-research` 的标准研究结构，再把同一份结果转成页面。
- 页面要帮助读者快速判断：这个主题是否值得继续采证、最强/最弱结论在哪里、下一步查什么。
- 不增加未在研究结构中出现的新结论。
- 对未核验结论使用“推断”“观点”“需要查证”等降级表述。

## 文件建议

```text
content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo-source.md
content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo.html
```

如果用户只要求页面，可以只生成 HTML；如果后续要维护、复核或交给 `wenchang-research`，建议同时保留 Markdown 源文件。

## 页面信息架构

HTML 至少包含以下区块：

1. Hero
   - 主题。
   - 一句话核心结论。
   - 使用的 skill 名称：`storm-research`。
   - 可信度或事实边界提示。

2. Demo 说明
   - 本次输入是什么。
   - 如何使用 `storm-research` 协议。
   - 本页面是研究前置结果，不是正文。

3. 多视角扫描
   - 默认 5 个视角：实践者、学者、怀疑者、经济观察者、历史观察者。
   - 可用卡片或表格。
   - 每个视角至少包含：核心关切、支持判断、反对说法、待查问题。

4. 矛盾地图
   - 直接冲突。
   - 共识底座。
   - 证据强弱。
   - 关键盲点。
   - 最值得继续查的问题。

5. 研究简报
   - 一段话摘要。
   - 5 个关键发现，按可靠性排序。
   - 隐藏连接。
   - 行动建议。
   - 前沿问题。

6. 可信度评审
   - 每个关键发现的评分。
   - 最弱结论。
   - 偏见检查。
   - 缺失视角。
   - 必须人工核验项。
   - 不适合进入下一阶段的判断。

7. 后续采证计划
   - 按 P0 / P1 / P2 或高 / 中 / 低排序。
   - 每项包含：要查的问题、建议来源、目标输出。

8. `content_state` / `handoff`
   - 用 `<pre><code>` 或结构化面板展示。
   - 保留 `topic`、`purpose`、`perspectives`、`contradiction_map`、`synthesis_brief`、`confidence_review`、`evidence_plan`、`next_step`、`handoff`。

9. 下一步建议
   - 是否进入 `wenchang-research`。
   - 为什么进入或暂缓。
   - 用户需要做的判断。

## 视觉要求

- 单文件 HTML，可直接在浏览器打开。
- 不依赖外部 CDN、远程字体、远程脚本或远程图片。
- 使用内联 CSS。
- 布局清晰，优先信息密度和可读性。
- 支持桌面和移动端基本响应式。
- 使用目录导航或锚点。
- 避免大面积浮夸渐变、装饰性光斑、营销感 hero。
- 不做成 landing page，首屏直接展示研究结果。
- 不把页面做成 Markdown 原文简单套壳。

## 推荐 HTML 骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{主题}}｜storm-research Demo</title>
  <style>
    :root {
      --bg: #f6f7f4;
      --paper: #ffffff;
      --ink: #1d2428;
      --muted: #66727a;
      --line: #d9ded8;
      --accent: #0f766e;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      line-height: 1.65;
      letter-spacing: 0;
    }
    .page { max-width: 1180px; margin: 0 auto; padding: 28px 22px 56px; }
    .hero, section {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 26px;
      margin-top: 18px;
    }
    .nav {
      position: sticky;
      top: 0;
      display: flex;
      gap: 8px;
      overflow-x: auto;
      background: rgba(246,247,244,.92);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      margin-top: 18px;
    }
    .nav a { flex: 0 0 auto; color: var(--ink); text-decoration: none; font-weight: 650; }
    .grid { display: grid; gap: 14px; }
    .cards { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
    .card { border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: #fbfcfa; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; }
    th, td { padding: 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
    pre { overflow-x: auto; padding: 16px; border-radius: 8px; background: #182126; color: #e7f0ec; }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero" id="top">
      <p>storm-research demo</p>
      <h1>{{主题}}</h1>
      <p>{{一句话核心结论}}</p>
    </header>
    <nav class="nav" aria-label="页面目录">
      <a href="#demo">Demo 说明</a>
      <a href="#perspectives">多视角扫描</a>
      <a href="#contradictions">矛盾地图</a>
      <a href="#brief">研究简报</a>
      <a href="#confidence">可信度评审</a>
      <a href="#evidence">后续采证计划</a>
      <a href="#state">content_state</a>
      <a href="#next">下一步建议</a>
    </nav>
    <section id="demo"></section>
    <section id="perspectives"></section>
    <section id="contradictions"></section>
    <section id="brief"></section>
    <section id="confidence"></section>
    <section id="evidence"></section>
    <section id="state"></section>
    <section id="next"></section>
  </main>
</body>
</html>
```

## 验证清单

生成后至少检查：

```bash
test -f content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo.html
rg -n "storm-research|多视角扫描|矛盾地图|研究简报|可信度评审|后续采证计划|content_state" content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo.html
git diff --check -- content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo.html content/outputs/YYYY-MM-DD-<topic-slug>-storm-demo-source.md
```

如果本仓有禁用句式，继续扫描新增文件。

如果环境允许，使用浏览器打开或截图检查首屏、目录、主要区块和中文编码。无法浏览器验证时，在最终回复里说明只做了静态 HTML 检查。
