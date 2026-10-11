# 取舍 · Life Tradeoffs

> 人生不用全做对，只需**取舍**对几件事。

基于《[高性价比人生指南](https://github.com/eternity4719/HowToLiveBetter)》的**非官方衍生**网站。原书把 677 条经核验的建议写给所有人；本站回答另一个问题：**此刻的我，最该看哪几条？**

纯前端、无后端、无账号，所有收藏/打卡只存在你自己的浏览器里。

## 怎么找到适合你的建议

- **懵住时刻**：被裁员、被欠薪、租房、结婚、生娃、确诊慢性病、家人走了、被骗——把跨章节的相关条目聚合成**按先后顺序排好的步骤清单**，并标出时间窗（谈判期、黄金 30 分钟等）。
- **完整手册**：原书 34 节的系统阅读，左侧章节目录 + 右侧按时机分组的条目。
- **生活领域**：工作学习、日常开销、居住安全、健康就医、家人照护、办事权益。
- **搜索**：关键词 + 可靠度 + 时机（趁早做 / 出事当下 / 平时做 / 长期坚持）。

每条建议是独立可分享链接（`#/tip/章-条`），详情页写明要花什么、能换回什么、适用边界、依据有多可靠，并附上**该条在原仓库的 git 更新记录**。

> 这是一份**备选单，不是任务清单**。依据只用大白话表达：很可靠 / 较可靠 / 仅供参考。

## 数据与上游同步

- 数据源是上游仓库的 `book/*.md`（34 个章节文件），不是手工维护。
- GitHub Actions 每天拉取上游，重建数据；有更新时**自动开 PR**，合并后 Vercel 自动部署（见 `.github/workflows/sync-upstream.yml`）。
- 每条建议的“资料更新记录”由 `scripts/build-provenance.mjs` 读取上游完整 git 历史生成（首次收录 + 最近 3 次提交）。
- 页脚显示当前资料版本（上游短 commit + 日期），一眼可知新旧。

## 开发

```bash
npm install
npm run sync:upstream   # 拉取/更新上游到 scripts/.upstream（完整 git 历史，已 gitignore）
npm run build:data      # 重建 src/data/dataset.json 与 provenance.json
npm run dev             # 本地开发
npm run build           # 数据 + 类型检查 + 生产构建
npm run build:site      # 只用已提交的数据构建（CI/部署用，不联网拉上游）
npm run preview         # 预览构建产物
```

数据脚本：

| 脚本 | 作用 |
| --- | --- |
| `scripts/sync-upstream.mjs` | clone / 更新上游到 `scripts/.upstream` |
| `scripts/build-data.mjs` | 解析 `book/*.md`，加工时机标签与时刻包，输出 `dataset.json`（含上游版本） |
| `scripts/build-provenance.mjs` | 按条目匹配上游 git 提交，输出 `provenance.json` |
| `scripts/taxonomy.mjs` / `moments.mjs` | 领域 / 人生阶段 / 懵住时刻的编排 |

`src/data/*.json` 会提交进仓库，因此部署端无需访问上游网络即可构建。

## 部署（Vercel）

静态站点，框架 Vite：

- Build Command：`npm run build:site`
- Output Directory：`dist`

配置已写在 `vercel.json`（含 SPA rewrite 与静态资源缓存）。路由用 hash 模式，任何子路径都不需要额外服务端配置。

## 技术栈

Vite + Vue 3 + TypeScript，零第三方运行时依赖；轻量自研 hash 路由；localStorage 持久化。

## 许可与归属

- **代码**：[MIT](./LICENSE)，© 2026 Grant Liu (chnjames)。
- **条目内容**：来自《高性价比人生指南》，遵循 **CC BY 4.0**，版权归原项目 eternity4719；本项目为非官方衍生，不改原书数字与结论，不自称官方，一切以原仓库中文原文为准。
