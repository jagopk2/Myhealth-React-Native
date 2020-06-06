import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Corpus, Similarity } from "tiny-tfidf";
import trackerApi from "../Api/tracker";
// import Toast from "react-native-simple-toast";
import MultiSelect from "react-native-multiple-select";
import { showMessage, hideMessage } from "react-native-flash-message";
import ProgressLoader from "rn-progress-loader";
import AwesomeAlert from "react-native-awesome-alerts";
import { NavigationEvents } from "react-navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Header, Text, Button, ThemeContext } from "react-native-elements";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const fetchSymptoms = async (setSymptoms, setError) => {
  try {
    const response = await trackerApi.get(`/getSymptoms`);
    // console.log(response.data);
    setError(false);
    setSymptoms(response.data);
  } catch (error) {
    console.log("Error Fetching Symptoms", error);
    setError(true);
    // Toast.show("Error Fetching Symptoms");
  }
};
const fetchDocuments = async (setDocuments, setError) => {
  try {
    const response = await trackerApi.get(`/getDiseaseSymptoms`);
    // console.log(response.data);
    setError(false);
    setDocuments(response.data);
  } catch (error) {
    console.log("Error Fetching getDiseaseSymptoms", error);
    setError(true);
    // Toast.show("Error Fetching getDiseaseSymptoms");
  }
};

const predict = (items, data, navigation) => {
  const desease = [];
  const symp = [];
  if (data.length) {
    data.forEach((element) => {
      // console.log("elem", element);
      desease.push(element.name);
      symp.push(element.symptoms_list);
    });
    desease.push("queury");
    symp.push(items);
    const corpus = new Corpus(desease, symp);
    const queury_vector = corpus.getDocumentVector("queury");

    // setCorpus(corpus);
    const deseases = corpus.getDocumentIdentifiers();
    const resultsValue = [];
    const resultsDesease = [];
    deseases.forEach((desease) => {
      if (desease !== "queury") {
        const predicted_value = Similarity.cosineSimilarity(
          queury_vector,
          corpus.getDocumentVector(desease)
        );
        const num = parseFloat(predicted_value);
        if (num !== 0) {
          resultsValue.push(num * 100);
          resultsDesease.push(desease);
        }
      }
    });
    const chart_data = {
      labels: resultsDesease,
      datasets: [
        {
          data: resultsValue,
        },
      ],
    };
    navigation.navigate("SymptomsDetail", {
      // data: null
      data: chart_data,
    });
  } else {
    console.log("No Data for Corpus Creation");
  }
};

// console.log(Similarity.cosineSimilarity(v1, v2));

const SymptomsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [multiSelect, setMultiSelect] = useState(null);
  const [error, setError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [fontLoad, setFontLoad] = useState(false);
  const fetchFonts = () => {
    return Font.loadAsync({
      "helvari-regular": require("../../assets/fonts/helvari.ttf"),
      "helvari-bold": require("../../assets/fonts/helvaribold.ttf"),
      "helvari-italic": require("../../assets/fonts/helvariitalic.ttf"),
      "helvari-italic-bold": require("../../assets/fonts/helvaribolditalic.ttf"),
      "helvari-medium": require("../../assets/fonts/helvarimedium.ttf"),
      "helvari-medium-italic": require("../../assets/fonts/helvarimediumitalic.ttf"),
    });
  };

  useEffect(() => {
    setSelectedItems([]);
    setMultiSelect(null);
    fetchSymptoms(setSymptoms, setError);
    fetchDocuments(setDocuments, setError);
  }, []);
  if (!fontLoad) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoad(true);
        }}
      />
    );
  }
  return (
    <>
      <NavigationEvents
        onWillFocus={() => {
          // setError(false);
          setSelectedItems([]);
          setMultiSelect(null);
          fetchSymptoms(setSymptoms, setError);
          fetchDocuments(setDocuments, setError);
          // console.log("Nav Evenet");
        }}
      />
      {symptoms.length && !error ? (
        <View style={{ marginHorizontal: wp("2%") }}>
          <Header
            placement="left"
            leftComponent={
              <MaterialCommunityIcons
                name="menu"
                color={"black"}
                size={30}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            }
            centerComponent={{
              text: "Symptoms",
              style: { color: "black", fontFamily: "helvari-bold" },
            }}
            rightComponent={
              <MaterialCommunityIcons
                name="home"
                color={"black"}
                size={30}
                onPress={() => {
                  navigation.navigate("Homepage");
                }}
              />
            }
            containerStyle={{
              backgroundColor: theme.colorNav,
              justifyContent: "space-around",
              paddingTop: 0,
              height: hp("10%"),
            }}
          />
          <Text h4 style={styles.mainHeading}>
            Select Symtoms from List
          </Text>
          <MultiSelect
            styleMainWrapper={{
              marginTop: hp("1%"),
            }}
            hideTags
            styleRowList={{ marginVertical: 2 }}
            styleListContainer={{ height: hp("50%") }}
            fontFamily="helvari-regular"
            itemFontFamily="helvari-regular"
            selectedItemFontFamily="helvari-italic-bold"
            hideSubmitButton={false}
            items={symptoms}
            uniqueKey="name"
            ref={(component) => {
              setMultiSelect(component);
            }}
            onSelectedItemsChange={(selItems) => {
              // console.log(selItems);
              setSelectedItems(selItems);
            }}
            selectedItems={selectedItems}
            selectText="Pick Symptoms"
            searchInputPlaceholderText="Search Symptoms..."
            onChangeInput={(text) => console.log(text)}
            //altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="red"
            tagBorderColor="black"
            tagTextColor="black"
            selectedItemTextColor="green"
            selectedItemIconColor="green"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: "#CCC" }}
            submitButtonColor="green"
            submitButtonText="Submit"
            onAddItem={() => {
              console.log("i am called");
            }}

            // flatListProps={{ scrollEnabled: false }}
          />
          {selectedItems.length ? (
            <View>
              {multiSelect.getSelectedItemsExt(selectedItems)}

              <Button
                onPress={() => {
                  predict(
                    selectedItems
                      .toString()
                      .split(" ")
                      .join("_")
                      .split(",")
                      .join(" "),
                    documents,
                    navigation
                  );
                }}
                title="predict"
              />
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <AwesomeAlert
          show={error}
          showProgress={true}
          title="Error fetching symptoms"
          message="Go Back To Home Screen"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Home Screen"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            console.log("Cancel");
          }}
          onConfirmPressed={() => {
            console.log("Symptoms Go Back Home Screen");
            navigation.navigate("Homepage");
            // setError(false);
          }}
        />
        <ProgressLoader
          visible={!(symptoms.length > 0 && documents.length > 0) && !error}
          isModal={true}
          isHUD={true}
          hudColor={"#fffafa"}
          color={"#000000"}
          onRequestClose={() => {
            console.log("asdsad");
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  mainHeading: {
    marginTop: hp("2%"),
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default SymptomsScreen;
