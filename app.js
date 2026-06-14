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
  contractChecks: document.querySelector("#contract-checks"),
  groupsGrid: document.querySelector("#groups-grid"),
  teamAPreview: document.querySelector("#team-a-preview"),
  teamBPreview: document.querySelector("#team-b-preview"),
  briefText: document.querySelector("#brief-text")
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

const REPLAY_URL =
  "https://www.xiaohongshu.com/discovery/item/6a2b3526000000000701093f?source=webshare&xhsshare=pc_web&xsec_source=pc_share";
const ALL_MATCHES_URL = "https://www.xiaohongshu.com/worldcup26?wcup_source=web_sidebar_entry";

const schedule = [
  { time: "6月12日 03:00", title: "墨西哥主场轻取南非", stage: "小组赛 A组", a: "墨西哥", b: "南非", status: "done", score: "2 : 0", replay: REPLAY_URL },
  { time: "6月12日 10:00", title: "太极虎让一追二", stage: "小组赛 A组", a: "韩国", b: "捷克", status: "done", score: "2 : 1", replay: REPLAY_URL },
  { time: "6月13日 03:00", title: "拉林救主，加拿大逼平波黑", stage: "小组赛 B组", a: "加拿大", b: "波黑", status: "done", score: "1 : 1", replay: REPLAY_URL },
  { time: "6月13日 09:00", title: "巴洛贡梅开二度，美国大胜", stage: "小组赛 D组", a: "美国", b: "巴拉圭", status: "done", score: "4 : 1", replay: REPLAY_URL },
  { time: "6月14日 03:00", title: "补时绝平，亚洲冠军逼平瑞士", stage: "小组赛 B组", a: "卡塔尔", b: "瑞士", status: "done", score: "1 : 1", replay: REPLAY_URL },
  { time: "6月14日 06:00", title: "维尼修斯救主，巴西平摩洛哥", stage: "小组赛 C组", a: "巴西", b: "摩洛哥", status: "done", score: "1 : 1", replay: REPLAY_URL },
  { time: "6月14日 09:00", title: "麦金一锤定音，风笛奏响", stage: "小组赛 C组", a: "海地", b: "苏格兰", status: "done", score: "0 : 1", replay: REPLAY_URL },
  { time: "6月14日 12:00", title: "袋鼠军团赢下首胜", stage: "小组赛 D组", a: "澳大利亚", b: "土耳其", status: "done", score: "2 : 0", replay: REPLAY_URL },
  { time: "6月15日 01:00", title: "德国战车首秀", stage: "小组赛 E组", a: "德国", b: "库拉索", status: "soon", subscribed: "88.2万" },
  { time: "6月15日 04:00", title: "蓝武士首战荷兰", stage: "小组赛 F组", a: "荷兰", b: "日本", status: "soon", subscribed: "74.5万" },
  { time: "6月15日 07:00", title: "非洲大象首秀", stage: "小组赛 E组", a: "科特迪瓦", b: "厄瓜多尔", status: "soon", subscribed: "49.4万" },
  { time: "6月15日 10:00", title: "伊萨克携手哲凯赖什", stage: "小组赛 F组", a: "瑞典", b: "突尼斯", status: "soon", subscribed: "50.3万" },
  { time: "6月16日 00:00", title: "欧洲杯冠军亮相", stage: "小组赛 H组", a: "西班牙", b: "佛得角", status: "soon", subscribed: "75.1万" },
  { time: "6月16日 03:00", title: "欧洲红魔硬撼法老军团", stage: "小组赛 G组", a: "比利时", b: "埃及", status: "soon", subscribed: "51.6万" },
  { time: "6月16日 06:00", title: "沙特绿鹰首战天蓝军团", stage: "小组赛 H组", a: "沙特", b: "乌拉圭", status: "soon", subscribed: "49.0万" },
  { time: "6月16日 09:00", title: "波斯铁骑艰难迎来首战", stage: "小组赛 G组", a: "伊朗", b: "新西兰", status: "soon", subscribed: "49.9万" },
  { time: "6月17日 03:00", title: "法国军团首秀", stage: "小组赛 I组", a: "法国", b: "塞内加尔", status: "soon", subscribed: "81.4万" },
  { time: "6月17日 06:00", title: "哈兰德首秀，北欧海盗出击", stage: "小组赛 I组", a: "伊拉克", b: "挪威", status: "soon", subscribed: "70.5万" },
  { time: "6月17日 09:00", title: "梅西领衔，卫冕冠军出战", stage: "小组赛 J组", a: "阿根廷", b: "阿尔及利亚", status: "soon", subscribed: "127.9万" },
  { time: "6月17日 12:00", title: "音乐之国与历史文明的碰撞", stage: "小组赛 J组", a: "奥地利", b: "约旦", status: "soon", subscribed: "46.8万" },
  { time: "6月18日 01:00", title: "C罗迎来第 6 届世界杯", stage: "小组赛 K组", a: "葡萄牙", b: "刚果金", status: "soon", subscribed: "114.9万" },
  { time: "6月18日 04:00", title: "宿命对决，18 年半决赛重演", stage: "小组赛 L组", a: "英格兰", b: "克罗地亚", status: "soon", subscribed: "71.6万" },
  { time: "6月18日 07:00", title: "非洲黑星冲击中美洲劲旅", stage: "小组赛 L组", a: "加纳", b: "巴拿马", status: "soon", subscribed: "46.3万" },
  { time: "6月18日 10:00", title: "中亚白狼邂逅南美魔幻", stage: "小组赛 K组", a: "乌兹别克斯坦", b: "哥伦比亚", status: "soon", subscribed: "46.2万" }
];

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
    updateQuickMatchState(button);
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
fields.stage.addEventListener("change", updateQuickMatchState);

