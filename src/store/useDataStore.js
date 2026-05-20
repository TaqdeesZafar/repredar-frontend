import { create } from "zustand";
import {
  fetchTwitterData,
  fetchLinkedInData,
  fetchTikTokData,
  fetchFacebookData,
  fetchFacebookProfileUsers,
  fetchInstagramData,
} from "../api/apiClient";

const useDataStore = create((set, get) => ({
  // Data per platform with associated query
  twitterData: null,
  linkedinData: null,
  tiktokData: null,
  facebookData: null,
  facebookProfileData: null,
  instagramData: null,
  googleBusinessData: null,

  // State controls
  loading: false,
  error: null,
  activeTab: "X",

  // Tab switching
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Clear
  resetData: () => {
    set({
      twitterData: null,
      linkedinData: null,
      tiktokData: null,
      facebookData: null,
      facebookProfileData: null,
      instagramData: null,
      googleBusinessData: null,
      error: null,
    });
  },

  // Generic loading reset
  setLoadingFalse: () => set({ loading: false, error: null }),

  // Log search function
  logSearch: async (platform, searchQuery, resultCount = null, filters = {}) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/search-logs/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          searchQuery,
          resultCount,
          filters
        })
      });
    } catch (error) {
      console.error('Error logging search:', error);
    }
  },

  getTwitterData: async (query) => {
    const { twitterData, logSearch } = get();

    if (twitterData && twitterData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchTwitterData(query);
      const resultCount = result?.twitterUsers?.timeline?.length || 0;
      await logSearch('TWITTER', query, resultCount);
      set({ twitterData: { ...result, query }, loading: false });
    } catch (error) {
      await logSearch('TWITTER', query, 0, { error: error.message });
      set({ error: error.message || "Twitter fetch failed", loading: false });
    }
  },

  // LinkedIn
  getLinkedInData: async (query) => {
    const { linkedinData, logSearch } = get();
    if (linkedinData && linkedinData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchLinkedInData(query);
      const resultCount = result?.linkedinUsers?.length || 0;
      await logSearch('LINKEDIN', query, resultCount);
      // Show results immediately
      set({ linkedinData: { ...result, query }, loading: false });

      // Enrich profile pictures in background
      const peopleUrls = (result?.linkedinUsers || [])
        .filter(u => u.type === 'Person' && u.url)
        .map(u => u.url);

      if (peopleUrls.length > 0) {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/linkedin/enrich-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: peopleUrls }),
          });
          const { enriched } = await res.json();
          if (enriched?.length) {
            const enrichMap = {};
            enriched.forEach(e => { enrichMap[e.url] = e; });
            set(state => {
              const updated = (state.linkedinData?.linkedinUsers || []).map(u => {
                const e = enrichMap[u.url];
                if (!e) return u;
                return {
                  ...u,
                  ...(e.profile_image_url ? { profile_picture: [{ url: e.profile_image_url }] } : {}),
                  ...(e.follower_count ? { follower_count: e.follower_count } : {}),
                };
              });
              // Re-sort after enrichment since follower counts may have updated
              updated.sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));
              return {
                linkedinData: { ...state.linkedinData, linkedinUsers: updated },
              };
            });
          }
        } catch {
          // enrichment failed silently — placeholder avatars stay
        }
      }
    } catch (error) {
      await logSearch('LINKEDIN', query, 0, { error: error.message });
      set({ error: error.message || "LinkedIn fetch failed", loading: false });
    }
  },

  getTikTokData: async (query) => {
    const { tiktokData, logSearch } = get();
    console.log("tiktok : ", tiktokData);
    if (tiktokData && tiktokData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchTikTokData(query);
      const resultCount = result?.tiktokUsers?.length || 0;
      await logSearch('TIKTOK', query, resultCount);
      set({ tiktokData: { ...result, query }, loading: false });
    } catch (error) {
      await logSearch('TIKTOK', query, 0, { error: error.message });
      set({ error: "Failed to fetch TikTok data", loading: false });
      console.error(error);
    }
  },

  // Facebook
  getFacebookData: async (query) => {
    const { facebookData, logSearch } = get();

    if (facebookData && facebookData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchFacebookData(query);
      const resultCount = result?.facebookUsers?.length || 0;
      await logSearch('FACEBOOK', query, resultCount);
      set({ facebookData: { ...result, query }, loading: false });
    } catch (error) {
      await logSearch('FACEBOOK', query, 0, { error: error.message });
      set({ error: "Failed to fetch Facebook data", loading: false });
      console.error(error);
    }
  },

  getFacebookProfileData: async (query) => {
    const { facebookProfileData, logSearch } = get();

    if (facebookProfileData && facebookProfileData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchFacebookProfileUsers(query);
      const resultCount = result?.facebookUsers?.length || 0;
      await logSearch('FACEBOOK_PROFILE', query, resultCount);
      set({ facebookProfileData: { ...result, query }, loading: false });
    } catch (error) {
      await logSearch('FACEBOOK_PROFILE', query, 0, { error: error.message });
      set({ error: "Failed to fetch Facebook profile data", loading: false });
      console.error(error);
    }
  },

  getInstagramData: async (query) => {
    const { instagramData, logSearch } = get();

    if (instagramData && instagramData.query === query) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const result = await fetchInstagramData(query);
      const resultCount = result?.instagramUsers?.length || 0;
      await logSearch('INSTAGRAM', query, resultCount);
      set({ instagramData: { ...result, query }, loading: false });
    } catch (error) {
      await logSearch('INSTAGRAM', query, 0, { error: error.message });
      set({ error: "Failed to fetch Instagram data", loading: false });
      console.error(error);
    }
  },

  setGoogleBusinessData: (data) => set({ googleBusinessData: data }),
}));

export default useDataStore;
