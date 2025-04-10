import React, { useEffect, useState, Children } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from "react-native";
import Markdown from 'react-native-markdown-display';
import Auth from "@aws-amplify/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { List, PaperProvider } from "react-native-paper";
import Input from "../../../components/Input";
import config from "../../../components/config";
import api from "../../../components/api";
import { TextInput } from "react-native";
import UserRequest from "../../UserRequest";
import Button from '../../../components/Button';

const ButtonsView = () => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [info, setInfo] = useState('');
  const route = useRoute();
  const req = route.params?.item;
  const generateAnswer = async () => {
    const res = await api.post(
      "/genai/v0.0.1/generate_answer",
      {category: req?.category, subject:req?.subject, description: req?.description}
    );
    setInfo(res.data);
    setInfoOpen(true);
  }
  return (
    <View style={{ flexDirection: "row", marginBottom: 15, marginTop: 15 }}>
      {infoOpen && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={infoOpen}
          onRequestClose={() => {
              Alert.alert("Edit closed.");
              setInfoOpen(!infoOpen);
          }}
          >
          <View
              style={{
              height: "90%",
              marginTop: "auto",
              }}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.infoContainer}>
              <Markdown>
                {info}
              </Markdown>
              <View style={styles.buttonContainer}>
                <Button 
                  backgroundColor="blue" 
                  style={{width:'25%', marginRight:0, marginLeft:"auto"}}
                  onPress={()=>{setInfoOpen(false)}}
                >
                  Ok
                </Button>
              </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
        <TouchableOpacity
        style={{
            width: 125,
            height: 50,
            borderRadius: 10,
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#2F80ED",
        }}
        >
        <FontAwesome5
            name="users"
            size={16}
            color="white"
            style={{ marginRight: 5 }}
        />
        <Text style={{ fontSize: 15, marginTop: 1, color: "white" }}>
            Volunteer Organizations{" "}
        </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={{
            width: 125,
            height: 50,
            borderRadius: 10,
            marginLeft: 10,
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#EB5757",
        }}
        >
        <MaterialIcons
            name="emergency"
            size={20}
            color="white"
            style={{ marginRight: 5 }}
        />
        <Text
            style={{
            fontSize: 15,
            marginTop: 1,
            marginLeft: 10,
            color: "white",
            }}
        >
            Emergency Contact{" "}
        </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
              width: 125,
              height: 50,
              borderRadius: 10,
              marginLeft: 10,
              alignContent: "center",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F2C94C",
          }}
          onPress={generateAnswer}
        >
        <FontAwesome5
          name="info-circle"
          size={16}
          color="white"
          style={{ marginRight: 5 }}
        />
        <Text
          style={{
          fontSize: 15,
          marginTop: 1,
          marginLeft: 10,
          color: "white",
          }}
        >
            More Information{" "}
        </Text>
        </TouchableOpacity>
    </View>
  )
}

const Comments = ({title="Comments"}) => {
    const url = "https://my-json-server.typicode.com/rmb2020/database/comments"; //Using a test json server
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [addComment, setComment] = useState("");

    useEffect(() => {
        fetchComments();
    },[])

    const fetchComments = async () => {
        try {
          const res = await fetch(url); //not needed now //temp reverting back to fetch
          //const res = await api.get('rmb2020/database/comments') //Get data axios instance
          const resdata = await res.json(); //not needed now
          // const resdata = res.data;//Axios data
          setData(resdata);
          // console.log(resdata)
          setLoading(false);
        } catch (err) {
          console.log("error from axios : ", err);
        }
      };
    
    const commentsView = (
        <View style={{ flexDirection: "row" }}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <ScrollView showsHorizontalScrollIndicator={false}>
                {data.map((item) => {
                    return (
                    <View style={styles.commentBox} key={item.id}>
                        <View style={styles.header}>
                        <Image
                            source={require("../../../assets/rn-logo.png")}
                            style={styles.userImage}
                        />
                        <Text style={styles.userName}>
                            {" "}
                            Peter Parker{/*item.name*/}
                        </Text>
                        </View>
                        <Text
                        numberOfLines={3}
                        style={{ fontSize: 15, fontWeight: "400", marginLeft: 5 }}
                        >
                        {item.comment} {/*item.comment*/}
                        </Text>
                    </View>
                    );
                })}
                </ScrollView>
            )}
        </View>
    );
    return (
        <View>
            {/*Comment section code*/}
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Text> </Text>
                <Input
                    value={addComment}
                    placeholder="Write a comment...."
                    style={styles.addComment}
                    onChange={(text) => setComment(text)}
                />
                <Text style={{ flex: 1, marginLeft: 5, marginTop: 5 }}>
                <TouchableOpacity style={styles.postButton}>
                    <Feather
                        name="send"
                        size={24}
                        //backgroundColor="lightblue"
                        color="white"
                        marginTop={4}
                        marginLeft={2}
                    />
                </TouchableOpacity>{" "}
                </Text>
                <Text style={{ flex: 1, marginLeft: 5, marginTop: 10 }}>
                {/* <Feather
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                    onPress={handlePress}
                /> */}
                </Text>
            </View>
            {/* Displays data length of comments 
                <TouchableOpacity style={{width:30, height:30, borderRadius:50, alignContent:'center', backgroundColor:"#E6E6FA"}}>
                    <Text style={{fontSize:20,marginTop:1}}>  {data.length}</Text>
                </TouchableOpacity>
            </View>*/}
            {commentsView}
        </View>
    )
    
}

