# 本地分发工具安装与交付

标准 `wenchang-skill-pack-v版本.zip` 交付内容生产 Skills、模板与说明。显式加入 `--with-publishing` 才生成 `wenchang-publishing-pack-v版本.zip`，包含可在新目录重建的分发工具源码、锁定依赖、浏览器桥接、R2 Python 工具、测试和纯合成样稿。

两个包都不附真实账号、凭证、平台回执、用户文章、依赖目录或已构建程序。README 与实施方案保留完整项目进展，其中真实稿件、历史回执、开发待办等链接仅在原仓库中可用；交付包未复制这些私密或用户产物。实施方案中描述的验收结果属于项目历史记录，不代表新安装用户已完成验收。

## 生成独立交付包

从仓库根目录运行，指定新版本和独立输出目录：

```sh
VERSION=0.2 ./scripts/package_for_sale.sh --with-publishing --out-dir /tmp/wenchang-delivery
```

默认内容生产包仍使用 `./scripts/package_for_sale.sh`；同名工作目录或 zip 已存在时拒绝覆盖。此命令不会修改已有 v0.1 交付物。发布工具按白名单复制 `src/`、`schemas/`、`browser/`、`test/`、包配置、指定 R2 源码和合成 fixture，生成逐文件 SHA-256 清单并与源仓库比较；不执行上传、登录或平台操作。

源码包先生成 `publishing-manifest.json` 的源码哈希，再生成 `package-manifest.txt` 的完整文件列表，复核通过后才压缩。解压校验会拒绝未列出的文件，以及清单缺失、重复、漏项或多项；只豁免根目录的清单自身，同名嵌套文件仍须列入。兼容旧包把根清单自身列入的格式。默认内容包与源码包均按大小写不敏感规则阻断 `.git`、凭证、`.env*` 环境文件及生成目录，并拒绝符号链接、命名管道等非常规条目和含换行或回车的文件名。清单使用包内相对路径生成，输出目录名中的空格、方括号或 `#` 不参与路径表达式处理；生成与校验不覆盖已有版本或修改用户安装目录。

## 在解压目录安装

需要 Node.js 22+（含 npm）和 Python 3.8+。依赖安装只作用于当前工具目录，不需要全局安装。先检查文件及运行时，再安装并验证：

```sh
python3 scripts/validate_publishing_package.py --package . --check-runtimes
npm --prefix tools/wenchang-publishing ci
npm --prefix tools/wenchang-publishing run build
npm --prefix tools/wenchang-publishing run typecheck
npm --prefix tools/wenchang-publishing test
node tools/wenchang-publishing/dist/cli.js --help
```

首次 `npm ci` 需要访问 npm registry，或者本机已有完整 npm 缓存。缓存齐全时可使用 `npm --prefix tools/wenchang-publishing ci --offline`；缺包会明确失败，安装器不改镜像或代理。已安装依赖时可直接 build/typecheck/test；`npm ci` 会重建该目录的 node_modules，不要在里面保存个人文件。测试会建立临时目录，并监听临时回环端口，不连接平台。

包完整性检查适用于尚未构建的解压目录。构建后生成的 node_modules/dist 属于本机运行产物，不应重新装入交付包；需要再次检查交付物时，使用新的解压目录。

## 跑通纯本地样稿

在解压目录运行：

```sh
node tools/wenchang-publishing/dist/cli.js init --workspace content/publishing/p0/fixture --source content/publishing/p0/fixture/body.md --metadata content/publishing/p0/fixture/metadata.json --out content/publishing/p0/fixture/distribution
node tools/wenchang-publishing/dist/cli.js build --dir content/publishing/p0/fixture/distribution
node tools/wenchang-publishing/dist/cli.js check --dir content/publishing/p0/fixture/distribution
node tools/wenchang-publishing/dist/cli.js serve --dir content/publishing/p0/fixture/distribution
```

打开 CLI 返回的 127.0.0.1 地址。样稿与两张图片均为合成材料；本地就绪只证明构建与校验通过，不表示平台草稿已保存。

## 三个平台的前置条件

公众号 API 需要用户自己的 AppID、AppSecret、接口权限和出口 IP 白名单。配置应保存在交付目录外的本机私密目录，按工具说明设置权限；账号对应关系与后台排版、封面仍需人工核实。当前图片适配使用 macOS `/usr/bin/sips`，其他系统可运行本地构建和纯本地测试，公众号图片上传尚未提供跨平台替代方案。

知乎和小红书的浏览器操作依赖 Codex 提供的受控浏览器/CUA 工具、用户自己登录的正确账号及实际草稿页面。包内浏览器桥接文件供 Codex 按真实页面观察调用，不能作为独立无人值守浏览器程序。R2 需要用户自己的配置，上传会产生可通过该公开域名访问的素材。所有真实账号上传和草稿写入都需要该次任务授权；最终发布由用户执行。

详见[分发工具手册](../tools/wenchang-publishing/README.md)、[草稿同步手册](../content/wenchang-publish-check/references/draft-sync.md)和[实施方案](product/wenchang-local-publishing-mvp.md)。
