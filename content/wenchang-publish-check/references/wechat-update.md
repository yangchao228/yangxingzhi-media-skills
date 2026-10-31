# 公众号：原草稿更新、冲突与恢复

适用于本工具已保存、具有私密journal和media_id的单篇正式图文草稿。用户要求更新草稿时，使用已有账号、文章和草稿ID；不因改稿新建另一份草稿，不发布、不删除，不使用强制覆盖参数。

## 正常更新

1. 沿用唯一Markdown正文，平台标题/摘要/封面保存在原platforms/wechat.json。先build/check，再运行同一条wechat-cli sync命令。
2. 工具读取原草稿并比较最后成功远端快照；任何HTML格式、链接、图序、封面/裁切、来源、评论或其他编辑字段变化均会停止。
3. 远端未变时，更新原media_id的第0篇；只改摘要时，请求沿用当前远端HTML和其他编辑字段。平台可能再次处理HTML，必须完整回读，不能据请求内容推定版式已保留。写前再次读取，缩短并发窗口。
4. 写前持久化update_pending，回读完整目标匹配后才推进fingerprint和基线。记录operation、版本、ID和回读范围，不能以HTTP成功代替回读。

```sh
node tools/wenchang-publishing/dist/cli.js build --dir content/my-article/distribution
node tools/wenchang-publishing/dist/cli.js check --dir content/my-article/distribution
node tools/wenchang-publishing/dist/wechat-cli.js sync --config /本机私密目录/credentials.json --dir content/my-article/distribution
node tools/wenchang-publishing/dist/cli.js status --dir content/my-article/distribution
```

## 旧记录迁移

旧journal没有完整远端快照时，先用上次成功的本地输入同步一次。此步骤只读，并要求核心字段及规范化HTML均匹配；只允许已经观察到的微信图片HTTP/HTTPS、末尾/0与/640别名。不能仅凭正文文字相同就放过链接和样式差异。

- LEGACY_BASELINE_REQUIRED：当前本地输入已变，先恢复上次成功版本；不要删除journal后重新新增。
- LEGACY_REMOTE_REVIEW_REQUIRED：旧远端HTML与本地不同。保存私密比较证据，说明文字、图片、链接和排版的区别，停下来让用户决定保留远端或另行处理。未获确认前不吸收差异、不覆盖草稿。

用户明确确认保留当前远端版式与纯文字引用后，可使用已审规范化快照的SHA-256采纳本地基线：

```sh
node tools/wenchang-publishing/dist/wechat-cli.js adopt-baseline --config /本机私密目录/credentials.json --dir content/my-article/distribution --expected-remote-hash '<用户已确认的64位快照sha256>'
```

该入口仅调用stable_token和draft/get，重新计算快照哈希，匹配后才记录本机基线与确认范围。当前本地必须仍为上次成功输入，图片缓存和核心字段均匹配，且没有pending。不新增、不上传、不更新；既有基线不能据此替换，同一已采纳快照可幂等重核。REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED表示快照已变，需要重新审阅；BASELINE_PENDING_OPERATION_REQUIRES_RECONCILIATION表示先完成原写入对账。不得把任意当前哈希直接填入命令当作用户确认。

## 用户确认更新后的HTML差异

已有基线和pending的更新若回读出现HTML差异，先保存差异与私密快照，交用户核对。用户明确接受当前呈现后，使用独立只读对账入口；不能用adopt-baseline替换既有基线，也不能删除pending。

```sh
node tools/wenchang-publishing/dist/wechat-cli.js reconcile-baseline --config /本机私密目录/credentials.json --dir content/my-article/distribution --expected-remote-hash '<用户已确认的新快照sha256>'
node tools/wenchang-publishing/dist/wechat-cli.js sync --config /本机私密目录/credentials.json --dir content/my-article/distribution
node tools/wenchang-publishing/dist/wechat-cli.js sync --config /本机私密目录/credentials.json --dir content/my-article/distribution
```

对账仅允许具有v2基线、原media_id且处于remote_conflict/readback_mismatch的pending。当前本地fingerprint必须等于pending目标；重新读取的完整规范化快照须与用户确认哈希一致。相对pending目标仅允许content字段差异，标题、摘要、作者、正文文字、封面和图序仍须匹配，其他编辑字段变化也会拒绝。

通过后将旧完整远端基线、原确认及resolved_pending_update归档到私密journal的baseline_reconciliations，保留本地target_local_article，记录本次确认，再清除已完成pending和冲突。返回operation=reconciled、baseline_reconciled=true；相同批准可只读幂等重核。此入口只调用stable_token/get，不发送更新、新增或上传。之后两次普通sync应均为verify且同ID、无pending；新增差异则继续阻塞，不能沿用旧确认。

