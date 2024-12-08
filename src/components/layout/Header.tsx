import React from 'react';
import { Guitar } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Guitar size={32} />
            <h1 className="text-2xl font-bold">Guitar Master</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#tabs" className="hover:text-indigo-200">吉他谱</a></li>
              <li><a href="#tuner" className="hover:text-indigo-200">调音仪</a></li>
              <li><a href="#videos" className="hover:text-indigo-200">视频</a></li>
              <li><a href="#recorder" className="hover:text-indigo-200">录音</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};