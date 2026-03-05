import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { InfobarProvider } from '@/components/ui/infobar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Todo App Dashboard',
  description: 'Simple todo app with Next.js and Shadcn',
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <InfobarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
        <InfoSidebar side='right' />
      </InfobarProvider>
    </SidebarProvider>
  );
}
