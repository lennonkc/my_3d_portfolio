import { useEffect, useState, useRef, useCallback } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { CTA } from "../components";

// 创建transformer实例
const transformer = new Transformer();

// 自定义钩子：使用markmap内置方法处理思维导图相关逻辑
const useMarkmap = () => {
  const [mdContent, setMdContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const markmapRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  
  // 获取Markdown内容
  useEffect(() => {
    const fetchMdFile = async () => {
      try {
        setLoading(true);
        const url = "https://raw.githubusercontent.com/lennonkc/ai-tools-map/refs/heads/main/test.md";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setMdContent(text);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMdFile();
  }, []);

  // 创建或更新思维导图
  useEffect(() => {
    if (!loading && !error && mdContent && svgRef.current) {
      // 清除旧的思维导图内容
      if (svgRef.current.innerHTML) {
        svgRef.current.innerHTML = '';
      }

      // 转换MD内容为思维导图数据
      const { root } = transformer.transform(mdContent);

      // 创建思维导图
      if (!markmapRef.current) {
        markmapRef.current = Markmap.create(svgRef.current, null, root);
      } else {
        markmapRef.current.setData(root);
      }
      
      // 调整视图
      setTimeout(() => {
        if (markmapRef.current) {
          markmapRef.current.fit(); // 首先适应视图
        }
      }, 100);
    }
  }, [mdContent, loading, error]);

  // 复制功能 - 修改为复制原始Markdown内容
  const copyToClipboard = useCallback(() => {
    if (mdContent) {
      navigator.clipboard.writeText(mdContent);
      alert('The Markdown content has been copied to the clipboard.');
    }
  }, [mdContent]);

  // 导出功能 - 修改为导出PNG图片
  const exportAsPNG = useCallback(() => {
    if (svgRef.current) {
      try {
        // 显示加载中提示
        const loadingToast = () => alert("正在生成图片，请稍候...");
        loadingToast();
        
        // 获取SVG元素并计算尺寸
        const svgElement = svgRef.current;
        const svgWidth = svgElement.clientWidth || svgElement.getBoundingClientRect().width;
        const svgHeight = svgElement.clientHeight || svgElement.getBoundingClientRect().height;
        
        if (svgWidth === 0 || svgHeight === 0) {
          alert("无法获取思维导图尺寸，请确保思维导图已正确加载");
          return;
        }
        
        // 创建临时Canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // 设置Canvas尺寸（高分辨率）
        const scale = 2; // 高清输出比例
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;
        
        // 设置白色背景
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        
        // 转换SVG为数据URL
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);
        
        // 创建图像并在加载完成后绘制
        const img = new Image();
        img.onload = () => {
          // 绘制图像
          ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
          
          // 将Canvas转换为PNG数据URL
          try {
            const pngUrl = canvas.toDataURL("image/png");
            
            // 创建下载链接
            const link = document.createElement("a");
            link.download = "AI-tools-mindmap.png";
            link.href = pngUrl;
            link.click();
            
            // 清理资源
            URL.revokeObjectURL(url);
            alert("导出成功！");
          } catch (canvasError) {
            console.error("Canvas导出错误:", canvasError);
            alert("导出图片时发生错误，可能是由于跨域资源限制");
          }
        };
        
        // 错误处理
        img.onerror = () => {
          console.error("图片加载失败");
          alert("无法加载SVG图像，导出失败");
          URL.revokeObjectURL(url);
        };
        
        // 设置图片源并开始加载
        img.src = url;
      } catch (error) {
        console.error("导出PNG过程中发生错误:", error);
        alert("导出过程中发生错误: " + error.message);
      }
    } else {
      alert("思维导图尚未加载完成，请稍后再试");
    }
  }, []);

  return {
    svgRef,
    containerRef,
    loading,
    error,
    exportAsPNG,
    copyToClipboard,
    mdContent,
  };
};

// 新增组件：控制按钮区域
const ControlButtons = ({ onCopy, onExport }) => {
  return (
    <div className="absolute right-2 top-2 z-10 bg-white/70 rounded-xl p-3 shadow-md flex flex-col gap-3 backdrop-blur-sm">
      <div className="flex flex-col gap-2">
        <button 
          onClick={onCopy} 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1">
          <span>📋</span> Copy
        </button>
        <button 
          onClick={onExport} 
          className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1">
          <span>📥</span> Export
        </button>
      </div>
    </div>
  );
};

const MyTools = () => {
  const {
    svgRef,
    containerRef,
    loading,
    error,
    exportAsPNG,
    copyToClipboard,
  } = useMarkmap();

  return (
    <section className='w-full pt-24 min-h-screen flex flex-col '>
      <h1 className='head-text w-4/5 mx-auto items-center gap-2 px-4 '>
        <span className='blue-gradient_text font-semibold drop-shadow flex items-center'>
          My AI Tools Map 
          <svg t="1745389561378" className="icon ml-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5540" width="30" height="30">
          </svg>
        </span>
      </h1>
      <div className='mt-2 mb-3 w-4/5 mx-auto flex-col gap-2 text-slate-500 px-4 '>
        <p>
        A mind map about AI tools, showcasing the most popular and user-friendly systems and tools in the current AI technology ecosystem. 
          <br/>
          I will update this mind map every week. If you want to participate in editing, you can visit  <a href="https://github.com/lennonkc/ai-tools-map" className='blue-gradient_text font-semibold drop-shadow'>    This Repo</a>
        </p>
      </div>

      <div className='py-3 flex flex-col items-center flex-1 rounded-xl'>
        {loading && (
          <div className="w-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 "></div>
            <p className="ml-3 text-xl font-semibold">加载中...</p>
          </div>
        )}
        
        {error && <p className="text-xl font-semibold text-red-500 py-10">Something Wrong: {error}</p>}
        
        {/* 思维导图显示区域 - 调整为填充剩余空间 */}
        <div className="relative w-4/5 mx-auto my-4 overflow-hidden flex-1 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse"></div>
          
          {/* 容器高度填充可用空间 */}
          <div className="relative glassmorphism rounded-2xl p-2 flex-1 flex flex-col">
            {/* SVG容器 - 确保没有内边距 */}
            <div 
              ref={containerRef}
              className="flex-1 relative overflow-hidden"
              style={{touchAction: 'none', height: '100%'}}
            >
              {/* 使用重构后的控制按钮组件 */}
              <ControlButtons 
                onCopy={copyToClipboard}
                onExport={exportAsPNG}
              />
              
              {/* 思维导图 SVG - 调整以完全填充容器空间 */}
              <svg 
                ref={svgRef} 
                className="w-full h-full min-h-[65vh] bg-white/90 rounded-xl transform transition-transform absolute inset-0"
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyTools;