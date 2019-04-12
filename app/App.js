/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from './Components/Charts';

const data = {
  January: -20,
  February: -10,
  March: -5,
  April: 5,
  May: 15,
  June: 25,
  July: 30,
  August: 20,
  September: 15,
  October: 10,
  November: 5,
  December: -10,
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 300,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <BarChart data={data} labelRotation={30} maxValue={40} />
    </View>
  );
}