import AsyncStorage from '@react-native-community/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableHighlightBase, TouchableOpacity, View } from 'react-native';

export default function App() {

  const [day, setDay] = useState(false)
  const [font, setFont] = useState(true)
  const [frase, setFrase] = useState(undefined)

  const styles = _styles(day, font);

  useEffect(() => {
    AsyncStorage.getItem('prefs').then((item) => {

      const data = JSON.parse(item);

      setFont(data?.font || false)
      setDay(data?.day || false)
    })

    fetch('https://allugofrases.herokuapp.com/frases/random').then(async (response) => {
      setFrase(await response.json())
    })

  }, [])

  async function getFrase() {
    fetch('https://allugofrases.herokuapp.com/frases/random').then(async (response) => {
      setFrase(await response.json())
    })

  }

  async function setEvent(type, event) {

    if (type === 'font') {

      setFont(event);
      AsyncStorage.setItem('prefs', JSON.stringify({ day, font: event }))
    } else {

      AsyncStorage.setItem('prefs', JSON.stringify({ day: event, font }))
      setDay(event)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <View>
          <Text>Fonte Grande</Text> <Switch value={font} onValueChange={(e) => setEvent('font', e)}></Switch>
        </View>
        <View>
          <Text>Modo noturno</Text> <Switch value={day} onValueChange={(e) => setEvent('day', e)}></Switch>
        </View>
      </View>
      <View style={styles.space} />
      <View style={styles.textContainer}>
        <Text style={styles.bold}>{frase?.livro || ''}</Text>
        <Text style={styles.autor}>{frase?.autor || ''}</Text>
        <Text style={styles.font}>{frase?.frase || ''}</Text>
      </View>
      <TouchableOpacity onPress={getFrase} style={styles.button}>
        <Text style={styles.buttonColor}>Nova frase</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const _styles = (day, font) => StyleSheet.create({
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: !day ? '#fff' : '#1F1D36',
    alignItems: 'center',
    padding: 10
  },
  lineContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  space: {
    height: 1,
    width: '100%',
    backgroundColor: '#d8d8d8',
    marginBottom: 10,
    marginTop: 10
  },
  textContainer: {
    minHeight: 50,
    padding: 20,
    backgroundColor: !day ? '#dbdbdb' : '#3F3351',
    width: '100%'
  },
  font: {
    fontSize: !font ? '18px' : '26px'
  },
  bold: {
    fontWeight: '700'
  },
  autor: {
    fontStyle: 'italic'
  },
  button: {
    padding: 10,
    backgroundColor: !day ? "#000" : "#864879",
    width: '100%',
    marginTop: 10
  },
  buttonColor: {
    color: !day ? "#fff" : "#E9A6A6",
    fontWeight: '700'
  }
});
