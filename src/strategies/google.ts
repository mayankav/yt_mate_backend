import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { google } from "googleapis";
import axios, { AxiosError } from "axios";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_REDIRECT_URL,
  scope: [
    "email",
    "profile",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ],
};
// action to be taken after verification is done
const verifyFunction = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  const captionId = "AUieDab8ioscCY8p-QDqhF3SwiqToDTUOh_AlywqULxuLNThN98";
  const videoId = "wrHTcjSZQ1Y";
  const apiKey = process.env.GOOGLE_API_KEY;
  const captionsDownloadURL = `https://youtube.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`;
  const captionsListURL = `https://youtube.googleapis.com/youtube/v3/captions?part=id,snippet&videoId=${videoId}&key=${apiKey}`;

  try {
    const youtube = google.youtube({
      version: "v3",
      auth: accessToken, // Pass your accessToken directly for simple requests
    });
    // youtube.captions.list(
    //   {
    //     videoId: videoId,
    //     part: ["id", "snippet"],
    //   },
    //   (error, response) => {
    //     if (error) {
    //       console.log(error);
    //       console.error("Error fetching caption:", error.message);
    //       return;
    //     }

    //     console.log("-------start youtube caption api-----");
    //     console.log(response?.data);
    //     console.log("-------end youtube caption api-----");
    //   }
    // );
    youtube.captions.download(
      {
        id: captionId,
        auth: accessToken,
      },
      (error, response) => {
        if (error) {
          console.log(error);
          console.error("Error downloading caption:", error.message);
          return;
        }

        console.log("-------start youtube caption download api-----");
        console.log(response?.data);
        console.log("-------end youtube caption dow api-----");
      }
    );
    // const response = await axios.get(captionsDownloadURL, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // console.log("-------start youtube caption download api-----");
    // console.log(response.data);
    // console.log("-------end youtube caption download api-----");
  } catch (error) {
    // interface ErrorResponse {
    //   error: {
    //     code: number;
    //     message: string;
    //     errors: Array<{ [key: string]: string }>;
    //   };
    // }
    // if (axios.isAxiosError(error)) {
    //   const axiosError = error as AxiosError;

    //   if (axiosError.response?.data) {
    //     const errorData = axiosError.response.data as ErrorResponse;

    //     if ("error" in errorData) {
    //       const apiError = errorData.error;
    //       console.error("API error code:", apiError.code);
    //       console.error("API error message:", apiError.message);

    //       if (apiError.code === 403) {
    //         console.error("Permission error:", apiError.message);
    //       }
    //     }
    //   }
    // } else {
    //   console.error("Unexpected error:", error);
    // }
    console.log(error);
  }

  done(null, {
    userName: profile.displayName,
  });
};

// Define serialize and deserialize functions outside the verify function
passport.serializeUser((user, done) => {
  try {
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.deserializeUser((id: string, done) => {
  // In a real-world scenario, you might fetch additional user details based on the id
  // However, since you don't have a backend model, you can simply pass the user object stored in the session during serialization
  done(null, id);
});

if (googleStrategyOptions.clientID && googleStrategyOptions.clientSecret) {
  passport.use(new GoogleStrategy(googleStrategyOptions, verifyFunction));
} else {
  throw new Error(
    "googleStrategyOptions clientID or clientSecret not available!"
  );
}
