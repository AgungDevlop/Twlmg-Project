import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaCopy, FaDownload, FaPlay, FaSpinner, FaSearch, FaFire, FaVideo } from 'react-icons/fa';

declare global {
  interface Window {
    fluidPlayer?: (elementId: string, options?: any) => any;
  }
}

// Komponen Kartu Video
const VideoCard = ({ video, onClick, isRecent = false }: { video: any, onClick: (videoId: string) => void, isRecent?: boolean }) => (
  <div 
    onClick={() => onClick(video.id)} 
    className={`group cursor-pointer flex-shrink-0 ${isRecent ? 'w-72' : 'w-full'}`}
  >
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:shadow-blue-900/10 group-hover:-translate-y-1 transition-all duration-300">
      <video className="w-full h-full object-cover" preload="metadata" muted>
        <source src={video.Url} type="video/mp4" />
      </video>
      
      {/* Overlay Play Icon */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
           <FaPlay className="text-slate-900 ml-1" />
        </div>
      </div>

      {isRecent && (
        <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm tracking-wider">
          New
        </div>
      )}
    </div>
    <div className="mt-3 px-1">
      <h3 className="text-slate-800 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
        {video.Judul}
      </h3>
    </div>
  </div>
);

export function PlayVideo() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  const [videos, setVideos] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const videosPerPage = 12;

  const playerRef = useRef<any>(null);

  const randomUrls = [
    'https://otieu.com/4/10055984',
  ];

  // Fetch Data
  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/AgungDevlop/Viral/refs/heads/main/Video.json'
        );
        const data = await response.json();
        
        setVideos(shuffleArray([...data]));
        setRecentVideos(data.slice(-10).reverse());

        if (id) {
          const video = data.find((item: { id: string }) => item.id === id);
          if (video) {
            document.title = video.Judul;
            setVideoUrl(video.Url);
            setVideoTitle(video.Judul);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  // Handle Search Filter
  useEffect(() => {
    setSearchTerm(query);
    const results = query 
      ? videos.filter(video => video.Judul.toLowerCase().includes(query.toLowerCase()))
      : videos;
    setFilteredVideos(results);
    setCurrentPage(1);
  }, [query, videos]);

  // Player Init
  useEffect(() => {
    if (!loading && videoUrl && window.fluidPlayer) {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const player = window.fluidPlayer('video-player', {
        layoutControls: {
          controlBar: { autoHideTimeout: 3, animated: true, autoHide: true },
          autoPlay: true,
          mute: true,
          allowTheatre: false,
          playPauseAnimation: true,
          playbackRateEnabled: true,
          allowDownload: false, 
          playButtonShowing: true,
          fillToContainer: true,
          primaryColor: '#0f172a',
          posterImage: '' 
        }
      });

      playerRef.current = player;
    }
  }, [loading, videoUrl]);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- MODIFIKASI UTAMA DISINI ---
  const handleCardClick = (videoId: string) => {
    // 1. Buka video di Tab Baru
    window.open(`/${videoId}`, '_blank');
    
    // 2. Di Tab Lama, redirect ke iklan setelah 3 detik
    setTimeout(() => {
       const randomAdUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
       window.location.href = randomAdUrl;
    }, 3000);
  };
  // --------------------------------

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleDownloadClick = () => {
    sessionStorage.setItem('videoUrl', videoUrl);
    sessionStorage.setItem('videoTitle', videoTitle);
    window.open('/download', '_blank');

    const randomAdUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
    setTimeout(() => {
      window.location.href = randomAdUrl;
    }, 2000);
  };

  const handleSearch = () => {
    setSearchParams({ search: searchTerm });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <FaSpinner className="animate-spin text-4xl text-slate-900 mb-4" />
         <p className="text-slate-500 font-medium">Loading contents...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* --- PLAYER SECTION --- */}
      {videoUrl && (
        <div className="mb-12">
           <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-gray-100">
             <div className="relative aspect-video bg-black">
                <video 
                    id="video-player" 
                    className="w-full h-full" 
                    playsInline
                    key={videoUrl}
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
             </div>

             <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                    {videoTitle}
                </h1>
                
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <input 
                            type="text" 
                            value={window.location.href} 
                            readOnly 
                            className="flex-1 px-5 py-3.5 bg-transparent text-slate-600 outline-none text-sm font-medium" 
                        />
                        <button 
                            onClick={handleCopy} 
                            className="px-6 py-3.5 hover:bg-gray-200 text-slate-700 transition-colors border-l border-gray-200"
                            title="Copy Link"
                        >
                            <FaCopy size={18} />
                        </button>
                    </div>

                    <button 
                        onClick={handleDownloadClick} 
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 transition-all duration-200"
                    >
                        <FaDownload />
                        <span>Download Video</span>
                    </button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* --- SEARCH SECTION --- */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-24 py-4 bg-white border border-gray-200 rounded-2xl text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md"
            placeholder="Search videos by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* --- RECENT POSTS SECTION --- */}
      {recentVideos.length > 0 && (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                    <FaFire />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Posts</h2>
            </div>
            
            <div className="relative">
                <div className="flex gap-5 overflow-x-auto pb-6 pt-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {recentVideos.map((video) => (
                        <VideoCard key={`recent-${video.id}`} video={video} onClick={handleCardClick} isRecent={true} />
                    ))}
                </div>
                <div className="absolute top-0 right-0 bottom-6 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:block hidden" />
            </div>
        </div>
      )}

      {/* --- GRID VIDEO SECTION --- */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                {query ? <FaSearch /> : <FaVideo />}
             </div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {query ? `Search Results for "${query}"` : "Recommended For You"}
             </h2>
          </div>
        </div>
        
        {currentVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentVideos.map((video) => (
               <VideoCard key={video.id} video={video} onClick={handleCardClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                <FaSearch className="text-3xl text-gray-300" />
             </div>
             <p className="text-slate-500 font-medium">No videos found matching your search.</p>
             <button 
                onClick={() => {setSearchTerm(''); setSearchParams({});}} 
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
             >
                Clear search
             </button>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-12 pb-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-slate-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <span className="text-slate-500 font-medium text-sm px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-slate-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
}