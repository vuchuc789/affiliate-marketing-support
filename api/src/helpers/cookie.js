const isSSL = process.env.NODE_ENV === 'production';
const tenMinutesToMilliseconds = 10 * 60 * 1000;

/**
 * @param {number} age max age of cookie
 */
exports.getCookieOptions = (age = tenMinutesToMilliseconds) => ({
  maxAge: age,
  httpOnly: true,
  secure: isSSL,
  signed: true,
  sameSite: isSSL ? 'None' : 'Strict',
});
