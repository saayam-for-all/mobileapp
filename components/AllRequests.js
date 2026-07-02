//import * as React from 'react';
import React, { useEffect } from 'react';
//import { DataTable, Searchbar } from 'react-native-paper';
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons'

import { TextInput, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ReqFilter from '../screens/AllRequests/ReqFilter';
import { colors } from '../styles/theme';

const AllRequests = ({ data, isLoadingMore, onLoadMore }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(data);
  const [filters, setFilters] = React.useState({ requestStatus: {}, requestPriority: {}, categoryFilter: {}, checkedCategories: [] });
  const [selectedPriority, setSelectedPriority] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);

  const handleNavigate = () => {
    setShowFilter(true);
  }

  const handleFilterDone = (newFilters) => {
    setFilters(newFilters);
    setSelectedPriority(newFilters.selectedPriority || []);
    setShowFilter(false);
  };

  const handlePriorityPress = (level) => {
    if (level === "All") {
      setSelectedPriority([]);
      return;
    }

    if (selectedPriority.includes(level)) {
      setSelectedPriority(selectedPriority.filter((p) => p !== level));
    } else {
      if (selectedPriority.length < 2) {
        setSelectedPriority([...selectedPriority, level]);
      } else {
        setSelectedPriority([]);
      }
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter(item =>
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (Object.keys(filters.requestStatus).length > 0) {
      result = result.filter(item =>
        Object.values(filters.requestStatus).includes(item.status)
      );
    }

    if (Object.keys(filters.requestPriority).length > 0) {
      result = result.filter(item =>
        Object.values(filters.requestPriority).includes(item.priority)
      );
    }

    if (selectedPriority.length > 0) {
      result = result.filter((item) => selectedPriority.includes(item.priority));
    }

    if (filters.checkedCategories && filters.checkedCategories.length > 0) {
      result = result.filter(item =>
        filters.checkedCategories.includes(item.category)
      );
    }

    setFilteredData(result);
  }, [data, searchQuery, filters, selectedPriority]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          placeholder="Search the request"
          outlined
          left={<TextInput.Icon icon="magnify" size={28} style={{ pointerEvents: 'none' }} />}
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, styles.iconButton]}
          onPress={handleNavigate}
        >
          <Ionicons name="options-outline" size={18} color={colors.chrome} />
        </TouchableOpacity>

        <View style={styles.verticalDivider} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityScroll}>
          {["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterButton,
                (level === "All" && selectedPriority.length === 0) ||
                  selectedPriority.includes(level)
                  ? styles.selectedButton
                  : null,
              ]}
              onPress={() => handlePriorityPress(level)}
            >
              <Text
                style={[
                  styles.filterText,
                  (level === "All" && selectedPriority.length === 0) ||
                    selectedPriority.includes(level)
                    ? styles.selectedText
                    : null,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
      {showFilter && (
        <Modal visible={showFilter} animationType="slide" transparent={true}>
          <View style={{ flex: 1, backgroundColor: colors.overlay }}>
            <ReqFilter
              currentFilters={{ ...filters, selectedPriority }}
              onGoBack={handleFilterDone}
              onClose={() => setShowFilter(false)}
            />
          </View>
        </Modal>
      )}
      <FlatList
        keyExtractor={(item, index) => String(item.id || item.requestId || index)}
        data={filteredData}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={colors.chrome} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reqData} onPress={() => { navigation.navigate("RequestDetails", { item, reqTitle: item.id }) }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                Id : {item.id}{" "}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "400", fontSize: 17 }}>
                {" "}
                {item.subject}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {" "}
                <AntDesign name="right" size={15} color={colors.black} />
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>
                {" "}
                <AntDesign name="calendar" size={20} color={colors.black} />{" "}
                {item.creationDate}{" "}
              </Text>
            </View>

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.black,
                marginTop: 5,
                marginBottom: 5,
              }}
            ></View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginRight: 5,
  },
  reqData: {
    width: '100%',
    marginBottom: 2,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  input: {
    fontSize: 15,
    width: "98%",
    marginBottom: 20,
    marginRight: 10,
    height: 28,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginTop: 5,
  },

  priorityScroll: {
    flexShrink: 1,
  },

  filterButton: {
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: colors.chrome,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  iconButton: {
    paddingHorizontal: 14,
  },

  verticalDivider: {
    width: 1.2,
    height: 40,
    backgroundColor: colors.chromeDivider,
    marginHorizontal: 8,
  },

  selectedButton: {
    backgroundColor: colors.chrome,
    borderColor: colors.chrome,
  },

  filterText: {
    color: colors.chrome,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },

  selectedText: {
    color: colors.white,
    fontWeight: "600",
  },
});

export default AllRequests;
