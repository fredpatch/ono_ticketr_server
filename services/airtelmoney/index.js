import dotenv from "dotenv";
dotenv.config();

const fetchAccessToken = async () => {
  const inputBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_KEY,
    grant_type: "client_credentials",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  try {
    const response = await fetch(
      "https://openapiuat.airtel.africa/auth/oauth2/token",
      {
        method: "POST",
        body: JSON.stringify(inputBody),
        headers: headers,
      }
    );
    const data = await response.json();
    console.log("Access Token:", data);
    return data.access_token; // Save this token for later use
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Unable to authenticate with Airtel API");
  }
};

export default fetchAccessToken;

