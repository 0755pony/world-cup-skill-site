# 绿茵神算网站交接文档

## 项目概览

- 项目名称：绿茵神算 2026 FIFA 世界杯预测页面
- GitHub 仓库：https://github.com/0755pony/world-cup-skill-site
- 本地目录：`/Users/mac/Documents/公众号/green-soccer-skill-site`
- 部署平台：Cloudflare Pages
- 线上建议域名：`worldcup.shenwan.ai`
- 主域名规划：`shenwan.ai` 未来作为个人网站，不建议继续绑定本项目

这个项目是一个静态前端 + Cloudflare Pages Functions 的世界杯预测站点。前端负责比赛选择、视觉展示和结果渲染，后端函数负责读取 `skill.md` 并调用 DeepSeek API 生成预测 JSON。

## 当前状态

- 已接入 GitHub 自动部署。
- 已配置 Cloudflare Pages 项目。
- 已配置 DeepSeek 环境变量。
- 已加入 FIFA 奖杯 Logo。
- 已加入 48 支球队本地国旗图片。
- 已完成多轮 UI 优化，当前方向是接近 Apple.com 的克制、精致、顺滑产品质感。
- 已移除原项目外链、原始 JSON 展示、页面编辑器。
- GitHub 外链已改为用户自己的仓库地址。

## 关键文件

- `index.html`
  - 页面主体结构。
  - 包含左侧预测输入面板、右侧结果面板、12 组分组展示。
  - CSS/JS 引用带版本号，用于绕过浏览器或 Cloudflare 缓存。

- `styles.css`
  - 页面全部视觉和响应式样式。
  - 当前设计重点：Apple 风格的浅色系统感、轻玻璃卡片、精细阴影、segmented control、顺滑 hover/pressed/focus 状态。

- `app.js`
  - 前端交互逻辑。
  - 管理快捷比赛、球队交换、表单提交、结果渲染、契约校验、分组渲染。

- `functions/api/predict.js`
  - Cloudflare Pages Function。
  - 接收 `POST /api/predict`。
  - 读取 `skill.md` 作为 system prompt。
  - 调用 DeepSeek Chat Completions API。
  - 返回标准 JSON 给前端渲染。

- `skill.md`
  - 预测 Skill 原文。
  - 修改预测规则、输出结构、球队知识时主要改这里。

- `assets/brand/fifa-logo.png`
  - 页面顶部 Logo。

- `assets/flags/*.png`
  - 48 支球队国旗，本地自托管，避免外链失效。

- `wrangler.toml`
  - Cloudflare Pages / Wrangler 配置。

## 环境变量

Cloudflare Pages 项目中需要配置：

```text
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-chat
```

注意：

- `DEEPSEEK_API_KEY` 必须配置在 Cloudflare Pages 的环境变量里。
- 不要把 API Key 写进 GitHub 仓库。
- `DEEPSEEK_MODEL` 当前使用 `deepseek-chat`。

## Cloudflare Pages 设置

推荐配置：

```text
Build command: 留空
Build output directory: .
Production branch: main
```

项目没有构建步骤，HTML/CSS/JS 和 Functions 直接部署。

部署入口：

```bash
git push origin main
```

Cloudflare Pages 会自动检测 GitHub 推送并重新部署。

## 域名策略

当前业务目标：

- 世界杯预测页面使用：`worldcup.shenwan.ai`
- 主域名 `shenwan.ai` 保留给个人网站

Cloudflare DNS / Pages 建议：

1. 在 Pages 项目中添加 Custom Domain：`worldcup.shenwan.ai`
2. 确认 DNS 有 CNAME：

```text
worldcup -> world-cup-skill-site.pages.dev
Proxy status: Proxied
TTL: Auto
```

3. 从本 Pages 项目的 Custom Domains 中移除 `shenwan.ai`
4. 之后单独给 `shenwan.ai` 部署个人网站

## 本地开发

安装依赖：

```bash
npm install
```

本地运行 Cloudflare Pages Functions：

```bash
npm run dev
```

本地测试 API 前设置：

```bash
export DEEPSEEK_API_KEY="sk-你的DeepSeekKey"
export DEEPSEEK_MODEL="deepseek-chat"
```

如果只是看前端静态页面，也可以临时运行：

```bash
python3 -m http.server 8788
```

