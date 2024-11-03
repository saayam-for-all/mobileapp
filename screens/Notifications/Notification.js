import { Button } from "react-native";
import { MyReqData } from "../../data/MyReqData";
import { useEffect,useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import NotificationCard from "./NotificationCard";

export default function Notification() {
    const reqdata = MyReqData;
    // 0 means all data, 1 means volunteer, 2 means help request
    const [data, setData] = useState([]);
    const [dataOptions, setDataOptions] = useState(0);
    useEffect(()=>{
        if(dataOptions === 1) {
            setData(reqdata.filter(item=>item.status==="Open"));
        }
        else if(dataOptions === 2) {
            setData(reqdata.filter(item=>item.status==="Closed"));
        }
        else {
            setData(reqdata);
        }
    },[dataOptions])

    return (
        <>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <Button title="All" onPress={()=>setDataOptions(0)}/>
            <Button title="Volunteer Match" onPress={()=>setDataOptions(1)}/>
            <Button title="Help Request" onPress={()=>setDataOptions(2)}/>
        </View>
        <FlatList
            keyExtractor={(item) => item.id}
            //data={data}
            data={data}
            renderItem={({ item }) => (
                <NotificationCard item={item}/>
            )}
        />
      </>
    )
}