import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Github, Heart, LogOut } from "lucide-react";

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg glow-effect">
              <FileText size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PasteBin</h1>
              <p className="text-sm text-muted-foreground">Simple & Secure Text Sharing</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            {user && (
  <span className="text-sm text-muted-foreground">
    Welcome, {user.user_metadata?.username || user.email}
  </span>
)}

            {/* <Button variant="ghost" size="sm">
              <a href="#PasteArea.tsx">Paste</a>
              
            </Button> */}
            <Button variant="ghost" size="sm">
              <a href="#recent-pastes">Recent Pastes</a>
              
            </Button>
            {/* <Button variant="ghost" size="sm">
              <a href="#about">About</a>
              
            </Button> */}
    
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            )}
          </nav>

          <div className="flex md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};