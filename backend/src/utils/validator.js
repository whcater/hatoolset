export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // 密码至少8个字符，包含至少一个字母和一个数字
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

export const validateUsername = (username) => {
  // 用户名3-20个字符，只允许字母、数字和下划线
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

export const validateUserData = (userData) => {
  const errors = {};
  
  if (!userData.username) {
    errors.username = '用户名不能为空';
  } else if (!validateUsername(userData.username)) {
    errors.username = '用户名格式不正确，只允许3-20个字母、数字和下划线';
  }
  
  if (!userData.email) {
    errors.email = '邮箱不能为空';
  } else if (!validateEmail(userData.email)) {
    errors.email = '邮箱格式不正确';
  }
  
  if (!userData.password) {
    errors.password = '密码不能为空';
  } else if (!validatePassword(userData.password)) {
    errors.password = '密码格式不正确，至少8个字符，包含至少一个字母和一个数字';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 