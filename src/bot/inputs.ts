import { parsePhoneNumber as awesomeParse } from "awesome-phonenumber";
import * as emailValidator from "email-validator";

export const parsePhoneNumber = (input: string) => {
  const pn = awesomeParse(input, { regionCode: "CA" });
  if (!pn.valid) {
    return null;
  }

  return pn.number.e164;
};

export const parseEmail = (input: string) => {
  const isValid = emailValidator.validate(input);
  return isValid ? input : null;
};

export const parseBoolean = (input: string) => {
  return (
    input.toLowerCase() === "yes" ||
    input.toLowerCase() === "y" ||
    input === "1" ||
    input.toLowerCase() === "true"
  );
};
