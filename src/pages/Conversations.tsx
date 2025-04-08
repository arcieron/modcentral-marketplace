import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SearchIcon, MessageSquare } from 'lucide-react';
import { Conversation } from '@/types';

const Conversations = () => {
  const [conversations, setConversations] = useState<
    Array<Conversation & { participantName: string; unreadCount: number }>
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
    }
    
    // Mock data for demonstration
    const mockConversations = [
      {
        id: '1',
        participantIds: ['user-123', 'vendor-1'],
        participantName: 'Tech Mods Shop',
        lastMessageAt: new Date().toISOString(),
        lastMessage: 'Thank you for your question! Yes, we do have that in stock.',
        unreadCount: 1
      },
      {
        id: '2',
        participantIds: ['user-123', 'vendor-2'],
        participantName: 'Gaming Accessories',
        lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
        lastMessage: 'Your order has been shipped! You can track it using the following link.',
        unreadCount: 0
      },
      {
        id: '3',
        participantIds: ['user-123', 'vendor-3'],
        participantName: 'Custom Parts',
        lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
        lastMessage: "We'll need about 2-3 business days to create your custom part.",
        unreadCount: 0
      }
    ];
    
    setConversations(mockConversations);
  }, [navigate]);
  
  const filteredConversations = conversations.filter(
    (conversation) => 
      conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  if (!currentUser) {
    return null; // Will redirect to login in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Messages</h1>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
            
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-1 bg-card border rounded-lg overflow-hidden">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <Link 
                    key={conversation.id} 
                    to={`/chat/${conversation.participantIds.find(id => id !== currentUser.id)}`}
                    className="block"
                  >
                    <div className={`p-4 hover:bg-accent/50 flex items-center ${conversation.unreadCount > 0 ? 'bg-accent/20' : ''}`}>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {conversation.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-width-0">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-medium truncate ${conversation.unreadCount > 0 ? 'font-semibold' : ''}`}>
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        </div>
                        
                        <p className={`text-sm truncate ${
                          conversation.unreadCount > 0 
                            ? 'text-foreground' 
                            : 'text-muted-foreground'
                        }`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <Separator />
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">No conversations found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Start chatting with vendors on their profile pages'}
                  </p>
                  
                  <Link to="/shop">
                    <Button variant="secondary" size="sm">Browse Vendors</Button>
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

export default Conversations;
