import { useState, useEffect } from 'react';
import { AITool } from './data/aiData';
import { AppContainer } from './AppContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToolFormData } from './types/tool';

export function AppRouter() {

  // Shared state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('nexus_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [customTools, setCustomTools] = useState<AITool[]>(() => {
    const saved = localStorage.getItem('customTools');
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply theme
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Save custom tools
  useEffect(() => {
    localStorage.setItem('customTools', JSON.stringify(customTools));
  }, [customTools]);

  // Apply font size on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('nexus_font_size') || 'medium';
    document.documentElement.setAttribute('data-font-size', savedFontSize);
  }, []);

  const addCustomTool = (toolData: ToolFormData) => {
    const newTool: AITool = {
      id: `custom-${Date.now()}`,
      name: toolData.name,
      description: toolData.description,
      url: toolData.url,
      category: toolData.category,
      logo: toolData.logo,
      tags: toolData.tags,
      domain: toolData.domain,
    };
    setCustomTools((prev) => [...prev, newTool]);
  };

  const editCustomTool = (toolId: string, toolData: ToolFormData) => {
    setCustomTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId ? { ...tool, ...toolData } : tool
      )
    );
  };

  const deleteCustomTool = (toolId: string) => {
    setCustomTools((prev) => prev.filter((tool) => tool.id !== toolId));
    setFavorites((prev) => prev.filter((id) => id !== toolId));
  };

  return (
    <ErrorBoundary>
      <AppContainer
        favorites={favorites}
        customTools={customTools}
        onAddTool={addCustomTool}
        onEditTool={editCustomTool}
        onDeleteTool={deleteCustomTool}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
      />
    </ErrorBoundary>
  );
}
