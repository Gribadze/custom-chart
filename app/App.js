/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, LineChart } from './Components/Charts';

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
  January2: -20,
  February2: -10,
  March2: -5,
  April2: 5,
  May2: 15,
  June2: 25,
  July2: 30,
  August2: 20,
  September2: 15,
  October2: 10,
  November2: 5,
  December2: -10,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <BarChart data={data} thickness={40} spaceAround={5} />
      <LineChart data={data} spaceAround={20} maxValue={35} minValue={-30} />
    </View>
  );
}
