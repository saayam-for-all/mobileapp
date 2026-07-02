import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import AllRequests from '../../components/AllRequests';
import { getAllPaginatedRequests } from '../../services/requestServices';

const PAGE_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default function OtherRequests() {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageRef = useRef(0);

  const getData = useCallback(async (pageNum) => {
    try {
      setIsLoadingMore(true);
      const res = await getAllPaginatedRequests({ page: pageNum, size: PAGE_SIZE });
      const records = res?.data?.content || res?.content || res?.body || [];
      const normalized = records.map((r) => ({
        ...r,
        id: r.requestId || r.id,
        category: r.requestCategory || r.category,
        description: r.reqDesc || r.description,
      }));

      if (pageNum === 0) {
        setData(normalized);
      } else {
        setData((prev) => [...prev, ...normalized]);
      }

      setHasMore(records.length === PAGE_SIZE);
      pageRef.current = pageNum;
    } catch (error) {
      console.log('data error', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    pageRef.current = 0;
    setHasMore(true);
    getData(0);
  }, [getData]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      getData(pageRef.current + 1);
    }
  }, [isLoadingMore, hasMore, getData]);

  if (data && data.length) {
    return (
      <SafeAreaView style={styles.container}>
        <AllRequests
          data={data}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
        />
      </SafeAreaView>
    );
  }
}
