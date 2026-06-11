import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import AllRequests from '../../components/AllRequests';
import { getMyRequests } from '../../services/requestServices';
import useAuthUser from '../../hooks/useAuthUser';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default function MyReqs() {
  const [data, setData] = useState([]);
  const user = useAuthUser();
  const userDbId = user?.attributes?.userDbId;

  const getData = async () => {
    try {
      const res = await getMyRequests({ userId: userDbId, page: 0, size: 10 });
      const records = res?.data?.content || res?.content || res?.body || [];
      const normalized = records.map((r) => ({
        ...r,
        id: r.requestId || r.id,
        category: r.requestCategory || r.category,
        description: r.reqDesc || r.description,
      }));
      setData(normalized);
    } catch (error) {
      console.log('data error', error);
    }
  };

  useEffect(() => {
    if (userDbId) {
      getData();
    }
  }, [userDbId]);

  if (data && data.length) {
    return (
      <SafeAreaView style={styles.container}>
        <AllRequests data={data} />
      </SafeAreaView>
    );
  }
}
