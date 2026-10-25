# 小红书：日常 Chrome 草稿操作流程

适用：用户要求保存小红书草稿或回读。项目默认使用用户现用 Chrome 配置 yangchao；先核验小红书账号，不凭 Chrome 配置名推断平台身份。只保存草稿，不发布、不排期、不用私密发布替代。

## 连接与定位

1. 复用现用 Chrome 的小红书标签页。确认账号和草稿列表；登录失效时请用户登录。不要新建自动化独立profile、复制用户数据、清缓存或删除旧草稿。
2. Chrome DevTools默认启动独立浏览器。list_pages只看到about:blank时，不在其中登录或上传。Chrome 144+可用官方 --autoConnect；用户在 chrome://inspect/#remote-debugging 开启调试并允许连接。调试授权可读写所连接profile的标签页，只访问任务相关页面。
3. 本机已配置 chrome-live；连接参数为 npx -y chrome-devtools-mcp@latest --autoConnect --no-usage-statistics。先检查现有配置，避免重复添加。新配置可能需客户端重新加载，不能用旧插件list_pages证明新连接生效。
4. 用户明确授权Chrome DevTools后，若新增MCP未加载，可使用同一官方包提供的CLI。先查看已安装版本和 --help；支持时执行 chrome-devtools start --autoConnect --no-usage-statistics --workspace <仓库绝对路径>，然后list_pages核验用户现有标签页。不要硬编码npm缓存路径、页码或元素uid；缺该CLI时使用已配置MCP，不临时替换控制方式或开无确认调试端口。
5. 确认目标页面账号及「草稿箱 → 图文笔记」，检查同名稿。重复运行先回读；发现用户修改则保留，不覆盖。网页草稿属于当前浏览器本地，Chrome、内嵌浏览器、手机App不能视作同一个草稿箱。

## 上传与保存

- 按plan.json有序上传upload/内文件，标题及独立正文取自plan；R2映射是源资产记录，不等于小红书草稿。
- 文件选择器关闭不等于上传失败。重新读取页面，核对当前图片数；若已有第一张，补传剩余图片，避免整组重传。
- 原生截图与AX不一致、点击无效或显示控件离屏时，停止重复点击。重新观察；必要时请用户切前台或使用已授权的Chrome DevTools。保存结果不明时先查列表，不重复创建。
- 六张图片仅为本次案例，实际数量以plan为准。等待全部complete且naturalWidth/Height匹配，再填写标题及正文；观察记录为uploaded。
- 从新快照精确定位「暂存离开」。不要用泛化publish选择器；无法区分保存与发布时交由用户保存。等待「保存成功」及返回上传页，在列表确认标题、保存时间、数量并截图。

## 独立重开验收

1. 确认原编辑器已退出（暂存后返回上传页亦可），新开同profile标签页。进入「发布笔记 → 上传图文 → 草稿箱 → 图文笔记」，从列表编辑同一稿；不要再填入内容。
2. 读取reopened，精确比较账号、标题、正文及有序图片数。每张图片实际尺寸须匹配plan；complete=true但宽高0仍失败。
3. 允许正常加载的同源blob；必须是新页面重开产生的不同地址，不复用uploaded地址。逐张切换预览，与源图核对内容与顺序并留截图。尺寸、数量及blob形式都不能替代视觉核验。
4. evidence包含plan_hash、uploaded、reopened、saved_in_list、reopened_from_list、independent_reopen、visual_order_verified、checked_at，并附browser、profile、保存时间和截图路径。布尔值必须来自实际观察。
5. 执行draft-sync.md中的xhs-cli verify。该命令会更新版本目录receipt/status；迁移浏览器前保留旧证据，本次另存chrome/。现有自动回执只通过evidence_sha256绑定浏览器信息，交接时同时读取evidence，不假定receipt本身记录了profile。
6. 只有重开及逐图检查通过才报告draft_verified。留目标Chrome页面供用户继续编辑；不得把旧内嵌浏览器成功回执作为本次验收。

## 交付

说明账号、标题、浏览器/profile、保存入口、重开后的图片和正文结果，附截图；明确publication_performed=false。在线截图、账号证据、凭证和用户浏览器配置不提交Git。

已验证案例：2026-10-24，Chrome现用配置保存正式稿后，新标签从列表重开，6张1080×1440卡片和198字正文一致。该案例不代表手机云端同步。

参考：[Chrome DevTools官方连接说明](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/advanced-usage.md#connecting-to-a-running-chrome-instance)。版本或参数变化时重新查本机帮助及官方文档。
