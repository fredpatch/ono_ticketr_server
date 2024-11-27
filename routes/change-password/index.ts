import User from "../../models/User";
import { logger } from "../../services/logs/logger";
import { password_validation } from "../../utils";
import bcrypt from "bcryptjs";
// import crypto from "crypto";

export const change_password = async (req: any, res: any) => {
  let user_id = req.user;
  let { currentPassword, newPassword } = req.body;

  if (
    !password_validation.test(currentPassword) ||
    !password_validation.test(newPassword)
  ) {
    return res.status(400).json({
      error:
        "Password should be between 6 to 20 characters and should contain at least 1 uppercase letter, 1 lowercase letter and 1 digit",
    });
  }

  User.findOne({ _id: user_id })
    .then((user) => {
      if (user?.google_auth) {
        return res
          .status(400)
          .json({ error: "Google user cannot change password" });
      }

      const storedPassword = user?.personal_info?.password;
      if (!storedPassword) {
        return res.status(500).json({ error: "Password not found" });
      }

      bcrypt.compare(
        currentPassword,
        storedPassword,
        (err: any, result: any) => {
          if (err) {
            return res.status(500).json({
              error:
                "Something went wrong while changing password please try again later",
            });
          }

          if (!result) {
            return res.status(403).json({
              error: "Current password is incorrect",
            });
          }

          if (currentPassword == newPassword) {
            return res.status(403).json({
              error: "New password can't be same as current password",
            });
          }

          bcrypt.hash(newPassword, 10, (err, hashed_password) => {
            if (err) {
              return res.status(500).json({
                error:
                  "Something went wrong while changing password please try again later",
              });
            }

            User.findOneAndUpdate(
              {
                _id: user_id,
              },
              {
                "personal_info.password": hashed_password,
              }
            )
              .then((u) => {
                return res.status(200).json({
                  message: "Password changed successfully",
                  user: u,
                });
              })
              .catch((err) =>
                res.status(500).json({
                  error: `Error happened while changing password ${err.message}`,
                })
              );
          });
        }
      );
    })
    .catch((error) => {
      logger.info("Error user not found !");
      return res.status(500).json({
        error: `User not found ${error.message}`,
      });
    });
};
