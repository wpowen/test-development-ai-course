#!/usr/bin/env bash
#
# 内容重建与门禁的唯一入口。
#
# 用法：
#   scripts/rebuild-content.sh              # 全量重建 + 全部门禁（引用元数据走 GitHub API）
#   scripts/rebuild-content.sh --offline    # 不调 GitHub API，沿用上次抓到的版本与许可证
#   scripts/rebuild-content.sh --check-urls # 额外验证每个引用 URL 仍然可达（慢，建议定时跑）
#
# 为什么需要它：这条链有先后依赖，顺序错了不会报错，只会产出静默不一致的产物。
# 引用台账必须先于文档投影生成，否则 build-dimension-docs.mjs 拿到的是上一版的版本号；
# 站点模块必须先于站点校验重建，否则 validate-content.ts 校验的是旧投影。
# 过去这些命令散落在提交记录和交接文档里，换个人执行顺序就变了——这个脚本把顺序固化下来。
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OFFLINE=""
CHECK_URLS=""
for arg in "$@"; do
  case "$arg" in
    --offline)    OFFLINE="--offline" ;;
    --check-urls) CHECK_URLS="--check-urls" ;;
    *) echo "未知参数：$arg" >&2; exit 2 ;;
  esac
done

step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }

step "1/8 引用台账（人工判断 + GitHub 实时版本与许可证）"
python3 scripts/build-reference-library.py $OFFLINE

step "2/8 站点深度层模块投影"
python3 scripts/build-site-modules.py

step "3/8 维度 Markdown 投影"
node scripts/build-dimension-docs.mjs

step "4/8 语义门禁（状态命名空间、统计判定、审查独立性契约）"
node scripts/validate-semantic-contracts.mjs

step "5/8 TEVV 治理门禁（覆盖矩阵、Judge/Gold、阈值、学习路径与 NOT_RUN 收据）"
node scripts/validate-tevv-governance.mjs

step "6/8 可落地性门禁（阈值、失效点、架构索引、三段式门禁）"
python3 scripts/validate-deep-sources.py

step "7/8 引用门禁（出处、版本锚点、许可证、标准版本与复核队列）"
python3 scripts/validate-references.py $CHECK_URLS

step "8/8 发布语义、证据新鲜度、内容投影与类型检查"
npm --prefix site run validate:release
npm --prefix site run typecheck

printf '\n\033[32m全部通过。\033[0m内容源改动已同步到站点模块与 Markdown 两个投影。\n'
