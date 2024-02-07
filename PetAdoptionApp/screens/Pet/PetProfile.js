import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "../../lib/supabase";
import PetProfileCard from "../../components/Pet/PetProfileCard";

const Stack = createStackNavigator();

const PetProfile = () => {
  const [fetchError, setFetchError] = useState(null);
  const [petProfiles, setPetProfiles] = useState(null);

  useEffect(() => {
    //An "async" function, this allow us to use "await"
    const fetchPetProfiles = async () => {      
      const { data, error } = await supabase //fetching the data in supabase
        .from("pet_profiles") //the supabase table's name
        .select("*"); //select all statement( select * from)

      if (error) {
        setFetchError("Unable to fetch data from:" + "this table");
        setPetProfiles(null); //setting to null so to reset the data
        alert(error);
      }
      if (data) {
        setPetProfiles(data);
        setFetchError(null);
      }
    };
    fetchPetProfiles();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />  */}
        {fetchError && <Text>{fetchError}</Text>}
        {petProfiles && (
          <View style={styles.pet_profile}>
            {petProfiles.map((petProfiles) => (
              //<text>petProfiles.name</text>
              <PetProfileCard key={petProfiles.id} pet_profiles={petProfiles} />
            ))}
          </View>
        )}
        {/* <Text>Data fetched from Supabase:</Text>
        <Text>{JSON.stringify(data)}</Text> */}
      </View>
    </NavigationContainer>
  );
};

export default PetProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
