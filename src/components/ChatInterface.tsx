
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  requestId: string;
  currentUserId?: string; // Made optional
  disabled?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  requestId, 
  currentUserId,
  disabled = false 
}) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { getRequestById, sendMessage } = useRequest();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Get request data
  const request = getRequestById(requestId);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [request?.chatHistory]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || (!user && !currentUserId) || !request) return;
    
    // Use provided currentUserId or get from auth context
    const userId = currentUserId || user?.id;
    if (!userId) return;
    
    sendMessage(requestId, userId, message);
    setMessage("");
  };

  // Format timestamp for display
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (!request) {
    return <div className="p-4 text-center text-gray-500">Chat not available</div>;
  }

  // Get the user ID to use for message comparison
  const userId = currentUserId || user?.id;

  return (
    <div className="flex flex-col h-[400px] border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-3 bg-medical text-white font-medium border-b flex items-center">
        <div className="flex-1">
          Live Chat - Request #{requestId.substring(0, 8)}
        </div>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {!request.chatHistory || request.chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No messages yet. Start the conversation!
          </div>
        ) : (
          request.chatHistory.map((msg: any) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] p-3 rounded-lg",
                msg.senderId === userId
                  ? "ml-auto bg-blue-100 text-blue-900 rounded-br-none"
                  : "mr-auto bg-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              <div className="text-sm">{msg.text}</div>
              <div className="text-xs mt-1 opacity-60 text-right">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
      
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-3 flex items-center gap-2"
      >
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-medical hover:bg-medical-dark"
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
