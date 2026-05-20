export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (err) {
    console.error("Invalid token format", err);
    return true;
  }
};


export const userInfo = async() => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Fetch user profile data
      const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        
        
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user information")
      }

    const userResponseData = await userResponse.json();
    return userResponseData;
  } catch (err) {
    console.error("Invalid token format", err);
    return null;
  }
}
