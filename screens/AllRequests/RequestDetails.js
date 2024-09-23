import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import Auth from '@aws-amplify/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
import {AntDesign, Octicons, Feather} from '@expo/vector-icons' 

import Input from '../../components/Input';
import config from '../../components/config';



const comments = [{id:1, name:'Peter Parker', comment:'Some test comment'} ,{id:2, name:'Peter Parker', comment:'Some comment text'}, {id:3, name:'Peter Parker', comment:'Some comment1'}]
export default function RequestDetails(item) {
  //const navigation = useNavigation();
  const route = useRoute();
  const req = route.params?.item;
  const [userName, setUserName] = useState("");
  const [addComment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const url = "https://my-json-server.typicode.com/rmb2020/database/comments" //Using a test json server



  useEffect(() => {
    getUser()
    fetchData()

  }, []);

  const fetchData = async () => {
    try{
    const res = await fetch(url)
    const resdata = await res.json()
    setData(resdata)
    // console.log(resdata)
     setLoading(false)
    }catch(err){
       console.log('error from fetch : ',err)
    }
  }
  
  const getUser = async () => {
    try{
      const user = await Auth.currentUserInfo();
      setUserName(user.attributes.name);

    }catch(err){
      console.log('error from cognito : ',err)
   }
 }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.title}> {req.subject}</Text>
          
        </View>
        <View style={{  borderWidth:1,
        borderColor:'grey',
        borderRadius:17, marginBottom:10}}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/rn-logo.png")}
            style={styles.userImage}
          />

          <Text style={styles.userName}> {userName}</Text>
          <Text style={{ flex: 1, textAlign: "right" }}>
            <Octicons
              name="dot-fill"
              size={20}
              color={req.status === "Open" ? "orange" : "#aeb6bf"}
            />{" "}
            <Text style={{ fontSize: 20 }}>{req.status}</Text>
          </Text>
        </View>
        <Text>
          {" "}
          <AntDesign name="calendar" size={20} color="black" />{" "}
          <Text style={styles.text}> {req.creationDate} </Text>
        </Text>
        <Text style={styles.textUpdate}>Last Updated </Text>
        <Text style={styles.textDescription}>
          We need volunteers for our upcoming Community Clean-Up Day on August
          15 from 9:00 AM to 1:00 PM at Cherry Creek Park. Tasks include picking
          up litter, sorting recyclables, and managing the registration table.
          We also need donations of trash bags, gloves, and refreshments.
        </Text></View>
      </View>
      <View style={{ flexDirection: "row", marginBottom:10 }}>
        <Input
          value={addComment}
          placeholder="Write a comment...."
          style={styles.addComment}
          onChange={(text) => setComment(text)}
        />
        <Text style={{ flex: 1, textAlign: "right"  }}>
            <TouchableOpacity style={styles.postButton} >
          <Feather
            name="send"
            size={34}
            //backgroundColor="lightblue"
            color="white"
            marginTop={4}
            marginLeft={2}
          /></TouchableOpacity>{" "}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Comments   </Text>
        <TouchableOpacity style={{width:30, height:30, borderRadius:50, alignContent:'center', backgroundColor:"#E6E6FA"}}>
            <Text style={{fontSize:20,marginTop:1}}>  {data.length}</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "right", fontSize: 20 }}>
          View All <AntDesign name="right" size={15} color="black" />
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
      {isLoading ? <Text>Loading...</Text> : 
      (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                  style={{ fontSize: 20, fontWeight: "400", marginLeft:5 }}
                >
                  {item.comment} {/*item.comment*/}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
      </View>
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
        marginBottom:10,
    },
    userImage: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        marginRight: 10,  
    
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
                 
      },
      userName: {
        fontWeight: '600',
        marginBottom: 5,
        marginRight: 10,
        fontSize:20,
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
        height:150,
        width:config.deviceWidth*.8,
        borderRadius:17,
        marginTop:5,
        marginLeft:5,
      },
      postButton:{
        backgroundColor:"lightblue",
        width:45, 
        //alignContent:'center',
        //alignItems:'center',
        height:45,
        borderRadius:100
      }
  });

