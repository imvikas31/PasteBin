import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Save, Share2, Timer, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasteAreaProps {
  onSave?: (content: string, title: string, isPrivate: boolean, expiration: string) => void;
}

export const PasteArea = ({ onSave }: PasteAreaProps) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [expiration, setExpiration] = useState("never");
  const { toast } = useToast();

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to save",
        variant: "destructive",
      });
      return;
    }

    onSave?.(content, title || "Untitled Paste", isPrivate, expiration);
    
    toast({
      title: "Paste Saved!",
      description: "Your paste has been saved successfully",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && content.trim()) {
      try {
        await navigator.share({
          title: title || "Shared Paste",
          text: content,
        });
      } catch (err) {
        // Fallback to copy URL or content
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Controls */}
      <Card className="p-6 paste-area">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter a title for your paste (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button
                variant={isPrivate ? "default" : "secondary"}
                size="sm"
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center gap-2"
              >
                {isPrivate ? <EyeOff size={16} /> : <Eye size={16} />}
                {isPrivate ? "Private" : "Public"}
              </Button>
              <select 
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground border border-border text-sm"
              >
                <option value="never">Never Expire</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
                <option value="1m">1 Month</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Paste Area */}
      <Card className="paste-area overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Paste Content</h2>
              {content.length > 0 && (
                <Badge variant="secondary">
                  {content.length.toLocaleString()} characters
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!content.trim()}
                className="h-8 w-8 p-0"
              >
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                disabled={!content.trim()}
                className="h-8 w-8 p-0"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
          
          <Textarea
            placeholder="Paste or type your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-0 bg-transparent p-0 text-base leading-relaxed focus-visible:ring-0"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Cascadia, "Cascadia Code", Roboto Mono, Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", Consolas, monospace' }}
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={handleSave}
          className="glow-effect flex items-center gap-2 px-8 py-3 text-base font-medium"
          disabled={!content.trim()}
        >
          <Save size={18} />
          Save Paste
        </Button>
        <Button 
          variant="secondary"
          onClick={handleCopy}
          disabled={!content.trim()}
          className="flex items-center gap-2 px-8 py-3 text-base"
        >
          <Copy size={18} />
          Copy Content
        </Button>
      </div>
    </div>
  );
};