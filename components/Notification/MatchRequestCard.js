import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons' 
import { useNavigation } from '@react-navigation/native';

const sampleItem = {
    
}

const MatchRequestCard = (item=sampleItem) => {
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
}

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

  export default MatchRequestCard;