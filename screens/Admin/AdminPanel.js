import {useState,useEffect} from "react";
import {StyleSheet} from "react-native";
import {View, Text, Button} from "react-native";
import AdminPieChart from "./AdminPieChart";
import { MyReqData } from "../../data/MyReqData";

const AdminPanel = () => {
    const [data, setData] = useState(MyReqData)
    const userColor = "rgb(42,97,245)";
    const volunteerColor = "rgb(162,86,213)";
    const othersColor = "rgb(78,191,177)"

    return (

        <View style={styles.container}>
            <AdminPieChart title="User/Voluteer Requests" data={data} groupCol="role" groupCriteria={{[userColor]: "User", [volunteerColor]: "Volunteer", [othersColor]: "Others"}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        width: '100%',
      },
});
export default AdminPanel;