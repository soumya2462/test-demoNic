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
          
          {item.blockText=="1HGCM82633A 004352" ?
          <Text>{item.blockText} is Verify</Text>
          :
          <Text>{item.blockText} not Verify</Text>
          }
        </View>
      )
    }
    
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
