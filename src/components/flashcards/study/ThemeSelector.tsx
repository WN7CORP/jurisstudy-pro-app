
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ThemeSelectorProps {
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
  uniqueThemes: string[];
  selectedThemes: string[];
  handleThemeSelection: (theme: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showThemeSelector,
  setShowThemeSelector,
  uniqueThemes,
  selectedThemes,
  handleThemeSelection,
}) => {
  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowThemeSelector(!showThemeSelector)}
      >
        Temas ({selectedThemes.length})
      </Button>
      {showThemeSelector && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border p-2 z-50">
          <div className="max-h-64 overflow-y-auto">
            {uniqueThemes.map((theme) => (
              <div key={theme} className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id={`theme-${theme}`} 
                  checked={selectedThemes.includes(theme)}
                  onCheckedChange={() => handleThemeSelection(theme)}
                />
                <label 
                  htmlFor={`theme-${theme}`}
                  className="text-sm cursor-pointer"
                >
                  {theme}
                </label>
              </div>
            ))}
          </div>
          <Button 
            className="w-full mt-2"
            size="sm"
            onClick={() => setShowThemeSelector(false)}
          >
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
};
