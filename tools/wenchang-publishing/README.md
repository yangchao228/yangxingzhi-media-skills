# 文昌本地分发工具 · P1

独立 Node.js 22+ CLI。正文只维护一份 Markdown，平台配置保存标题、摘要、署名、封面及小红书文案；生成 HTML、图片清单、版本指纹和可迁移快照。无需 Obsidian、账号或云端服务。

从仓库根目录运行：

```sh
npm --prefix tools/wenchang-publishing ci
npm --prefix tools/wenchang-publishing run build
node tools/wenchang-publishing/dist/cli.js --help
node tools/wenchang-publishing/dist/cli.js check --dir content/publishing/p1/own-article/distribution
node tools/wenchang-publishing/dist/cli.js serve --dir content/publishing/p1/own-article/distribution
```

打开输出的回环地址。也可直接打开 distribution/index.html 离线阅读；静态文件不会自动探测源文件变化，编辑后需要重新 build/check。

## 为新文章建立分发包

```sh
node tools/wenchang-publishing/dist/cli.js init --workspace content --source content/my-article/body.md --out content/my-article/distribution
# 编辑 distribution/platforms/*.json 和 derived/xiaohongshu-cards.json
node tools/wenchang-publishing/dist/cli.js build --dir content/my-article/distribution
node tools/wenchang-publishing/dist/cli.js check --dir content/my-article/distribution
node tools/wenchang-publishing/dist/cli.js export --dir content/my-article/distribution --out content/exports/review-01
```

`--workspace` 是正文、状态和素材的共同根目录。CLI 参数按当前目录解释；配置和图片清单路径按 distribution 解释。初始化遇到非空目录会拒绝覆盖。`--metadata` 可接收本仓库 P0/P1 样例的 JSON 格式，减少手填。

## 与已有 Skills 接力

- 文昌写作/整章阶段仍维护唯一正文；本工具读取原文件，不生成第二份可编辑正文。
- `init --state ...` 读取 `content_state.draft.file`；存在歧义时显式给 `--source`。
- `attach-state --dir ... --state ...` 只新增 `content_state.distribution.package_ref`，不推进审核或发布状态。已有不同引用会拒绝覆盖。新增引用后重新 build。
- 小红书卡片默认使用 `baoyu-xhs-images` 的 `sketch-notes` + `macaron`，见[视觉与交接规范](../../content/wenchang-publish-check/references/xiaohongshu-visuals.md)。P1 接收已确认的 3:4 PNG/JPEG/WebP（不低于1080×1440），保留原图字节与实际尺寸，校验顺序、重复文件并按 01、02…导出；不负责截图或改写文章。
- `wenchang-publish-check` 仍负责内容检查；`local_ready` 只表示本地工程检查通过。

## 配置及产物

| 文件 | 作用 |
| --- | --- |
| project.json | 唯一正文、workspace、可选状态引用、固定主题 |
| platforms/zhihu.json | 标题 |
| platforms/wechat.json | 标题、署名、摘要、独立封面 |
| platforms/xiaohongshu.json | 封面标题、发布标题、独立描述、话题、卡片清单引用 |
| derived/xiaohongshu-cards.json | 有序本地图片路径 |
| bundle.json | 当前成功版本、输入/产物 SHA-256、三个平台状态 |
| renders/平台/版本/ | 预览、HTML 正文片段或图片/文案、缓存记录 |
| builds/版本/ | 汇总预览、校验记录和版本快照 |
| reports/last-failure.json | 最近失败记录，成功后仍可保留作历史诊断 |

小红书封面标题 5–20、发布标题 1–20、独立描述 150–300 个 Unicode code points；双标题不能完全相同。这些是本项目编辑约定。标题含义、图片文字、裁切和事实准确性仍需视觉/编辑审查。

文章支持 Markdown 段落、标题、引用、列表、表格、代码及本地 PNG/JPEG/GIF/WebP。HTML 原样转义；公式/Mermaid 保留文本并给提示。远程图片和本地文档链接被阻止，需先本地化或调整。GIF 原文件保留；线上上传兼容性尚未验证。图片校验读取格式头和尺寸，不等于完整解码质量检查。

## 版本与失败处理

