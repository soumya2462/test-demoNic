import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    height: 70,
    width: '100%',
  }
});

const Results = ({ route }) => {

  const { data, type } = route.params;

  const renderItems = ({ item }) => {
    if(type === "Text") {
      return (
        <View style={styles.itemContainer}>
          <Text>{item.blockText}</Text>
          <Text>{item.resultText}</Text>
        </View>
      )
    }
    return (
      <View style={styles.itemContainer}>
        <Text>{`Objeto: ${item.description}`}</Text>
        <Text>{`Confidence: ${item.confidence}`}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItems}
      />
    </View>
  )
}

export { Results };
