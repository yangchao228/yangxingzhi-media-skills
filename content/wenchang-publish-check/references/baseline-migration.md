# 知乎与小红书：跨 plan 基线迁移

适用于改文案、换图或工具升级后，继续更新原已核验草稿。默认只保存草稿，不发布、不排期、不用私密发布替代。仅本地检查或文档请求不授权浏览器采集和真实草稿操作。

依赖仓库内支持 `migrate-baseline` 的 `tools/wenchang-publishing`；本 Skill 单独安装不包含执行工具。命令从仓库根目录运行。公众号继续走 [公众号更新与冲突处理](wechat-update.md)，不套用本流程。

## 选择入口与准备批次

| 情况 | 入口 |
| --- | --- |
| 同一plan、已有匹配证据 | `preflight --baseline-evidence`，证据仍须绑定当前plan |
| 不同plan、旧草稿有完整已核验链 | 本手册的 `migrate-baseline` → `preflight --migrated-baseline` |
| 首次无基线或只有失败证据 | 保留阻塞，单独审阅初始化方案；不能用空编辑器或未审页面建立覆盖基线 |
| 当前target已成功、保存结果不明或含历史记录 | 先回读并核对回执；不重复迁移、prepare、上传或新建稿 |

1. 保留旧 `builds/<旧bundle_version>/` 与 `transfers/<平台>/<旧bundle_version>/` 全目录。显式选择原成功版本，不能按最新目录名猜基线；旧status/receipt须为`draft_verified`，receipt的证据hash须匹配固定位置的`evidence.json`或`chrome/evidence.json`。
2. 当前包先build/check；确需新计划时prepare一次，已有本轮有效plan与`ready_for_browser`状态则复用。prepare可能上传R2：只做本地验证时仅用已上传且完整的映射，缺映射就阻塞，不执行真实上传。
3. 新旧内容须为同一`content_id`和账号，知乎须保持原`draft_url`。小红书旧证据必须是`chrome/evidence.json`，使用用户日常Chrome同一配置核验账号，按**旧标题**唯一匹配并从列表重开原稿；改标题也先按旧标题定位。

迁移记录绑定当前`status.attempt_id`为`target_attempt_id`。再次prepare会换批次，即使plan字节相同也不能复用旧关联。target有`receipt.json`或`history`（含空目录）即阻塞；不能删记录、改hash/attempt_id或重prepare来解除阻塞。

先定位当前`bundle_version`对应的target，检查是否有回执、history或未完成保存，再决定是否prepare；不能先运行prepare再判断是否需要。迁移前后保留plan hash与attempt_id，失败后仍核对这组值，不用重prepare生成的新批次替代原记录。

## 当次只读观察

在已获平台只读权限的范围内独立重开原草稿，把`observe()`完整输出放进新的本地JSON；它不是新版本成功证据，不要复制旧evidence并更新时间。以下是结构示意，false/0不得为通过校验而直接改成成功值：

```json
{
  "checked_at": "<本次只读采集的ISO时间>",
  "independent_reopen": false,
  "observation": {},
  "browser": "chrome",
  "saved_in_list": false,
  "reopened_from_list": false,
  "visual_order_verified": false,
  "draft_match_count": 0
}
```

- `checked_at`须在五分钟内、不早于旧独立回读，不超过当前时间五秒；`independent_reopen`必须来自实际重开。
- 知乎`observation`包含url/account/title/text、images及saved/busy/failed；后三者必须是JSON布尔值。小红书包含account/title/description、topics名称/ID和images。图片须有src、布尔complete及实际width/height。
- 末五个外层字段仅小红书必需，分别确认Chrome、列表保存/重开、视觉顺序及唯一匹配数1。它们是采集者确认；CLI不会自动连接Chrome或证明配置名称、稳定草稿ID及云端同步。CLI忽略blob会话地址，等尺寸blob互换也可能通过；`visual_order_verified`须来自逐图对照，不能仅凭数量/尺寸推断顺序正确。

当前远端应等于**旧已验基线**，无需预先等于新文案或新图片；差异保留为冲突，不自动吸收成新基线。

## 迁移、预检与新验收

以下路径及版本均替换成实际值；两个观察文件分别来自迁移时和编辑前的实际只读采集。仅本地演练时全部使用临时合成分发目录与观察，不用正式稿或真实平台文件。

```sh
distribution="<实际distribution目录>"
old_version="<旧已核验bundle_version>"

node tools/wenchang-publishing/dist/zhihu-cli.js migrate-baseline \
  --dir "$distribution" --from-version "$old_version" \
  --observation "/本机临时/zhihu-current-observation.json"
node tools/wenchang-publishing/dist/zhihu-cli.js preflight \
  --dir "$distribution" --migrated-baseline \
  --observation "/本机临时/zhihu-fresh-observation.json"

node tools/wenchang-publishing/dist/xhs-cli.js migrate-baseline \
  --dir "$distribution" --from-version "$old_version" \
  --observation "/本机临时/xhs-current-observation.json"
node tools/wenchang-publishing/dist/xhs-cli.js preflight \
  --dir "$distribution" --migrated-baseline \
  --observation "/本机临时/xhs-fresh-observation.json"
```

按目标平台只执行对应两条；`--migrated-baseline`与`--baseline-evidence`互斥。这两个命令不采集浏览器、不上传、不保存草稿、不新建或发布。

每条命令完成后检查退出码及当次JSON：成功为退出码0及stdout结果；失败为退出码1及stderr的`status=blocked`、错误码和差异字段。不要在第一条失败后执行第二条或浏览器编辑。迁移/preflight失败不更新transfer/status.json；该文件仍为ready_for_browser也不表示此次通过。verify对就绪分发包记录本次核验状态，只有通过才写成功receipt，失败时保留的旧receipt只能作历史。

