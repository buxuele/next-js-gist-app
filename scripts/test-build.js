// 测试构建脚本 - 检查所有依赖是否正确
const fs = require("fs");
const path = require("path");

console.log("🔍 检查项目构建依赖...");

// 检查必要的文件是否存在
const requiredFiles = [
  "src/lib/data.ts",
  "src/lib/data-neon.ts",
  "src/lib/data-adapter.ts",
  "src/lib/utils.ts",
  "src/lib/constants.ts",
  "src/app/api/gists/route.ts",
  "src/app/api/gists/[gist_id]/route.ts",
];

let allFilesExist = true;

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

// 检查 package.json 中的依赖
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const requiredDeps = ["@neondatabase/serverless", "next", "react", "react-dom"];

console.log("\n📦 检查依赖包...");
requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - 依赖缺失`);
    allFilesExist = false;
  }
});

// 检查是否有不需要的依赖
const unnecessaryDeps = [
  "@vercel/kv",
  "@supabase/supabase-js",
  "@planetscale/database",
];
console.log("\n🧹 检查不需要的依赖...");
unnecessaryDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`⚠️  ${dep} - 建议移除此依赖`);
  } else {
    console.log(`✅ ${dep} - 已清理`);
  }
});

if (allFilesExist) {
  console.log("\n🎉 所有检查通过！项目应该可以正常构建。");
} else {
  console.log("\n❌ 发现问题，请修复后重试。");
  process.exit(1);
}
