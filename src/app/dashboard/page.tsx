import ChatPanel from '@/components/dashboard/chat-panel';
import InsightsPanel from '@/components/dashboard/insights-panel';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-8">
      <div className="lg:col-span-4">
        <ChatPanel />
      </div>
      <div className="lg:col-span-3">
        <InsightsPanel />
      </div>
    </div>
  );
}
