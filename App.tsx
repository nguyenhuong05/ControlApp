import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const App = () => {
  const [setting, setControl] = useState('');
  const [displayText, setDisplayText] = useState('');
  const supabaseUrl = 'https://atamzgfzgyynoqqdnbup.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YW16Z2Z6Z3l5bm9xcWRuYnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyOTg0NDEsImV4cCI6MjAzNDg3NDQ0MX0.Ner2Wvuop0mILVgNkhI_Q0_XNgzC32pKRTkAhQlWA2I';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: false,
    },
  });

  const fetchData = async () => {
    const {data, error} = await supabase
      .schema('public')
      .from('temperature')
      .select('*')
      .order('id', {ascending: false})
      .limit(1);

    if (error) {
      console.error(error);
    } else {
      console.log('Data', data);
      setDisplayText(`${data[0].value}°C`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeTemperature = async (temperature: number) => {
    const {data, error} = await supabase
      .from('temperature')
      .insert([{value: temperature}])
      .select();

    if (!!data) {
      console.log('dataCHange', data);
    }
  };

  const handleSettingInput = (text: React.SetStateAction<string>) => {
    setControl(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${setting}°C`);
    changeTemperature(Number(setting));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textdisplay}>
        Nhập ngưỡng nhiệt độ để bật tắt thiết bị
      </Text>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{displayText || '0°C'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleSettingInput}
          value={setting}
          placeholder="Nhập ngưỡng nhiệt độ"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#99D9F2',
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    width: 330,
    margin: 12,
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: 'white',
    padding: 10,
  },
  textdisplay: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 13,
    borderRadius: 20,
    width: 330,
    height: 45,
    marginLeft: 12,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  circle: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 200,
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
  },
  circleText: {
    fontSize: 30,
    color: 'black',
  },
});

export default App;
