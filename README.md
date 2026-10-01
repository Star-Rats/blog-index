# blog-index · 博客主站

配套 `../../blog` 后端（FastAPI）的博客主站前端。Vue 3 + Vite + vue-router，样式手写（暖纸色 + 赭石色调，衬线标题）。

## 页面

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：站点信息、文章列表（支持分类/标签/关键词过滤）、分页、侧栏 |
| `/articles/:slug` | 文章详情：富文本正文排版、分类标签、浏览量自增 |
| `/archives` | 归档聚合：同一批文章的三种视角（`?mode=time\|category\|tag`） |
| `/about` | 「关于」页：渲染后台维护的 Markdown |

## 启动

```bash
npm install
npm run dev   # http://127.0.0.1:5173
```

API 地址默认 `http://127.0.0.1:8000`，构建时用 `VITE_API_BASE` 覆盖：

```bash
VITE_API_BASE=https://api.example.com npm run build
```

产物在 `dist/`，Nginx 托管 + SPA fallback 到 `index.html`。`index.html` 已带 `<meta name="referrer" content="no-referrer">`（外链图片防盗链）。
