import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

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
  const apiKey = process.env.GOOGLE_API_KEY;
  fetch(
    `https://youtube.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`
  );
  done(null, {
    userName: profile.displayName,
  });
};
if (googleStrategyOptions.clientID && googleStrategyOptions.clientSecret) {
  passport.use(new GoogleStrategy(googleStrategyOptions, verifyFunction));
} else {
  throw new Error(
    "googleStrategyOptions clientID or clientSecret not available!"
  );
}
