import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import {colors} from "./src/constants";
import Keyboard from "./src/components/Keyboard";

// Making number of columns which will be number of tries
const numOfTries = 6;

export default function App() {
  const word = "hello";
  const letters = word.split(''); // Split based on nothing and that will return an array of characters

  // Keep whole map in state. 
  // The map depends on this array
  const rows = new Array(numOfTries).fill(
    new Array(letters.length).fill("a")
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
     
     
{/* Title Of Page*/}
      <Text style={styles.title}>NEYR WORDLE</Text> 

{/* Make a view, a view of that will contain the whole map */}
      <ScrollView style={styles.map}>
{/* map for all the rows we have */}
        {rows.map((row) => (
          <View style={styles.row}>
            {row.map((cell) => (
             <View style={styles.cell}> 
             <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
             </View>
          ))}
        </View>
        ))}
      </ScrollView>

      <Keyboard/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  map: {
    alignSelf: "stretch",
    height: 100,
  },
  row: {

    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    maxWidth: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});
