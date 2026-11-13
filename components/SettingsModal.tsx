
import React from 'react';
import { X, Shield, FolderOpen, Globe, Save } from 'lucide-react';
import { PermissionSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PermissionSettings;
  onUpdateSettings: (newSettings: PermissionSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof PermissionSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Agent Permissions
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
            title="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-400 mb-4">
            Configure the capabilities and access levels for the NanoEdit Agent.
          </p>

          {/* System Folders */}
          <div className="flex items-start gap-4 group relative">
            <div className={`p-2 rounded-lg ${settings.allowSystemAnalysis ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">System Folder Access</span>
                <button 
                  onClick={() => toggleSetting('allowSystemAnalysis')}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${settings.allowSystemAnalysis ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.allowSystemAnalysis ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500">Allow the agent to analyze local folder structures and read file metadata for project context.</p>
            </div>
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-[10px] text-slate-300 rounded shadow-2xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">System Analysis Impact</span>
              Enabling this lets the agent suggest relevant files from your "System Folders" to help automate editing workflows based on local context.
            </div>
          </div>

          {/* Online Tools */}
          <div className="flex items-start gap-4 group relative">
            <div className={`p-2 rounded-lg ${settings.allowOnlineTools ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-500'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">Online Tool Analysis</span>
                <button 
                  onClick={() => toggleSetting('allowOnlineTools')}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${settings.allowOnlineTools ? 'bg-purple-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.allowOnlineTools ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500">Enable the agent to fetch and process external URLs and web tool documentation.</p>
            </div>
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-[10px] text-slate-300 rounded shadow-2xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">Web Tool Impact</span>
              Allows the agent to browse documentation from "Analyzed Links" to use external design tools or follow specific branding guides.
            </div>
          </div>

          {/* Auto Save */}
          <div className="flex items-start gap-4 group relative">
            <div className={`p-2 rounded-lg ${settings.allowAutoSave ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
              <Save className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">Auto-Save Edits</span>
                <button 
                  onClick={() => toggleSetting('allowAutoSave')}
                  className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${settings.allowAutoSave ? 'bg-emerald-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.allowAutoSave ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-xs text-slate-500">Automatically save generated images to your session history.</p>
            </div>
            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-[10px] text-slate-300 rounded shadow-2xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none">
              <span className="font-bold text-white block mb-1">Persistence Impact</span>
              When on, your chat history and images are stored in your browser's local storage so you don't lose progress on refresh.
            </div>
          </div>

        </div>
        
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-end">
          <div className="relative group">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Done
            </button>
            <div className="absolute right-0 bottom-full mb-2 w-32 p-2 bg-slate-900 text-[10px] text-white rounded shadow-xl border border-slate-700 invisible group-hover:visible z-50 pointer-events-none text-center">
              Apply settings and return.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
