import { useState} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import {colors, CLEAR, ENTER} from "./src/constants";
import Keyboard from "./src/components/Keyboard";


// Making number of columns which will be number of tries
const numOfTries = 6;

const copyArray = (arr) => {
  return [...(arr.map(rows => [...rows]))]
}

export default function App() {
  const word = "hello";
  const letters = word.split(""); // Split based on nothing and that will return an array of characters

  const[rows, setRows] = useState(  //[value of state, setter of state]
      new Array(numOfTries).fill(new Array(letters.length).fill("")) // Keep whole map in state. The map depends on this array
  );   
  const [curRow, setCurRow] = useState(0);
  const[curCol, setCurCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);

    // Clear button going back current columnn one cell behind
    if (key == CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol)
      }
      return;
    }
    // Enter button
    if (key == ENTER) {
    // make sure row has been fully filled before going on to next row
      if (curCol == rows[0].length){
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }
    
   if (curCol < rows[0].length) { //this if statement stops the cursor at the last column
    // update our rows in const rows
    updatedRows[curRow][curCol] = key; 
    setRows(updatedRows);  
    setCurCol(curCol+1);
    }
  };

  const isCellActive = (row,col) => {
    return row == curRow && col == curCol;
  };

  const getCellBGColor = (letter, row, col) => {
    // checking that the row the user is currently in is more or equal to the letter being currently rendered
    if (row >= curRow) {
      return colors.black;
    }
    if (letter == letters[col]) {    // if the letter is the same as the letter in the position column then its in the right position for green background
      return colors.primary;
    } 
    if (letters.includes(letter)) { //if letter is not guess, then check if word contains has that letter
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  return (
   <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
     
     
{/* Title Of Page*/}
      <Text style={styles.title}>NEYR WORDLE</Text> 

{/* Make a view, a view of that will contain the whole map */}
      <ScrollView style={styles.map}>
{/* map for all the rows we have */}
        {rows.map((row, i) => (
          <View key={`row-${i}`} style={styles.row}>
            {row.map((letter, j) => (
             <View 
             key={`cell-${i}-${j}`}
              style={[
                styles.cell, 
                {
                  borderColor: isCellActive(i,j) 
                    ? colors.lightgrey 
                    : colors.darkgrey,
                  backgroundColor: getCellBGColor(letter, i, j),
                },
              ]}
            > 
             <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
             </View>
          ))}
        </View>
        ))}
      </ScrollView>

      <Keyboard onKeyPressed={onKeyPressed}/>
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
    marginVertical: 20,
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
