//import * as React from 'react';
import React, { useEffect } from 'react';
//import { DataTable, Searchbar } from 'react-native-paper';
import { StyleSheet, Text, View, Modal, Button, TouchableOpacity, FlatList } from 'react-native';
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons'

import { TextInput, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ReqFilter from '../screens/AllRequests/ReqFilter';

const AllRequests = ({ data }) => {
  const navigation = useNavigation();
  const [sortAscending, setSortAscending] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([4, 5]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [isVisible, setVisible] = React.useState(false);
  const toggleVisibility = () => setVisible(!isVisible);
  const [idBasic, setIdBasic] = React.useState();
  const [status, setStatus] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(data);
  const [isDataBAck, setDataBack] = React.useState(false);
  const [filters, setFilters] = React.useState({ requestStatus: {}, requestPriority: {}, selectedCategories: [], selectedSubCategories: [] });
  const [selectedPriority, setSelectedPriority] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);

  /* const showModalBasic = (id, status, category) => {
     toggleVisibility();
     setIdBasic('' + id + '\nStatus: ' + status + '\nCategory: ' + category);
   }*/

  const [items] = React.useState(data);

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

  const sortedItems = items
    .slice()
    .sort((item1, item2) =>
      sortAscending
        ? item1.creationDate.localeCompare(item2.creationDate)
        : item2.creationDate.localeCompare(item1.creationDate)
    );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  /* React.useEffect(() => {
     setPage(0);
   }, [itemsPerPage]);*/

  useEffect(() => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      result = result.filter(item =>
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Request Status filter
    if (Object.keys(filters.requestStatus).length > 0) {
      result = result.filter(item =>
        Object.values(filters.requestStatus).includes(item.status)
      );
    }

    // Request Priority filter from ReqFilter.js
    if (Object.keys(filters.requestPriority).length > 0) {
      result = result.filter(item =>
        Object.values(filters.requestPriority).includes(item.priority)
      );
    }

    if (selectedPriority.length > 0) {
      result = result.filter((item) => selectedPriority.includes(item.priority));
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      result = result.filter(item =>
        filters.selectedCategories.includes(item.category)
      );
    }

    setFilteredData(result);
  }, [searchQuery, filters, selectedPriority]);

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
            testID="navigateButton"
          style={[styles.filterButton, styles.iconButton]}
          onPress={handleNavigate}
        >
          <Ionicons name="options-outline" size={18} color="#4d4d4dff" />
        </TouchableOpacity>

        <View style={styles.verticalDivider} />

        {["All", "Low", "Medium", "High"].map((level) => (
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

      </View>
      {showFilter && (
        <Modal visible={showFilter} animationType="slide" transparent={true}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <ReqFilter
              currentFilters={{ ...filters, selectedPriority }}
              onGoBack={handleFilterDone}
              onClose={() => setShowFilter(false)}
            />
          </View>
        </Modal>
      )}
      <FlatList
        keyExtractor={(item) => item.id}
        //data={data}
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reqData} onPress={() => { navigation.navigate("RequestDetails", { item, reqTitle: item.id }) }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                Id : {item.id}{" "}
              </Text>

              {/* <Text style={{ flex: 1, textAlign: "right" }}>
                  <Octicons
                    name="dot-fill"
                    size={15}
                    color={item.status === "Open" ? "orange" : "#aeb6bf"}
                  />
                  <Text> {item.status} </Text>
                </Text> */}

            </View>
            {/* <View>
              <Text style={{ fontWeight: "350" }}> {item.category} </Text>
            </View> */}
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "400", fontSize: 17 }}>
                {" "}
                {item.subject}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {" "}
                <AntDesign name="right" size={15} color="black" testID='antDesign' />
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>
                {" "}
                <AntDesign name="calendar" size={20} color="black"  testID='antDesign'/>{" "}
                {item.creationDate}{" "}
              </Text>
              {/* <Text style={{ flex: 1, textAlign: "right" }}>
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 70,
                    backgroundColor:
                      item.priority === "High"
                        ? "#7ba6c8"
                        : item.priority === "Medium"
                        ? "#796796"
                        : "#d0d0e1",
                    borderRadius: 17,
                  }}
                >
                  <Text style={{ color: "white", alignSelf: "center" }}>
                    {item.priority}
                  </Text>
                </TouchableOpacity>
              </Text> */}
            </View>

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "black",
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
    //width: '100%',
    //alignContent:'center',
    //flex: 1,
    //justifyContent:'center'
    marginLeft: 5,
    marginRight: 5
  },
  tabText: {
    marginLeft: 24,
    fontSize: 18,
    //alignContent:'center',
    //justifyContent:'center'
  },
  modalContainer: {
    backgroundColor: "#ccc",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  modalView: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  alert: {
    width: '100%',
    maxWidth: 300,
    margin: 48,
    elevation: 24,
    borderRadius: 2,
    backgroundColor: '#fff'
  },
  alertTitle: {
    margin: 24,
    fontWeight: "bold",
    fontSize: 24,
    color: "#000"
  },
  alertMessage: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    fontSize: 16,
    color: "#000"
  },
  alertButtonGroup: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 8,
    marginLeft: 24,
    padding: 10,
    display: "flex",
    flexDirection: 'row',
    justifyContent: "flex-end"
  },
  alertButton: {
    marginTop: 12,
    marginRight: 8,
    width: 100
  },
  reqDataRow: {
    //flex: .4,
    flexDirection: 'row',
    //columnGap: 50
  },
  reqData: {
    width: '100%',
    //height: 100,
    marginBottom: 2,
    borderRadius: 2,
    backgroundColor: 'white'
  },
  priorityButton: {
    marginTop: 5,
    marginleft: 100,

  },
  input: {
    fontSize: 15,
    //marginLeft: 5,
    width: "98%",
    marginBottom: 20,
    //borderWidth: 1,
    //borderColor: 'lightgray',
    marginRight: 10,
    height: 28

  },

  filterRow: {
    flexDirection: "row",
    alignItems: "Left",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginTop: 5,
  },

  filterButton: {
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: "#4d4d4dff",
    borderRadius: 25, // pill shape
    backgroundColor: "white",
    flexDirection: "row",
    marginHorizontal: 6,
    alignItems: "center", // vertical centering
    justifyContent: "center",
  },

  iconButton: {
    paddingHorizontal: 14,
  },

  verticalDivider: {
    width: 1.2,
    height: 40,
    backgroundColor: "#626262ff",
    marginHorizontal: 8,
  },

  selectedButton: {
    backgroundColor: "#4d4d4dff",
    borderColor: "#4d4d4dff",
  },

  filterText: {
    color: "#4d4d4dff",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    textAlignVertical: "center", // vertical centering (mainly for Android)
    alignSelf: "center",         // ensure the text itself stays centered in the parent
  },

  selectedText: {
    color: "white",
    fontWeight: "600",
  },
});

export default AllRequests;
