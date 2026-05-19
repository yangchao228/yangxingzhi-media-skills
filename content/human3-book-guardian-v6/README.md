# Human3.0 成书守门员 v6

这一版把入口彻底收口成一句话：

**请使用 Human3.0 成书守门员审查这篇文章**

## 默认使用方式

你只需要：
1. 上传一篇 **Markdown 原文文件**，或直接粘贴文章正文
2. 说一句：

```text
请使用 Human3.0 成书守门员审查这篇文章
```

然后 skill 会自动完成：
- 识别原始标题
- 生成书稿备注标题
- 判断通过 / 条件通过 / 不通过
- 判断归属主线
- 给出建议章节
- 给出最小纠偏建议
- 生成素材库 Markdown 条目
- 判断归档到 Part 1~Part 6 或未归档

## 输入约定

- **优先支持 Markdown 文件上传**
- 当前上传的 Markdown 文件默认就是待审文章
- 不需要你手动提供标题、章节、标签、归档位置

## 推荐工作流

### 第一步：上传 Markdown 原文
例如：
- `my-article.md`
- `draft-human3.md`

### 第二步：触发审查

```text
请使用 Human3.0 成书守门员审查这篇文章
```

### 第三步：保存审查结果（可选）
把模型输出保存为：

```bash
review_result.md
```

### 第四步：归档到 `human3.0_book/`（推荐）

如果用户确认进入 Human3.0 成书归档，推荐在仓库根目录维护：

```text
human3.0_book/
  materials.md
  entries/YYYY-MM-DD-slug.md
```

- `materials.md`：只追加索引条目，按 Part 1 到 Part 6 归类。
- `entries/`：保存单篇素材卡片、审查结论、发布包和正文快照。

归档后执行：

```bash
python scripts/validate_human3_book.py
```

### 第五步：旧版单文件素材库归档（兼容）

先准备素材库文件：

```bash
cp templates/Human3.0-book-materials.md Human3.0-book-materials.md
```

再执行：

```bash
python scripts/archive_from_review.py --review review_result.md --materials Human3.0-book-materials.md
```

## 目录

- `SKILL.md`：极简触发规则与审查标准
- `inputs/book_map.md`：Human3.0 成书地图
- `inputs/review_rubric.md`：硬判断标准
- `templates/Human3.0-book-materials.md`：素材库模板
- `examples/example_request.md`：最短触发示例
- `scripts/archive_from_review.py`：从审查结果自动归档
- 其他脚本：保留兼容使用
