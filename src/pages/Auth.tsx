import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password || !username) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },   // ✅ Save username in user_metadata
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        throw error;
      }
    } else {
      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      });
    }
  } catch (error: any) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">PasteBin</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
          <TabsContent value="signin">
  <form onSubmit={handleSignIn} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="signin-email">Email</Label>
      <Input
        id="signin-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signin-password">Password</Label>
      <Input
        id="signin-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
    </div>
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Signing in..." : "Sign In"}
    </Button>
  </form>
</TabsContent>


            
            <TabsContent value="signup">
  <form onSubmit={handleSignUp} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="signup-username">Username</Label>
      <Input
        id="signup-username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username"
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-email">Email</Label>
      <Input
        id="signup-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-password">Password</Label>
      <Input
        id="signup-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password (min 6 characters)"
        minLength={6}
        required
      />
    </div>
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Creating account..." : "Sign Up"}
    </Button>
  </form>
</TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;