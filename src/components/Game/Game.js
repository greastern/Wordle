import { useState, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";
import Keyboard from "../Keyboard";
import * as Clipboard from "expo-clipboard";
import words from "../../words";
import styles from "./Game.styles";
import { copyArray, getDayOfTheYear } from "../../Utils"

// Making number of columns which will be number of tries
const numOfTries = 5;

const dayOfTheYear = getDayOfTheYear();

const Game = () => {
  const word = words[dayOfTheYear];
  const letters = word.split(""); // Split based on nothing and that will return an array of characters

  const[rows, setRows] = useState(  //[value of state, setter of state]
      new Array(numOfTries).fill(new Array(letters.length).fill("")) // Keep whole map in state. The map depends on this array
  );   
  const [curRow, setCurRow] = useState(0);
  const[curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing') // game states are won, lost, playing, playing being the current until won or lost

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState != 'won') {
      Alert.alert("Hooraaay", "YOU WON!!", [{ text: 'Share', onPress: shareScore}]);
      setGameState('won');
    } else if (checkIfLost() && gameState != 'lost') {
      Alert.alert("boo", "try again tomorrow!");
      setGameState('lost');
    }
  };
  const shareScore = () => {
    const textMap = rows
      .map((row, i) => 
        row.map((cell,j) => colorsToEmoji[getCellBGColor(i,j)]).join ("")
      )
      .filter((row) => row)
      .join("\n");
    const textToShare = `NEYR WORDLE \n${textMap}`;
  
    Clipboard.setString(textToShare);
    Alert.alert("Copied Successfully", "Share your score on your social media");
  };

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter == letters[i]);
  };
  
  const checkIfLost =  () => {
    return !checkIfWon() && curRow == rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState != "playing") {
      return;
    }

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

  const isCellActive = (row, col) => {
    return row == curRow && col == curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
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

  const getAllLettersWithColor =(color) => { 
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) == color)
    );
  }

  const greenCaps = getAllLettersWithColor (colors.primary);
  const yellownCaps = getAllLettersWithColor (colors.secondary);
  const greyCaps = getAllLettersWithColor (colors.darkgrey);

  return (
    <>
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
                  backgroundColor: getCellBGColor(i, j),
                },
              ]}
            > 
             <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
             </View>
          ))}
        </View>
        ))}
      </ScrollView>

      <Keyboard 
        onKeyPressed={onKeyPressed}
        greenCaps = {greenCaps}
        yellowCaps = {yellownCaps}
        greyCaps = {greyCaps}
      />
      </>
  );
}
export default Game;