const tsSiteKey = document.querySelector('meta[name="turnstile-sitekey"]')?.content || "";
const tsEnabled = tsSiteKey && !tsSiteKey.startsWith("__");
let tsToken = null;
let tsWidgetId = null;

window.onloadTS = function () {
  if (!tsEnabled || !window.turnstile) return;
  const host = document.querySelector("#ts");
  if (host) host.classList.add("is-active");
  tsWidgetId = window.turnstile.render("#ts", {
    sitekey: tsSiteKey,
    theme: "light",
    size: "flexible",
    callback: (token) => {
      tsToken = token;
    },
    "expired-callback": () => {
      tsToken = null;
    },
    "error-callback": () => {
      tsToken = null;
    }
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    stage: fields.stage.value.trim(),
    teamA: fields.teamA.value.trim(),
    teamB: fields.teamB.value.trim(),
    notes: fields.notes.value.trim(),
    turnstileToken: tsToken
  };

  if (!payload.teamA || !payload.teamB) {
    setStatus("请填写球队", "error");
    return;
  }

  if (tsEnabled && !tsToken) {
    setStatus("请稍候", "error");
    showError("人机验证还没就绪,稍等一两秒再点预测,或刷新页面。");
    return;
  }

  setLoading(true);
  clearError();

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
    showError();
    console.error("[predict]", error);
  } finally {
    setLoading(false);
    if (tsEnabled && window.turnstile && tsWidgetId !== null) {
      tsToken = null;
      try {
        window.turnstile.reset(tsWidgetId);
      } catch {}
    }
  }
});

function renderLabels() {
  setTeamLabel(output.teamALabel, fields.teamA.value || "球队 A");
  setTeamLabel(output.teamBLabel, fields.teamB.value || "球队 B");
  renderSelectedMatch();
  updateQuickMatchState();
}

function updateQuickMatchState(activeButton = null) {
  document.querySelectorAll(".chip").forEach((button) => {
    const isActive =
      button === activeButton ||
      (button.dataset.stage === fields.stage.value &&
        button.dataset.teamA === fields.teamA.value &&
        button.dataset.teamB === fields.teamB.value);
    button.classList.toggle("is-active", isActive);
  });
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

  animateResult();
}

