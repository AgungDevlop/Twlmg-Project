import React from 'react';
import { FaPlay, FaUpload, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased bg-gray-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center gap-3 cursor-default group">
          <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 bg-slate-900 rounded-xl group-hover:rotate-6 group-hover:scale-105 shadow-lg shadow-slate-900/20">
            <FaPlay className="text-sm text-white ml-0.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Video Twimg <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Pro</span>
          </h1>
        </div>
        <a
          href="https://viplay.top"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/25 active:scale-95"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaUpload className="text-xs" />
          <span>Upload</span>
        </a>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full h-full opacity-100 transition-opacity duration-500">
          {children}
        </div>
      </main>

      <div id="install-modal" class="hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
        <div class="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl transform transition-all scale-100 animate-bounce-short">
            <div class="flex items-start gap-4 mb-5">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-white">Install App</h3>
                    <p class="text-sm text-slate-400 mt-1">Tambahkan ke layar utama untuk akses instan dan fullscreen.</p>
                </div>
            </div>
            
            <div class="flex gap-3 mt-2">
                <button id="btn-close" class="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition font-medium text-sm">
                    Nanti Saja
                </button>
                <button id="btn-install" class="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition font-medium text-sm">
                    Install Sekarang
                </button>
            </div>
        </div>
    </div>

      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-500 font-medium">
            © 2024 No Ads Stream. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-slate-900 transition-colors">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-slate-900 transition-colors">
              <FaGithub size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-slate-900 transition-colors">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Layout;
