// 数据迁移脚本：从本地 JSON 迁移到 Vercel KV
const fs = require("fs");
const { kv } = require("@vercel/kv");

async function migrateData() {
  try {
    // 读取本地 gists.json
    const localData = JSON.parse(fs.readFileSync("gists.json", "utf-8"));
    console.log(`Found ${localData.length} gists in local file`);

    // 保存到 KV
    await kv.set("gists", localData);
    console.log("Successfully migrated data to Vercel KV");

    // 验证迁移
    const kvData = await kv.get("gists");
    console.log(`Verified: ${kvData.length} gists in KV`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateData();
