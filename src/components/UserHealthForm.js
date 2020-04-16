import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { showMessage, hideMessage } from "react-native-flash-message";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const UserHealthForm = ({
  headerText,
  errorMessage,
  onSubmit,
  submitButtonText,
  type
}) => {
  const [reading, setReading] = useState("");

  return (
    <>
      <Spacer>
        <Text h3>{headerText} Entry</Text>
      </Spacer>
      <Spacer></Spacer>
      <Input
        label={headerText}
        value={reading}
        onChangeText={setReading}
        placeholder="Enter Value Here"
      />

      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => {
            onSubmit({ reading, type, showMessage });

            // onSubmit({ email, password, name });
          }}
          icon={
            <FontAwesome5
              name="plus"
              color={"white"}
              size={20}
              style={{ marginRight: 10 }}
            />
          }
        />
      </Spacer>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white"
  }
});

export default UserHealthForm;
