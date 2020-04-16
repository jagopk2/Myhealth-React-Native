import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { showMessage, hideMessage } from "react-native-flash-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as EmailValidator from "email-validator";

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  return (
    <>
      <Spacer />
      <Spacer />
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      {submitButtonText === "SignIn" ? null : (
        <Input
          autoCapitalize="none"
          label="Name"
          value={name}
          onChangeText={setName}
          leftIcon={
            <FontAwesome5
              name="user"
              color={"grey"}
              size={20}
              style={{ marginRight: 5 }}
            />
          }
          errorMessage={nameErr}
        />
      )}
      <Spacer />
      {submitButtonText === "SignIn" ? null : (
        <Input
          autoCapitalize="none"
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          leftIcon={
            <MaterialCommunityIcons
              name="cellphone"
              color={"grey"}
              size={20}
              style={{ marginRight: 5 }}
            />
          }
          errorMessage={phoneNumberErr}
        />
      )}
      <Spacer />
      <Input
        autoCapitalize="none"
        label="Email"
        value={email}
        onChangeText={setEmail}
        leftIcon={
          <MaterialCommunityIcons
            name="email"
            color={"grey"}
            size={20}
            style={{ marginRight: 5 }}
          />
        }
        errorMessage={emailErr}
      />
      <Spacer />
      <Input
        autoCapitalize="none"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon={
          <MaterialCommunityIcons
            name="lock"
            color={"grey"}
            size={20}
            style={{ marginRight: 5 }}
          />
        }
        errorMessage={passwordErr}
      />
      <Spacer>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <Button
          title={submitButtonText}
          onPress={() => {
            submitButtonText === "SignIn"
              ? (validate_email(email, setEmailErr),
                validate_password(password, setPasswordErr),
                passwordErr === "" && emailErr === ""
                  ? onSubmit({
                      email,
                      password,
                      showMessage,
                    })
                  : null)
              : //onSubmit({ email, password, showMessage })
                (validate_email(email, setEmailErr),
                validate_phoneNumber(phoneNumber, setPhoneNumberErr),
                validate_name(name, setNameErr),
                validate_password(password, setPasswordErr),
                passwordErr === "" &&
                nameErr === "" &&
                phoneNumberErr === "" &&
                emailErr === ""
                  ? onSubmit({
                      email,
                      password,
                      name,
                      phoneNumber,
                      showMessage,
                    })
                  : null);
            // ? onSubmit({ email, password, showMessage })
            // : onSubmit({ email, password, name, phoneNumber, showMessage });

            // onSubmit({ email, password, name });
          }}
        />
      </Spacer>
    </>
  );
};
const validate_email = (email, setEmailErr) => {
  if (EmailValidator.validate(email)) {
    setEmailErr("");
  } else {
    setEmailErr("Kindly Enter a Valid Email");
  }
};
const validate_phoneNumber = (phoneNumber, setPhoneNumberErr) => {
  var phoneno = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
  if (phoneNumber.match(phoneno)) {
    setPhoneNumberErr("");
  } else {
    setPhoneNumberErr("Kindly Enter a Valid PhoneNumber");
  }
};
const validate_name = (name, setNameErr) => {
  if (name.match(/^[a-zA-Z]*$/) && name.length > 1) {
    setNameErr("");
  } else {
    setNameErr("Kindly Enter a Name");
  }
};
const validate_password = (password, setPasswordErr) => {
  if (password.match(/^.{4,15}$/)) {
    setPasswordErr("");
  } else {
    setPasswordErr("Password should be atleast 4 to 15 Characters long");
  }
};
// const validate_email = (email, setEmailErr) => {
//   if (EmailValidator.validate(email)) {
//     setEmailErr("");
//   } else {
//     setEmailErr("Kindly Enter a Valid Email");
//   }
// };
const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginBottom: 15,
  },
  mainHeading: {
    marginTop: hp("10%"),
    marginLeft: wp("15%"),
  },
});

export default AuthForm;
