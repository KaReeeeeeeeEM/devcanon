import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";

export const productDefaults = {
  name: "My product",
  description: "",
  kind: "general",
  stackMode: "skip",
  frontend: "not-specified",
  backend: "not-specified",
  database: "not-specified",
  dataTool: "none",
  mobile: "not-specified",
  language: "not-specified",
  extras: [],
  hasDesignReferences: false,
};

export const productChoices = {
  kind: ["web", "mobile", "api", "desktop", "general"],
  frontend: ["nextjs", "react", "vue", "sveltekit", "angular", "html-css-js", "other", "not-specified"],
  backend: ["nextjs", "node-express", "nestjs", "python-fastapi", "python-django", "laravel-php", "go", "other", "not-specified"],
  database: ["postgresql", "mysql", "sqlite", "mongodb", "supabase", "firebase", "none", "other", "not-specified"],
  dataTool: ["drizzle", "prisma", "mongoose", "sql", "none", "other"],
  mobile: ["react-native-expo", "flutter-dart", "swift-swiftui", "kotlin-compose", "ionic", "other", "not-specified"],
  language: ["typescript", "javascript", "python", "dart", "swift", "kotlin", "go", "php", "rust", "other", "not-specified"],
};

const productLabels = {
  web: "Website or web app", mobile: "Mobile app", api: "API", desktop: "Desktop app", general: "Something else",
  nextjs: "Next.js", react: "React", vue: "Vue", sveltekit: "SvelteKit", angular: "Angular", "html-css-js": "HTML, CSS and JavaScript",
  "node-express": "Node.js / Express", nestjs: "NestJS", "python-fastapi": "Python / FastAPI", "python-django": "Python / Django", "laravel-php": "Laravel / PHP",
  postgresql: "PostgreSQL", mysql: "MySQL", sqlite: "SQLite", mongodb: "MongoDB", supabase: "Supabase", firebase: "Firebase",
  drizzle: "Drizzle", prisma: "Prisma", mongoose: "Mongoose", sql: "SQL", "react-native-expo": "React Native / Expo",
  "flutter-dart": "Flutter / Dart", "swift-swiftui": "Swift / SwiftUI", "kotlin-compose": "Kotlin / Jetpack Compose", ionic: "Ionic",
  typescript: "TypeScript", javascript: "JavaScript", python: "Python", dart: "Dart", swift: "Swift", kotlin: "Kotlin", go: "Go", php: "PHP", rust: "Rust",
  none: "None", other: "Something else", "not-specified": "Let the AI choose",
};

function productLabel(value) {
  return productLabels[value] || value;
}

function cleanText(value, fallback = "") {
  return String(value ?? "").trim().replaceAll("\0", "").slice(0, 4000) || fallback;
}

export function normalizeProduct(value = {}) {
  const product = { ...productDefaults, ...value };
  product.name = cleanText(product.name, productDefaults.name).slice(0, 100);
  product.description = cleanText(product.description);
  product.stackMode = ["choose", "guided"].includes(product.stackMode) ? "choose" : "skip";
  for (const key of Object.keys(productChoices)) {
    if (!productChoices[key].includes(product[key])) {
      throw new Error(`Invalid product value for ${key}: ${product[key]}. Choose: ${productChoices[key].join(", ")}`);
    }
  }
  product.extras = Array.isArray(product.extras)
    ? [...new Set(product.extras.map((item) => cleanText(item)).filter(Boolean))].slice(0, 20)
    : [];
  product.hasDesignReferences = Boolean(product.hasDesignReferences);
  return product;
}

export function encodeProduct(value) {
  return `dcp1_${Buffer.from(JSON.stringify(normalizeProduct(value))).toString("base64url")}`;
}

export function decodeProduct(code) {
  if (!code?.startsWith("dcp1_")) throw new Error("Invalid product code. Expected a code beginning with dcp1_.");
  try {
    return normalizeProduct(JSON.parse(Buffer.from(code.slice(5), "base64url").toString("utf8")));
  } catch (error) {
    if (error.message.startsWith("Invalid product")) throw error;
    throw new Error("The product code is malformed or incomplete.");
  }
}

function stackLines(product) {
  if (product.stackMode === "skip") return ["- Stack choices are intentionally open. Inspect the repository and recommend the simplest suitable stack before implementation."];
  const pairs = product.kind === "mobile"
    ? [["Mobile framework", product.mobile], ["Main language", product.language], ["Database", product.database], ["Data tool", product.dataTool]]
    : [["Frontend", product.frontend], ["Backend", product.backend], ["Database", product.database], ["Data tool", product.dataTool], ["Main language", product.language]];
  return [...pairs.map(([label, value]) => `- **${label}:** ${productLabel(value)}`), `- **Extra tools:** ${product.extras.join(", ") || "None selected"}`];
}

