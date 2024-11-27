"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password_validation = exports.email_validation = void 0;
exports.email_validation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
exports.password_validation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
