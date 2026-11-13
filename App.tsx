import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { Asset, Message, MessageRole, PermissionSettings } from './types';
import { generateImageEdit } from './services/geminiService';

const DEFAULT_SETTINGS: PermissionSettings = {
  allowSystemAnalysis: false,
  allowOnlineTools: false,
  allowAutoSave: true,
};

const STORAGE_KEYS = {
  ASSETS: 'nanoedit_assets',
  MESSAGES: 'nanoedit_messages',
  SETTINGS: 'nanoedit_settings'
};

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse assets from storage", e);
        }
      }
    }
    return [
      { id: '1', name: 'Project Assets', type: 'folder', path: '/System/Projects/NanoEdit' },
      { id: '2', name: 'Design Specs', type: 'folder', path: '/System/Docs/Specs' },
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse messages from storage", e);
        }
      }
    }
    return [];
  });

  const [settings, setSettings] = useState<PermissionSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse settings from storage", e);
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [currentModel, setCurrentModel] = useState('gemini-2.5-flash-image');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    if (settings.allowAutoSave) {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    }
  }, [assets, settings.allowAutoSave]);

  useEffect(() => {
    if (settings.allowAutoSave) {
      try {
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save messages to localStorage (quota exceeded?)", e);
      }
    }
  }, [messages, settings.allowAutoSave]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const handleAddAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const handleResetProject = () => {
    if (window.confirm("Are you sure you want to clear the current project? This will delete all chat history and reset assets.")) {
      setMessages([]);
      setAssets([
         { id: '1', name: 'Project Assets', type: 'folder', path: '/System/Projects/NanoEdit' },
         { id: '2', name: 'Design Specs', type: 'folder', path: '/System/Docs/Specs' },
      ]);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.ASSETS);
    }
  };

  // Helper to find the last valid image in the chat history to use as context
  const getLastImageContext = (): string | undefined => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].imageUrl && messages[i].role !== MessageRole.SYSTEM) {
        return messages[i].imageUrl;
      }
    }
    return undefined;
  };

  const handleSendMessage = async (text: string, file?: File) => {
    // Create User Message
    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: MessageRole.USER,
      text: text,
      timestamp: Date.now(),
    };

    let base64Image: string | undefined = undefined;

    if (file) {
      // If user uploaded a file, convert to base64
      try {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newUserMsg.imageUrl = base64Image;
      } catch (err) {
        console.error("File reading failed", err);
        return;
      }
    }

    setMessages(prev => [...prev, newUserMsg]);
    setIsProcessing(true);

    try {
      // Determine context:
      // 1. If user provided a file, that is the source.
      // 2. If no file, look back in history for the last image to "edit".
      let contextImage = base64Image;
      if (!contextImage) {
        contextImage = getLastImageContext();
      }

      if (!contextImage && !text) {
        // Edge case: no image, no text (should be blocked by UI)
        setIsProcessing(false);
        return;
      }

      // Pass the selected model to the service
      const result = await generateImageEdit(text, contextImage, 'image/png', currentModel);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: result.text,
        imageUrl: result.imageUrl,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "I encountered an error processing your request. Please ensure your API key is valid and try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        assets={assets}
        onAddAsset={handleAddAsset}
        onRemoveAsset={handleRemoveAsset}
        onOpenSettings={() => setSettingsOpen(true)}
        onResetProject={handleResetProject}
      />
      
      <main className="flex-1 flex flex-col h-full min-w-0">
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          currentModel={currentModel}
          onModelChange={setCurrentModel}
        />
      </main>

      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};

export default App;