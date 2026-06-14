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
  rawJson: document.querySelector("#raw-json")
};

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
  output.teamALabel.textContent = fields.teamA.value || "球队 A";
  output.teamBLabel.textContent = fields.teamB.value || "球队 B";
}

function renderResult(data) {
  output.teamALabel.textContent = data.teamA?.name || fields.teamA.value;
  output.teamBLabel.textContent = data.teamB?.name || fields.teamB.value;
  output.teamAProb.textContent = formatPercent(data.teamA?.winProb);
  output.teamBProb.textContent = formatPercent(data.teamB?.winProb);
  output.drawProb.textContent = formatPercent(data.draw);
  output.predictedScore.textContent = data.predictedScore || "-";
  output.confidence.textContent = data.confidence || "--";
  output.analysis.textContent = data.analysis || "暂无分析";
  output.rawJson.textContent = JSON.stringify(data, null, 2);

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

renderLabels();
