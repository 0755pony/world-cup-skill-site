const form = document.querySelector("#prediction-form");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submit-button");
const swapButton = document.querySelector("#swap-button");

const fields = {
  stage: document.querySelector("#stage"),
  teamA: document.querySelector("#team-a"),
  teamB: document.querySelector("#team-b"),
  notes: document.querySelector("#notes")
};

const output = {
  teamALabel: document.querySelector("#team-a-label"),
  teamBLabel: document.querySelector("#team-b-label"),
  teamAProb: document.querySelector("#team-a-prob"),
  teamBProb: document.querySelector("#team-b-prob"),
  drawProb: document.querySelector("#draw-prob"),
  predictedScore: document.querySelector("#predicted-score"),
  confidence: document.querySelector("#confidence"),
  keyFactors: document.querySelector("#key-factors"),
  analysis: document.querySelector("#analysis"),
  players: document.querySelector("#players"),
  rawJson: document.querySelector("#raw-json"),
  contractChecks: document.querySelector("#contract-checks"),
  groupsGrid: document.querySelector("#groups-grid"),
  teamAPreview: document.querySelector("#team-a-preview"),
  teamBPreview: document.querySelector("#team-b-preview")
};

const teamFlags = {
  "墨西哥": "mx",
  "南非": "za",
  "韩国": "kr",
  "捷克": "cz",
  "加拿大": "ca",
  "波黑": "ba",
  "卡塔尔": "qa",
  "瑞士": "ch",
  "巴西": "br",
  "摩洛哥": "ma",
  "海地": "ht",
  "苏格兰": "gb-sct",
  "美国": "us",
  "巴拉圭": "py",
  "澳大利亚": "au",
  "土耳其": "tr",
  "德国": "de",
  "库拉索": "cw",
  "科特迪瓦": "ci",
  "厄瓜多尔": "ec",
  "荷兰": "nl",
  "日本": "jp",
  "瑞典": "se",
  "突尼斯": "tn",
  "比利时": "be",
  "埃及": "eg",
  "伊朗": "ir",
  "新西兰": "nz",
  "西班牙": "es",
  "佛得角": "cv",
  "沙特": "sa",
  "乌拉圭": "uy",
  "法国": "fr",
  "塞内加尔": "sn",
  "伊拉克": "iq",
  "挪威": "no",
  "阿根廷": "ar",
  "阿尔及利亚": "dz",
  "奥地利": "at",
  "约旦": "jo",
  "葡萄牙": "pt",
  "刚果金": "cd",
  "乌兹别克斯坦": "uz",
  "哥伦比亚": "co",
  "英格兰": "gb-eng",
  "克罗地亚": "hr",
  "加纳": "gh",
  "巴拿马": "pa"
};

const groups = [
  ["A", ["墨西哥", "南非", "韩国", "捷克"]],
  ["B", ["加拿大", "波黑", "卡塔尔", "瑞士"]],
  ["C", ["巴西", "摩洛哥", "海地", "苏格兰"]],
  ["D", ["美国", "巴拉圭", "澳大利亚", "土耳其"]],
  ["E", ["德国", "库拉索", "科特迪瓦", "厄瓜多尔"]],
  ["F", ["荷兰", "日本", "瑞典", "突尼斯"]],
  ["G", ["比利时", "埃及", "伊朗", "新西兰"]],
  ["H", ["西班牙", "佛得角", "沙特", "乌拉圭"]],
  ["I", ["法国", "塞内加尔", "伊拉克", "挪威"]],
  ["J", ["阿根廷", "阿尔及利亚", "奥地利", "约旦"]],
  ["K", ["葡萄牙", "刚果金", "乌兹别克斯坦", "哥伦比亚"]],
  ["L", ["英格兰", "克罗地亚", "加纳", "巴拿马"]]
];

document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => {
    fields.stage.value = button.dataset.stage;
    fields.teamA.value = button.dataset.teamA;
    fields.teamB.value = button.dataset.teamB;
    renderLabels();
  });
});

swapButton.addEventListener("click", () => {
  const nextA = fields.teamB.value;
  fields.teamB.value = fields.teamA.value;
  fields.teamA.value = nextA;
  renderLabels();
});

fields.teamA.addEventListener("input", renderLabels);
fields.teamB.addEventListener("input", renderLabels);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    stage: fields.stage.value.trim(),
    teamA: fields.teamA.value.trim(),
    teamB: fields.teamB.value.trim(),
    notes: fields.notes.value.trim()
  };

  if (!payload.teamA || !payload.teamB) {
    setStatus("请填写球队", "error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "预测失败");
    }

    renderResult(data);
    setStatus("已完成");
  } catch (error) {
    setStatus("出错", "error");
    output.analysis.textContent = error.message;
  } finally {
    setLoading(false);
  }
});

