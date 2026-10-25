# 三平台草稿同步操作手册

适用于已定稿内容的公众号、知乎和小红书草稿分发。默认只保存草稿，不发布、排期或设为“仅自己可见”发布。仅做发布检查的请求不自动授权外部上传；用户要求同步草稿后，执行必要上传与保存，无需逐步重复确认。缺登录、账号对应关系或必要凭证时再提醒。

## 依赖与文件约定

需要完整的 yangxingzhi-media-skills 仓库和 Node.js 22+、Python 3。独立安装本 Skill 不包含执行工具：在仓库根目录定位 `tools/wenchang-publishing/` 与 `md-img-r2/`；缺失时先补齐仓库，不能臆造命令成功。完整参数及浏览器桥接见仓库 `tools/wenchang-publishing/README.md`。

- 正文唯一维护源：`article.md`；平台标题、摘要、卡片清单是衍生资产。
- `distribution/project.json` 指定目标平台；平台配置在 `platforms/`。
- 小红书 `derived/xiaohongshu-cards.json` 按顺序列图，引用路径相对 distribution；当前工具约定1080×1440静态PNG/JPEG/WebP。这是项目约定，不是小红书平台唯一允许尺寸。
- 小红书封面标题与发布标题不同，发布标题≤20个Unicode字符；独立描述150–300字。没有竖版图时使用卡片Skill生成衍生资产，不偷偷裁切原图或上传测试图替代正式内容。
- 私密配置、token、签名URL、账号记录及在线截图不进入Skill示例或Git。R2公开上传需在用户授权范围内。

## 本地准备

以下命令从仓库根目录运行。示例路径需换成实际项目；已有分发目录直接build，不重复init。

```sh
npm --prefix tools/wenchang-publishing ci
npm --prefix tools/wenchang-publishing run build
node tools/wenchang-publishing/dist/cli.js init --source content/my-article/article.md --workspace content/my-article --out content/my-article/distribution --metadata content/my-article/metadata.json --platforms wechat,zhihu,xiaohongshu
node tools/wenchang-publishing/dist/cli.js build --dir content/my-article/distribution
node tools/wenchang-publishing/dist/cli.js check --dir content/my-article/distribution
```

先补齐init生成的配置，再build/check。`local_ready`仅代表本地包就绪；内容、素材或配置变更后重新构建。发布包不依赖Obsidian。

## 路径选择

| 平台 | 图片传输 | 保存与验收 |
| --- | --- | --- |
| 公众号 | 官方接口上传正文图片与独立封面素材；不直接依赖R2外链 | draft/add后draft/get；回读字段、正文与图片标识；视觉验收另记 |
| 知乎 | md-img-r2只上传生成映射，HTML导入后等平台转存 | 等草稿保存；新标签重开，核验正文、平台图片、顺序与视觉 |
| 小红书 | R2映射管理源资产，哈希一致的本地文件副本经文件选择器上传 | 暂存离开；关闭上传页，从新标签草稿列表重开，逐图验证 |

R2 URL可访问不代表目标平台保存成功。不能把小红书正文中的URL当成图文图片上传。

## 公众号

本地私密 `.local/wechat/credentials.json` 包含 account_name、app_id、app_secret，权限600，已忽略Git。用户本地填写密钥，不发聊天。用户确认AppID属于目标账号，account_name只是配置声明，接口读取不会独立证明账号名称。

```sh
node tools/wenchang-publishing/dist/wechat-cli.js preflight --config .local/wechat/credentials.json
node tools/wenchang-publishing/dist/wechat-cli.js sync --config .local/wechat/credentials.json --dir content/my-article/distribution
```

preflight读取草稿数量、素材数量，成功只证明读取权限；写权限在同步中检验。sync上传图片和封面、保存单篇草稿、回读。当前实现支持PNG/JPEG静态图。重复执行同一内容时复用journal中的media_id并回读；内容变化、已有同名稿、写入结果不确定均先核对，不能删journal强行新增。

回执 `wechat-sync-receipt.json` 的 `draft_verified` 是API回读通过，`visual_review: pending` 必须如实保留。程序不调用发布接口。

## 知乎

确认登录账号和真实草稿编辑URL。新稿先完成编辑器初始化并取得稳定ID；既有稿复用ID。不要因为等待超时重复新建。

```sh
node tools/wenchang-publishing/dist/zhihu-cli.js prepare --dir content/my-article/distribution --draft https://zhuanlan.zhihu.com/p/实际ID/edit --account 目标账号 --env-file /本机私密目录/.env
```

