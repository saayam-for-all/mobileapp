import * as React from 'react';
//import { DataTable, Searchbar } from 'react-native-paper';
import { StyleSheet, Text, View, Modal, Button, TouchableOpacity, FlatList} from 'react-native';
import { AntDesign, Ionicons, Octicons } from '@expo/vector-icons' 

import {TextInput, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AllRequests = ({ data }) => {
  const navigation = useNavigation();
  const [sortAscending, setSortAscending] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([4,5]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [isVisible,setVisible] = React.useState(false);
  const toggleVisibility = () => setVisible(!isVisible);
  const [idBasic, setIdBasic] = React.useState();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(data);

  const showModalBasic = (id, status, category) => {
    toggleVisibility();
    setIdBasic('' + id + '\nStatus: ' + status + '\nCategory: ' + category);
  }

  const [items] = React.useState(data);

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
    const filtered = text === "" ? data : data.filter(
      (data) =>
        data.subject.toLowerCase().includes(text.toLowerCase()) ||
        data.category.toLowerCase().includes(text.toLowerCase()) ||
        data.id.toLowerCase().includes(text.toLowerCase())
        // ||
        //data.id.includes(text)
    );
    setFilteredData(filtered);
  };

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          placeholder="Search the request"
          //size={28}
          outlined
          left={<TextInput.Icon icon="magnify" size={28} style={{pointerEvents: 'none'}} />}
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ReqFilter')}>
        <Text style={{marginBottom:20}}><Ionicons name="filter" size={28} color="black" /></Text>
        </TouchableOpacity>
      </View>
      <FlatList
        keyExtractor={(item) => item.id}
        //data={data}
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.reqData}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold" }}>
                {" "}
                Id : {item.id}{" "}
              </Text>
             
                <Text style={{ flex: 1, textAlign: "right" }}>
                  <Octicons
                    name="dot-fill"
                    size={15}
                    color={item.status === "Open" ? "orange" : "#aeb6bf"}
                  />
                  <Text> {item.status} </Text>
                </Text>
             
            </View>
            <View>
              <Text style={{ fontWeight: "350" }}> {item.category} </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "400", fontSize: 17 }}>
                {" "}
                {item.subject}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
                {" "}
                <AntDesign name="right" size={15} color="black" onPress={() => {navigation.navigate("RequestDetails", { item, reqTitle: item.id} )}} />
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text>
                {" "}
                <AntDesign name="calendar" size={20} color="black" />{" "}
                {item.creationDate}{" "}
              </Text>
              <Text style={{ flex: 1, textAlign: "right" }}>
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
              </Text>
            </View>

            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "black",
                marginTop: 5,
                marginBottom: 5,
              }}
            ></View>
          </View>
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
    marginLeft:5,
    marginRight:5
  },
  tabText: {
    marginLeft: 24,  
    fontSize: 18,
    //alignContent:'center',
    //justifyContent:'center'
  },
  modalContainer:{
    backgroundColor:"#ccc",
    top:0,
    left:0,
    right:0,
    bottom:0,
    position:'absolute',
},
modalView:{
    flex:1,
    alignContent:'center',
    justifyContent:'center'
},
alert:{
    width:'100%',
    maxWidth:300,
    margin:48,
    elevation:24,
    borderRadius:2,
    backgroundColor:'#fff'
},
alertTitle:{
    margin:24,
    fontWeight:"bold",
    fontSize:24,
    color:"#000"
},
alertMessage:{
    marginLeft:24,
    marginRight:24,
    marginBottom:24,
    fontSize:16,
    color:"#000"
},
alertButtonGroup:{
    marginTop:0,
    marginRight:0,
    marginBottom:8,
    marginLeft:24,
    padding:10,
    display:"flex",
    flexDirection:'row',
    justifyContent:"flex-end"
},
alertButton:{
    marginTop:12,
    marginRight:8,
    width:100
},
reqDataRow:{
  //flex: .4,
  flexDirection: 'row',
  //columnGap: 50
},
reqData:{
  width: '100%',
  //height: 100,
  marginBottom: 2,
  borderRadius: 2,
  backgroundColor: 'white'
},
priorityButton:{
  marginTop:5,
  marginleft:100,
  
},
input: {
    fontSize: 15,
    //marginLeft: 5,
    width: "85%",
    marginBottom: 20,
    //borderWidth: 1,
    //borderColor: 'lightgray',
    marginRight: 10,
    height:28

  },

});

export default AllRequests;
