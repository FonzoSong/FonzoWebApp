import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSidebar(dir = "../../Note", basePath = "/Note/") {
  const dirPath = path.resolve(__dirname, dir);

  try {
    const files = fs.readdirSync(dirPath);
    return processFiles(files, dirPath, basePath);
  } catch (error) {
    console.error("Error generating routes:", error);
    return [];
  }
}

function processFiles(files, dirPath, basePath) {
  return files
    .filter((item) => !item.startsWith("."))
    .sort(sortItems)
    .map((item) => processItem(item, dirPath, basePath))
    .filter(Boolean);
}

function sortItems(a, b) {
  const priorityOrder = ["Development", "Web", "O&M"];
  const indexA = priorityOrder.indexOf(a);
  const indexB = priorityOrder.indexOf(b);
  return indexA - indexB || a.localeCompare(b);
}

function processItem(item, dirPath, basePath) {
  const fullPath = path.join(dirPath, item);
  const stats = fs.statSync(fullPath);

  if (stats.isDirectory()) {
    return createDirectoryItem(item, fullPath, basePath);
  }

  if (item.endsWith(".md") && !/^(README|Readme|readme)\.md$/i.test(item)) {
    return createFileItem(item, basePath);
  }
}

function createDirectoryItem(item, fullPath, basePath) {
  const nestedItems = fs.readdirSync(fullPath);
  return {
    text: formatName(item),
    collapsible: true,
    items: [
      ...processFiles(nestedItems, fullPath, `${basePath}${item}/`), // 保持路径大小写
    ],
  };
}

function createFileItem(item, basePath) {
  return {
    text: formatName(path.parse(item).name),
    link: `${basePath}${item.replace(/\.md$/i, "")}`, // 保留原始大小写
  };
}

function formatName(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}

export default generateSidebar;