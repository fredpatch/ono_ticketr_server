import Token from "../models/Token.js";

export const revokeToken = async (token, replacedByToken = null) => {
  const tokenDoc = await Token.findOne({ refresh_token: token });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }

  tokenDoc.revoked = true;
  tokenDoc.revokedAt = new Date();
  tokenDoc.replacedByToken = replacedByToken;
  await tokenDoc.save();

  return tokenDoc;
};
