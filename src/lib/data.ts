import fs from 'fs/promises';
import path from 'path';

// 定义 Gist 的数据结构类型，这就是 TypeScript 的好处
export interface Gist {
  id: string;
  description: string;
  filename: string;
  content: string;
  created_at: number;
  updated_at: number;
}

// 找到 gists.json 文件的绝对路径
// process.cwd() 指向项目根目录
const dataFilePath = path.join(process.cwd(), 'gists.json');

/**
 * 从 gists.json 文件加载数据
 */
// --- 让这个函数开口说话 ---
export async function loadGists(): Promise<Gist[]> {
  // 日志1：告诉我们它到底在找哪个路径的文件
  console.log('Attempting to load gists from:', dataFilePath);

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (!fileContent) {
      // 日志2：告诉我们文件是空的
      console.log('gists.json is empty.');
      return [];
    }
    const gists: Gist[] = JSON.parse(fileContent);
    // 日志3：告诉我们成功加载了多少条数据
    console.log(`Successfully loaded ${gists.length} gists.`);
    return gists;
  } catch (error) {
    // 日志4：如果出错了，把错误信息打印出来！
    console.error("!!! Critical Error loading gists.json:", error);
    return []; 
  }
}


/**
 * 将数据保存到 gists.json 文件
 * @param gists 要保存的 Gist 数组
 */
export async function saveGists(gists: Gist[]): Promise<void> {
  try {
    // 将 gists 数组转换成格式化的 JSON 字符串
    const data = JSON.stringify(gists, null, 4); // null, 4 用于美化输出，类似 Python 的 indent=4
    // 异步写入文件
    await fs.writeFile(dataFilePath, data, 'utf-8');
  } catch (error) {
    console.error("Error saving gists:", error);
  }
}