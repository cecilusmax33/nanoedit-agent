
import React, { useState } from 'react';
import { Folder, Link as LinkIcon, Plus, Settings, ChevronRight, ChevronDown, Trash2, RotateCcw } from 'lucide-react';
import { Asset } from '../types';

interface SidebarProps {
  assets: Asset[];
  onAddAsset: (asset: Asset) => void;
  onRemoveAsset: (id: string) => void;
  onOpenSettings: () => void;
  onResetProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ assets, onAddAsset, onRemoveAsset, onOpenSettings, onResetProject }) => {
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [isLinksOpen, setIsLinksOpen] = useState(true);

  const handleAddLink = () => {
    const url = prompt("Enter URL to analyze:");
    if (url) {
      onAddAsset({
        id: Date.now().toString(),
        name: new URL(url).hostname,
        type: 'link',
        url: url
      });
    }
  };

  const handleAddFolder = () => {
    const name = prompt("Enter system folder name (simulation):");
    if (name) {
      onAddAsset({
        id: Date.now().toString(),
        name: name,
        type: 'folder',
        path: `/System/Users/Dev/${name}`
      });
    }
  };

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">N</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100">NanoEdit</h1>
        </div>
        <div className="relative group">
          <button 
            onClick={onResetProject}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
            <span className="font-bold text-white block mb-1">Reset Project</span>
            Permanently clear all chat history and reset asset context sources.
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* System Folders Section */}
        <div>
          <div 
            className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 cursor-pointer hover:text-slate-300"
            onClick={() => setIsFoldersOpen(!isFoldersOpen)}
          >
            <span>System Context</span>
            {isFoldersOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          
          {isFoldersOpen && (
            <div className="space-y-1">
              {assets.filter(a => a.type === 'folder').map(asset => (
                <div key={asset.id} className="group flex items-center justify-between p-2 rounded hover:bg-slate-800 text-slate-300 transition-colors relative">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm truncate" title={asset.path}>{asset.name}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveAsset(asset.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <div className="absolute left-full ml-2 top-0 w-40 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
                    Remove this folder context from the agent's knowledge.
                  </div>
                </div>
              ))}
              <div className="relative group">
                <button 
                  onClick={handleAddFolder}
                  className="w-full flex items-center gap-2 p-2 text-sm text-slate-500 hover:text-blue-400 hover:bg-slate-800/50 rounded dashed border border-transparent hover:border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Folder Source</span>
                </button>
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
                  <span className="font-bold text-white block mb-1">Local Analysis</span>
                  Simulate adding a system folder to help the agent understand your project file structure.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Links Section */}
        <div>
          <div 
            className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 cursor-pointer hover:text-slate-300"
            onClick={() => setIsLinksOpen(!isLinksOpen)}
          >
            <span>Analyzed Links</span>
            {isLinksOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          
          {isLinksOpen && (
            <div className="space-y-1">
              {assets.filter(a => a.type === 'link').map(asset => (
                <div key={asset.id} className="group flex items-center justify-between p-2 rounded hover:bg-slate-800 text-slate-300 transition-colors relative">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <LinkIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-sm truncate">{asset.name}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveAsset(asset.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="relative group">
                <button 
                  onClick={handleAddLink}
                  className="w-full flex items-center gap-2 p-2 text-sm text-slate-500 hover:text-purple-400 hover:bg-slate-800/50 rounded dashed border border-transparent hover:border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link Tool</span>
                </button>
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
                  <span className="font-bold text-white block mb-1">External Context</span>
                  Provide documentation or reference URLs for the agent to crawl and use for your requests.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800">
        <div className="relative group">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Permission Settings</span>
          </button>
          <div className="absolute left-0 bottom-full mb-2 w-56 p-2 bg-slate-800 text-[10px] text-slate-300 rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
            <span className="font-bold text-white block mb-1">Privacy & Guardrails</span>
            Configure the agent's access to local files, online tools, and auto-save behavior.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
