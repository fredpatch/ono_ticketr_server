// validation.js
import { password_validation, email_validation } from "./index";

const validateFullname = (fullname: any): string | null => {
  if (fullname.length <= 3) {
    return "@@[logger] Fullname must be at least 3 characters long";
  }
  return null;
};

const validateEmail = (email: any): string | null => {
  if (email.length === 0) {
    return "@@ Email is required";
  }
  if (!email_validation.test(email)) {
    return "Email is not valid";
  }
  return null;
};

const validatePassword = (password: any): string | null => {
  if (!password_validation.test(password)) {
    return "Password should be between 6 to 20 characters and should contain at least 1 uppercase letter, 1 lowercase letter and 1 digit";
  }
  return null;
};

export { validateFullname, validateEmail, validatePassword };
