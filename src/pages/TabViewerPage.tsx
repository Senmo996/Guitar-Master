import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Columns, ZoomIn, ZoomOut, Play, Pause, Clock } from 'lucide-react';
import { Song } from '../types';
import { tabDB } from '../services/tabDB';

const difficultyText = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
};

interface TabViewerPageProps {
  song: Song;
  onBack: () => void;
}

export const TabViewerPage: React.FC<TabViewerPageProps> = ({ song, onBack }) => {
  const [columns, setColumns] = useState(1);
  const [imageScale, setImageScale] = useState(100);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0.5);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [totalPracticeTime, setTotalPracticeTime] = useState(song.totalPracticeTime || 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const sessionStartTime = useRef<number>(Date.now());

  // Format time in HH:MM:SS format
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      setCurrentSessionTime(currentTime);
      setTotalPracticeTime(song.totalPracticeTime + currentTime);
    }, 1000);

    return () => {
      clearInterval(timer);
      // Save the practice time when unmounting
      const finalSessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      tabDB.updatePracticeTime(song.id, finalSessionDuration).catch(console.error);
    };
  }, [song.id, song.totalPracticeTime]);

  const handleIncreaseColumns = () => {
    setColumns(prev => Math.min(prev + 1, 4));
  };

  const handleDecreaseColumns = () => {
    setColumns(prev => Math.max(prev - 1, 1));
  };

  const handleIncreaseScale = () => {
    setImageScale(prev => Math.min(prev + 10, 150));
  };

  const handleDecreaseScale = () => {
    setImageScale(prev => Math.max(prev - 10, 50));
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev);
  };

  useEffect(() => {
    let accumulatedScroll = 0;
  
    const scroll = () => {
      if (!isAutoScrolling) return;
  
      const baseSpeed = 0.1;
      const variableSpeed = scrollSpeed * 0.4;
      const scrollAmount = baseSpeed + variableSpeed;
  
      accumulatedScroll += scrollAmount;
  
      if (accumulatedScroll >= 1) {
        window.scrollBy(0, accumulatedScroll);
        accumulatedScroll = 0;
      }
  
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
      if (window.scrollY >= maxScroll) {
        setIsAutoScrolling(false);
        return;
      }
  
      animationFrameRef.current = requestAnimationFrame(scroll);
    };
  
    if (isAutoScrolling) {
      animationFrameRef.current = requestAnimationFrame(scroll);
    }
  
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Handle back button click
  const handleBack = () => {
    // Save the practice time before going back
    const finalSessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    tabDB.updatePracticeTime(song.id, finalSessionDuration)
      .then(() => onBack())
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={24} className="mr-2" />
                返回谱库
              </button>
              <div>
                <h1 className="text-2xl font-bold">{song.title}</h1>
                <p className="text-gray-600">{song.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">本次练习：{formatTime(currentSessionTime)}</span>
                  <span className="text-sm text-gray-600">总练习时长：{formatTime(totalPracticeTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-8">
        <div className="fixed top-20 left-0 right-0 z-10 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">难度：{difficultyText[song.difficulty]}</p>
              </div>
              
              <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                {/* Auto-scroll Control */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleAutoScroll}
                    className={`p-2 rounded-lg shadow-sm ${
                      isAutoScrolling 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {isAutoScrolling ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-600">滚动速度</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={scrollSpeed}
                      onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>慢</span>
                      <span>快</span>
                    </div>
                  </div>
                </div>

                {/* Column Control */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">列数：</span>
                  <div className="flex items-center bg-white shadow-sm rounded-lg p-1">
                    <button
                      onClick={handleDecreaseColumns}
                      disabled={columns <= 1}
                      className={`p-1 rounded ${
                        columns <= 1 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Columns size={20} className="rotate-90" />
                    </button>
                    <span className="px-2 text-gray-700">{columns}</span>
                    <button
                      onClick={handleIncreaseColumns}
                      disabled={columns >= 4}
                      className={`p-1 rounded ${
                        columns >= 4 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Columns size={20} className="-rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Zoom Control */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">大小：</span>
                  <div className="flex items-center bg-white shadow-sm rounded-lg p-1">
                    <button
                      onClick={handleDecreaseScale}
                      disabled={imageScale <= 50}
                      className={`p-1 rounded ${
                        imageScale <= 50 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ZoomOut size={20} />
                    </button>
                    <span className="px-2 text-gray-700">{imageScale}%</span>
                    <button
                      onClick={handleIncreaseScale}
                      disabled={imageScale >= 150}
                      className={`p-1 rounded ${
                        imageScale >= 150 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <ZoomIn size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={contentRef} 
          className="scroll-smooth pt-20"
        >
          {song.sheetMusicImages.length > 0 ? (
            <div className={`grid ${getGridColumns()} gap-6 pb-6`}>
              {song.sheetMusicImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative transition-transform hover:scale-[1.02]"
                  style={{
                    width: '100%',
                    maxWidth: `${imageScale}%`,
                    margin: '0 auto'
                  }}
                >
                  <img
                    src={image}
                    alt={`${song.title} 乐谱 ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    第 {index + 1} 页
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              暂无乐谱
            </p>
          )}

          {song.tabContent && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">附加说明</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {song.tabContent}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};