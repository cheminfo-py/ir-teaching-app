"use strict";

define(["module", './aesjs'], function (module, AES) {
  function encrypt(text, key) {
    key = new TextEncoder().encode(key);
    var textBytes = AES.utils.utf8.toBytes(text);
    var aesCtr = new AES.ModeOfOperation.ctr(key);
    var encryptedBytes = aesCtr.encrypt(textBytes);
    return AES.utils.hex.fromBytes(encryptedBytes);
  }

  function decrypt(encryptedHex, key) {
    key = new TextEncoder().encode(key);
    var encryptedBytes = AES.utils.hex.toBytes(encryptedHex);
    var aesCtr = new AES.ModeOfOperation.ctr(key);
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return AES.utils.utf8.fromBytes(decryptedBytes);
  }

  module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
  };
});