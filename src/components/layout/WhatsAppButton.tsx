import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="#"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
      aria-label="WhatsApp"
    >
      <MessageCircle size={34} />
    </a>
  );
}