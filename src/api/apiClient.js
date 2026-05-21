import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchTwitterData = async (query, searchType = "People") => {
  try {
    const response = await apiClient.get(
      `/twitter/fetch-users?query=${encodeURIComponent(
        query
      )}&search_type=${searchType}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchLinkedInData = async (query, searchType = "People") => {
  try {
    const response = await apiClient.get(
      `/linkedin/fetch-users?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchTikTokData = async (query) => {
  try {
    const response = await apiClient.get(
      `/tiktok/fetch-users?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchFacebookData = async (query) => {
  try {
    const response = await apiClient.get(
      `/facebook/fetch-users?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchFacebookProfileUsers = async (query) => {
  try {
    const response = await apiClient.get(
      `/facebook/fetch-profile-users?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchInstagramData = async (query) => {
  try {
    const response = await apiClient.get(
      `/instagram/search-profile?search_query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const resolveSearchQuery = async (query, mode = "person") => {
  try {
    const response = await apiClient.get(
      `/search/resolve?query=${encodeURIComponent(query)}&mode=${mode}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const lookupProfiles = async (username, platforms, mode = "person") => {
  try {
    const response = await apiClient.get(
      `/lookup/profiles?username=${encodeURIComponent(username)}&platforms=${platforms.join(",")}&mode=${mode}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
