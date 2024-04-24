import CryptoJS from "crypto-js";

const cryptoKey = import.meta.env.VITE_CRYPTO_KEY;

function encrypt(message) {
  return CryptoJS.AES.encrypt(message, cryptoKey).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