const ExpandableListItem = ({ item, expanded, onPress }) => {
  return (
    <View style={volunteerStyles.itemContainer}>
      <TouchableOpacity 
        style={volunteerStyles.headerRow} 
        onPress={onPress}
      >
        <View style={volunteerStyles.titleContainer}>
          <Text style={volunteerStyles.name}>{item.name}</Text>
          <View style={volunteerStyles.ratingContainer}>
            <Icon 
              name="star" 
              size={20} 
              color="#FFD700"
            />
            <Text style={volunteerStyles.rating}>{item.rating}</Text>
          </View>
        </View>
        <Icon 
          name={expanded ? "expand-less" : "expand-more"} 
          size={24} 
          color="#3D2A1F" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={volunteerStyles.expandedContent}>
          <View style={volunteerStyles.detailsContainer}>
            <Text style={volunteerStyles.detailText}>Address: {item.address}</Text>
            <Text style={volunteerStyles.detailText}>Size: {item.size}</Text>
            <Text style={volunteerStyles.detailText}>Cause: {item.causes}</Text>
          </View>
          <View style={volunteerStyles.actionButtons}>
            <TouchableOpacity style={volunteerStyles.actionButton}>
              <Icon name="phone" size={24} color="#4CAF50" />
              <Text style={volunteerStyles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={volunteerStyles.actionButton}>
              <Icon name="email" size={24} color="#2196F3" />
              <Text style={volunteerStyles.actionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const ExpandableList = ({data}) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={volunteerStyles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpandableListItem
            item={item}
            expanded={expandedId === item.id}
            onPress={() => toggleExpand(item.id)}
          />
        )}
      />
    </View>
  );
};

const volunteerStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 500,
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: '#3D2A1F',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
  },
  expandedContent: {
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailText: {
    marginBottom: 8,
    fontSize: 14,
  },
});

