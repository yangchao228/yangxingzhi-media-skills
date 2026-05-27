import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUT = __dirname;
const SVG_DIR = path.join(OUT, "svg");
fs.mkdirSync(SVG_DIR, { recursive: true });

const palette = {
  ink: "#133b38",
  ink2: "#082422",
  paper: "#f7f1e5",
  paper2: "#fff9ed",
  line: "#d8cbb5",
  yellow: "#f1c94a",
  coral: "#e76f51",
  teal: "#5aa7a0",
  blue: "#5d87a1",
  muted: "#64726e",
  white: "#fffaf0",
};

const font = `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`;
const serif = `"Songti SC", "Noto Serif CJK SC", "STSong", serif`;

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textBlock(lines, x, y, opts = {}) {
  const {
    size = 42,
    weight = 700,
    fill = palette.ink,
    family = font,
    lineHeight = 1.28,
    anchor = "start",
  } = opts;

  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family='${family}' font-size="${size}" font-weight="${weight}" fill="${fill}">
${lines
  .map(
    (line, i) =>
      `  <tspan x="${x}" dy="${i === 0 ? 0 : size * lineHeight}">${esc(line)}</tspan>`,
  )
  .join("\n")}
</text>`;
}

function pill(x, y, w, h, label, opts = {}) {
  const fill = opts.fill || palette.yellow;
  const textFill = opts.textFill || palette.ink2;
  const size = opts.size || 26;
  return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>
  <text x="${x + w / 2}" y="${y + h / 2 + size * 0.34}" text-anchor="middle" font-family='${font}' font-size="${size}" font-weight="800" fill="${textFill}">${esc(label)}</text>
</g>`;
}

function footer(width, y, fill = palette.muted) {
  return `<g font-family='${font}' font-size="28" font-weight="800" fill="${fill}" opacity="0.86">
  <text x="74" y="${y}">更早发现</text>
  <text x="${width / 2}" y="${y}" text-anchor="middle">更准判断</text>
  <text x="${width - 74}" y="${y}" text-anchor="end">更快行动</text>
</g>`;
}

