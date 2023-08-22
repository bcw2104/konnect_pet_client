import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomInput from '../elements/CustomInput';
import { useEffect, useState } from 'react';
import { REGEX } from '../../commons/regex';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../commons/colors';
import CustomText from '../elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const PasswordSetting = ({ onPasswordChange = (value) => {} }) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [password2, setPassword2] = useState('');
  const [password2Error, setPassword2Error] = useState(false);
  const [checker, setChecker] = useState({
    Character: 0,
    Number: 0,
    Special: 0,
    Length: 0,
  });
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

  useEffect(() => {
    if (isPasswordSuccess) {
      onPasswordChange(password);
    } else {
      onPasswordChange(null);
    }
  }, [isPasswordSuccess]);

  const getCheckColor = (check) => {
    if (check == 0) {
      return COLORS.gray;
    } else if (check == 1) {
      return COLORS.primary;
    } else {
      return COLORS.danger;
    }
  };

  const renderCheckIcon = (check) => {
    const color = getCheckColor(check);
    if (check == 0) {
      return <Feather name="circle" size={16} color={color} />;
    } else if (check == 1) {
      return <Feather name="check-circle" size={16} color={color} />;
    } else {
      return <Feather name="minus-circle" size={16} color={color} />;
    }
  };

  const validatePassword = (password) => {
    let valid = true;
    const check = {
      Character: 1,
      Number: 1,
      Special: 1,
      Length: 1,
    };
    if (!REGEX.hasCharacter.test(password)) {
      check.Character = 2;
      valid = false;
    }
    if (!REGEX.hasNumber.test(password)) {
      check.Number = 2;
      valid = false;
    }
    if (!REGEX.hasSpecial.test(password)) {
      check.Special = 2;
      valid = false;
    }
    if (password.length < 8) {
      check.Length = 2;
      valid = false;
    }
    setChecker(check);

    return valid;
  };

  const confirmPassword = (password1, password2) => {
    const test = validatePassword(password1);

    if (!test) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (password1 != password2) {
      setIsPasswordSuccess(false);
      setPassword2Error(true);
    } else {
      setIsPasswordSuccess(test);
      setPassword2Error(false);
    }
  };

  const handlePasswordChange = (password) => {
    confirmPassword(password, password2);
    setPassword(password);
  };

  const handlePassword2Change = (password2) => {
    confirmPassword(password, password2);
    setPassword2(password2);
  };

  return (
    <View style={styles.passwordInputWrap}>
      <CustomInput
        title="Password"
        value={password}
        maxLength={16}
        onValueChange={handlePasswordChange}
        secureTextEntry={true}
        keyboardType="default"
        errorHandler={passwordError}
        errorMsg="Please check your password."
      />

      <View style={styles.checkerWrap}>
        {Object.keys(checker).map((key) => (
          <View key={key} style={styles.checkerItem}>
            {renderCheckIcon(checker[key])}
            <CustomText
              style={{
                marginLeft: 5,
              }}
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={13}
              fontColor={getCheckColor(checker[key])}
            >
              {key}
            </CustomText>
          </View>
        ))}
      </View>
      <CustomInput
        title="Verify password"
        value={password2}
        maxLength={16}
        onValueChange={handlePassword2Change}
        secureTextEntry={true}
        keyboardType="default"
        errorHandler={password2Error}
        errorMsg="Passwords do not match."
        wrapperStyle={styles.password2Input}
      />
    </View>
  );
};

export default PasswordSetting;

const styles = StyleSheet.create({
  passwordInputWrap: {
    alignItems: 'center',
  },

  password2Input: {
    marginTop: 20,
  },
  checkerWrap: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkerItem: {
    flexDirection: 'row',
    marginRight: 10,
  },
});
