import fs from "fs";
import path from "path";

// The Agent's Execution Engine: Codebase Audit & Refactor Scout
async function runScoutAgent() {
  console.log("🚀 [Agent Init]: Booting Codebase Audit & Refactor Scout...");
  console.log("🔍 [Observation]: Scanning component repository for a11y, style tokens, and type constraints...");

  const targetDir = path.resolve(process.cwd(), "src/components");
  const report = [];

  // Tool 1: File Tree Inspector
  function scanFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(scanFiles(fullPath));
      } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(fullPath);
      }
    });
    return results;
  }

  const files = scanFiles(targetDir);
  console.log(`📂 [Tool: list_directory]: Found ${files.length} active TypeScript components.`);

  // Tool 2: Code Linter & Token Auditor
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf-8");
    const relative = path.relative(process.cwd(), filePath);

    // Rule A: Interactive button accessibility check
    if (content.includes("<button") && !content.includes("aria-label") && !content.includes("children")) {
      report.push({
        file: relative,
        rule: "A11y/WCAG-2.1",
        issue: "Potential missing accessible name on interactive <button> element.",
        severity: "WARN",
        fix: "Add aria-label attribute describing interactive purpose.",
      });
    }

    // Rule B: TypeScript loose type check
    if (content.includes(": any") || content.includes("<any>")) {
      report.push({
        file: relative,
        rule: "TS-Strictness",
        issue: "Loose 'any' type annotation detected.",
        severity: "HIGH",
        fix: "Define typed interface or infer from Zod schema.",
      });
    }

    // Rule C: Console log cleanliness in production
    if (content.includes("console.log(")) {
      report.push({
        file: relative,
        rule: "Prod-Cleanliness",
        issue: "Active console.log statement found in component scope.",
        severity: "INFO",
        fix: "Remove debug logging before production release.",
      });
    }
  }

  // Tool 3: Non-Destructive Review Reporter
  const outputDir = path.resolve(process.cwd(), ".review");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const reportPath = path.join(outputDir, "agent-audit-report.json");
  const reportPayload = {
    agent: "Codebase Audit & Refactor Scout v1.0",
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    findingsCount: report.length,
    findings: report,
    status: "COMPLETE",
  };

  fs.writeFileSync(reportPath, JSON.stringify(reportPayload, null, 2));

  console.log(`\n✅ [Agent Loop Complete]: End-to-end inspection finished without errors.`);
  console.log(`📊 Scanned: ${files.length} files | Flagged: ${report.length} quality items.`);
  console.log(`📝 Output saved safely to: .review/agent-audit-report.json`);
}

runScoutAgent().catch((err) => {
  console.error("❌ [Agent Halted]:", err.message);
  process.exit(1);
});