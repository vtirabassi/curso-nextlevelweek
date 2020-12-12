import React, {useState} from 'react'
import {  Feather as Icon } from "@expo/vector-icons";
import {View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform} from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from "@react-navigation/native";

const Home = () => {

  const navigation = useNavigation()

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  function handleNavigationToPoint(){
    navigation.navigate('Points', {
      uf, 
      city
    })
  }

  return (
  <ImageBackground style={styles.container} 
    source={require('../../assets/home-background.png')} 
    imageStyle={{width: 274, height: 368}}
  >
    <View style={styles.main}>
    <Image source={require('../../assets/logo.png')} />
    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
    </View>

    <View style={styles.footer}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TextInput style={styles.input} 
          value={uf} 
          onChangeText={text => setUf(text)} 
          maxLength={2}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="Digite a UF" ></TextInput>
        <TextInput style={styles.input} 
          value={city} 
          autoCorrect={false}
          onChangeText={text => setCity(text)}
          placeholder="Digite a Cidade"></TextInput>
      </KeyboardAvoidingView>

      <RectButton style={styles.button} onPress={handleNavigationToPoint}>
        <View style={styles.buttonIcon}>
          <Text>
            <Icon name="arrow-right" color="#FFF" size={23}></Icon>
          </Text>
        </View>  
          <Text style={styles.buttonText}>Entrar</Text>
      </RectButton>

    </View>
  </ImageBackground>
  )
}

export default Home



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});