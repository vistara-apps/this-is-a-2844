import { ReactNode } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function DashboardLayout({ children, activeView, onViewChange }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
