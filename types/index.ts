import { Request, Response } from "express";

export interface UsernameGeneration {
  email: any;
}

export interface UserDataToSendProps {
  user: any;
}

export interface EventValidationProps {
  title: string;
  des: string;
  content: any;
  tags: any;
  banner: string;
  draft: boolean;
  res: any;
}

export interface FullNameValidationProps {
  fullname: string;
  res: any;
}

export interface EmailValidationProps {
  email: string;
  res: any;
}

export interface PasswordValidationProps {
  password: string;
  res: any;
}

export interface RequestProps {
  req: any;
  res: any;
  next?: any;
}
