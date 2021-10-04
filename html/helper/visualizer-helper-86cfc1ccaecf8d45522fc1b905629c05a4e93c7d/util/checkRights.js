/**
Checks if one of the usernames is part of the rights list
 A right may be a regular expression.

 */

module.exports = function checkRights(
  usernames,
  rights = '',
  defaultValue = false
) {
  if (!rights) return defaultValue;
  if (!usernames) return false;
  if (!Array.isArray(usernames)) usernames = [usernames];
  var alloweds = rights.split(/[ ,;\r\n]+/).filter((a) => a);

  for (let allowed of alloweds) {
    let isRegExp = false;
    if (allowed.startsWith('/') && allowed.endsWith('/')) {
      isRegExp = true;
      var regexp = new RegExp(allowed.substring(1, allowed.length - 1));
    }

    for (let username of usernames) {
      if (!username) continue;
      if (isRegExp) {
        if (username.match(regexp)) return true;
      } else {
        if (username.toLowerCase() === allowed.toLowerCase()) return true;
      }
    }
  }
  return false;
};