function animateResult() {
  const panel = document.querySelector(".result-panel");
  if (!panel) return;
  panel.classList.remove("show-result");
  void panel.offsetWidth;
  panel.classList.add("show-result");
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

function showError(message) {
  if (output.briefText) {
    output.briefText.textContent =
      message || "预测没能生成,稍等片刻再试一次。如果多次失败,可能是网络或服务繁忙。";
    output.briefText.closest(".brief-panel")?.classList.add("is-error");
  }
}

function clearError() {
  output.briefText?.closest(".brief-panel")?.classList.remove("is-error");
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

function renderSchedule() {
  const track = document.querySelector("#schedule-track");
  if (!track) return;

  const cards = schedule.map((m) => {
    const card = document.createElement("article");
    card.className = `sched-card ${m.status === "soon" ? "is-soon" : "is-done"}`;

    const time = document.createElement("div");
    time.className = "sched-time";
    time.textContent = m.time;

    const title = document.createElement("p");
    title.className = "sched-title";
    title.textContent = m.title;

    const match = document.createElement("div");
    match.className = "sched-match";
    const score = document.createElement("div");
    score.className = "sched-score";
    const stage = document.createElement("span");
    stage.className = "sched-stage";
    stage.textContent = m.stage;
    const num = document.createElement("strong");
    num.textContent = m.status === "soon" ? "VS" : m.score;
    score.append(stage, num);
    match.append(
      createTeamBadge(m.a, "team-badge sched-team"),
      score,
      createTeamBadge(m.b, "team-badge sched-team")
    );

    card.append(time, title, match);

    if (m.status === "soon") {
      const book = document.createElement("button");
      book.type = "button";
      book.className = "sched-book";
      book.textContent = "预约预测";
      book.addEventListener("click", () => bookMatch(m));
      const count = document.createElement("small");
      count.className = "sched-count";
      count.textContent = `${m.subscribed} 已预约`;
      card.append(book, count);
    } else {
      const replay = document.createElement("a");
      replay.className = "sched-replay";
      replay.href = m.replay;
      replay.target = "_blank";
      replay.rel = "noreferrer";
      replay.textContent = "查看回放";
      card.append(replay);
    }

    return card;
  });

  const all = document.createElement("a");
  all.className = "sched-card sched-all";
  all.href = ALL_MATCHES_URL;
  all.target = "_blank";
  all.rel = "noreferrer";
  const allIcon = document.createElement("span");
  allIcon.className = "sched-all-icon";
  allIcon.textContent = "📅";
  const allTitle = document.createElement("strong");
  allTitle.textContent = "全部赛程";
  const allCount = document.createElement("small");
  allCount.textContent = "104 场";
  all.append(allIcon, allTitle, allCount);

  track.replaceChildren(...cards, all);
  setupSlider(track);
}

function setupSlider(track) {
  const prev = document.querySelector("#sched-prev");
  const next = document.querySelector("#sched-next");
  const step = () => Math.max(track.clientWidth * 0.85, 260);

  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev?.toggleAttribute("disabled", track.scrollLeft <= 0);
    next?.toggleAttribute("disabled", track.scrollLeft >= max);
  };

  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // 鼠标拖拽滑动(触摸交给原生滚动)
  let down = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    down = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (!down) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });

  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    track.classList.remove("is-dragging");
  });

  // 拖拽后吞掉误触点击
  track.addEventListener(
    "click",
    (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    },
    true
  );
}

function bookMatch(m) {
  fields.teamA.value = m.a;
  fields.teamB.value = m.b;
  const stageName = m.stage.split(" ")[0];
  if ([...fields.stage.options].some((o) => o.value === stageName)) {
    fields.stage.value = stageName;
  }
  renderLabels();
  document.querySelector("#predict")?.scrollIntoView({ behavior: "smooth", block: "start" });
  fields.notes.focus({ preventScroll: true });
}

renderLabels();
renderGroups();
renderSchedule();

const siteNav = document.querySelector(".site-nav");
if (siteNav) {
  const onScroll = () => siteNav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const revealTargets = document.querySelectorAll(".reveal");
if (revealTargets.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));
}