注意：普通静态服务器不支持 `/api/predict`，点击预测时接口会失败，这是预期现象。要完整测试接口请使用 Wrangler。

## 常用检查

检查 JS 语法：

```bash
node --check app.js
node --check functions/api/predict.js
```

检查旧链接和不该出现的内容：

```bash
rg "TradingAi666|原项目|raw-json|编辑页面|DEEPSEEK_API_KEY"
```

检查 Git 状态：

```bash
git status --short --branch
```

## UI 设计方向

当前目标不是花哨体育博彩风，而是更接近 Apple.com 的感觉：

- 大量留白
- 克制颜色
- 精致卡片
- 高质量字体节奏
- 轻微 hover 和 pressed 动效
- 控件像系统原生控件
- 不做复杂说明文案
- 不使用重渐变、炫光、过多装饰

已经完成的 UI 特性：

- 浅色背景和柔和玻璃卡片
- 顶部赛事感细线
- 快捷比赛 segmented control 选中态
- 自定义下拉框外壳和箭头
- 按钮 hover / pressed / focus-visible
- 输入框 hover / focus 状态
- 结果卡、关键先生、分组卡 hover 反馈
- `prefers-reduced-motion` 弱动效适配
- 移动端无横向溢出

后续继续优化时建议保持：

- 圆角不要过大，当前保持 8px
- 不要加大面积花哨背景图
- 不要把页面变成营销落地页
- 主体验应直接是预测工具
- 保持信息密度适中，方便用户快速操作

## 预测流程

1. 用户选择比赛阶段。
2. 用户填写球队 A、球队 B。
3. 可选填写补充信息。
4. 前端提交到：

```text
POST /api/predict
```

5. Pages Function 读取 `skill.md`。
6. Pages Function 调用 DeepSeek。
7. DeepSeek 返回 JSON。
8. 前端渲染：
   - 球队胜率
   - 平局概率
   - 预测比分
   - 置信度
   - 关键因素
   - 综合分析
   - 关键先生
   - 输出契约校验

## 前端数据结构要求

前端当前期望模型返回大致结构：

```json
{
  "teamA": {
    "name": "墨西哥",
    "winProb": 45
  },
  "teamB": {
    "name": "南非",
    "winProb": 25
  },
  "draw": 30,
  "predictedScore": "2-1",
  "confidence": "中",
  "keyFactors": ["因素一", "因素二", "因素三"],
  "analysis": "综合分析文本",
  "playersToWatch": [
    {
      "team": "墨西哥",
      "player": "球员名",
      "reason": "理由"
    }
  ]
}
```

如果修改 `skill.md`，请尽量保持这些字段名稳定，否则需要同步修改 `app.js` 的 `renderResult()`。

## 缓存注意事项

`index.html` 里 CSS 和 JS 带版本号：

```html
<link rel="stylesheet" href="/styles.css?v=...">
<script src="/app.js?v=..." type="module"></script>
```

每次大改 CSS/JS 后建议更新版本号，避免浏览器或 Cloudflare 缓存导致线上加载旧文件。

之前遇到过的问题：

```text
Cannot set properties of null (setting 'textContent')
```

原因是 HTML 已更新但浏览器拿到了旧 JS。解决方式就是更新脚本版本号并重新部署。

## 最近提交

```text
e2b7098 Refine controls and interaction polish
7d5f975 Polish prediction page design
43c6055 Bust app script cache
f357342 Remove editor and upstream project references
2c521b4 Add editable page content panel
cb894a3 Add trophy logo and fix group layout
12f69b4 Add team flag visuals
f265a72 Align demo with upstream skill docs
```

## 后续建议

短期：

- 继续优化移动端首屏高度和按钮位置。
- 给预测中状态增加更优雅的 loading 表现。
- 给结果生成后增加轻微 reveal 动效。
- 优化错误提示，不直接展示技术错误。

中期：

- 为 `shenwan.ai` 单独做个人主页。
- 保持 `worldcup.shenwan.ai` 作为世界杯预测工具。
- 可以增加分享海报或结果截图功能。

长期：

- 如果需要后台编辑页面文案，建议接入 Cloudflare KV / D1 / Supabase。
- 如果需要可持续维护球队资料，建议把球队、分组、旗帜映射拆成独立 JSON。
- 如果需要更稳定输出，可以在后端对 DeepSeek 返回 JSON 做 schema 校验和兜底修复。
