const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const files = [path.join(rootDir, "server.js")];

function collectJavaScriptFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      collectJavaScriptFiles(filePath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(filePath);
    }
  }
}

collectJavaScriptFiles(path.join(rootDir, "src"));

for (const file of files) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log(`Checked ${files.length} backend file(s).`);