function renderLabels() {
  setTeamLabel(output.teamALabel, fields.teamA.value || "球队 A");
  setTeamLabel(output.teamBLabel, fields.teamB.value || "球队 B");
  renderSelectedMatch();
}

function renderResult(data) {
  setTeamLabel(output.teamALabel, data.teamA?.name || fields.teamA.value);
  setTeamLabel(output.teamBLabel, data.teamB?.name || fields.teamB.value);
  output.teamAProb.textContent = formatPercent(data.teamA?.winProb);
  output.teamBProb.textContent = formatPercent(data.teamB?.winProb);
  output.drawProb.textContent = formatPercent(data.draw);
  output.predictedScore.textContent = data.predictedScore || "-";
  output.confidence.textContent = data.confidence || "--";
  output.analysis.textContent = data.analysis || "暂无分析";
  output.rawJson.textContent = JSON.stringify(data, null, 2);
  renderContractChecks(data);

  output.keyFactors.replaceChildren(
    ...(Array.isArray(data.keyFactors) && data.keyFactors.length
      ? data.keyFactors.map((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          return li;
        })
      : [document.createElement("li")])
  );

  if (!output.keyFactors.firstElementChild.textContent) {
    output.keyFactors.firstElementChild.textContent = "暂无关键因素";
  }

  output.players.replaceChildren(
    ...(Array.isArray(data.playersToWatch) ? data.playersToWatch : []).map((player) => {
      const item = document.createElement("article");
      item.className = "player";
      const title = document.createElement("strong");
      title.textContent = `${player.player || "未知球员"} · ${player.team || "球队"}`;
      const reason = document.createElement("span");
      reason.textContent = player.reason || "暂无理由";
      item.append(title, reason);
      return item;
    })
  );
}

function setTeamLabel(target, name) {
  target.replaceChildren(createTeamBadge(name, "team-badge stacked"));
}

function renderSelectedMatch() {
  output.teamAPreview.replaceChildren(createTeamBadge(fields.teamA.value || "球队 A", "team-badge compact"));
  output.teamBPreview.replaceChildren(createTeamBadge(fields.teamB.value || "球队 B", "team-badge compact"));
}

function createTeamBadge(name, className = "team-badge") {
  const badge = document.createElement("span");
  badge.className = className;

  const code = teamFlags[name];
  if (code) {
    const flag = document.createElement("img");
    flag.className = "flag";
    flag.src = `/assets/flags/${code}.png`;
    flag.alt = `${name} 国旗`;
    flag.loading = "lazy";
    flag.decoding = "async";
    flag.addEventListener("error", () => {
      flag.remove();
      badge.classList.add("no-flag");
    });
    badge.append(flag);
  } else {
    badge.classList.add("no-flag");
  }

  const text = document.createElement("span");
  text.textContent = name;
  badge.append(text);
  return badge;
}

function renderContractChecks(data) {
  const teamA = Number(data.teamA?.winProb);
  const teamB = Number(data.teamB?.winProb);
  const draw = Number(data.draw);
  const total = teamA + teamB + draw;
  const checks = [
    ["概率总和 100", Number.isFinite(total) && total === 100],
    ["胜率不超过 85", [teamA, teamB, draw].every((value) => Number.isFinite(value) && value <= 85)],
    ["比分格式正确", /^\d{1,2}-\d{1,2}$/.test(data.predictedScore || "")],
    ["关键因素 3-5 条", Array.isArray(data.keyFactors) && data.keyFactors.length >= 3 && data.keyFactors.length <= 5],
    ["关键先生 2 人", Array.isArray(data.playersToWatch) && data.playersToWatch.length === 2]
  ];

  output.contractChecks.replaceChildren(
    ...checks.map(([label, ok]) => {
      const item = document.createElement("span");
      item.className = ok ? "check ok" : "check warn";
      item.textContent = `${ok ? "通过" : "待修正"} · ${label}`;
      return item;
    })
  );
}

function formatPercent(value) {
  return Number.isFinite(Number(value)) ? `${Number(value)}%` : "--";
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "预测中..." : "开始预测";
  if (isLoading) {
    setStatus("预测中", "busy");
  }
}

function setStatus(text, state = "") {
  statusEl.textContent = text;
  statusEl.className = `status ${state}`.trim();
}

function renderGroups() {
  output.groupsGrid.replaceChildren(
    ...groups.map(([name, teams]) => {
      const card = document.createElement("article");
      card.className = "group-card";
      const title = document.createElement("strong");
      title.textContent = `${name} 组`;
      const list = document.createElement("div");
      list.className = "group-team-list";
      teams.forEach((team) => {
        list.append(createTeamBadge(team, "team-badge group-team"));
      });
      card.append(title, list);
      return card;
    })
  );
}

renderLabels();
renderGroups();
