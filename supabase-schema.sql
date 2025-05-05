-- Create the user settings table
CREATE TABLE public.user_settings (
                                      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                                      dark_theme BOOLEAN DEFAULT false,
                                      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                                      UNIQUE(user_id)
);

-- Create the bookmarks table
CREATE TABLE public.bookmarks (
                                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                                  url TEXT NOT NULL,
                                  title TEXT,
                                  image_url TEXT,
                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                                  UNIQUE(user_id, url)
);

-- Set up Row Level Security policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
                                       USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
                                              USING (auth.uid() = user_id);

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.bookmarks FOR SELECT
                                   USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
ON public.bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
ON public.bookmarks FOR UPDATE
                                          USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.bookmarks FOR DELETE
USING (auth.uid() = user_id);