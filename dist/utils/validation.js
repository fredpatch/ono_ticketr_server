"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = exports.validateFullname = void 0;
// validation.js
const index_1 = require("./index");
const validateFullname = (fullname) => {
    if (fullname.length <= 3) {
        return "@@[logger] Fullname must be at least 3 characters long";
    }
    return null;
};
exports.validateFullname = validateFullname;
const validateEmail = (email) => {
    if (email.length === 0) {
        return "@@ Email is required";
    }
    if (!index_1.email_validation.test(email)) {
        return "Email is not valid";
    }
    return null;
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    if (!index_1.password_validation.test(password)) {
        return "Password should be between 6 to 20 characters and should contain at least 1 uppercase letter, 1 lowercase letter and 1 digit";
    }
    return null;
};
exports.validatePassword = validatePassword;
