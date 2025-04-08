
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Send, MoreVertical, ChevronLeft } from 'lucide-react';
import { Message } from '@/types';

const Chat = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [vendorInfo, setVendorInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Scrolls to the bottom of messages
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
    
    // In a real app, fetch the vendor info from API based on vendorId
    setVendorInfo({
      id: vendorId || '',
      name: 'Vendor Store'
    });
    
    // Mock data for demonstration
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: vendorId || '',
        senderName: 'Vendor Store',
        receiverId: 'customer-123',
        content: 'Hello! How can I help you today?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: true
      }
    ];
    
    setMessages(mockMessages);
  }, [vendorId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (!currentUser) {
      toast.error('Please sign in to send messages');
      return;
    }
    
    // In a real app, this would send the message to an API
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: vendorId || '',
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    
    // In a real app, you'd wait for API confirmation
    toast.success('Message sent');
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto bg-card border rounded-lg overflow-hidden flex flex-col h-[calc(100vh-240px)]">
            {/* Chat Header */}
            <div className="p-4 bg-muted border-b flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/shop" className="mr-2 sm:hidden">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {vendorInfo?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{vendorInfo?.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentUser ? 'Online' : 'Sign in to chat'}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to={`/vendor/${vendorId}`}>
                    <DropdownMenuItem>View Vendor Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>Mark All as Read</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Block Vendor</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                <>
                  <div className="text-center my-2">
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                      {formatDate(messages[0].createdAt)}
                    </span>
                  </div>
                  
                  {messages.map((message) => {
                    const isCurrentUser = currentUser && message.senderId === currentUser.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isCurrentUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endOfMessagesRef} />
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      Send a message to start the conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              {currentUser ? (
                <form 
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Please sign in to send messages
                  </p>
                  <Link to="/login">
                    <Button variant="secondary" size="sm">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