源文件、素材、配置、状态引用或渲染器变化会使包过期；仅小红书字段变化时复用两篇文章渲染。失败不替换上次成功 bundle。check 退出码 0=就绪、2=过期、1=阻塞。服务只监听 127.0.0.1，只读并阻止过期 HTML。

不要手改 renders/builds；产物摘要不匹配会拒绝检查或导出。意外中断留下 `.build.lock` / `.building` 时，先确认进程已退出，再将对应文件移到备份位置后重试。

export 将所需输入和当前产物按 workspace 内原有相对布局打包。整体移动导出目录即可阅读及复核；源文件副本只用于快照追溯，继续编辑原项目。导出不包含工具运行时，另一台电脑要重建需另装此工具和锁定依赖。

## 验证

```sh
npm --prefix tools/wenchang-publishing test
npm --prefix tools/wenchang-publishing run typecheck
./scripts/validate_skills.sh
```

14 项回归覆盖缓存、失败保护、过期检测、迁移、路径、产物完整性、Unicode、HTML、状态接力、只读 HTTP、GIF 及相对资源。HTTP 测试需要允许临时监听回环端口。P1 不执行平台登录、上传、草稿同步或发布。

## P2 按平台接入

### 只读汇总本地与平台状态

```sh
npm --prefix tools/wenchang-publishing run build
node tools/wenchang-publishing/dist/cli.js status --dir content/my-article/distribution
```

`status` 不联网、不读账号凭证、不上传，也不修改构建、回执或 content_state。它按本次选定平台返回本地构建状态、回执版本关系、记录时点、存储范围、待审项及下一步。`serve` 提供只读 `GET /publishing-status` 和 `/workbench`；`/workbench` 展示 bundle、平台状态、预览入口与恢复动作，不提供上传、保存或发布按钮；原 `GET /status` 继续只表示本地构建检查。

| 平台状态 | 含义 |
| --- | --- |
| not_started | 没有找到同步记录 |
| ready_for_browser | 当前版本的传输准备已完成，等待浏览器保存及回读 |
| verified_current | 回执及关联证据对应当前构建；只代表记录时点的核验范围 |
| historical_verified | 旧回执的平台输入、正文来源及实际产物与当前构建相同，明确沿用历史核验 |
| stale_receipt | 本地产物已过期，或内容与回执不同；历史信息保留，不能据此上传旧版本 |
| blocked | 最新尝试未核验通过，或本地条件未满足；状态会保留错误码和恢复动作 |
| saved_pending_readback | 保存结果不确定，必须从草稿列表重新回读；不能重传或新建 |
| invalid_evidence | 回执、计划、证据或产物不完整，哈希、内容身份或受限路径校验失败 |

旧回执不会重写成新成功；同版本的失败状态优先于残留成功回执。
知乎和小红书的 prepare/verify 会在 transfer/status.json 记录 attempt_id、started_at、updated_at、plan_hash、last_error_code 和 recovery_action。`WAIT_TIMEOUT`、`SAVE_PENDING_READBACK` 或 `FRESH_EVIDENCE_REQUIRED` 出现时，保留现有草稿和旧回执，重新从草稿列表独立回读并提供新 evidence；verify 不会自动重传、创建新稿或发布。
浏览器证据必须与回执中的 SHA-256 及计划原始字节匹配。公众号始终保留账号对应关系和视觉待审；小红书保留浏览器重启持久性待审。汇总不输出账号、签名图片地址或凭据，不能替代当次线上复查。

CLI 退出码只反映本地条件：0=本地就绪，1=本地阻塞，2=本地过期。平台是否仍需处理，读取各平台 `state`、`review_pending` 和 `next_action`。工具升级也可能使旧包过期；重新 build 仅更新本地产物，不产生新的平台回执。

需要在新目录安装运行时源码时，见 [安装与交付](../../docs/publishing-install.md)。单独安装出刊 Skill 仍不包含本工具。

`init --platforms wechat,zhihu` 只创建并校验选定平台，未指定时保持原有三平台行为。已有项目可在 project.json 添加 `target_platforms` 数组。数组不能为空、不能重复、不能含未知平台；未选平台不需要配置或卡片，也不会进入导出。选择变化会使包过期。

