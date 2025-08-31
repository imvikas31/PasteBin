import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { PasteArea } from "@/components/PasteArea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Eye, Lock, Trash2 } from "lucide-react";

interface SavedPaste {
  id: string;
  title: string;
  content: string;
  is_private: boolean;
  access_key: string | null;
  expiration: string;
  created_at: string;
  views: number;
  user_id: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedPastes, setSavedPastes] = useState<SavedPaste[]>([]);
  const [isLoadingPastes, setIsLoadingPastes] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserPastes();
    }
  }, [user]);

  const fetchUserPastes = async () => {
    if (!user) return;
    
    setIsLoadingPastes(true);
    try {
      const { data, error } = await supabase
        .from("pastes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setSavedPastes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch your pastes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPastes(false);
    }
  };

  const handleSavePaste = async (content: string, title: string, isPrivate: boolean, expiration: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save pastes",
        variant: "destructive",
      });
      return;
    }

    try {
      const accessKey = isPrivate ? Math.random().toString(36).substring(2, 15) : null;
      
      const { data, error } = await supabase
        .from("pastes")
        .insert({
          title,
          content,
          is_private: isPrivate,
          access_key: accessKey,
          expiration,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: isPrivate 
          ? `Private paste saved with access key: ${accessKey}`
          : "Paste saved successfully",
      });

      fetchUserPastes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save paste",
        variant: "destructive",
      });
    }
  };

  const handleDeletePaste = async (id: string) => {
    try {
      const { error } = await supabase
        .from("pastes")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Paste deleted successfully",
      });

      fetchUserPastes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete paste",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            Share Text Instantly
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Paste, save, and share your text snippets, code, or any content securely with expiration control and privacy options.
          </p>
        </div>

        {/* Main Paste Area */}
        <PasteArea onSave={handleSavePaste} />

        {/* Recent Pastes */}
        {savedPastes.length > 0 && (
          <div id="recent-pastes" className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Recent Pastes</h3>
            <div className="grid gap-4 max-w-4xl mx-auto">
              {savedPastes.map((paste) => (
                <Card key={paste.id} className="p-4 paste-area hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg truncate">{paste.title}</h4>
                        <div className="flex items-center gap-1">
                          {paste.is_private ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Lock size={12} />
                              Private
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Eye size={12} />
                              Public
                            </Badge>
                          )}
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock size={12} />
                            {paste.expiration === 'never' ? 'Never expires' : `Expires in ${paste.expiration}`}
                          </Badge>
                          {paste.is_private && paste.access_key && (
                            <Badge variant="outline" className="text-xs">
                              Key: {paste.access_key}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 font-mono">
                        {paste.content.substring(0, 100)}
                        {paste.content.length > 100 && '...'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created {formatDate(paste.created_at)}</span>
                        <span>{paste.content.length} characters</span>
                        <span>{paste.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePaste(paste.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div id="about" className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center paste-area">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
              <Lock className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Private & Secure</h3>
            <p className="text-sm text-muted-foreground">
              Control who can see your pastes with privacy settings and secure storage.
            </p>
          </Card>
          
          <Card className="p-6 text-center paste-area">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Auto Expiration</h3>
            <p className="text-sm text-muted-foreground">
              Set expiration times for your pastes to automatically clean up sensitive data.
            </p>
          </Card>
          
          <Card className="p-6 text-center paste-area">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/20 rounded-lg flex items-center justify-center">
              <Eye className="text-primary" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Share your pastes instantly with direct links and copy functionality.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 PasteBin ||  Built with ❤️ By Vikas Singh For Easy Text Sharing || All rights reserved by Admin.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
