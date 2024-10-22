export const REGEX = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  //최소 8 자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,

  hasNumber: /[0-9]/,
  hasCharacter: /[a-zA-z]/,
  hasSpecial: /[`~!@#$%^&*|\\\'\";:\/?]/,
  
  number: /^[0-9]+$/,

  tel: /^[0-9]{6,14}$/,
};
