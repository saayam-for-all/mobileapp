import { View,Button,StyleSheet, Text } from "react-native";
import HelpRequestCard from "./HelpRequestCard";

export default function VolunteerMatchCard({item}) {
    return (
    <View style={{borderBottomWidth: 1, borderBottomColor:"grey"}}>
        <View>
            <HelpRequestCard volunteer={true} item={item} />
        </View>
        <View style={{width:"100%",display: 'flex',flexDirection:"row",paddingHorizontal: "15%"}}>
          <Text
            style={{...styles.button,color: "white",backgroundColor:"#4e79ba",}}
          >
            Accept
          </Text>
          <Text
            style={styles.button}
          >
            Deny
            </Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create(
    {
        button: {
            width:"46%",
            fontSize: 16,
            height: 40,
            lineHeight:40,
            textAlign: "center",
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            marginHorizontal: "4%",
            marginTop:-5,
            marginBottom:10,
            overflow:"hidden",
        }
    }
)