function cardShell({ page, bg = "warm", title = "", desc = "", body = "", accent = palette.yellow, dark = false }) {
  const fill = dark ? palette.white : palette.ink;
  const muted = dark ? "rgba(255,250,240,0.72)" : palette.muted;
  const bgMap = {
    warm: `<rect width="1080" height="1440" fill="${palette.paper}"/><rect x="0" y="0" width="1080" height="1440" fill="#fff7e8" opacity="0.55"/>`,
    light: `<rect width="1080" height="1440" fill="${palette.paper2}"/>`,
    teal: `<rect width="1080" height="1440" fill="#e9f1ed"/>`,
    yellow: `<rect width="1080" height="1440" fill="#f7e8ad"/>`,
    dark: `<rect width="1080" height="1440" fill="${palette.ink2}"/><rect x="0" y="0" width="1080" height="1440" fill="${palette.ink}" opacity="0.78"/>`,
  };

  return {
    fill,
    muted,
    header: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440" role="img" aria-label="${esc(title)}">
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#082422" flood-opacity="${dark ? "0.36" : "0.12"}"/>
    </filter>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="${dark ? "#fffaf0" : "#133b38"}" stroke-width="1" opacity="${dark ? "0.06" : "0.05"}"/>
    </pattern>
  </defs>
  ${bgMap[bg]}
  <rect width="1080" height="1440" fill="url(#grid)"/>
  <path d="M0 1080C212 1004 320 1118 510 1026C742 914 858 802 1080 840V1440H0Z" fill="${accent}" opacity="${dark ? "0.16" : "0.18"}"/>
  <path d="M0 230C194 154 348 266 544 174C744 80 894 58 1080 114" fill="none" stroke="${accent}" stroke-width="8" opacity="${dark ? "0.35" : "0.32"}"/>
  <g font-family='${font}'>
    <rect x="58" y="54" width="202" height="48" rx="24" fill="${dark ? "rgba(255,250,240,0.13)" : "rgba(19,59,56,0.09)"}"/>
    <text x="159" y="87" text-anchor="middle" font-size="24" font-weight="800" fill="${fill}">AI生命克劳德</text>
    <rect x="894" y="54" width="128" height="48" rx="24" fill="${dark ? "rgba(255,250,240,0.13)" : "rgba(19,59,56,0.1)"}"/>
    <text x="958" y="87" text-anchor="middle" font-size="24" font-weight="900" fill="${fill}">${String(page).padStart(2, "0")}/08</text>
  </g>`,
    footer: `${footer(1080, 1372, dark ? "rgba(255,250,240,0.72)" : palette.muted)}
</svg>`,
  };
}

function writeSvg(name, svg) {
  const file = path.join(SVG_DIR, name);
  fs.writeFileSync(file, svg.trimStart(), "utf8");
  return file;
}

function coverSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="596" viewBox="0 0 1400 596" role="img" aria-label="不要把学习外包给 AI">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#000" flood-opacity="0.28"/>
    </filter>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#fffaf0" stroke-width="1" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="1400" height="596" fill="${palette.ink2}"/>
  <rect width="1400" height="596" fill="${palette.ink}" opacity="0.72"/>
  <rect width="1400" height="596" fill="url(#grid)"/>
  <path d="M-40 454C178 380 318 450 536 344C750 240 878 112 1434 134" fill="none" stroke="${palette.yellow}" stroke-width="7" opacity="0.42"/>
  <path d="M-80 520C250 410 460 520 720 410C994 294 1126 282 1486 350" fill="none" stroke="${palette.teal}" stroke-width="4" opacity="0.34"/>

  <g transform="translate(76 72)">
    <rect x="0" y="0" width="640" height="452" rx="34" fill="rgba(8,36,34,0.56)" filter="url(#shadow)"/>
    ${pill(24, 28, 224, 46, "Human3.0 总纲", { fill: palette.yellow, size: 24 })}
    ${textBlock(["不要把学习", "外包给 AI"], 24, 172, {
      size: 82,
      weight: 900,
      fill: palette.white,
      family: serif,
      lineHeight: 1.12,
    })}
    <rect x="28" y="356" width="500" height="8" rx="4" fill="${palette.yellow}"/>
    ${textBlock(["AI 可以给答案，但不能替你长能力"], 28, 418, {
      size: 30,
      weight: 750,
      fill: "#e7f2ed",
      lineHeight: 1.2,
    })}
  </g>

  <g transform="translate(790 68)" filter="url(#shadow)">
    <rect x="0" y="0" width="520" height="456" rx="36" fill="${palette.paper}"/>
    <text x="52" y="74" font-family='${font}' font-size="28" font-weight="900" fill="${palette.ink}">AI 学习系统</text>
    <text x="52" y="116" font-family='${font}' font-size="20" font-weight="650" fill="${palette.muted}">把答案变成训练，把训练变成资产</text>

    <g transform="translate(52 154)">
      <rect x="0" y="0" width="416" height="72" rx="20" fill="#fffaf0" stroke="${palette.line}" stroke-width="2"/>
      <circle cx="38" cy="36" r="18" fill="${palette.yellow}"/>
      <text x="78" y="45" font-family='${font}' font-size="26" font-weight="850" fill="${palette.ink}">提出假设</text>
      <text x="258" y="45" font-family='${font}' font-size="20" font-weight="650" fill="${palette.muted}">先让自己入场</text>
    </g>
    <g transform="translate(52 246)">
      <rect x="0" y="0" width="416" height="72" rx="20" fill="#fffaf0" stroke="${palette.line}" stroke-width="2"/>
      <circle cx="38" cy="36" r="18" fill="${palette.teal}"/>
      <text x="78" y="45" font-family='${font}' font-size="26" font-weight="850" fill="${palette.ink}">亲手练习</text>
      <text x="258" y="45" font-family='${font}' font-size="20" font-weight="650" fill="${palette.muted}">保留关键动作</text>
    </g>
    <g transform="translate(52 338)">
      <rect x="0" y="0" width="416" height="72" rx="20" fill="#fffaf0" stroke="${palette.line}" stroke-width="2"/>
      <circle cx="38" cy="36" r="18" fill="${palette.coral}"/>
      <text x="78" y="45" font-family='${font}' font-size="26" font-weight="850" fill="${palette.ink}">复盘迁移</text>
      <text x="258" y="45" font-family='${font}' font-size="20" font-weight="650" fill="${palette.muted}">沉淀数字资产</text>
    </g>
  </g>

  <text x="78" y="558" font-family='${font}' font-size="22" font-weight="650" fill="rgba(255,250,240,0.72)">AI生命克劳德 · 别把学习外包给 AI 系列 01</text>
</svg>`;
}

const cards = [
  {
    name: "01-cover.svg",
    page: 1,
    bg: "dark",
    accent: palette.yellow,
    dark: true,
    body: ({ fill }) => `
      ${pill(74, 202, 236, 54, "Human3.0 总纲", { fill: palette.yellow, size: 26 })}
      ${textBlock(["不要把学习", "外包给 AI"], 74, 390, {
        size: 92,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.12,
      })}
      <rect x="78" y="638" width="516" height="10" rx="5" fill="${palette.yellow}"/>
      ${textBlock(["AI 可以给答案", "但不能替你长能力"], 78, 724, {
        size: 42,
        weight: 800,
        fill: "rgba(255,250,240,0.9)",
        lineHeight: 1.35,
      })}
      <g transform="translate(74 980)">
        <rect width="248" height="86" rx="24" fill="rgba(255,250,240,0.12)"/>
        <text x="124" y="54" text-anchor="middle" font-family='${font}' font-size="28" font-weight="850" fill="${fill}">提出假设</text>
      </g>
      <g transform="translate(346 980)">
        <rect width="248" height="86" rx="24" fill="rgba(255,250,240,0.12)"/>
        <text x="124" y="54" text-anchor="middle" font-family='${font}' font-size="28" font-weight="850" fill="${fill}">亲手练习</text>
      </g>
      <g transform="translate(618 980)">
        <rect width="248" height="86" rx="24" fill="rgba(255,250,240,0.12)"/>
        <text x="124" y="54" text-anchor="middle" font-family='${font}' font-size="28" font-weight="850" fill="${fill}">复盘迁移</text>
      </g>`,
  },
  {
    name: "02-illusion.svg",
    page: 2,
    bg: "warm",
    accent: palette.coral,
    body: ({ fill }) => `
      ${pill(74, 206, 182, 52, "最危险的错觉", { fill: palette.coral, textFill: palette.white, size: 25 })}
      ${textBlock(["看懂答案", "不等于真的会了"], 74, 388, {
        size: 70,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.18,
      })}
      <g transform="translate(74 666)" font-family='${font}'>
        ${miniNote(0, 0, "读了总结", "觉得自己懂了", palette.yellow)}
        ${miniNote(0, 138, "复制代码", "觉得自己会了", palette.teal)}
        ${miniNote(0, 276, "AI 改完", "觉得自己进步了", palette.coral)}
      </g>
      ${textBlock(["换个场景，问题又来了。"], 82, 1122, {
        size: 38,
        weight: 850,
        fill: palette.ink,
      })}`,
  },
  {
    name: "03-delivery-vs-growth.svg",
    page: 3,
    bg: "teal",
    accent: palette.teal,
    body: ({ fill }) => `
      ${pill(74, 206, 146, 52, "核心判断", { fill: palette.yellow, size: 25 })}
      ${textBlock(["AI 默认优化交付", "不自动优化成长"], 74, 386, {
        size: 64,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.2,
      })}
      <g transform="translate(74 678)" font-family='${font}'>
        <rect x="0" y="0" width="420" height="268" rx="30" fill="#fffaf0" stroke="${palette.line}" stroke-width="2" filter="url(#softShadow)"/>
        <text x="42" y="72" font-size="38" font-weight="900" fill="${palette.ink}">任务完成</text>
        <text x="42" y="128" font-size="26" font-weight="650" fill="${palette.muted}">问题被关闭</text>
        <rect x="42" y="178" width="270" height="22" rx="11" fill="${palette.yellow}"/>
        <text x="42" y="238" font-size="24" font-weight="700" fill="${palette.muted}">看得见、来得快</text>
        <rect x="496" y="0" width="420" height="268" rx="30" fill="#fffaf0" stroke="${palette.line}" stroke-width="2" filter="url(#softShadow)"/>
        <text x="538" y="72" font-size="38" font-weight="900" fill="${palette.ink}">能力增长</text>
        <text x="538" y="128" font-size="26" font-weight="650" fill="${palette.muted}">判断被更新</text>
        <rect x="538" y="178" width="210" height="22" rx="11" fill="${palette.teal}"/>
        <text x="538" y="238" font-size="24" font-weight="700" fill="${palette.muted}">慢一点、更值钱</text>
      </g>
      ${textBlock(["学习要多看一个指标：", "这次结束后，我有没有变强？"], 80, 1080, {
        size: 38,
        weight: 780,
        fill: palette.ink,
        lineHeight: 1.38,
      })}`,
  },
  {
    name: "04-four-actions.svg",
    page: 4,
    bg: "yellow",
    accent: palette.ink,
    body: ({ fill }) => `
      ${pill(74, 206, 228, 52, "四个动作不能外包", { fill: palette.ink, textFill: palette.white, size: 25 })}
      ${textBlock(["真正的学习", "长在这些动作里"], 74, 382, {
        size: 66,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.18,
      })}
      <g transform="translate(74 636)" font-family='${font}'>
        ${actionTile(0, 0, "01", "提出假设", "我先判断问题在哪")}
        ${actionTile(476, 0, "02", "亲手练习", "关键小块自己做")}
        ${actionTile(0, 270, "03", "识别错误", "知道它错在哪里")}
        ${actionTile(476, 270, "04", "复盘迁移", "变成下次可复用")}
      </g>`,
  },
  {
    name: "05-ai-roles.svg",
    page: 5,
    bg: "light",
    accent: palette.blue,
    body: ({ fill }) => `
      ${pill(74, 206, 172, 52, "正确角色", { fill: palette.blue, textFill: palette.white, size: 25 })}
      ${textBlock(["AI 不只做答案机器", "更适合做训练系统"], 74, 376, {
        size: 62,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.2,
      })}
      <g transform="translate(74 622)" font-family='${font}'>
        ${roleRow(0, "资料整理员", "整理概念地图和问题清单", palette.yellow)}
        ${roleRow(120, "概念教练", "换说法、举反例、追问你", palette.teal)}
        ${roleRow(240, "练习搭档", "拆小任务，保留关键动作", palette.coral)}
        ${roleRow(360, "错误陪练", "先读错，再设计验证", palette.blue)}
        ${roleRow(480, "复盘助手", "沉淀 checklist / prompt / SOP", palette.ink)}
      </g>`,
  },
  {
    name: "06-universal-flow.svg",
    page: 6,
    bg: "teal",
    accent: palette.yellow,
    body: ({ fill }) => `
      ${pill(74, 206, 172, 52, "通用流程", { fill: palette.yellow, size: 25 })}
      ${textBlock(["任何方向", "都可以先跑这 5 步"], 74, 382, {
        size: 66,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.18,
      })}
      <g transform="translate(116 636)" font-family='${font}'>
        ${flowStep(0, "1", "定最小目标")}
        ${flowStep(146, "2", "建立资料层")}
        ${flowStep(292, "3", "进入练习层")}
        ${flowStep(438, "4", "设计验收")}
        ${flowStep(584, "5", "复盘沉淀")}
      </g>
      ${textBlock(["别只保存聊天记录。", "要沉淀成模板、错题卡、SOP 或 skill。"], 86, 1132, {
        size: 38,
        weight: 800,
        fill: palette.ink,
        lineHeight: 1.36,
      })}`,
  },
  {
    name: "07-prompt-constraint.svg",
    page: 7,
    bg: "warm",
    accent: palette.coral,
    body: ({ fill }) => `
      ${pill(74, 206, 198, 52, "问 AI 前加一句", { fill: palette.coral, textFill: palette.white, size: 25 })}
      ${textBlock(["请不要直接", "替我完成"], 74, 388, {
        size: 78,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.12,
      })}
      <g transform="translate(74 660)" font-family='${font}' filter="url(#softShadow)">
        <rect width="914" height="390" rx="32" fill="#fffaf0" stroke="${palette.line}" stroke-width="2"/>
        <text x="44" y="74" font-size="30" font-weight="850" fill="${palette.ink}">请按学习教练的方式帮我：</text>
        <text x="44" y="142" font-size="28" font-weight="700" fill="${palette.muted}">1. 先判断我的假设</text>
        <text x="44" y="200" font-size="28" font-weight="700" fill="${palette.muted}">2. 拆出练习步骤</text>
        <text x="44" y="258" font-size="28" font-weight="700" fill="${palette.muted}">3. 保留关键部分让我做</text>
        <text x="44" y="316" font-size="28" font-weight="700" fill="${palette.muted}">4. 最后给我验收标准</text>
      </g>`,
  },
  {
    name: "08-series-preview.svg",
    page: 8,
    bg: "dark",
    accent: palette.yellow,
    dark: true,
    body: ({ fill }) => `
      ${pill(74, 206, 172, 52, "系列预告", { fill: palette.yellow, size: 25 })}
      ${textBlock(["别把学习", "外包给 AI"], 74, 386, {
        size: 82,
        weight: 900,
        fill,
        family: serif,
        lineHeight: 1.12,
      })}
      <g transform="translate(74 650)" font-family='${font}'>
        ${seriesPill(0, 0, "编程篇")}
        ${seriesPill(292, 0, "写作篇")}
        ${seriesPill(584, 0, "英语篇")}
        ${seriesPill(0, 126, "知识管理")}
        ${seriesPill(292, 126, "考试篇")}
        ${seriesPill(584, 126, "工作技能")}
      </g>
      ${textBlock(["让 AI 训练你完成学习，", "不要让它替你完成学习。"], 78, 1056, {
        size: 42,
        weight: 850,
        fill: "rgba(255,250,240,0.92)",
        lineHeight: 1.34,
      })}`,
  },
];

function miniNote(x, y, a, b, color) {
  return `<g transform="translate(${x} ${y})">
  <rect width="910" height="104" rx="24" fill="#fffaf0" stroke="${palette.line}" stroke-width="2" filter="url(#softShadow)"/>
  <rect x="34" y="28" width="48" height="48" rx="16" fill="${color}"/>
  <text x="112" y="47" font-size="30" font-weight="900" fill="${palette.ink}">${esc(a)}</text>
  <text x="112" y="82" font-size="24" font-weight="650" fill="${palette.muted}">${esc(b)}</text>
</g>`;
}

function actionTile(x, y, num, title, desc) {
  return `<g transform="translate(${x} ${y})">
  <rect width="438" height="214" rx="30" fill="#fffaf0" stroke="${palette.line}" stroke-width="2" filter="url(#softShadow)"/>
  <text x="34" y="58" font-size="28" font-weight="900" fill="${palette.coral}">${num}</text>
  <text x="34" y="116" font-size="38" font-weight="900" fill="${palette.ink}">${esc(title)}</text>
  <text x="34" y="166" font-size="25" font-weight="650" fill="${palette.muted}">${esc(desc)}</text>
</g>`;
}

function roleRow(y, title, desc, color) {
  return `<g transform="translate(0 ${y})">
  <rect width="914" height="88" rx="24" fill="#fffaf0" stroke="${palette.line}" stroke-width="2"/>
  <rect x="28" y="24" width="40" height="40" rx="14" fill="${color}"/>
  <text x="96" y="55" font-size="30" font-weight="900" fill="${palette.ink}">${esc(title)}</text>
  <text x="318" y="55" font-size="25" font-weight="650" fill="${palette.muted}">${esc(desc)}</text>
</g>`;
}

function flowStep(x, num, label) {
  return `<g transform="translate(${x} 0)">
  <circle cx="72" cy="72" r="64" fill="#fffaf0" stroke="${palette.line}" stroke-width="2" filter="url(#softShadow)"/>
  <text x="72" y="82" text-anchor="middle" font-size="38" font-weight="900" fill="${palette.ink}">${num}</text>
  <text x="72" y="182" text-anchor="middle" font-size="25" font-weight="850" fill="${palette.ink}">${esc(label)}</text>
</g>`;
}

function seriesPill(x, y, label) {
  return `<g transform="translate(${x} ${y})">
  <rect width="252" height="82" rx="24" fill="rgba(255,250,240,0.13)" stroke="rgba(255,250,240,0.2)" stroke-width="2"/>
  <text x="126" y="52" text-anchor="middle" font-size="30" font-weight="850" fill="${palette.white}">${esc(label)}</text>
</g>`;
}

writeSvg("wechat-cover.svg", coverSvg());

for (const card of cards) {
  const shell = cardShell(card);
  const svg = `${shell.header}
  ${card.body(shell)}
  ${shell.footer}`;
  writeSvg(card.name, svg);
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>不要把学习外包给 AI｜封面与小红书卡片</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ece2d2;
      color: ${palette.ink};
      font-family: ${font};
    }
    header {
      max-width: 1180px;
      margin: 0 auto;
      padding: 42px 24px 18px;
    }
    h1 {
      margin: 0;
      font-size: 42px;
      line-height: 1.15;
      letter-spacing: 0;
    }
    p {
      margin: 10px 0 0;
      color: ${palette.muted};
      font-size: 18px;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 22px 24px 64px;
    }
    .cover {
      width: 100%;
      border-radius: 18px;
      box-shadow: 0 18px 48px rgba(8,36,34,.18);
      background: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 26px;
      margin-top: 34px;
    }
    .grid img {
      width: 100%;
      border-radius: 18px;
      box-shadow: 0 18px 48px rgba(8,36,34,.15);
      background: #fff;
    }
  </style>
</head>
<body>
  <header>
    <h1>不要把学习外包给 AI</h1>
    <p>公众号封面 + 小红书 8 页卡片 · AI生命克劳德</p>
  </header>
  <main>
    <img class="cover" src="svg/wechat-cover.svg" alt="公众号封面">
    <section class="grid">
${cards.map((card) => `      <img src="svg/${card.name}" alt="${card.name}">`).join("\n")}
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(OUT, "preview.html"), html, "utf8");

const readme = `# 不要把学习外包给 AI｜封面与小红书卡片

生成内容：

- \`svg/wechat-cover.svg\`：公众号封面，尺寸 1400x596。
- \`svg/01-cover.svg\` 到 \`svg/08-series-preview.svg\`：小红书 8 页卡片，尺寸 1080x1440。
- \`preview.html\`：本地预览页。

如需重新生成：

\`\`\`bash
node ai_study/assets/01-dont-outsource-learning/generate_assets.mjs
\`\`\`
`;

fs.writeFileSync(path.join(OUT, "README.md"), readme, "utf8");

console.log(`Generated ${cards.length + 1} SVG files and preview.html in ${OUT}`);
