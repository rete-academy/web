export const checkRole = (user, role) => {
  if (user && user.role && role) {
    switch (role) {
      case 'admin':
      case 0:
        return user.role.some((n) => n === 0);
      case 'teacher':
      case 'mod':
      case 1:
        return user.role.some((n) => n === 1 || n === 0);
      case 'student':
      case 'user':
      case 2:
        return user.role.some((n) => n === 2 || n === 0);
      case 'unconfirmed':
      case 'new-user':
      case 3:
        return user.role.some((n) => n === 3 || n === 0);
      default:
        return false;
    }
  }
  return false;
};

export const isEmail = (str) => /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str);
