# Author has been dead / 第一章网页化

这是一个可部署到 GitHub Pages 的纯前端网页体验。原始 Markdown、PDF、PNG 和音频位于 `第一章/`，React 代码只负责展示、流程控制和媒体状态。

## 技术栈

- Vite
- React
- TypeScript
- React Router（Hash Router）
- react-markdown + remark-gfm
- 原生 CSS 与 Web Crypto API

项目不使用后端、数据库、运行时 CDN、外部字体、PWA、analytics 或 cookies。

## 常用命令

```bash
npm install
npm run dev
npm run test
npm run build
npm run preview
npm run hash -- "新答案"
```

`npm run dev` 和 `npm run build` 会先运行 `scripts/sync-runtime-assets.mjs`。它把需要的二进制文件复制到生成目录并写出媒体清单。`npm run build` 完成后还会扫描 `dist/`，防止幕后文档和敏感明文进入 production。

## 内容与目录

- `第一章/`：文字和媒体源文件。
- `src/content/manifest.ts`：明确列出的玩家可见内容清单，不进行整目录扫描。
- `src/config/game.ts`：日期、音频、校验摘要、credits 和媒体文件名配置。
- `src/audio/AudioManager.ts`：全站音频状态管理。
- `scripts/`：媒体同步、摘要计算和构建检查。
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动部署。
- `傻瓜.md`：面向不会前端的维护说明。

`第一章/玩家游玩流程.md`、`第一章/第一章大纲和谜题设计.md` 和根目录两篇幕后设定不得导入玩家应用，也不得复制进 `public/`。

## 构建和部署

```bash
npm ci
npm run build
```

静态产物位于 `dist/`，不要手工编辑。推送到 `main` 后工作流会自动构建并部署。第一次使用时，在 GitHub 仓库的 **Settings → Pages** 中把 Source 设为 **GitHub Actions**。
