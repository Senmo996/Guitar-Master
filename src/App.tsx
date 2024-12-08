import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { TabList } from './components/tabs/TabList';
import { EmptyState } from './components/tabs/EmptyState';
import { AddTabModal } from './components/tabs/AddTabModal';
import { TabViewerPage } from './pages/TabViewerPage';
import { Song, TabFilter, NewSong } from './types';
import { PlusCircle } from 'lucide-react';
import { tabDB } from './services/tabDB';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [filter, setFilter] = useState<TabFilter>({
    searchQuery: '',
    sortBy: 'lastPlayed',
    specialTuning: ''
  });

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await tabDB.init();
        const savedTabs = await tabDB.getAllTabs();
        setSongs(savedTabs);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initializeDB();
  }, []);

  const handleAddTab = async (newSong: NewSong) => {
    const song: Song = {
      id: crypto.randomUUID(),
      ...newSong,
      totalPracticeTime: 0,
      lastPlayed: new Date(),
      dateAdded: new Date()
    };

    try {
      await tabDB.addTab(song);
      setSongs(prevSongs => [...prevSongs, song]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add tab:', error);
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await tabDB.deleteTab(id);
      setSongs(prevSongs => prevSongs.filter(song => song.id !== id));
    } catch (error) {
      console.error('Failed to delete tab:', error);
    }
  };

  const handleViewTab = async (song: Song) => {
    try {
      // 获取最新的谱子数据
      const tabs = await tabDB.getAllTabs();
      const latestSong = tabs.find(tab => tab.id === song.id);
      
      if (latestSong) {
        // 更新最后播放时间
        const updatedSong = { ...latestSong, lastPlayed: new Date() };
        await tabDB.updateTab(updatedSong);
        
        // 更新状态
        setSongs(prevSongs =>
          prevSongs.map(s => (s.id === song.id ? updatedSong : s))
        );
        setSelectedSong(updatedSong);
      }
    } catch (error) {
      console.error('Failed to update song:', error);
      setSelectedSong(song); // 如果出错，使用当前的 song 对象
    }
  };

  const filteredSongs = React.useMemo(() => {
    let result = [...songs];

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        song => 
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query)
      );
    }

    if (filter.difficulty) {
      result = result.filter(song => song.difficulty === filter.difficulty);
    }

    if (filter.specialTuning) {
      result = result.filter(song => song.specialTuning === filter.specialTuning);
    }

    result.sort((a, b) => {
      switch (filter.sortBy) {
        case 'dateAdded': {
          const dateA = a.dateAdded instanceof Date ? a.dateAdded : new Date(a.dateAdded);
          const dateB = b.dateAdded instanceof Date ? b.dateAdded : new Date(b.dateAdded);
          return dateB.getTime() - dateA.getTime();
        }
        case 'lastPlayed': {
          const dateA = a.lastPlayed ? (a.lastPlayed instanceof Date ? a.lastPlayed : new Date(a.lastPlayed)) : new Date(0);
          const dateB = b.lastPlayed ? (b.lastPlayed instanceof Date ? b.lastPlayed : new Date(b.lastPlayed)) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        }
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [songs, filter]);

  if (selectedSong) {
    return (
      <TabViewerPage
        song={selectedSong}
        onBack={() => setSelectedSong(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">我的吉他谱子</h1>
            <p className="mt-2 text-sm text-gray-600">
              管理你最喜欢的吉他谱子
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusCircle size={20} className="mr-2" />
            添加新谱子
          </button>
        </div>

        {songs.length === 0 ? (
          <EmptyState onAddTab={() => setIsModalOpen(true)} />
        ) : (
          <TabList
            songs={filteredSongs}
            filter={filter}
            onFilterChange={setFilter}
            onViewTab={handleViewTab}
            onDeleteTab={handleDeleteSong}
          />
        )}

        <AddTabModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTab}
        />
      </main>
    </div>
  );
}

export default App;