迁移成功只在**新transfer**独占创建`baseline-migration.json`，返回`baseline_linked`；旧plan/evidence/receipt/status不改写，新status不推进为成功。记录绑定旧plan、evidence、receipt的字节hash，以及新plan和prepare批次。同批次重复调用仍重查当次观察，复用原记录且不刷新首次时间；旧证据变化、远端冲突或批次变化均阻塞。

获得编辑授权后，编排层调用`dist/baseline-migration.js`的`readMigratedBaseline(dir, platform, freshObservationFile)`，`platform`只取`zhihu`或`xiaohongshu`。用返回的`target_plan_hash`核对即将使用的plan，从返回值取得`baseline`；不要直接读迁移JSON拼基线。知乎传给`importDraft(tab, plan, { baseline })`，小红书传给`preflightBeforeEdit(tab, plan, baseline)`，在清空正文、改话题或替换图片之前再次比较。

`remote_unchanged`只表示本次比较通过。之后沿用[三平台手册](draft-sync.md)和[Chrome流程](chrome-drafts.md)完成已授权的保存、独立重开和逐图核对，以**新plan_hash**另存evidence再verify。小红书正式证据保存于新transfer的`chrome/evidence.json`；所有证据留本地，不进Skill或Git。只有本轮verify通过才报告`draft_verified`。

## 失败恢复

先保留旧构建、证据、新plan、迁移记录和原草稿，再按错误分流；CLI只输出阻塞和恢复提示，不执行强制修复。

| 错误 | 下一步 |
| --- | --- |
| `BASELINE_EVIDENCE_NOT_VERIFIED` / `BASELINE_EVIDENCE_PLAN_MISMATCH` / `EVIDENCE_HASH_MISMATCH` | 核对旧版本status、receipt、plan与回执绑定证据；不能借用失败证据或改hash。文件不完整时先找回原件，再做只读核对 |
| `BASELINE_CONTENT_MISMATCH` / `ACCOUNT_MISMATCH` / `DRAFT_OR_ACCOUNT_MISMATCH` | 停止编辑，核对content_id、目标账号及原草稿；不自动切账号、改目标或新建替代稿 |
| `BASELINE_MIGRATION_NOT_NEEDED` / `BASELINE_OPTIONS_CONFLICT` | 同plan改用同plan预检；不要同时提供两种基线参数 |
| `BASELINE_MIGRATION_MISMATCH` / `MIGRATION_TARGET_PLAN_MISMATCH` | 核对旧链、新plan hash和target_attempt_id。若曾重prepare，保留所有记录，先核对前次保存与回读；无自动换绑或覆盖入口，不删迁移文件重来 |
| `MIGRATION_TARGET_NOT_READY` | 查看target根回执、history及最新status；已有成功先重开核验，保存不确定则先只读对账。即使根receipt已归档也不能重复编辑；不能删history或用prepare重置 |
| `REMOTE_BASELINE_CHANGED` | 保存`changed_fields`，保留远端修改和本地目标，交用户决定如何合并；不静默覆盖或自动采纳 |
| `FRESH_EVIDENCE_REQUIRED` | 独立重开原稿并另存新观察，核对真实时间，不回填旧文件。verify阶段还须满足失败状态后的时间要求 |
| `REMOTE_DRAFT_NOT_READY` / `REMOTE_OBSERVATION_INVALID` | 等页面稳定，重新读取完整字段与真实布尔值；不以旧快照或字符串“false”证明已保存 |
| `CHROME_BASELINE_REQUIRED` / `ORIGINAL_CHROME_DRAFT_REQUIRED` | 使用原Chrome范围的已验证据，按旧标题唯一匹配并重开，确认顺序；不能借用内嵌浏览器证据。同名多稿先请用户辨认 |
| `WAIT_TIMEOUT` / `SAVE_PENDING_READBACK` | 保留原稿及本次状态，重新从列表独立回读，并保留实际imported/uploaded阶段观察一起组成新证据再verify；不重传、不重prepare、不新建。只有reopened或缺少有效阶段观察时继续阻塞，不复制字段伪造阶段；见下节 |

文件或路径校验失败时，检查所选目录、缺失文件与符号链接，不放宽校验或改用其他目录绕过。无法恢复的绑定/冲突继续报告blocked，说明缺少哪份证据或哪个用户决定。

### 保存不确定后的证据恢复

verify不是只接收一份新reopened：知乎仍要求真实`imported`与`reopened`，小红书仍要求真实`uploaded`与`reopened`及保存/列表重开/顺序确认。保留本批次导入或上传阶段的有效观察，将新独立回读与它组成另存的新evidence，保持新plan_hash，checked_at取实际重开时间；旧证据不覆盖。

若前阶段观察缺失、未加载或不匹配，继续blocked，说明缺哪一阶段；在已授权范围内只读复查尚可核验的原编辑器及独立新页，不能重新上传以补字段，也不能把同页观察复制成两次独立重开。再次verify前，若先前status记录了WAIT_TIMEOUT/SAVE_PENDING_READBACK，新checked_at须严格晚于那次失败的updated_at；不得改时间、hash或布尔值绕过。重新回读尚不满足新plan时保留不一致，不自动再次写入原稿。

交付时区分本地准备、`baseline_linked`、`remote_unchanged`与新版本`draft_verified`，写明批次、原稿定位依据、证据路径、限制及`publication_performed=false`。本地合成回归通过不代表真实平台迁移通过。
