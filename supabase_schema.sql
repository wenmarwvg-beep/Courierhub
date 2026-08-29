-- ============================================================================
-- COURIERHUB - SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Copy and run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  dota_id TEXT DEFAULT '109283742',
  rank TEXT DEFAULT 'Legend I',
  region TEXT DEFAULT 'SEA',
  avatar TEXT DEFAULT '🔥',
  avatar_frame TEXT DEFAULT 'avatar-frame-legend',
  bio TEXT DEFAULT 'Ready to party on CourierHub!',
  win_rate NUMERIC DEFAULT 52.5,
  games_played INT DEFAULT 120,
  is_online BOOLEAN DEFAULT true,
  online_status TEXT DEFAULT 'online',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Dota Match Lobbies Table
CREATE TABLE IF NOT EXISTS public.lobbies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'SEA',
  rank_tier TEXT NOT NULL DEFAULT 'Legend',
  game_mode TEXT NOT NULL DEFAULT 'Ranked All Pick',
  is_password_protected BOOLEAN DEFAULT false,
  lobby_password TEXT,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  host_avatar TEXT DEFAULT '🔥',
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed'
  radiant_slots INT DEFAULT 5,
  dire_slots INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Lobby Members Table
CREATE TABLE IF NOT EXISTS public.lobby_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lobby_id TEXT REFERENCES public.lobbies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  team TEXT NOT NULL CHECK (team IN ('radiant', 'dire', 'spectator')),
  slot_number INT NOT NULL,
  player_name TEXT NOT NULL,
  player_rank TEXT DEFAULT 'Legend',
  player_avatar TEXT DEFAULT '🔥',
  player_role TEXT DEFAULT 'Core',
  is_ready BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lobby_id, team, slot_number),
  UNIQUE(lobby_id, user_id)
);

-- 5. Create Community Chat Messages Table
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '🔥',
  author_rank TEXT DEFAULT 'Legend',
  text TEXT NOT NULL,
  reply_to_id UUID REFERENCES public.community_messages(id) ON DELETE SET NULL,
  reply_preview JSONB,
  lobby_embed JSONB,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Private Direct Messages Table
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Party Finder Queue Table
CREATE TABLE IF NOT EXISTS public.party_finder (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  host_avatar TEXT DEFAULT '🔥',
  host_rank TEXT DEFAULT 'Legend',
  title TEXT NOT NULL,
  region TEXT DEFAULT 'SEA',
  roles_needed TEXT[] DEFAULT ARRAY['Core', 'Support'],
  current_size INT DEFAULT 1,
  max_size INT DEFAULT 5,
  status TEXT DEFAULT 'looking',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_finder ENABLE ROW LEVEL SECURITY;

-- Public Read & Write Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Lobbies are viewable by everyone" ON public.lobbies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create lobbies" ON public.lobbies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Lobby hosts can update their lobbies" ON public.lobbies FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Lobby hosts can delete their lobbies" ON public.lobbies FOR DELETE USING (auth.uid() = host_id);

CREATE POLICY "Lobby members are viewable by everyone" ON public.lobby_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can join lobbies" ON public.lobby_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can leave or update their lobby slot" ON public.lobby_members FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Community messages are viewable by everyone" ON public.community_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post community messages" ON public.community_messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own messages" ON public.community_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON public.community_messages FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their direct messages" ON public.direct_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send direct messages" ON public.direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Party finder posts are viewable by everyone" ON public.party_finder FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create party requests" ON public.party_finder FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Party hosts can update party requests" ON public.party_finder FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Party hosts can delete party requests" ON public.party_finder FOR DELETE USING (auth.uid() = host_id);

-- 9. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, email, dota_id, rank, region, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'dota_id', (100000000 + floor(random() * 900000000))::text),
    COALESCE(NEW.raw_user_meta_data->>'rank', 'Legend I'),
    COALESCE(NEW.raw_user_meta_data->>'region', 'SEA'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', '🔥')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Enable Supabase Realtime for Chat and Lobbies
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobbies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_finder;
