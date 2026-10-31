# 草稿同步失败排查

先确定失败阶段：本地构建 → 源图上传 → 平台上传/转存 → 保存 → 独立重开 → 图片显示。记录账号、标题/ID、bundle_version、时间、图片数/尺寸、脱敏地址和错误码。不要输出凭证、签名参数或cookie。

| 现象/错误 | 检查与下一步 |
| --- | --- |
| BUNDLE_STALE / PLAN_MISMATCH | 对照源稿、卡片、配置与版本。输入确已变化时build/check，确需新plan再prepare一次；已有迁移或保存尝试时先按[迁移恢复](baseline-migration.md#失败恢复)核对批次和回执，不循环prepare，不拿旧证据验证新包。 |
| XHS_CARD_SIZE | 本项目要求精确3:4且宽度≥1080像素。1086×1448原图有效；不要为凑1080×1440缩放或重绘。非3:4或分辨率不足时重新准备合规素材，不放宽校验。 |
| R2_MAP_NOT_UPLOADED / R2_UPLOAD_FAILED | 检查映射是否dry-run、缺文件或部分失败，核对哈希。修复网络/凭证后只重跑该上传清单的upload-only，再prepare；保留失败记录，不改原稿。 |
| listen/connect EPERM | 先区分执行环境权限与平台失败。仅为必要本地监听或网络申请执行权限；不要据此改代理或宣称平台故障。 |
| 公众号40164 | 让用户把实际出口IP加入该AppID白名单；不要猜本机内网IP，也不要修改敏感配置绕过。 |
| 公众号48001 / 凭证错误 | 核验AppID对应账号、接口权限及本地凭证；让用户本地填写AppSecret。读权限通过不等于写权限通过。 |
| PREVIOUS_ADD_UNCERTAIN_MANUAL_RECONCILIATION_REQUIRED | 上次新增结果不确定且journal未取得media_id。保留记录，先人工核对远端同名稿及ID；未确认前不再次新增，不删除journal重试。 |
| NETWORK_UNCERTAIN（可带接口后缀） | 先核对失败接口、journal和本次回执，读取失败不能推定已写入。新增结果不确定走人工对账；已有pending_update按下述更新恢复，不把网络错误统一当作可以重发。 |
| EXISTING_TITLE_REQUIRES_REVIEW | 本工具尚未绑定media_id时发现远端同名稿。先人工核对归属并查找原journal；缺少可信关联则保持阻塞，不按标题接管，不新建重复稿。`sync`不接受任意草稿ID。 |
| 公众号改稿（旧版CONTENT_CHANGED提示） | 当前已有本工具journal、media_id和完整远端基线时，先build/check，再用`sync`。远端未变时更新同一ID；本地与远端均未变时只回读。操作步骤见[正常更新](wechat-update.md#正常更新)，无强制覆盖入口。 |
| LEGACY_BASELINE_REQUIRED / LEGACY_REMOTE_REVIEW_REQUIRED | 前者先恢复上次成功本地输入，再用`sync`只读迁移基线；后者先审阅HTML等差异。仅在用户明确接受已审呈现、原输入不变且无pending时，按[旧记录迁移](wechat-update.md#旧记录迁移)使用`adopt-baseline`及已审快照hash；不替换已有基线。 |
| REMOTE_CONFLICT_DRAFT_PRESERVED / READBACK_MISMATCH_DRAFT_PRESERVED | 保留原草稿、journal和pending，核对本次回执及conflict_fields。差异可能来自人工编辑或平台处理，不自动覆盖或吸收；已有pending且用户接受更新后的HTML差异时，按[显式对账](wechat-update.md#用户确认更新后的html差异)核对`reconcile-baseline`的适用条件。 |
| UPDATE_PENDING_RECONCILIATION_REQUIRED / PENDING_UPDATE_INPUT_CHANGED | 保持待确认输入不变；已改稿时先恢复pending目标版本。下一次`sync`先读原ID：等于目标则完成且不重发，仍等于原基线时本次最多重发一次，第三种状态停止为冲突。详见[超时与失败](wechat-update.md#超时与失败)；不删pending，不以旧成功回执代替本次结果。 |
| REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED / RECONCILIATION_*（错误码族） | 快照再次变化或对账条件不符时继续阻塞，保留旧基线、pending及差异，按本次错误重新核对本地目标、用户确认的hash及允许字段。`adopt-baseline`和`reconcile-baseline`只读重核并记录本地基线，不新增、上传或更新；不能把当前任意hash当作用户确认。 |
| WAIT_TIMEOUT / SAVE_PENDING_READBACK | 保留本批次plan/status、旧回执及有效imported/uploaded观察；新独立reopened须与阶段观察组成完整新证据再verify，不能只有reopened或复制字段。详见[证据恢复](baseline-migration.md#保存不确定后的证据恢复)；禁止重传、重prepare、删稿或新建同名草稿。 |
| FRESH_EVIDENCE_REQUIRED | verify时检查是否早于上次失败；迁移时检查观察是否在五分钟内、不早于旧回读且不超过当前时间五秒。重新只读采集，不回填时间或改旧证据hash；见[迁移恢复](baseline-migration.md#失败恢复)。 |
| BASELINE_REQUIRED / BASELINE_EVIDENCE_NOT_VERIFIED / BASELINE_EVIDENCE_PLAN_MISMATCH | 保留原草稿和旧证据，先区分同plan与跨plan。同plan核对当前plan绑定；跨plan须读取旧已核验status/receipt/evidence，经[显式迁移](baseline-migration.md)关联新批次，不能把新回读标为旧验收或手改hash；首次无基线仍阻塞。 |
| BASELINE_MIGRATION_MISMATCH / MIGRATION_TARGET_PLAN_MISMATCH / MIGRATION_TARGET_NOT_READY | 迁移绑定、prepare批次或target回执/历史不符。保留plan、迁移记录与原草稿，按[迁移恢复](baseline-migration.md#失败恢复)核对；禁止删除history、改attempt_id或重新prepare制造可编辑状态。 |
| BASELINE_CONTENT_MISMATCH / CHROME_BASELINE_REQUIRED / ORIGINAL_CHROME_DRAFT_REQUIRED | 旧内容身份、Chrome证据范围或原稿唯一匹配不符。核对分发目录和原Chrome列表，不借用其他文章或内嵌浏览器证据，不新建稿替代；详见[迁移恢复](baseline-migration.md#失败恢复)。 |
| REMOTE_BASELINE_CHANGED | 草稿标题、正文/描述、话题或图片顺序/尺寸已被平台或人工修改。保留当前草稿和旧回执，查看 `changed_fields` 后由用户决定合并；不自动覆盖、不新建同名稿。 |
| REMOTE_DRAFT_NOT_READY / REMOTE_OBSERVATION_INVALID | 当前页面仍在加载、保存或回读字段不完整。等待状态稳定后重新独立回读，不用旧页面快照继续编辑。 |
| 知乎导入后缺图 | 先核验R2原图能打开、编辑器已初始化；等待转存和保存。回读仍失败时保留草稿，别反复粘贴正文。 |
| IMAGE_NOT_LOADED | complete=true仍可能是破图。检查naturalWidth/Height与计划；等待平台处理，再重新观察。不可把0×0放行。 |
| IMAGE_NOT_PERSISTED | 检查是否目标平台URL或小红书同源blob；外站blob、R2外链不冒充已转存平台图。 |
| BLOB_REOPEN_NOT_INDEPENDENT | 是否真的关闭上传页、新标签从列表重开？同一页上传预览不是回读证据；不要仅重写布尔值。 |
| DUPLICATE_IMAGE_SOURCE / IMAGE_COUNT_MISMATCH | 对照有序卡片清单、缩略图与实际图片；保留草稿，修复前先确认错误图片。 |
| TITLE_OR_DESCRIPTION_MISMATCH / ACCOUNT_MISMATCH | 停止写入，核验账号、目标草稿和版本；不要自动切账号或改用户已有文案。 |
| DESCRIPTION_LAYOUT_MISMATCH | 正文字相同但段落丢失或位置改变。检查fill是否压平换行，用支持段落的实际文本输入重填，保存前先看预览；不要将全部空白删除后判相同。 |
| TOPICS_MISMATCH / TOPIC_NOT_SELECTED | 核对plan.tags与编辑器内已选话题名称/ID。用话题搜索结果补齐，排除重复/无关标签；普通#文字、页面推荐词或本地数组不能替代已选节点。 |
| VISUAL_ORDER_REVIEW_REQUIRED | 逐张打开预览，与本地图片核对内容、顺序；保存实际截图后再确认。 |

迁移/preflight的blocked来自本次退出码和stderr，不会自动持久化为transfer/status.json的blocked；即使本地状态仍ready_for_browser也必须停止编辑。verify对就绪分发包另记核验状态，仅通过才写成功回执；失败时旧回执只作历史，不能把两种入口混为同一种恢复动作。

## Chrome连接与本地草稿

- Chrome与Codex草稿列表不一致：本地存储隔离；关闭代理不会合并草稿。确认同一profile并切到图文分类。
- 只看到about:blank：通常为独立自动化浏览器，停止上传；按[Chrome流程](chrome-drafts.md)连接现用浏览器。
- 已添加chrome-live但工具未出现：客户端尚未加载配置；不要继续使用旧连接冒充新连接。使用已授权且核验过的官方CLI或重新加载客户端。
- 原生操作返回成功但页面未变：先用可靠页面快照核对，避免重复上传。保存不确定先查同名稿和时间，不盲目再次保存。
- 文件提示不在workspace roots：核对工具允许目录。必要时在授权范围内为官方CLI指定精确仓库 `--workspace`，见[Chrome流程](chrome-drafts.md)；实际安全策略拒绝时停止该路径，不能换目录或通道绕过。
- `Multiple file uploads only work with <input type=file multiple>`：普通按钮不是批量input。重新观察真实文件input的multiple属性并取得新uid；先确认页面是否已部分上传，再继续。
- 换六张后出现十二张等数量翻倍：新图被追加。不要暂存或删除整篇草稿，先核对当前编辑稿，按“更新既有草稿”步骤使用图片替换控件。保留磁盘旧版与已保存草稿证据。
- 更新后出现同名多稿或列表数量增加：停止重复创建，核对每份保存时间、图片和正文；不擅自删稿，无法确定目标时请用户选择。
- 点击图片编号但截图一直相同：编号可能只用于排序。检查实际轮播分页、活动页及可见图片后逐页截图，不把点击成功当作已换页。

## 小红书CDN与代理的定向对照

适用于原草稿和文字仍在、预览图宽高为0，且CDN请求返回HTTP400或`ERR_BLOCKED_BY_ORB`。错误码本身不能证明代理故障或图片丢失；先做同一完整URL的定向对照，不重新上传。

处理顺序：

1. 从当前DOM的`currentSrc`及真实失败请求取得URL、状态和响应类型。对照请求须保留原协议、路径、查询参数和必要的来源头；观察器为脱敏而去参数的`src`不能直接拿来测试可用性。完整签名URL仅存本地私密证据，对外只给域名、状态和去参数地址，不输出cookie或认证头。
2. 对同一完整URL比较当前访问路径与单次直连，不改全局代理。只有直连返回可解码图片、当前路径失败时，才将原因指向代理/转发链路；两者都失败时继续核对参数、有效期、DNS和CDN响应。`400 text/html`且正文为`The plain HTTP request was sent to HTTPS port`是本次观察到的线索，`ORB`不能靠关闭浏览器安全检查解决。
3. 先提出精确域名改动，只有用户已授权该域名的网络配置变更后才执行。读取客户端、Global/Rule模式、TUN、系统代理、端口及已有例外并备份；保留原开关和模式，不因排障开启或关闭TUN/VPN。配置文件只改已确认字段，保留未知字段和并发用户改动。
4. **系统代理开启、TUN关闭时，优先系统代理精确绕过**，无需把Global切为Rule。macOS Clash Verge可在`system_proxy_bypass`追加`sns-creator-preview.xhscdn.com`，保留`use_default_bypass`和所有已有自定义例外；该平台多项以逗号分隔。同步核对当前网络服务的生效绕过列表，只追加该完整域名，HTTP/HTTPS/SOCKS代理及端口保持原值。仅写配置文件不代表运行时生效；不重启VPN来代替应用设置。
5. 系统绕过不适用时，先核对客户端支持的路由方式。Rule模式可评估精确`DOMAIN,sns-creator-preview.xhscdn.com,DIRECT`规则，验证实际命中；Global模式通常不执行普通规则，不能只加规则便称成功，也不自动切Rule或重写其余流量的路由。TUN已开启时，系统例外未必足够，需另行审阅最小路由方案，不能扩大到整个`xhscdn.com`后缀或修改TLS校验。
6. 在用户日常Chrome同一profile的新标签，从草稿列表唯一匹配并重开原稿。检查账号、标题、正文分段和已选话题名称/ID；全部图片须解码且实际尺寸正确，再逐页点击真实预览分页核对内容、顺序并留本地截图。正常同源blob可通过；数量、尺寸或blob协议本身不证明视觉顺序。只读排障不点击暂存或发布，不为刷新旧回执重新prepare或重上传。
7. 无效时仅撤回本次新增例外或规则，恢复本次改动的字段；不拿完整旧备份覆盖后续用户改动。继续保留原稿，检查DNS/CDN/平台状态；不清浏览器数据或重复建稿。若需fake-IP排除或更广的路由变动，先说明对象和影响，再取得对应授权。

2026-10-31本地案例：同一完整图片URL直连返回200 PNG，当前代理环境返回400 HTML；六张直连资源与本地原图字节一致。系统代理开启、TUN关闭、Global模式下，仅追加上述域名至macOS系统代理绕过及Clash Verge对应偏好后，原稿从日常Chrome新标签重开，六图解码和逐页视觉核对通过，正文与话题保留；未重传或点击保存发布。该记录只说明当次案例，不保证其他破图原因相同或跨重启后设置仍有效。

配置已保存、生效路由/绕过列表、浏览器图片恢复分别记录；在系统代理层绕过时，流量可能根本不进入Clash，不能强求其连接日志出现DIRECT再判成功。没有跨重启或手机端验收就保留未验证。blob可能经过重新编码，不承诺其文件哈希等于原PNG；若需像素级一致性，应单独完成像素对照，不能用尺寸或视觉核对冒充。

配置语义参考[Clash Verge官方系统代理实现](https://github.com/clash-verge-rev/clash-verge-rev/blob/dev/src-tauri/src/core/proxy_control.rs)，版本变化时按本机实际配置复核。浏览器访问被安全策略拒绝时停止该访问路径，不用其他接口或浏览器规避。

## 证据限制

- 图片尺寸一致不能证明像素或内容相同，视觉检查不可省略。
- 本地测试通过不代表平台在线通过。
- 旧receipt是历史；以最新status及同版本证据为准。
- 公众号API回读和后台视觉验收分别记录。
- 小红书当前浏览器本地草稿不保证跨设备可见。
- 发布、排期、仅自己可见发布均不属于默认草稿流程。
