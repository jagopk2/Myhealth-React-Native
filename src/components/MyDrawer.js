import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Header, Avatar } from "react-native-elements";

const MyDrawer = (props) => {
  return (
    <ScrollView style={styles.background}>
      {/* <Text>This is the MyDrawer Screen</Text> */}
      <Avatar
        rounded
        size="xlarge"
        source={require("../../assets/userIcon.jpg")}
        containerStyle={{ marginLeft: 45, marginTop: 0 }}
      />
      <DrawerItems {...props} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
});

export default MyDrawer;