const Volunteer = ({title="Volunteer"}) => {
    const [volunteerData, setVolunteerData] = useState(null);
    const [volunteerCount, setVolunteerCount] = useState(0);
    const [rowHeights, setRowHeights] = useState({}); // Store max height for each row
    const [inputValue, setInputValue] = useState(0);
    const [showVolunteers, setShowVolunteers] = useState(false);

    const columnWidths = {
        name: 150,
        cause: 120,
        phone: 150,
        email: 200,
        location: 180,
        rating: 100,
    };
    const columnMapping = {
        name: "Name",
        cause: "Cause",
        phone: "Phone",
        email: "Email",
        location: "Location",
        rating: "Rating",
    };

    useEffect(()=>{
        handleRequestVolunteers();
    },[]);

    const handleRequestVolunteers = async () => {
        try {
          const data = await fetchOrgData();
          //console.log("data", data);
          if (data.body && data.body.length > 0) {
            setVolunteerData(data.body);
            setShowVolunteers(true);
          } else {
            setVolunteerData({
              causes: "",
              size: "",
              name: "",
              Location: "",
              rating: "",
              id: "",
            });
          }
          //console.log("volunteer", volunteerData);
        } catch (error) {
          console.error("Error requesting volunteers:", error);
        }
    };
    const fetchOrgData = async () => {
        try {
            const res = await api.get("/volunteer-orgs/v0.0.1/organizations-list"); //get data axios instance
            const resdata = res.data; //axios data
            // console.log("resdata", resdata);
            return resdata;
        } catch (error) {
            console.log("error from axios:", error);
            return null;
        }
    };
    const updateRowHeight = (rowIndex, height) => {
        setRowHeights((prevHeights) => ({
          ...prevHeights,
    
          [rowIndex]: Math.max(prevHeights[rowIndex] || 0, height),
        }));
      };
    
    const getColumnWidth = (key) => columnWidths[key] || 100;
    return (
        <View>
            <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
            >
            <View style={styles.inputContainer}>
                <TextInput
                placeholder="Enter number of volunteers required..."
                style={styles.input}
                keyboardType="numeric"
                onChangeText={(text) => {
                    const numericValue = parseInt(text, 10); // Convert to integer // Set to 0 if NaN
                    setInputValue(isNaN(numericValue) ? 0 : numericValue); // Set to 0 if NaN
                }}
                />
            </View>

            <TouchableOpacity
                style={styles.requestButton}
                onPress={() => {
                setVolunteerCount(inputValue);
                handleRequestVolunteers();
                }}
            >
                <FontAwesome5 name="user-plus" size={16} color="white" />
                <Text style={styles.buttonText}> Request Volunteers</Text>
            </TouchableOpacity>
            </View>

            {/* Volunteer Table - Rendered Below the Button */}
            {showVolunteers && 
              (<View style={styles.volunteerTableContainer}>
                {volunteerData === null ? <Text> Loading... </Text> : <ExpandableList data={volunteerData.slice(0, volunteerCount)} />}
              </View>)
            }
        </View>
    )
}

const Attributes = ({title="Details", userName, setUserName}) => {
  const [showName, setShowName] = useState(false);
  const [showVolunteerName, setVolunteerName] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const route = useRoute();
  const req = route.params?.item;

  const showUserName = () => {
    setShowName(!showName);
  };

  const showVolunteer = () => {
    setVolunteerName(!showVolunteerName);
  };
  const closeForm = () => {
      setIsEditing(false);
  };

  const reqStatus = req.status;
  
  const request = (
      <View style={styles.header}>
          <Text>
              <AntDesign name="calendar" size={24} color="black" /> {req.creationDate}
              {"   "}
          </Text>
          <Text>
              <MaterialCommunityIcons
                  name="layers-triple-outline"
                  size={24}
                  color="black"
              />{" "}
              {req.category} {"   "}
          </Text>
      
          <Text>
              <FontAwesome5
                  name="exclamation-triangle"
                  size={20}
                  color={
                      req.priority === "High"
                      ? "#f44336"
                      : req.priority === "Medium"
                      ? "#fcc286"
                      : "#eae5f6"
                  }
              />{" "}
              {req.priority}
          </Text>
      </View>
  );
      
  return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
          {isEditing && (
              <Modal
              animationType="slide"
              transparent={true}
              visible={isEditing}
              onRequestClose={() => {
                  Alert.alert("Edit closed.");
                  setIsEditing(!isEditing);
              }}
              >
              <View
                  style={{
                  height: "90%",
                  marginTop: "auto",
                  }}
              >
                  <UserRequest isEdit={true} onClose={closeForm} requestItem={req} />
              </View>
              </Modal>
          )}
        <View style={styles.header}>
          <Text style={styles.subTitle}> {req.subject} </Text>
          <Text style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                height: 20,
                width: 65,
                backgroundColor: reqStatus === "Open" ? "#d4f980" : "#cfe2f3",
                borderRadius: 17,
              }}
            >
              <Text style={{ color: "black", alignSelf: "center" }}>
                {reqStatus}
              </Text>
            </TouchableOpacity>
          </Text>
          <Text style={{ flex: 1 }}>
            <FontAwesome5
              name="user-circle"
              size={20}
              color="black"
              onPress={showUserName}
            />
            {showName && <Text> {userName}</Text>}
            {/*userName*/}{" "}
          </Text>
          <Text style={{ flex: 1 }}>
            <MaterialCommunityIcons
              name="account-star-outline"
              size={24}
              color="black"
              onPress={showVolunteer}
            />{" "}
            {showVolunteerName && <Text> Ethan Marshall</Text>}
          </Text>
          <Text style={{ flex: 1, marginLeft: 10 }}>
            <AntDesign
              name="edit"
              size={24}
              color="black"
              onPress={() => setIsEditing(true)}
            />
            {/*Using edit icon instead of button <TouchableOpacity style={{height: 20, width: 50,
                  backgroundColor:'#2986cc', borderRadius: 5}}> 
                  <Text style={{ color: "white", alignSelf: "center" }}>Edit</Text>
                  </TouchableOpacity>*/}
          </Text>
          
        </View>

          {request}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textDescription}>
              {req?.description ||
                "We need volunteers for our upcoming Community Clean-Up Day on August \
15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking \
up litter, sorting recyclables, and managing the registration table. \
We also need donations of trash bags, gloves, and refreshments."}
            </Text>
          </View>
      </View>
  )
}

