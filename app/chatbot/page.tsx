// app/chatbot/page.tsx
import Chat from "../../components/Chat";

export default function ChatbotPage() {
  // Neutral headerless page: only content below
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Chat />
      </div>
    </section>
  );
}
