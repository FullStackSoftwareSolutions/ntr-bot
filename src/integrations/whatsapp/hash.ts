import crypto from "crypto";

const SALT_KEY = `sal-key-${Date.now()}`;
const SALT_IV = `sal-iv-${Date.now()}`;

const METHOD = "aes-256-cbc";

const key = crypto
  .createHash("sha512")
  .update(SALT_KEY)
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha512")
  .update(SALT_IV)
  .digest("hex")
  .substring(0, 16);

/**
 * Generamos un UUID unico con posibilidad de tener un prefijo
 * @param {*} prefix
 * @returns
 */
export const generateRefProvider = (prefix: string) => {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Encriptar data
 * @param {*} data
 * @returns
 */
export const encryptData = (data: string) => {
  const cipher = crypto.createCipheriv(METHOD, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
};

/**
 * Desencriptar data
 * @param {*} encryptedData
 * @returns
 */
export const decryptData = (encryptedData: string) => {
  try {
    const buff = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(METHOD, key, encryptionIV);
    return (
      decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
    );
  } catch (e) {
    return "FAIL";
  }
};
