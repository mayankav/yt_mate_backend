import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import axios from "axios";

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_REDIRECT_URL,
  scope: ["email", "profile"],
};
// action to be taken after verification is done
const verifyFunction = async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  console.log(accessToken);
  console.log(profile);
  const captionId = "AUieDabN3QOoUM_Ef5eINfHq5Vh2n-nT97-iTPo8acaqXmJCRTE";
  const videoId = "RGd6JC8C_8c";
  const apiKey = process.env.GOOGLE_API_KEY;
  const captionsDownloadURL = `https://youtube.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`;
  const captionsListURL = `https://youtube.googleapis.com/youtube/v3/captions?part=id,snippet&videoId=${videoId}&key=${apiKey}`;
  try {
    const response = await axios.get(captionsDownloadURL);
    console.log("-------start youtube list api-----");
    console.log(response.data);
    console.log("-------end youtube list api-----");
  } catch (error) {
    console.error("Error fetching captions:", error);
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
