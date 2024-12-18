import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// Useful Icons in Expo: https://icons.expo.fyi/Index

export default function HelpRequestCard({volunteer=false, item}) {
    return (
        <View style={{...styles.outerContainer,borderBottomWidth:volunteer ? 0:1}}>
            <View style={{width:"15%",aspectRatio:1,padding:5}}>
                {
                    volunteer ? 
                    <MaterialIcons name="volunteer-activism" size={50} color="#909aac" />
                    : <FontAwesome5 name="hands-helping" size={50} color="#909aac" />
                }
            </View>
            <View style={{width:"80%",aspectRatio:16/3,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <View style={{width:"100%",aspectRatio:48/3,display:"flex",flexDirection:"row",}}>
                    <View style={{width:"50%",aspectRatio:24/3, ...styles.textContainer}}>
                        <Text style={{...styles.text,fontWeight:"bold"}}>{volunteer ? "New Match Request" : item.category+" Help"}</Text>
                    </View>
                    <View style={{width:"50%",aspectRatio:24/3,}}>
                        <Text style={{...styles.text,color:"grey",textAlign:"right"}}>{item.creationDate}</Text>
                    </View>
                </View>
                <View style={{width:"100%",}}>
                    <Text style={styles.text}>{"Need help with "+item.category}</Text>
                </View>
                
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        //marginBottom:2,
    },
    outerContainer: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        paddingTop:20, 
        paddingBottom:20,
        borderBottomColor:"grey",
    },
    textContainer: {
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between"
    }
})
