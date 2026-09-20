import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { VehiclesView } from './components/vehicles/VehiclesView';
import { TicketsView } from './components/tickets/TicketsView';
import { SchedulesView } from './components/schedules/SchedulesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CreateFaultModal } from './components/tickets/CreateFaultModal';
import { AddVehicleModal } from './components/vehicles/AddVehicleModal';
import { BookServiceModal } from './components/schedules/BookServiceModal';
import { TicketDetailModal } from './components/tickets/TicketDetailModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'vehicles' && <VehiclesView />}
      {activeTab === 'tickets' && <TicketsView />}
      {activeTab === 'schedules' && <SchedulesView />}
      {activeTab === 'analytics' && <AnalyticsView />}

      {/* Global Modals */}
      <CreateFaultModal />
      <AddVehicleModal />
      <BookServiceModal />
      <TicketDetailModal />
    </main>
  );
};

const AppShell: React.FC = () => {
  const { theme } = useApp();

  return (
    <div data-theme={theme} className="min-h-screen app-canvas flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
