import {useState,useEffect} from "react";
import {StyleSheet} from "react-native";
import {View, Text, Button} from "react-native";
import AdminPieChart from "./AdminPieChart";
import { MyReqData } from "../../data/MyReqData";

const AdminPanel = () => {
    const [data, setData] = useState(MyReqData)
    // useEffect(()=>{
    //     console.log(data)
    // },[])
    return (
        <View>
            <View style={styles.container}>
               <AdminPieChart title="User/Voluteer Requests" data={data} groupCol="status" groupCriteria={{"red": "Open", "blue": "Closed", "yellow": "In Progress"}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },
});
export default AdminPanel;