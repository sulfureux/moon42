import * as EmailValidator from "email-validator";
import axios from "axios";
import { RECAPTCHA_SECRETKEY } from "../config";
import { isWaitlistExist, saveWaitlist as saveWaitlistModel } from "../models/waitlist";
import { KoaContext } from "../global";
import { errorResponse, successResponse } from "../services/response";

const saveWaitlist = async (ctx: KoaContext) => {
  try {
    const body = ctx.request.body;
    if (!body["email"] || !body["key"]) {
      ctx.status = 400;

      ctx.body = errorResponse("Wrong params", 400);
      return;
    }

    const vailidEmail = EmailValidator.validate(body["email"]);
    if (!vailidEmail) {
      ctx.status = 400;

      ctx.body = errorResponse("Email is not valid", 400);
      return;
    }

    const key = ctx.request.body["key"];
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRETKEY}&response=${key}`;
    const verify = await axios.post(verifyUrl, { headers: { "Content-Type": "application/x-www-form-urlencoded", json: true } });
    if (!verify.data["success"]) {
      ctx.status = 400;

      ctx.body = errorResponse("Captcha verify error", 400);
      return;
    }

    if (await isWaitlistExist(body["email"])) {
      ctx.status = 400;

      ctx.body = errorResponse("Joined already", 400);
      return;
    }

    await saveWaitlistModel(body["email"]);

    ctx.body = successResponse("Success");
    return;
  } catch (error) {
    ctx.status = 500;

    ctx.body = errorResponse("Internal error", 500);
    return;
  }
};

export default saveWaitlist;
