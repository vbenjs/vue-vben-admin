// let char = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-\\/.!@#$%^&()_';
const char = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

export const createPassword = (num = 6) => {
  let password = "";
  let j = 0;
  for (let i = 0; i < num; i++) {
    j = Math.floor(Math.random() * char.length);
    password += char.charAt(j);
  }
  return password;
};