export function productPrompt(productValue) {
  const product = normalizeProduct(productValue);
  const references = product.hasDesignReferences
    ? "I will attach design examples. Study them for layout, hierarchy, spacing, typography, interaction patterns, and visual direction. Do not copy branding or protected content."
    : "No design examples are attached. Establish a calm, accessible visual direction that fits the product and existing repository conventions.";
  return `Build ${product.name} from start to finish.

What the product does:
${product.description || "The product description is not decided yet. Ask me one short question before planning."}

Product type: ${product.kind}

Chosen stack:
${stackLines(product).join("\n")}

Design direction:
${references}

Before coding, read AGENTS.md, .ai/AGENTS.md, .ai/product.md, and every relevant standard and prompt. Inspect the existing repository and preserve working conventions. Then:
1. Restate the outcome in simple language and list any truly blocking question.
2. Create a small, testable implementation plan.
3. Build the complete product flow, including empty, loading, error, success, responsive, accessibility, security, and recovery states.
4. Verify the real user journey end to end and fix problems you find.
5. Finish with what was built, how it was verified, and any decision I still need to make.

Do not invent requirements, expose secrets, weaken mandatory safeguards, or claim completion without evidence.`;
}

export async function applyProduct(target, value) {
  const product = typeof value === "string" ? decodeProduct(value) : normalizeProduct(value);
  const code = encodeProduct(product);
  const root = path.join(target, ".ai");
  await mkdir(path.join(root, "prompts"), { recursive: true });
  const descriptionHelp = "This description gives the AI agent the product goal, users, and boundaries so it can make better decisions without guessing.";
  const markdown = `# Product Brief

## Purpose
Give humans and AI agents one clear description of the product before implementation begins.

## Product
- **Name:** ${product.name}
- **Type:** ${product.kind}
- **Description:** ${product.description || "Not decided yet"}
- **Why this matters:** ${descriptionHelp}

## Stack
${stackLines(product).join("\n")}

## Design References
${product.hasDesignReferences ? "Design examples will be attached with the build prompt. Treat them as direction, not content to copy." : "No design examples are expected."}

## Rules
- Read this brief before planning or changing product behavior.
- Ask a short question when an undecided choice would materially change the product.
- Prefer the simplest solution that satisfies this brief and the engineering handbook.
- Mandatory security, privacy, accessibility, and data-integrity rules still apply.
`;
  await writeFile(path.join(root, "product.md"), markdown);
  await writeFile(path.join(root, "product.json"), `${JSON.stringify({ version: 1, code, product }, null, 2)}\n`);
  await writeFile(path.join(root, "prompts", "build-product.md"), `${productPrompt(product)}\n`);
  return { code, product };
}

async function choose(terminal, question, choices, defaultIndex = 0) {
  console.log(`\n${question}`);
  choices.forEach((choice, index) => console.log(`  ${index + 1}. ${productLabel(choice)}`));
  const answer = (await terminal.question(`Choose 1-${choices.length} (Enter for ${defaultIndex + 1}): `)).trim();
  if (!answer) return choices[defaultIndex];
  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || !choices[index]) throw new Error("Please choose one of the numbers shown.");
  return choices[index];
}

async function yesNo(terminal, question, defaultValue = false) {
  const suffix = defaultValue ? "Y/n" : "y/N";
  const answer = (await terminal.question(`${question} (${suffix}): `)).trim().toLowerCase();
  if (!answer) return defaultValue;
  return ["y", "yes"].includes(answer);
}

export async function askProductQuestions({ terminal: providedTerminal } = {}) {
  const terminal = providedTerminal || readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    console.log("\nLet’s tell the AI what you want to build. Short answers are perfect.");
    const name = cleanText(await terminal.question("\nWhat should we call your product? "), productDefaults.name);
    console.log("This description helps the AI understand the goal and avoid guessing.");
    const description = cleanText(await terminal.question("What does the product help people do? "));
    const useGuidedStack = await yesNo(terminal, "Would you like to choose the technology stack?", false);
    const base = { ...productDefaults, name, description, stackMode: useGuidedStack ? "choose" : "skip" };
    if (!useGuidedStack) {
      base.hasDesignReferences = await yesNo(terminal, "Do you have design examples to attach?", false);
      return normalizeProduct(base);
    }
    base.kind = await choose(terminal, "What are you building?", ["web", "mobile", "api", "desktop", "general"]);
    if (base.kind === "mobile") {
      base.mobile = await choose(terminal, "How should the mobile app be built?", productChoices.mobile);
      base.language = await choose(terminal, "What is the main coding language?", productChoices.language);
    } else if (base.kind === "web") {
      base.frontend = await choose(terminal, "What should build the screens people see?", productChoices.frontend);
      base.backend = await choose(terminal, "What should run the server work?", productChoices.backend);
      base.language = await choose(terminal, "What is the main coding language?", productChoices.language);
    } else {
      base.backend = await choose(terminal, "What should power the product?", productChoices.backend);
      base.language = await choose(terminal, "What is the main coding language?", productChoices.language);
    }
    base.database = await choose(terminal, "Where should the product save its data?", productChoices.database);
    if (!["none", "not-specified"].includes(base.database)) base.dataTool = await choose(terminal, "How should the code talk to the database?", productChoices.dataTool);
    const extras = cleanText(await terminal.question("Any extra tools? Use commas, or press Enter to skip: "));
    base.extras = extras ? extras.split(",").map((item) => item.trim()) : [];
    base.hasDesignReferences = await yesNo(terminal, "Do you have design examples to attach?", false);
    return normalizeProduct(base);
  } finally {
    if (!providedTerminal) terminal.close();
  }
}