线上草稿回读证据与本地构建分开保存；bundle 中的 `transfer_status: not_started` 表示构建器自身未执行传输，不能作为线上草稿的实时状态。P2 当前由受控浏览器执行，尚未提供无人值守同步命令。

### 公众号 API：只读权限预检（2026-10-24）

凭证保存在仓库根目录 `.local/wechat/credentials.json`，由用户本机填写
`account_name`、`app_id`、`app_secret`。此目录已忽略 Git；文件须为普通文件且权限为 600。
不要把凭证放进分发包、HTML、测试记录或聊天。不要把分发包 workspace 设置为凭证目录。

```sh
npm --prefix tools/wenchang-publishing run build
node tools/wenchang-publishing/dist/wechat-cli.js preflight --config .local/wechat/credentials.json
```

该入口仅向固定 `api.weixin.qq.com` 获取 stable_token（force_refresh=false），随后读取
`draft/count` 和 `material/get_materialcount`。不跟随重定向、不自动重试、不落盘 token，
日志不输出原始接口错误、凭证或请求 URL。40164 提示配置实际出口 IP 白名单；48001 提示检查接口权限。
读取成功只标记 `read_permissions_verified`：不能据此认定新增草稿、图片上传或账号身份已经核实。
账号名称来自用户配置，必须人工确认 AppID 与目标账号对应。

权限确认后使用下述sync入口上传图片、封面；首次执行draft/add，已有草稿改稿后执行draft/update，并通过draft/get回读。入口仅处理本工具记录的单篇草稿，不接受任意草稿ID或强制覆盖参数。
写入超时不得盲目重新 add，以免重复草稿。发布接口不在此工具范围内。
此前浏览器后台访问受到站点安全策略限制；此入口是独立的开发凭证核验，不读取浏览器登录态，
也不访问被限制的后台页面。真实账号同步结果见下节；preflight自身仍只核验读取权限。

### 公众号 API：保存正式稿（2026-10-24 已实测）

```sh
node tools/wenchang-publishing/dist/wechat-cli.js sync --config .local/wechat/credentials.json --dir content/my-article/distribution
```

仅在用户授权保存草稿且账号凭证对应正确公众号后执行。先 `build` / `check`，再同步。
当前适配器支持单篇图文、静态 PNG/JPEG，使用 macOS `/usr/bin/sips` 生成 JPEG 上传副本（原图不变），超过 1MB 的副本阻塞。
GIF 尚未接入，不静默转换；上传回执按原图哈希复用。只允许 token、草稿读取/新增/更新、正文图片和永久封面素材接口；没有发布或删除能力。

同名已有草稿会停止，由人工核对；同一内容重复执行复用本地记录的草稿 ID，仅回读，不重复新增。
已有可信基线时，内容变更更新同一个media_id，不重新新增。先比较完整远端快照（含HTML、链接、封面裁切、来源、评论和未知编辑字段），发现改动立即停止。只改摘要时保留远端原HTML及未修改字段。写入之前持久化 `add_pending` 或 `update_pending`；新增结果不确定时禁止自动重试，更新结果不确定时先读取原草稿对账。
本地记录位于私密配置目录的 `sync/` 下；不要删除后重试。并发锁异常残留需先确认无进程在运行。

同步结果保存在分发目录 `wechat-sync-receipt.json`。`draft_verified` 表示 API 回读的标题、作者、摘要、正文文字、封面 ID 和有序图片标识一致；不等于后台视觉验收。
实测微信会将正文图片 HTTP 改成 HTTPS，将末尾 `/0` 改成 `/640`；只对这两个已观察到的变换归一化，素材路径不同仍判定失败。
账号名称来自用户配置，本工具未通过 API 独立核验账号名称。2026-10-24 已使用用户指定正式稿完成上传、保存、回读，未发布。

### 公众号原草稿更新与恢复（2026-10-25）

继续使用同一条 `wechat-cli sync` 命令。journal v2在私密配置目录保存最后成功的本地输入、完整远端基线和待确认更新，文件权限600；不存token。单次调用最多发送一次更新。回执 `operation` 分为 `create`、`update`、`verify`、`reconciled`。

| 条件 | 行为与下一步 |
| --- | --- |
| 本地与远端均未变 | 只回读已有草稿，不新增、不更新 |
| 本地已改、远端仍为上次基线 | 最后一次读取复查后更新原ID，回读通过才推进基线 |
| 远端HTML、链接、摘要、封面或其他编辑字段已改 | `REMOTE_CONFLICT_DRAFT_PRESERVED`；保留草稿，由用户决定如何合并 |
| 旧journal无快照，本地仍是上次成功输入 | 仅在回读核心字段及严格HTML匹配时只读迁移；只允许已观察到的图片协议和尺寸别名 |
| 旧journal无快照且本地已改 | `LEGACY_BASELINE_REQUIRED`；先恢复上次成功输入并完成只读迁移 |
| 旧journal的远端HTML有未知差异 | `LEGACY_REMOTE_REVIEW_REQUIRED`；先审阅差异，不能删journal或直接吸收远端基线 |
| 用户确认保留已审远端版式与纯文字引用 | `adopt-baseline --expected-remote-hash`只读重核该快照；本地须为上次成功输入、无pending，核心字段须匹配；不会新增、上传或更新 |
| 确认后远端快照再次变化 | `REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED`；重新审阅，不能用旧确认覆盖 |
| 已有pending的HTML差异经用户明确接受 | `reconcile-baseline --expected-remote-hash`只读匹配新快照、pending目标版本、核心内容及其他字段；归档旧基线/确认/pending后完成对账 |
| 更新响应丢失，回读等于目标 | 记为 `reconciled`，不再次写入 |
| 更新响应不确定，回读仍等于原基线 | 保留pending；输入不变的下次调用先读取，确认后最多重发一次 |
| 回读失败或既不等于基线也不等于目标 | 保留pending或标记冲突；不得以旧成功回执替代本次结果 |
| pending期间再次改稿 | `PENDING_UPDATE_INPUT_CHANGED`；先恢复待确认版本完成对账，再继续改稿 |

更新前的最后一次读取只能缩短并发窗口；客户端没有已核验的原子条件写入能力，不能保证消除读取与写入之间的其他编辑。建议验收期间关闭该草稿的其他编辑窗口。

当前已通过56项公众号更新离线回归及130项完整工具回归，包含快照采纳、平台样式处理后阻塞、显式批准对账及只读重跑。真实稿的同ID测试摘要修改与原摘要恢复已回读，样式变化曾触发冲突；用户确认当前版式可接受后，reconcile-baseline重读匹配新快照并归档旧基线/确认/pending，原本地目标保留。连续两次普通sync均verify、同ID、快照不变，当前无pending且status为verified_current。本轮只读对账及重跑共三组token/get，未追加更新或发布。详见 [最新真实验收](../../content/publishing/p2/agent-review-burden/wechat-reconciliation-acceptance-20261025.md)；[前轮阻塞](../../content/publishing/p2/agent-review-burden/wechat-update-acceptance-20261025.md) 保留历史。

`adopt-baseline`不是强制覆盖：它不能处理已有pending，也不能替换既有基线；仅允许初次采纳用户已审的精确快照，或幂等重核同一采纳记录。实际命令及失败处理见下方操作手册。

`reconcile-baseline`只处理已有冲突pending或同一批准的幂等重核；它要求已审哈希、目标本地版本、核心内容和HTML之外的编辑字段全部匹配。成功前把旧完整基线、原确认和resolved_pending_update归档到私密journal的baseline_reconciliations；保持本地target_local_article，防止下一次仅改摘要被误判为正文改动。它不会写入远端，不接受任意新基线覆盖。

官方完整字段文档本轮访问受限，未绕过访问策略；尤其不把未知裁切字段原样回传的合成测试升级为通用线上兼容性结论。具体操作见 [公众号更新与冲突处理](../../content/wenchang-publish-check/references/wechat-update.md)。

### R2 → 知乎草稿分发（只保存草稿）

本地 `build/check/export` 仍使用相对路径，不访问 R2。另一个显式入口处理线上传输：

