import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import AllRequests from '../../components/AllRequests';
import { getOthersRequests } from '../../services/requestServices';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function OtherRequests() {
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await getOthersRequests();
      setData(res["body"]);
    } catch (error) {
      console.log('data error', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (data && data.length) {
    return (
      <SafeAreaView style={styles.container}>
        <AllRequests data={data} />
      </SafeAreaView>
    );
  }
}
