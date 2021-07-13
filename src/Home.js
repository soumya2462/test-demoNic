import React,{ useState } from 'react';
import { Button, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { TrackableButton } from './TrackableButton';
import TextInput from './components/TextInput'

const Home = ({ navigation }) => {
  const [appno, setAppno] = useState({ value: '', error: '' })

  const onPress = (type) => {
    console.warn("Pressed");
    navigation.navigate("Camera", { type });
  }

  return (
    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
     {appno.value == "12345678"? (    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>

<Text style={{ padding:10}}>Ref Number</Text>
<Text style={{ margin:10,borderRadius:4,borderWidth:1,paddingLeft:80,paddingRight:80,paddingTop:10,paddingBottom:10}}>1HGCM82633A 004352</Text>
  
<TrackableButton 
  title="Verify"
  buttonStyle={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'green', width: '30%', height: '8%', borderRadius: 10, marginBottom: 5 }}
  logEventName="Opened_camera"
  logEventData={{name: "Test1", activity: 'Opened camera'}}
  feedback
  onPress={() => onPress("Text")}
/>
</View>):(<TextInput
      style={{ margin:10}}
        label="Application Number"
        returnKeyType="next"
        value={appno.value}
        onChangeText={(text) => setAppno({ value: text, error: '' })}
        autoCapitalize="none"
        keyboardType="text"
      />)
      }
         
      
      
    </View>
  )
}

export { Home };
