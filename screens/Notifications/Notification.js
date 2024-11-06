import { Button } from "react-native";
import { MyReqData } from "../../data/MyReqData";
import { useEffect,useState } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
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
          {/* Custom Top Tab Bar */}
          <View style={styles.tabContainer}>
            <View style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tab, dataOptions === 0 && styles.activeTab]}
                onPress={() => setDataOptions(0)}
              >
                <Text style={[styles.tabText, dataOptions === 0 && styles.activeTabText]}>All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tab, dataOptions === 1 && styles.activeTab]}
                onPress={() => setDataOptions(1)}
              >
                <Text style={[styles.tabText, dataOptions === 1 && styles.activeTabText]}>Volunteer Match</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tab, dataOptions === 2 && styles.activeTab]}
                onPress={() => setDataOptions(2)}
              >
                <Text style={[styles.tabText, dataOptions === 2 && styles.activeTabText]}>Help Request</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {/* Data List */}
          <FlatList
            keyExtractor={(item) => item.id}
            data={data}
            renderItem={({ item }) => (
              <NotificationCard item={item}/>
            )}
          />
        </>
      );
    };
    
    const styles = StyleSheet.create({
      tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      tabWrapper: {
        flex: 1, // Each tab takes equal width
        alignItems: 'center', // Center content within each tab
      },
      tab: {
        paddingVertical: 8,
        alignItems: 'center', // Ensures text stays centered within the tab
      },
      tabText: {
        fontSize: 16,
        color: 'gray',
      },
      activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4285F4',
      },
      activeTabText: {
        color: '#4285F4',
        fontWeight: 'bold',
      },
    });