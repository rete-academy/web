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

export const isValidUrl = (url) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(url);

export const diff = (s, t) => s.filter((c) => !t.find((o) => o._id === c._id));

// Delete the properties not allowed to change before submit
export const sanitizeData = (obj) => {
  if (!obj) {
    return obj;
  }

  const cleanData = { ...obj };

  delete cleanData._id;
  delete cleanData.id;
  delete cleanData.authors;

  // The time should be handled by backend automatically
  delete cleanData.createdTime;
  delete cleanData.updatedTime;

  if (cleanData.file) {
    delete cleanData.file;
  }

  if (cleanData.slug) {
    delete cleanData.slug;
  }

  if (cleanData.sprints) {
    delete cleanData.sprints;
  }

  if (cleanData.materials) {
    delete cleanData.materials;
  }

  return cleanData;
};
