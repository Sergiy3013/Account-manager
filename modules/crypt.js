const encryptpwd = require("encrypt-with-password");

exports.encrypt = (text, pass) => {
    return encryptpwd.encrypt(text, pass);
}
exports.decrypt = (text, pass) => {
    try {
        return encryptpwd.decrypt(text, pass);
    } catch (error) {
        return false;
    }
}


// const text = "Hel`lo, World!";
// const password1 = "examplepassword1";
// const password2 = "examplepassword2";

// console.log("text: ", text);

// const encrypted = crypt.encrypt(text, password1);
// console.log("encrypted: ", encrypted);

// const decrypted = crypt.decrypt(encrypted, password1);
// console.log("decrypted: ", decrypted);

// if (decrypted) console.log(true);
// else console.log(false);