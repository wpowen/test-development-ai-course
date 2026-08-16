# TD-P02 validation

## Research coverage

## Claim traceability

## Runnable lab

## Independent comparison

## Publication verdict

静态要求：研究目录含九个独立文件、10 条 source-pack 记录、两次 research run、Evidence/Inference/Unknown 分栏和 comparison 裁决。工程要求：manifest、authority policy、schema、prompt manifest/eval/mutation、traceability、run receipts 均版本化；fresh unzip 不依赖仓库外路径。

动态要求：`reset` 后 baseline 返回 0；删除 source 或注入 unsupported rule 后返回 2；代码 mutation 返回 1；repair 返回 0；文档冲突不生成下游 test package。所有报告保留 `evidence_status=fixture-tested`，provider/model 为 none/offline-deterministic 且 prompt manifest 为 NOT_RUN。

当前未完成项是 live model/API、企业系统回读、从业者盲评、真实数据治理、生产部署和学员效果。若任何验证脚本失败，状态保持 blocked，不得改写为 PASS-LIVE。验证命令和最新收据由 course→validation handoff 指向。
