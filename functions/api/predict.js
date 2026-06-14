const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return json({ error: "缺少 DEEPSEEK_API_KEY 环境变量" }, 500);
    }

    const body = await context.request.json();
    const teamA = clean(body.teamA);
    const teamB = clean(body.teamB);
    const stage = clean(body.stage || "小组赛");
    const notes = clean(body.notes || "");

    if (!teamA || !teamB) {
      return json({ error: "请填写两支球队" }, 400);
    }

    const skillPrompt = await loadSkillPrompt(context);
    const userPrompt = [
      `请预测这场 2026 世界杯比赛：【${stage}】${teamA} vs ${teamB}。`,
      notes ? `补充信息：${notes}` : "",
      "严格输出合法 JSON 对象，不要 markdown 代码块，不要输出 JSON 之外的文字。"
    ].filter(Boolean).join("\n");

    const upstream = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: context.env.DEEPSEEK_MODEL || "deepseek-chat",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: skillPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.4
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      return json({ error: result.error?.message || "DeepSeek 请求失败" }, upstream.status);
    }

    const content = result.choices?.[0]?.message?.content;
    if (!content) {
      return json({ error: "DeepSeek 没有返回内容" }, 502);
    }

    return json(parseModelJson(content));
  } catch (error) {
    return json({ error: error.message || "服务器错误" }, 500);
  }
}

export function onRequestGet() {
  return json({ ok: true, message: "POST /api/predict" });
}

async function loadSkillPrompt(context) {
  const url = new URL(context.request.url);
  url.pathname = "/skill.md";

  const assetResponse = await context.env.ASSETS.fetch(new Request(url.toString()));
  if (!assetResponse.ok) {
    throw new Error("无法读取 skill.md");
  }

  return assetResponse.text();
}

function parseModelJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("模型返回的不是 JSON");
    }
    return JSON.parse(match[0]);
  }
}

function clean(value) {
  return String(value || "").trim().slice(0, 500);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