const TabsToggle = ({children}) => {
  const tabs = Children.toArray(children);
  const [status, setStatus] = useState(0);
  return (
    <View>
      {/* titles */}
      <View style={{display: "flex", flexDirection: "row", marginBottom:10}}>
          {Children.map(children, (tab, index) => (
              <TouchableOpacity key={tab.props.title} style={index==status ? {...styles.tab,...styles.tabSelected} : styles.tab}
                onPress={() => setStatus(index)}
              >
                <Text style={styles.tabTitle}>{tab.props.title}</Text>
              </TouchableOpacity>
          ))}
      </View>
      {/* content */}
      { tabs[status] }
    </View>
  )
}

export default function RequestDetails({ signOut }) {
  //const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const route = useRoute();
  const req = route.params?.item;
  
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await Auth.currentUserInfo();
      setUserName(
        user.attributes.given_name + " " + user.attributes.family_name
      );
    } catch (err) {
      //signOut();  // If error getting usern then signout
      Alert.alert( // show alert to signout
        "Alert", // Title
        "Session timeout. Please sign in again", // Message
        [            
          {
            text: "Logout",
            onPress: () => signOut(),
            style: "destructive", 
          },
        ],
      );  
      console.log("error from cognito : ", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}> {req.subject} </Text>
        <ButtonsView/>
        <TabsToggle>
          <Comments title="Comments"/>
          <Volunteer title="Volunteer"/>
          <Attributes title="Details" userName = {userName} setUserName = {setUserName}/>
        </TabsToggle>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginLeft: 5,
    marginRight: 5,
    //alignItems: 'center',
    //justifyContent: 'center',
    //marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    //marginBottom:2,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom:2,
  },
  tab: {
    flex: 1,
    padding:10,
    height: 50,
    borderWidth: 1,
  },
  tabSelected: {
    borderBottomWidth: 0
  },
  tabTitle: {
    fontSize:20,
    fontWeight: "bold",
  },
  userImage: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  userName: {
    fontWeight: "600",
    marginBottom: 5,
    marginRight: 10,
    fontSize: 15,
  },
  text: {
    fontWeight: "300",
    marginBottom: 20,
    marginRight: 10,
    fontSize: 15,
  },
  textUpdate: {
    fontWeight: "400",
    marginBottom: 10,
    marginRight: 10,
    fontSize: 15,
  },
  textDescription: {
    fontWeight: "300",
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 20,
    // borderWidth:1,
    //borderColor:'grey',
    // borderRadius:17,
  },
  addComment: {
    height: 40,
    //margin: '3%',
    padding: "3%",
    width: "80%",
    borderWidth: 1,
    borderColor: "lightgray",
    // borderRadius: 5,
    //backgroundColor: '#fff',
  },
  commentBox: {
    flex: 1,
    backgroundColor: "#F8F8FF",
    borderColor: "black",
    borderWidth: 1,
    marginHorizontal: 15,
    justifyContent: "flex-start",
    height: 80,
    width: config.deviceWidth * 0.95,
    borderRadius: 17,
    marginTop: 5,
    marginLeft: 5,
  },
  postButton: {
    backgroundColor: "lightblue",
    width: 30,
    //alignContent:'center',
    //alignItems:'center',
    height: 30,
    borderRadius: 100,
  },
  accordion: {
    backgroundColor: "#F7F7F8",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
    height: 40,
    backgroundColor: "#F5F5F5",
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F80ED",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "bold",
  },

  volunteerTableContainer: {
    height:"500",
    marginTop: 10,
    paddingHorizontal: 10,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  columnHeader: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  tableCell: {
    textAlign: "center",
    paddingVertical: 10,
  },
});

