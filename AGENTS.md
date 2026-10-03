# AGENTS.md

面向 coding agent 的仓库工作指南。

## 项目概述

博客主站前端（配套后端 `../blog`，FastAPI）。Vue 3 + Vite + vue-router；**不使用组件库**，样式全部手写在 `src/styles.css`（设计 token：暖纸色背景 `--bg`、赭石主色 `--accent`、衬线标题 `--font-serif`）。

## 常用命令

```bash
npm install
npm run dev     # http://127.0.0.1:5173
npm run build   # 产物 dist/（勿提交）
```

后端地址默认 `http://127.0.0.1:8000`，构建时 `VITE_API_BASE` 覆盖；axios 实例在 `src/api.js`。

## 页面与数据

- 路由：`/` 首页（支持 `?category_id=&tag_id=&keyword=&page=` 过滤）、`/articles/:slug` 详情、`/archives?mode=time|category|tag` 聚合、`/about` 关于
- 所有数据来自后端接口（`/api/home`、`/api/articles` 等），不在前端 mock
- 详情页用 `v-html` 渲染 `body_html`，排版样式在 `.prose`；其中包含语雀 `ne-` 前缀 class 的兼容样式，勿随意删除
- `index.html` 的 `<meta name="referrer" content="no-referrer">` 用于绕过图片防盗链，勿删

## 约定

- 注释、提交信息用中文
- 新页面放 `src/views/`，可复用组件放 `src/components/`，路由在 `src/router.js` 注册
- 设计 token 只在 `:root` 变量里改，不硬编码颜色
- `node_modules/`、`dist/` 不进仓库
