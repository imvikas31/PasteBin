-- Create pastes table for user-specific paste storage
CREATE TABLE public.pastes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  access_key TEXT,
  expiration TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own pastes" 
ON public.pastes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pastes" 
ON public.pastes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pastes" 
ON public.pastes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pastes" 
ON public.pastes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Public pastes can be viewed by anyone when not private
CREATE POLICY "Public pastes are viewable by everyone" 
ON public.pastes 
FOR SELECT 
USING (is_private = false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pastes_updated_at
BEFORE UPDATE ON public.pastes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();