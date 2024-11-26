import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import {AntDesign, MaterialCommunityIcons, Feather, MaterialIcons, FontAwesome5} from '@expo/vector-icons' 
import {List, PaperProvider} from 'react-native-paper'
import Input from '../../components/Input';
import config from '../../components/config';
import api from '../../components/api';
import { TextInput } from 'react-native';
import UserRequest from '../UserRequest';



const comments = [{id:1, name:'Peter Parker', comment:'Some test comment'} ,{id:2, name:'Peter Parker', comment:'Some comment text'}, {id:3, name:'Peter Parker', comment:'Some comment1'}]
export default function RequestDetails(item) {
  //const navigation = useNavigation();
  const route = useRoute();
  const req = route.params?.item;
  const [userName, setUserName] = useState("");
  const [addComment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const url = "https://my-json-server.typicode.com/rmb2020/database/comments" //Using a test json server
  const [expanded, setExpanded] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showVolunteerName, setVolunteerName] = useState(false);
  const handlePress = () => setExpanded(!expanded);

  const showUserName =() => {    
    setShowName(!showName);
  }

  const showVolunteer =() => {    
    setVolunteerName(!showVolunteerName);
  }

  const closeForm = () => {
    setIsEditing(false);
  }

  const handleEditClick = (event) => {
    event.stopPropagation();
    setIsEditing(true)
  }

  const handleOverlayClick = () => {
    setIsEditing(false);
  }

  const title=(
    <View style={styles.header}>
        <Text> 
           <FontAwesome5 name="user-circle" size={20} color="black" onPress={showUserName} />
             {showName && <Text> {userName}</Text>}{/*userName*/}  </Text>
            <Text><MaterialCommunityIcons name="account-star-outline" size={24} color="black" /></Text>
    </View>
  )

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

  const commentsView = (
    <View style={{ flexDirection: "row" }}>
    {isLoading ? <Text>Loading...</Text> : 
    (
      <ScrollView  showsHorizontalScrollIndicator={false}>
        {data.map((item) => {
          return (
            <View style={styles.commentBox} key={item.id}>
              <View style={styles.header}>
                <Image
                  source={require("../../assets/rn-logo.png")}
                  style={styles.userImage}
                />
                <Text style={styles.userName}> Peter Parker{/*item.name*/}</Text>
              </View>
              <Text
                numberOfLines={3}
                style={{ fontSize: 15, fontWeight: "400", marginLeft:5 }}
              >
                {item.comment} {/*item.comment*/}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    )}
    </View>
  )

  useEffect(() => {
    getUser();
    fetchData(); //fetching data for comments

  }, []);

  const fetchData = async () => {
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
  }
  
  const getUser = async () => {
    try{
      const user = await Auth.currentUserInfo();
      setUserName(user.attributes.given_name + ' ' + user.attributes.family_name);

    }catch(err){
      console.log('error from cognito : ',err)
   }
 }

  return (
    <SafeAreaView style={styles.container}>
      {isEditing && <Modal
        animationType="slide"
        transparent={true}
        visible={isEditing}
        onRequestClose={() => {
          Alert.alert('Edit closed.');
          setIsEditing(!isEditing);
        }}>
          <View
            style={{
              height: '90%',
              marginTop: 'auto',
            }}
          >
            <UserRequest isEdit={true} onClose={closeForm} requestItem={req} />
          </View>
      </Modal>}
      <View>        
        <View style={{  borderWidth:1,
        borderColor:'grey',
        borderRadius:10, marginBottom:10}}>
  
        <View style={styles.header}>
         <Text style={styles.title}> {req.subject}  </Text><Text style={{flex:1}}>
        <TouchableOpacity
                  style={{ height: 20, width: 65,
                    backgroundColor: 
                    reqStatus === "Open"
                    ? "#d4f980" : "#cfe2f3" ,
                    borderRadius: 17,
                  }}>
                    <Text style={{ color: "black", alignSelf: "center" }}>
                    {reqStatus}  
                  </Text></TouchableOpacity></Text>
         <Text style={{flex:1, marginLeft:10}}>  
            <AntDesign name="edit" size={24} color="black" onPress={()=>setIsEditing(true)}/>
                  {/*Using edit icon instead of button <TouchableOpacity style={{height: 20, width: 50,
                    backgroundColor:'#2986cc', borderRadius: 5}}> 
                    <Text style={{ color: "white", alignSelf: "center" }}>Edit</Text>
                    </TouchableOpacity>*/}
                    </Text>
            <Text style={{flex:1}}><FontAwesome5 name="user-circle" size={20} color="black" onPress={showUserName} />
             {showName && <Text> {userName}</Text>}{/*userName*/}  </Text>
            <Text style={{flex:1}}><MaterialCommunityIcons name="account-star-outline" size={24} color="black" onPress={showVolunteer}/> {showVolunteerName && <Text> Ethan Marshall</Text> }</Text>
          </View>
                   
      <List.Accordion
        //theme={{colors: {background: 'orange'} }}
        //style={{ backgroundColor: 'white' }}
        title={request}
        //titleNumberOfLines={3}        
      >       
      <View style={{alignItems: 'center'}} >
        <Text style={styles.textDescription}>
          {req?.description || "We need volunteers for our upcoming Community Clean-Up Day on August \
15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking \
up litter, sorting recyclables, and managing the registration table. \
We also need donations of trash bags, gloves, and refreshments."}
        </Text></View>        
      </List.Accordion>
      </View>
      </View>

      {/*Comment section code*/}
      <View style={{ flexDirection: "row", marginBottom:10 }}>
        <Text> </Text>
        <Input
          value={addComment}
          placeholder="Write a comment...."
          style={styles.addComment}
          onChange={(text) => setComment(text)}
        />
        <Text style={{ flex: 1 , marginLeft:5, marginTop:5 }}>
            <TouchableOpacity style={styles.postButton} >
          <Feather
            name="send"
            size={24}
            //backgroundColor="lightblue"
            color="white"
            marginTop={4}
            marginLeft={2}
          /></TouchableOpacity>{" "}
        </Text>
        <Text style={{ flex: 1 , marginLeft:5, marginTop:10 }}><Feather name={ expanded ? 'chevron-up' : 'chevron-down' }
              size={24} color="black" onPress={handlePress}/></Text>
      </View>
      {/* Displays data length of comments 
        <TouchableOpacity style={{width:30, height:30, borderRadius:50, alignContent:'center', backgroundColor:"#E6E6FA"}}>
            <Text style={{fontSize:20,marginTop:1}}>  {data.length}</Text>
        </TouchableOpacity>
      </View>*/}
      
      {/* show comments*/ expanded && commentsView }

      {/*3 Buttons view code below*/}
      <View style={{ flexDirection: "row", marginBottom:10, marginTop:10 }}>
      <TouchableOpacity style={{width:125, height:50, borderRadius:10, alignContent:'center',flexDirection: "row",alignItems: "center", backgroundColor:"#2F80ED"}}>
      <FontAwesome5 name="users" size={16} color="white" style={{ marginRight: 5 }} />
            <Text style={{fontSize:15, marginTop:1, color: "white"}}>Volunteer Organizations </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:125, height:50, borderRadius:10, marginLeft:10, alignContent:'center',flexDirection: "row",alignItems: "center", backgroundColor:"#EB5757"}}>
        <MaterialIcons name="emergency" size={20} color="white" style={{ marginRight: 5 }} />
            <Text style={{fontSize:15, marginTop:1, marginLeft:10, color: "white"}}>Emergency Contact </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:125, height:50, borderRadius:10, marginLeft:10, alignContent:'center',flexDirection: "row",alignItems: "center", backgroundColor:"#F2C94C"}}>
        <FontAwesome5 name="info-circle" size={16} color="white" style={{ marginRight: 5 }} />
            <Text style={{fontSize:15, marginTop:1, marginLeft:10, color: "white"}}>More Information </Text>
        </TouchableOpacity>
      </View>
      <List.Accordion  //From react native paper
  title="Helping Volunteers"
  //left={props => <List.Icon {...props} icon="folder" />}
>
  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter number of volunteers required..."
        style={styles.input}
        keyboardType="numeric"
      />
    </View>

    <TouchableOpacity style={styles.requestButton}>
      <FontAwesome5 name="user-plus" size={16} color="white" />
      <Text style={styles.buttonText}> Request Volunteers</Text>
    </TouchableOpacity>
  </View>
</List.Accordion>

    </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginLeft:5,
      marginRight:5
      //alignItems: 'center',
      //justifyContent: 'center',
      //marginTop: 20,
    },  
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        //marginBottom:2,
    },
    userImage: {
        width: 30,
        aspectRatio: 1,
        borderRadius: 25,
        marginRight: 10,  
        marginLeft: 4,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        //padding: 2,
                 
      },
      userName: {
        fontWeight: '600',
        marginBottom: 5,
        marginRight: 10,
        fontSize:15,
      },
      text: {
        fontWeight: '300',
        marginBottom: 20,
        marginRight: 10,
        fontSize:15,
      },
      textUpdate: {
        fontWeight: '400',
        marginBottom: 10,
        marginRight: 10,
        fontSize:15,
      },
      textDescription: {
        fontWeight: '300',
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        fontSize:20,
       // borderWidth:1,
        //borderColor:'grey',
       // borderRadius:17,
      },
      addComment: {
       height: 40,
        //margin: '3%',
        padding: '3%',
        width: '80%',
        borderWidth: 1,
        borderColor: 'lightgray',
        // borderRadius: 5,
        //backgroundColor: '#fff',
      },
      commentBox: {
        flex:1,
        backgroundColor:'#F8F8FF',
        borderColor:'black',
        borderWidth:1,
        marginHorizontal:15,
        justifyContent:'flex-start',
        height:80,
        width:config.deviceWidth*.95,
        borderRadius:17,
        marginTop:5,
        marginLeft:5,
      },
      postButton:{
        backgroundColor:"lightblue",
        width:30, 
        //alignContent:'center',
        //alignItems:'center',
        height:30,
        borderRadius:100
      },
        accordion: {
          backgroundColor: '#F7F7F8',
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
          borderColor: 'lightgray',
          borderRadius: 5,
          padding: 10,
          height: 40,
          backgroundColor: '#F5F5F5',
        },
        requestButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#2F80ED',
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 15,
        },
        buttonText: {
          color: 'white',
          marginLeft: 5,
          fontWeight: 'bold',
        },
      
  });

