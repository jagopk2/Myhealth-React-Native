import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { showMessage, hideMessage } from "react-native-flash-message";

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <>
      <Spacer />
      <Spacer />
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      {submitButtonText === "SignIn" ? null : (
        <Input label="Name" value={name} onChangeText={setName} />
      )}
      <Spacer />
      {submitButtonText === "SignIn" ? null : (
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      )}
      <Spacer />
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Spacer />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Spacer>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <Button
          title={submitButtonText}
          onPress={() => {
            submitButtonText === "SignIn"
              ? onSubmit({ email, password, showMessage })
              : onSubmit({ email, password, name, phoneNumber, showMessage });

            // onSubmit({ email, password, name });
          }}
        />
      </Spacer>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginBottom: 15,
  },
});

export default AuthForm;
