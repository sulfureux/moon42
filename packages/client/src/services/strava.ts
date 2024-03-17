import config from "../config";

export const genStravaLoginURL = (requestCode: string) => {
  return `http://www.strava.com/oauth/authorize?client_id=115438&response_type=code&redirect_uri=${config.apiURL}/v1/strava/callback%3FrequestCode%3D${requestCode}&approval_prompt=force&scope=activity:read_all`;
};
