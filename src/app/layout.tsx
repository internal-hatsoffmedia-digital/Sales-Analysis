import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { ControlHeader } from '@/components/layout/ControlHeader';
import { QuickAddDrawer } from '@/components/layout/QuickAddDrawer';

export const metadata: Metadata = {
  title: 'Hatsoff Sales & Marketing Control Center',
  description: 'Enterprise internal sales and marketing tracking system for Hatsoff Media Pvt Ltd',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AppProvider>
          <div className="flex min-h-screen">
            <SidebarNav />
            <div className="flex-1 ml-64 flex flex-col min-w-0">
              <ControlHeader />
              <main className="flex-1 mt-16 p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          <QuickAddDrawer />
        </AppProvider>
      </body>
    </html>
  );
}
