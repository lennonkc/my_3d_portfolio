import { useEffect, useState, useRef, useCallback } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { CTA } from "../components";
import copyIcon from "../assets/icons/copymd.svg";
import exportIcon from "../assets/icons/exportsvg.svg";
import noteIcon from "../assets/icons/notesvg.svg";
import scrollIcon from "../assets/icons/mousescrolling.svg";

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

  useEffect(() => {
    if (!loading && !error && mdContent && svgRef.current) {
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

  // 导出功能 - 恢复为导出SVG文件
  const exportAsSVG = useCallback(() => {
    if (svgRef.current) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AI-tools-mindmap.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  return {
    svgRef,
    containerRef,
    loading,
    error,
    exportAsSVG,
    copyToClipboard,
    mdContent,
  };
};

// 新增组件：控制按钮区域
const ControlButtons = ({ onCopy, onExport }) => {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showExportTooltip, setShowExportTooltip] = useState(false);
  const [showTipTooltip, setShowTipTooltip] = useState(false);
  
  return (
    <div className="absolute right-2 top-2 z-10 bg-white/70 rounded-xl p-3 shadow-md backdrop-blur-sm">
      <div className="flex flex-row gap-2">
        <div className="relative">
          <button 
            onClick={onCopy} 
            onMouseEnter={() => setShowCopyTooltip(true)}
            onMouseLeave={() => setShowCopyTooltip(false)}
            className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1"
            title="Copy Markdown">
            <img src={copyIcon} alt="Copy" className="w-5 h-5" />
          </button>
          {showCopyTooltip && (
            <div className="absolute top-full right-0 mt-2 p-3 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm whitespace-nowrap z-20 min-w-[220px]">
              <p className="text-center blue-gradient_text font-medium">Copy as Markdown</p>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={onExport} 
            onMouseEnter={() => setShowExportTooltip(true)}
            onMouseLeave={() => setShowExportTooltip(false)}
            className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1"
            title="Export SVG">
            <img src={exportIcon} alt="Export" className="w-5 h-5" />
          </button>
          {showExportTooltip && (
            <div className="absolute top-full right-0 mt-2 p-3 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm whitespace-nowrap z-20 min-w-[220px]">
              <p className="text-center blue-gradient_text font-medium">Export Svg Image</p>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onMouseEnter={() => setShowTipTooltip(true)}
            onMouseLeave={() => setShowTipTooltip(false)}
            className="bg-white/80 rounded-lg px-3 py-1.5 text-sm shadow hover:shadow-md transition-all duration-300 flex items-center gap-1"
            title="tip">
            <img src={noteIcon} alt="Tip" className="w-5 h-5" />
          </button>
          {showTipTooltip && (
            <div className="absolute top-full right-0 mt-2 p-3 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm whitespace-nowrap z-20 min-w-[220px]">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold blue-gradient_text">CTRL +</p>
                  <img src={scrollIcon} alt="Mouse scroll" className="w-12 h-12" />
                </div>
                <p className="text-center blue-gradient_text">Hold "CTRL" + scrolling to ZOOM</p>
              </div>
            </div>
          )}
        </div>
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
    exportAsSVG,
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
                onExport={exportAsSVG}
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