```sh
npm --prefix tools/wenchang-publishing run build
node tools/wenchang-publishing/dist/cli.js build --dir content/my-article/distribution
node tools/wenchang-publishing/dist/zhihu-cli.js prepare \
  --dir content/my-article/distribution \
  --draft https://zhuanlan.zhihu.com/p/实际草稿ID/edit \
  --account 你的账号名称 \
  --env-file /本机私密配置/.env
```

首次使用先在受控浏览器新建草稿，等它获得固定 ID 并完成初始化，再将真实编辑 URL 交给 prepare。既有正式稿复用原 ID。此入口上传正文引用的图片，不上传独立封面或小红书卡片；上传会使资源可通过已配置的 R2 公开域名读取，调用前须有相应授权。

`prepare` 调用受版本管理的 `md-img-r2/scripts/md_img_r2.py --upload-only`，输入为自动生成的资源列表。生成 `distribution/transfers/zhihu/<bundle_version>/`：

- `r2-map.json`：原稿哈希、每张图片哈希、本地引用、尺寸和 R2 URL。
- `article.fragment.html`：仅用于导入的 HTML，不回写原稿或离线预览。
- `plan.json`：绑定版本、目标草稿、账号、标题、规范化正文及有序图片的校验计划。
- `status.json`：当前阶段；`ready_for_browser` 尚未同步，`verifying` 尚未通过。
- `receipt.json`：通过独立重开回读后的历史回执；是否为最新结果须同时核对 status、bundle_version 和时间。

同版本有效映射复用，不再次上传。部分失败、哈希不匹配或 dry-run 映射都会阻塞，不自动覆盖失败记录。`--map 原稿.md.asset-map.json` 可接收此前 upload-only 结果，路径按原稿目录解释，要求覆盖全部正文图片且不能混入其他资源。源文件变化后必须重新 build/prepare。

首次在该会话加载桥接模块前，用 `cua_repl.js_add_node_module_dir` 注册本工具的绝对 `node_modules` 路径，以便解析本地依赖。

浏览器阶段在 Codex `cua_repl` 内执行 `browser/zhihu-draft.mjs`，沿用用户登录态，无独立浏览器、抓取会话或私有接口。先阅读浏览器工具文档并检查真实编辑页，确认账号、草稿 URL 与编辑器结构，再调用：

```js
// 在 cua_repl 中；所有路径和编辑页均使用实际 prepare 输出/页面观察值。
var bridge = await import('/绝对仓库路径/tools/wenchang-publishing/browser/zhihu-draft.mjs');
var fs = await import('node:fs/promises');
var crypto = await import('node:crypto');
var planBytes = await fs.readFile('/绝对路径/plan.json', 'utf8');
var plan = JSON.parse(planBytes);
// tab 为已经绑定并检查的目标草稿标签。
var start = await bridge.importDraft(tab, plan);
// 每次最多等待45秒，超时保留当前草稿并排查；不能当作成功，也不自动重传。
var imported = await bridge.waitForDraft(tab, plan);
var readback = await bridge.reopenAndRead(cua, tab, plan);
await fs.writeFile('/绝对路径/evidence.json', JSON.stringify({
  plan_hash: crypto.createHash('sha256').update(planBytes).digest('hex'),
  imported, reopened: readback.reopened,
  independent_reopen: readback.independent_reopen, checked_at: new Date().toISOString()
}, null, 2));
// 对每张图做视觉确认，保存截图；不能仅以 DOM 数量代替内容辨认。
```

```sh
node tools/wenchang-publishing/dist/zhihu-cli.js verify \
  --dir content/my-article/distribution --evidence /绝对路径/evidence.json
```

等待过程检查知乎平台域名、图片解码尺寸/比例、数量与顺序，以及“草稿”保存标记。首次与重开读取的图片地址须一致（去除临时签名查询参数）；标题和正文按去空白规则核对。DOM 读取保留内容标点，忽略知乎插入的零宽分隔符与空图注提示。验证不证明图片像素完全一致，视觉确认另外保存；GIF 动画仍需专门验收。

失败时停止并保留证据。浏览器导入不会自动重试；需要确认当前保存状态后再决定。重复调用已完成的任务应直接重开回读，不清空并粘贴。所有函数均无发布操作，`prepare` 不创建新草稿，`verify` 仅写本地回执。

