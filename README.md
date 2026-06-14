# 绿茵神算 Skill 网站

这是把 GitHub 仓库 `TradingAi666/worldcup2026-prediction-skill` 的 `skill.md` 接到网页上的 Cloudflare Pages 项目。

## 已对齐原项目能力

- 使用原项目 `skill.md` 作为 system prompt，预测内核与上游一致。
- 页面展示 48 队完整可选列表与 12 个小组分组。
- 48 支球队均配有本地自托管国旗图片，避免依赖外链加载。
- 展示四层约束：资料库、方法论、输出契约、每日情报。
- 展示方法论权重：近期状态 40%、硬实力 30%、历史交锋 15%、情境因素 15%。
- 前端对模型 JSON 做基础契约校验，包括概率总和、胜率上限、比分格式、关键因素数量、关键先生数量。
- 保留原始 JSON，方便前端、小程序、机器人继续复用。

## 本地预览

```bash
npm install
npm run dev
```

本地测试接口前需要设置：

```bash
export DEEPSEEK_API_KEY="sk-你的DeepSeekKey"
```

## 部署到 Cloudflare Pages

1. 进入 Cloudflare Dashboard。
2. 打开 `Workers & Pages`。
3. 点 `Create application`，选择 `Pages`。
4. 如果使用 GitHub，连接包含本目录的仓库；如果不用 GitHub，可以用 Direct Upload 上传整个目录。
5. Build command 留空。
6. Build output directory 填 `.`。
7. 在项目的 `Settings -> Environment variables` 添加：
   - `DEEPSEEK_API_KEY`: 你的 DeepSeek API Key
   - `DEEPSEEK_MODEL`: `deepseek-chat`
8. 部署成功后，在 `Custom domains` 添加 `shenwan.ai` 或 `www.shenwan.ai`。

## 文件说明

- `skill.md`: 预测 Skill 原文
- `index.html`: 网站页面
- `app.js`: 前端交互
- `styles.css`: 页面样式
- `functions/api/predict.js`: Cloudflare Pages Function，负责调用 DeepSeek
