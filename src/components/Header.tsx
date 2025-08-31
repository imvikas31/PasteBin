import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg glow-effect">
              <FileText size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PasteBin</h1>
              <p className="text-sm text-muted-foreground">
                Simple & Secure Text Sharing
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className=" hidden md:flex items-center gap-4">
            {user && (
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.username || user.email}
              </span>
            )}

            <Button variant="ghost" size="sm">
              <a href="#recent-pastes">Recent Pastes</a>
            </Button>

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

          {/* Mobile Nav (Dropdown) */}
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 ">
                {user && (
                  <DropdownMenuItem disabled>
                    Welcome, {user.user_metadata?.username || user.email}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Button variant="ghost" size="sm">
              <a href="#recent-pastes">Recent Pastes</a>
            </Button>
                  
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