### 小红书图文草稿分发（合成稿与正式稿已回读验证）

```sh
node tools/wenchang-publishing/dist/cli.js build --dir 项目/distribution
node tools/wenchang-publishing/dist/xhs-cli.js prepare \
  --dir 项目/distribution --account 目标账号 \
  --reuse-map 已有原稿.md.asset-map.json --env-file /本机私密配置/.env
```

`--reuse-map` 读取 md-img-r2 upload-only 映射，按完整 SHA-256 和字节数复用资源；未覆盖的卡片才上传 R2。小红书卡片以 `derived/xiaohongshu-cards.json` 的顺序为准，不用长文正文图片替代。生成 `transfers/xiaohongshu/<version>/plan.json`、`r2-map.json` 和 `upload/01.png` 等。上传副本与原图逐字节一致，便于文件选择器按序上传。当前卡片规则为3:4且不低于1080×1440，保留原图尺寸；GIF 不支持。

已确认新卡片更新现有草稿时，先改有序清单并重新 build/check/prepare，再按[Chrome更新与回读流程](../../content/wenchang-publish-check/references/chrome-drafts.md)替换原记录图片。只换图时保留标题和正文；保存后须在同一用户Chrome的新标签从列表重开，逐图核对实际尺寸、内容、顺序和文案。默认只暂存，不发布。

R2 负责统一图片资产和映射。小红书网页当前使用文件上传，采用与映射哈希一致的本地副本；不尝试把 R2 URL 写入正文来替代图文图片，也不篡改平台保存的预览地址。

受控浏览器流程：

1. 核验当前账号和新建入口。使用plan中的正式标题（首次接入可先用合成稿），标题不超过20字，保留其他草稿。重试前先检查列表有无同名草稿，禁止重复创建。
2. 新图使用真实“上传图片”控件和文件选择器，按 plan.images 的 upload_file 顺序上传；只改文案时保留既有图片。填写 title 和分段description，再逐个从平台话题搜索结果添加plan.tags。普通#文字不等于已选话题；避免用会压平换行的fill。浏览器桥接 `browser/xhs-draft.mjs` 的 observe/readXhsDocument 仅从DOM读取正文段落及已选topics的名称/ID，排除隐藏话题标记，不读内部状态或会话。
3. 保存前记录 uploaded 观察及截图。“暂存离开”有时位于封闭 shadow DOM：必须通过真实截图确认按钮和焦点，再执行保存；不能用通用“发布”选择器。若无法确认，交由用户手动暂存。
4. 回到草稿列表，唯一匹配标题并截图。关闭本轮编辑页，在新标签进入草稿箱，再点击该标题重开。
5. 记录 reopened 观察；正文内容及段落边界、已选topics与plan.tags、图片数和尺寸必须匹配。段落允许CRLF/空行差异，不能压成一段；非空tags缺topics会失败。重开后允许加载成功的 HTTPS 小红书 CDN 图片，或 creator.xiaohongshu.com 同源 blob。blob 必须与上传时地址不同，重开图片地址不得重复；仍须从保存列表独立重开并确认实际尺寸。blob 地址本身不能单独证明持久化。按编号人工检查图片顺序并保存截图。

证据 JSON 字段：plan_hash（plan.json 原始字节 SHA-256）、uploaded、reopened（observe 输出）、saved_in_list、reopened_from_list、independent_reopen、visual_order_verified、checked_at。布尔值必须来自当次实际观察；失败时保留 false。

```sh
node tools/wenchang-publishing/dist/xhs-cli.js verify \
  --dir 项目/distribution --evidence /绝对路径/evidence.json
```

verify 失败返回非零，status.json 写 blocked 和原因；旧 receipt 仅作历史，不能据此声称本轮成功。只有保存、独立重开、图片加载与视觉顺序均确认才写 draft_verified。网络或预览故障单独记录，不自动重传、不改代理、不发布。网页草稿的可迁移性和跨浏览器同步未由此流程保证。

操作入口与排障：[文昌草稿同步手册](../../content/wenchang-publish-check/references/draft-sync.md)、[失败排查](../../content/wenchang-publish-check/references/draft-troubleshooting.md)。默认只存草稿，不发布。
