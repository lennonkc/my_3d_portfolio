# [Live Website](https://kc-li.com)
# 项目结构和说明
这是一个使用React + Three.js构建的3D个人作品集项目。以下是项目的启动和使用方法：

### 1. 启动项目

首先需要安装依赖并运行开发服务器：

```bash
npm install
npm run dev
```

项目会运行在 `http://localhost:5173` (Vite默认端口)

### 2. 主要功能模块

- **3D主页**：包含岛屿、飞机和鸟的3D场景
- **作品画廊**：3D相册展示项目
- **联系表单**：带有3D狐狸动画的表单
- **项目展示**：传统2D项目列表

### 3. 关键组件说明

- `<mcsymbol name="Bird" filename="Bird.jsx" path="/Users/amberwong/Documents/MyCodes/Portfolio/3D_portfolio/src/models/Bird.jsx" startline="8" type="function"></mcsymbol>：会飞行的鸟模型
- `<mcsymbol name="Fox" filename="Fox.jsx" path="/Users/amberwong/Documents/MyCodes/Portfolio/3D_portfolio/src/models/Fox.jsx" startline="18" type="function"></mcsymbol>：联系页面的交互式狐狸模型
- `<mcsymbol name="HomeInfo" filename="HomeInfo.jsx" path="/Users/amberwong/Documents/MyCodes/Portfolio/3D_portfolio/src/components/HomeInfo.jsx" startline="5" type="function"></mcsymbol>：主页信息展示组件

### 4. 环境变量配置

项目使用了EmailJS服务，需要配置以下环境变量：

```plaintext:/Users/amberwong/Documents/MyCodes/Portfolio/3D_portfolio/.env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id 
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### 5. 构建部署

```bash
npm run build
```

构建完成后可将 `dist` 文件夹部署到Vercel等平台

### 6. 项目特点

- 响应式设计，适配不同屏幕尺寸
- 3D模型交互（如岛屿可旋转）
- 动画过渡效果
- 使用Tailwind CSS进行样式管理

如需了解具体某个功能的实现细节，可以告诉我，我会结合代码进一步解释。
