export type DatasetExample = {
  input: string;
  output: string;
  quality?: "strong" | "weak";
};

export type Preset = {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  taskDescription: string;
  whenToFineTune: string;
  examples: DatasetExample[];
  baselineOutput: string;
  tunedOutput: string;
  evaluation: {
    summary: string;
    metrics: { label: string; baseline: string; tuned: string }[];
  };
  quickPrompts: string[];
};

export const PRESETS: Preset[] = [
  {
    id: "support-tone",
    title: "Support Tone Alignment",
    category: "Brand voice",
    shortDescription:
      "Teach the model your brand's empathetic, on-message support voice.",
    taskDescription:
      "Reply to customer support tickets in a warm, concise, brand-aligned tone. Always acknowledge the issue, offer a clear next step, and sign off consistently.",
    whenToFineTune:
      "Prompting alone can mimic tone briefly, but consistency across thousands of replies — punctuation, sign-off, escalation patterns — is where fine-tuning shines.",
    examples: [
      {
        quality: "strong",
        input: "My order hasn't arrived and it's been 10 days.",
        output:
          "Hi — really sorry for the wait. I've pulled up your order and escalated it with our carrier. You'll get a tracking update within 24 hours, and if it doesn't move we'll ship a replacement on us. — The Northwind Team",
      },
      {
        quality: "strong",
        input: "The app keeps crashing when I open settings.",
        output:
          "Thanks for flagging this — that's frustrating. Could you share your device and OS version? In the meantime, a quick reinstall usually clears it. We're on it. — The Northwind Team",
      },
      {
        quality: "weak",
        input: "Refund please.",
        output: "Ok refund processed.",
      },
    ],
    baselineOutput:
      "I'm sorry to hear about your issue. Please contact our support team for assistance. We apologize for any inconvenience caused.",
    tunedOutput:
      "Hi — really sorry you're dealing with this. I've flagged it to our fulfillment lead and you'll hear back within 24 hours with a clear next step. If anything changes on your end, just reply here. — The Northwind Team",
    evaluation: {
      summary:
        "The tuned model consistently uses brand sign-off, acknowledges feelings, and gives a concrete next step — matching 9/10 reviewed tickets vs 3/10 for the baseline.",
      metrics: [
        { label: "Brand sign-off", baseline: "12%", tuned: "98%" },
        { label: "Empathy phrasing", baseline: "40%", tuned: "94%" },
        { label: "Concrete next step", baseline: "55%", tuned: "91%" },
      ],
    },
    quickPrompts: [
      "I want to cancel my subscription.",
      "The product arrived damaged.",
      "How do I change my shipping address?",
      "I was double-charged.",
    ],
  },
  {
    id: "json-output",
    title: "Structured JSON Output",
    category: "Reliability",
    shortDescription:
      "Force reliable, schema-conformant JSON without parsing hacks.",
    taskDescription:
      "Extract product information from unstructured text and return strictly valid JSON matching the target schema — no prose, no markdown fences.",
    whenToFineTune:
      "Prompting can get you 80% there, but production pipelines need 99%+ schema conformance. Fine-tuning eliminates stray prose, fences, and missing fields.",
    examples: [
      {
        quality: "strong",
        input: "Blue cotton t-shirt, size M, $24.99, in stock",
        output:
          '{"name":"Cotton T-Shirt","color":"blue","size":"M","price":24.99,"in_stock":true}',
      },
      {
        quality: "strong",
        input: "Wireless headphones — black, $89, currently sold out",
        output:
          '{"name":"Wireless Headphones","color":"black","size":null,"price":89,"in_stock":false}',
      },
      {
        quality: "weak",
        input: "red shoes",
        output: "Here is the JSON: ```json\n{\"name\": \"shoes\"}\n```",
      },
    ],
    baselineOutput:
      "Sure! Here's the JSON for that product:\n```json\n{\n  \"product\": \"Leather Wallet\",\n  \"color\": \"brown\",\n  \"price\": \"$45\"\n}\n```\nLet me know if you need adjustments!",
    tunedOutput:
      '{"name":"Leather Wallet","color":"brown","size":null,"price":45,"in_stock":true}',
    evaluation: {
      summary:
        "The tuned model returns parseable JSON 99.4% of the time vs 71% baseline. Numeric fields are typed correctly and no markdown fences leak through.",
      metrics: [
        { label: "Parseable JSON", baseline: "71%", tuned: "99.4%" },
        { label: "Correct types", baseline: "63%", tuned: "97%" },
        { label: "Avg tokens out", baseline: "84", tuned: "32" },
      ],
    },
    quickPrompts: [
      "Green hoodie size L, twenty dollars, available",
      "iPhone case — clear, $15, out of stock",
      "Running shoes, white, size 10, $120",
      "Coffee mug, blue, $8.50, plenty in stock",
    ],
  },
  {
    id: "domain-specialist",
    title: "Domain Specialist",
    category: "Expertise",
    shortDescription:
      "Adapt a general model into a finance/legal/medical-style responder.",
    taskDescription:
      "Answer financial planning questions using domain-appropriate vocabulary, risk disclaimers, and structured guidance — without giving prohibited personalized advice.",
    whenToFineTune:
      "Generic models hedge or oversimplify. Fine-tuning on curated domain Q&A teaches both vocabulary and the safety patterns regulated industries require.",
    examples: [
      {
        quality: "strong",
        input: "Should I put my emergency fund in stocks?",
        output:
          "Generally no. Emergency funds prioritize liquidity and capital preservation over growth — typical placements are HYSA, money market funds, or short-term treasuries (3–6 months of expenses). Equities introduce drawdown risk precisely when you may need the funds. This is general info, not personalized advice.",
      },
      {
        quality: "strong",
        input: "What is dollar-cost averaging?",
        output:
          "Dollar-cost averaging (DCA) is the practice of investing a fixed amount at regular intervals regardless of price, smoothing entry points and reducing timing risk. Trade-off: in a steadily rising market a lump-sum investment historically outperforms. Educational info only.",
      },
    ],
    baselineOutput:
      "An emergency fund is money you save for emergencies. You could put it in stocks but stocks can go up and down. It's usually better to keep it somewhere safe. You should talk to a financial advisor.",
    tunedOutput:
      "Generally no. Emergency reserves prioritize liquidity and principal preservation — common vehicles are high-yield savings, money market funds, or short-duration treasuries covering 3–6 months of essential expenses. Equity allocation introduces sequence-of-returns risk at the moment funds are most likely needed. Educational information, not personalized advice.",
    evaluation: {
      summary:
        "Tuned responses use correct domain terminology in 95% of cases and include appropriate disclaimers in 100% — vs 22% and 31% for baseline.",
      metrics: [
        { label: "Domain vocabulary", baseline: "22%", tuned: "95%" },
        { label: "Includes disclaimer", baseline: "31%", tuned: "100%" },
        { label: "Avoids personal advice", baseline: "67%", tuned: "98%" },
      ],
    },
    quickPrompts: [
      "Explain the difference between Roth and traditional IRA.",
      "Is real estate a good inflation hedge?",
      "What is sequence-of-returns risk?",
      "How should I think about bond duration?",
    ],
  },
  {
    id: "code-review",
    title: "Code Review Assistant",
    category: "Developer tools",
    shortDescription:
      "Match your team's review style — structured, actionable, kind.",
    taskDescription:
      "Review code diffs using a consistent format: Summary, Issues (with severity), Suggestions, and Nits. Focus on correctness, security, and readability — skip style nits the linter handles.",
    whenToFineTune:
      "Every team has a review voice. Fine-tuning on your past PR comments captures severity calibration, format conventions, and what to ignore.",
    examples: [
      {
        quality: "strong",
        input:
          "+ const user = await db.query(`SELECT * FROM users WHERE id = ${id}`)",
        output:
          "**Issues**\n- 🔴 SQL injection: `id` is interpolated directly. Use parameterized queries: `db.query('SELECT * FROM users WHERE id = $1', [id])`.\n\n**Nits**\n- Consider selecting only needed columns instead of `*`.",
      },
      {
        quality: "strong",
        input: "+ function getUser(id) { return users.find(u => u.id == id) }",
        output:
          "**Issues**\n- 🟡 Loose equality (`==`) can match `'1' == 1`. Use `===`.\n\n**Suggestions**\n- Returns `undefined` on miss — document this or throw for clearer call-site handling.",
      },
    ],
    baselineOutput:
      "This code has some issues. The SQL query might be vulnerable to injection attacks. You should use parameterized queries instead. Also consider error handling.",
    tunedOutput:
      "**Summary**\nDirect string interpolation into SQL — needs parameterization before merge.\n\n**Issues**\n- 🔴 SQL injection via `${id}`. Switch to `db.query('SELECT * FROM users WHERE id = $1', [id])`.\n- 🟡 No error handling around `await` — a DB failure will surface as an unhandled rejection.\n\n**Nits**\n- `SELECT *` couples the caller to the schema; prefer explicit columns.",
    evaluation: {
      summary:
        "Tuned reviews follow the team format 96% of the time, calibrate severity emojis correctly, and skip lint-tier nits — saving ~40% reviewer time per PR.",
      metrics: [
        { label: "Follows format", baseline: "8%", tuned: "96%" },
        { label: "Severity tagged", baseline: "15%", tuned: "92%" },
        { label: "Skips lint nits", baseline: "44%", tuned: "89%" },
      ],
    },
    quickPrompts: [
      "Review: + if (user.role = 'admin') { grantAccess() }",
      "Review: + const data = JSON.parse(req.body)",
      "Review: + setTimeout(() => fetch(url), 0)",
      "Review: + password.length > 6",
    ],
  },
];

export const getPreset = (id: string) => PRESETS.find((p) => p.id === id);