主要拒绝码：REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED（快照再变）、RECONCILIATION_LOCAL_INPUT_CHANGED（本地已变）、RECONCILIATION_SCOPE_MISMATCH_REVIEW_REQUIRED（超出HTML字段范围）、RECONCILIATION_CORE_MISMATCH_REVIEW_REQUIRED（文字或图片等核心不符）。拒绝保留原journal和pending。

## 超时与失败

单次调用最多发送一次更新；网络、HTTP或响应格式异常后先回读。等于目标即完成，不重写；仍为原基线则保留pending，后续调用先读后最多重发一次；出现第三种状态则保留远端并停止。回读失败仍为待确认，不能报告成功。

第三种状态可能来自人工编辑，也可能来自平台处理；必须依据差异判断，不能直接归因为人工修改。尤其是摘要已正确写入、正文文字和图片一致时，字体、颜色、链接等HTML差异仍应保留为冲突。恢复原摘要后也要单独核对版式；不得删除pending、清除基线或放宽正文比较来制造成功。真实验收的补偿恢复应逐次绑定原草稿ID、已观察快照和用户批准原目标，保存原pending及回读；此处没有通用强制恢复入口。

pending期间保持输入不变；已经改稿时先恢复待确认版本完成对账。业务错误保留具体错误码和pending信息，不以旧回执冒充当前成功。同一任务的并发锁存在时等待原任务，不覆盖其回执；异常锁需先确认进程退出。

远端快照与原始差异只存本机私密目录，权限600；报告只写字段名、版本、时间和结果，不输出token、密钥或签名URL。浏览器视觉验收与API数据验收分别记录。客户端没有已核验的条件写入能力，读取与写入之间仍可能发生并发编辑。

## 历史验收提炼与完成判定

2026-10-25的历史验收记录显示：同ID摘要修改及恢复后，正文文字和图片仍一致，原外层字体与颜色样式却未恢复，因而保留HTML冲突。用户随后在后台接受当时的新呈现，才按新快照完成只读对账及两次普通sync回读。这说明“按用户接受的新呈现完成对账”可以成立，不能据此宣称原CSS已恢复，也不能将该次结果视为当前线上状态。

| 观察结果 | 可复用判断 |
| --- | --- |
| 摘要恢复、正文文字与图片一致，但按现有归一化规则比较后HTML仍有差异 | 字段恢复不等于版式恢复。保留冲突与pending，按[超时与失败](#超时与失败)核对差异；不能凭核心内容一致报告完整恢复，也不将已支持的图片URL别名判为新冲突。 |
| 用户接受更新后的新呈现 | 确认只绑定本次已审新快照。按[用户确认更新后的HTML差异](#用户确认更新后的html差异)核对reconcile-baseline条件；旧版式的确认不能代替新确认。 |
| reconcile-baseline返回draft_verified、operation=reconciled、baseline_reconciled=true | 首次解决pending时，核对旧基线、原确认及已解决pending已归档到baseline_reconciliations，本地目标未被远端HTML替换；相同批准的幂等重核返回idempotent=true，不新增归档或重写journal。历史归档仍须独立核对，不能仅凭成功字段推定留存完整。两种路径均不发送更新、新建、上传或发布。 |
| 对账后本地输入与远端均未变，两次普通sync均返回draft_verified、operation=verify | 执行前确认原media_id、当前本地fingerprint与已对账目标一致且无pending；执行后核对完整规范化快照稳定、无pending/conflict，两次均仅stable_token与draft/get。普通sync没有通用只读开关，本地改稿或待确认写入可能触发更新，不能把这些情况当作不变重跑。 |

用户接受版式的反馈与API数据回读分别记录；API回执中的account_identity_verified=false、visual_review=pending不会因该反馈自动变成工具身份或视觉验收通过。草稿回读通过也不代表公开发布。

本历史案例的原始文档与证据保留在本机，不作为其他任务的安装或执行依赖；更新其他既有草稿仍须保留其自身的当前journal。实际重跑前，将当前wechat-sync-receipt.json、journal及对应回读/截图复制到本机私密历史目录；CLI会更新当前回执，baseline_reconciliations仅归档旧基线、原确认和已解决pending，不会自动保存每轮回执及截图。新结果另行留存，不覆盖历史副本或将旧blocked记录改写为成功；不照搬历史快照哈希、测试数量或后续待办执行新任务。
