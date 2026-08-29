/* ==========================================================================
   CourierHub - Supabase Cloud Backend & Realtime Integration
   ========================================================================== */

const SUPABASE_URL = 'https://siudmczzugjyeutzcexu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWRtY3p6dWdqeWV1dHpjZXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjA0MTksImV4cCI6MjEwMzU5NjQxOX0.nrA8rdhCAl06SJxpNEizeUkP3mwMwh6P8TCpkhH7vkI';

let supabase = null;

if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export const SupabaseService = {
  client: supabase,
  isAvailable: () => !!supabase,

  // --- AUTHENTICATION & SUPABASE NATIVE OTP ---
  async signUp(username, email, password) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: username,
          dota_id: Math.floor(100000000 + Math.random() * 900000000).toString(),
          rank: 'Legend I',
          region: 'SEA',
          avatar: '🔥'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async verifySignupOtp(email, token) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    if (error) throw error;
    return data;
  },

  async sendPasswordResetOtp(email) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  async verifyPasswordResetOtp(email, token) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  async signIn(emailOrUsername, password) {
    if (!supabase) throw new Error('Supabase client not initialized');
    let email = emailOrUsername;
    // If user provided a username without '@', resolve email or append default domain
    if (!email.includes('@')) {
      // Try to look up profile by username
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .maybeSingle();
      if (profile && profile.email) {
        email = profile.email;
      } else {
        email = `${emailOrUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}@courierhub.gg`;
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  },

  async getSession() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getUserProfile(userId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async updateProfile(userId, updates) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
    return data;
  },

  // --- LOBBIES ---
  async fetchLobbies() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('lobbies')
      .select('*, lobby_members(*)')
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async createLobby(lobbyData) {
    if (!supabase) throw new Error('Supabase not available');
    const { data, error } = await supabase
      .from('lobbies')
      .insert(lobbyData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // --- COMMUNITY CHAT ---
  async fetchCommunityMessages(limit = 50) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('community_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) return [];
    return data;
  },

  async sendCommunityMessage(msgData) {
    if (!supabase) throw new Error('Supabase not available');
    const { data, error } = await supabase
      .from('community_messages')
      .insert(msgData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // --- REALTIME SUBSCRIPTION ---
  subscribeCommunityMessages(onNewMessage) {
    if (!supabase) return null;
    return supabase
      .channel('public:community_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, payload => {
        onNewMessage(payload.new);
      })
      .subscribe();
  }
};
