"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import SettingsPanel from "./SettingsPanel";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
          {children}
        </main>
        <footer className="py-8 text-center text-xs text-ink-muted dark:text-cream-soft/60 font-sans">
          <p>Read with intention · Share with love</p>
        </footer>
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
