import { defineConfig } from "vitepress";
import generateRoutes from "./utils/generateRoutes.js"; // 引入自动生成路由的脚本

// 生成侧边栏结构（假设生成的路由是针对 Notes 目录的）
const generatedSidebar = generateRoutes(); // 调用生成函数，假设返回一个数组

export default defineConfig({
  title: "FonzoNote",
  description: "FonzoWepApp",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Notes", link: "/Note/README.md" }, // 确保导航栏指向 Notes 的入口
    ],
    sidebar: [
      // 合并自动生成的侧边栏（假设生成的是 Notes 目录的结构）
      ...generatedSidebar, // 使用扩展运算符合并动态生成的路由
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/FonzoSong" }],
  },
});