prepare调用`md-img-r2 --upload-only`，原稿不改，输出版本绑定的plan、R2映射和导入HTML。已有映射通过`--map`复用。按照工具README在受控浏览器调用`browser/zhihu-draft.mjs`：importDraft → waitForDraft → reopenAndRead。导入前检查目标页，等待转存与保存；超时只记录失败，不自动重贴正文。图片需转成知乎平台地址，独立重开后身份、正文与有序图片标识匹配；逐图视觉确认并留截图。

```sh
node tools/wenchang-publishing/dist/zhihu-cli.js verify --dir content/my-article/distribution --evidence /实际路径/evidence.json
```

## 小红书（含正常blob回读）

连接细节及一次完整验收步骤见 [Chrome 操作流程](chrome-drafts.md)。

默认目标是用户日常 Chrome（本次确认 profile：yangchao），保存、草稿列表和独立重开必须在同一 profile 内完成。先核验账号与同名稿；Chrome 未连接或无法可靠控制时提醒用户，不回退到内嵌浏览器保存。网页草稿为浏览器本地资产；不同浏览器/profile 不共享，代理直连只能解决图片网络加载，不能同步草稿列表。草稿入口为「发布笔记 → 上传图文 → 草稿箱 → 图文笔记」，默认视频分类为空不代表图文稿丢失。

连接现用 Chrome 可采用 Chrome DevTools 官方 `--autoConnect`（Chrome 144+）；用户在 `chrome://inspect/#remote-debugging` 开启并允许连接。先用list_pages确认用户原有标签页和目标账号。默认插件启动的独立profile、仅about:blank页不算接入成功。若Codex尚未热加载新增MCP，可在用户明确授权Chrome DevTools后使用同一官方包的CLI；不复制用户profile，不重启用户浏览器，不开启无确认的调试端口。

evidence记录浏览器及 profile，回执通过evidence_sha256绑定该证据；迁移到 Chrome 必须单独回读，不能沿用内嵌浏览器的 draft_verified。原草稿保留，不跨浏览器删除或覆盖。

```sh
node tools/wenchang-publishing/dist/xhs-cli.js prepare --dir content/my-article/distribution --account 目标账号 --reuse-map /已有路径/article.md.asset-map.json --env-file /本机私密目录/.env
```

没有已有映射时省略`--reuse-map`。按SHA-256与字节数复用资源，未覆盖的卡片上传R2。输出`transfers/xiaohongshu/<bundle_version>/plan.json`及有序`upload/`副本。

1. 确认账号，检查同名草稿，避免重试时重复创建。上传plan中的文件，不上传示例文件。
2. 使用`browser/xhs-draft.mjs`的observe记录uploaded：账号、标题、独立描述、图片src和实际解码尺寸。等全部加载后再保存。
3. 只点“暂存离开”。控件可能位于封闭shadow DOM；通过真实截图与键盘焦点确认按钮。无法确定焦点时交用户手动保存，不用“发布”选择器兜底。
4. 看到保存成功后，在列表确认唯一匹配标题并记录截图。确认本轮编辑器已退出（暂存后返回上传页亦可），新标签进入草稿箱，从列表打开同一稿。保留其他草稿，不清浏览器数据。
5. 记录reopened。允许HTTPS小红书CDN地址或`blob:https://creator.xiaohongshu.com/...`。同源blob须已加载、尺寸匹配、地址彼此不同且不复用uploaded中的地址；URL形式本身不是持久化证据。破图complete=true但宽高0仍失败。
6. 逐图对照本地卡片核对内容、数量与顺序，保存截图。填写evidence：plan_hash（plan.json原始字节SHA-256）、uploaded、reopened、saved_in_list、reopened_from_list、independent_reopen、visual_order_verified、checked_at。布尔字段只来自实际观察，不能为通过校验而设true。

```sh
node tools/wenchang-publishing/dist/xhs-cli.js verify --dir content/my-article/distribution --evidence /实际路径/evidence.json
```

小红书网页提示草稿保存在当前浏览器本地；验证通过也不能称为跨设备云同步。

## 结果与交接

`ready_for_browser`=准备完成；`blocked`=失败未验收；`draft_verified`=当前版本回读通过。同时检查status、bundle_version与时间，不能只读旧receipt宣称本轮通过。浏览器DOM校验不能代替像素和文案审阅。

交付：目标账号、标题/草稿标识、保存与重开结果、图片数与尺寸、视觉结论、回执路径、剩余限制、publication_performed=false。失败先看[排障手册](draft-troubleshooting.md)，保留已有草稿和证据。
