import { useEffect, useState, useRef, useCallback } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { CTA } from "../components";

// 创建transformer实例
const transformer = new Transformer();

// 自定义钩子：用于处理思维导图相关逻辑
const useMarkmap = () => {
  const [mdContent, setMdContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const svgRef = useRef(null);
  const markmapRef = useRef(null);
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
        markmapRef.current.fit();
      }
    }
  }, [mdContent, loading, error]);

  // 设置滚轮事件处理
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 阻止默认滚动行为的函数
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 添加多种事件监听，彻底阻止滚动
    container.addEventListener('wheel', preventScroll, { passive: false });
    container.addEventListener('DOMMouseScroll', preventScroll, { passive: false }); // Firefox
    container.addEventListener('mousewheel', preventScroll, { passive: false }); // 旧版浏览器
    
    // 添加处理缩放的自定义事件
    const handleZoom = (e) => {
      if (markmapRef.current) {
        e.preventDefault();
        e.stopPropagation();
        
        // 缩放系数：向下滚动缩小，向上滚动放大
        const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
        
        // 更新当前缩放值，不限制缩放范围
        setScale(prevScale => prevScale * scaleFactor);
        
        // 应用缩放
        markmapRef.current.rescale(scaleFactor);
        return false;
      }
    };
    
    container.addEventListener('wheel', handleZoom, { passive: false });

    // 清理函数
    return () => {
      container.removeEventListener('wheel', preventScroll);
      container.removeEventListener('DOMMouseScroll', preventScroll);
      container.removeEventListener('mousewheel', preventScroll);
      container.removeEventListener('wheel', handleZoom);
    };
  }, []);

  // 滑动条缩放
  const handleSliderChange = useCallback((e) => {
    if (markmapRef.current) {
      const newScale = parseFloat(e.target.value);
      const scaleFactor = newScale / scale;
      markmapRef.current.rescale(scaleFactor);
      setScale(newScale);
    }
  }, [scale]);

  // 导出功能
  const exportAsSVG = useCallback(() => {
    if (svgRef.current) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AI工具思维导图.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // 复制功能
  const copyToClipboard = useCallback(() => {
    if (svgRef.current) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      navigator.clipboard.writeText(svgString);
      alert('思维导图已复制到剪贴板');
    }
  }, []);

  return {
    svgRef,
    containerRef,
    loading,
    error,
    scale,
    handleSliderChange,
    exportAsSVG,
    copyToClipboard
  };
};

const MyTools = () => {
  const {
    svgRef,
    containerRef,
    loading,
    error,
    scale,
    handleSliderChange,
    exportAsSVG,
    copyToClipboard
  } = useMarkmap();

  return (
    <section className='w-full pt-24'>
      <h1 className='head-text w-4/5 mx-auto items-center gap-2 px-4 '>
        <span className='blue-gradient_text font-semibold drop-shadow flex items-center'>
          My AI Tools Map 
          <svg t="1745389561378" className="icon ml-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5540" width="30" height="30">
            <path d="M726.016 373.248H322.56c-16.896 0-30.72 13.312-30.72 30.208V414.72c0 16.384-13.824 30.208-30.72 30.208H209.92v-184.32c0-16.384 13.824-30.208 30.72-30.208h227.328c16.896 0 30.72-13.312 30.72-30.208V30.208c0-16.384-13.824-30.208-30.72-30.208H91.136c-16.896 0-30.72 13.312-30.72 30.208v170.496c0 16.384 13.824 30.208 30.72 30.208s30.72 13.312 30.72 30.208v762.88H209.92v-122.368h51.712c16.896 0 30.72 13.312 30.72 30.208v13.312c0 16.384 13.824 30.208 30.72 30.208h610.304c16.896 0 30.72-13.312 30.72-30.208v-173.056c0-16.384-13.824-30.208-30.72-30.208H322.56c-16.896 0-30.72 13.312-30.72 30.208v13.312c0 16.384-13.824 30.208-30.72 30.208H209.92v-284.16h51.712c16.896 0 30.72 13.312 30.72 30.208v11.264c0 16.384 13.824 30.208 30.72 30.208h402.944c16.896 0 30.72-13.312 30.72-30.208v-168.96c-0.512-16.896-13.824-30.72-30.72-30.72z" fill="#1296db" p-id="5541"></path>
          </svg>
        </span>
      </h1>

      <div className='mt-2 mb-3 w-4/5 mx-auto flex-col gap-2 text-slate-500 px-4'>
        <p>
          这是一个关于AI工具的思维导图，展示了当前AI技术生态最流行、最好用的系统和工具。我会每周更新这个思维导图。
          <br/>
          如果你想参与编辑，可以访问<a href="https://github.com/lennonkc/ai-tools-map" className='blue-gradient_text font-semibold drop-shadow'>这个项目</a>。
        </p>
      </div>

      <div className='py-3 flex flex-col items-center'>
        {loading && (
          <div className="w-full flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-xl font-semibold">加载中...</p>
          </div>
        )}
        
        {error && <p className="text-xl font-semibold text-red-500 py-10">出错了: {error}</p>}
        
        {/* 思维导图显示区域 - 调整为80%宽度并降低高度 */}
        <div className="relative w-4/5 mx-auto my-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse"></div>
          
          {/* 降低容器高度 */}
          <div className="relative glassmorphism rounded-2xl p-2 min-h-[60vh] flex flex-col">
            {/* SVG容器 - 使用滚轮缩放功能 */}
            <div 
              ref={containerRef}
              className="flex-1 relative overflow-hidden"
              style={{touchAction: 'none'}}
            >
              {/* 侧边控制区域 */}
              <div className="absolute right-2 top-2 z-10 bg-white/70 rounded-xl p-3 shadow-md flex flex-col gap-3 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">缩放比例</span>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={scale}
                    onChange={handleSliderChange}
                    className="w-28 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{Math.round(scale * 100)}%</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={copyToClipboard} 
                    className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1">
                    <span>📋</span> 复制
                  </button>
                  <button 
                    onClick={exportAsSVG} 
                    className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1">
                    <span>📥</span> 导出SVG
                  </button>
                </div>
              </div>
              
              {/* 思维导图 SVG - 减小最小高度 */}
              <svg 
                ref={svgRef} 
                className="w-full h-full min-h-[65vh] bg-white/90 rounded-xl transform transition-transform"
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyTools;