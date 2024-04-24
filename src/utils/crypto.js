import CryptoJS from "crypto-js";

const cryptoKey = import.meta.env.VITE_CRYPTO_KEY;

function encrypt(message) {
  return CryptoJS.AES.encrypt(message, cryptoKey).toString();
}

function decrypt(message) {
  var bytes = CryptoJS.AES.decrypt(message, cryptoKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export { encrypt, decrypt };
