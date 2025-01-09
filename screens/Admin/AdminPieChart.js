// import { PieChart } from "react-native-chart-kit";
import { PieChart } from "react-native-gifted-charts";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

const defaultConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
}
const renderLegend = (text='', color) => {
    return (
      <View key={`${text}-${color}`} style={{flexDirection: 'row', marginBottom: 12, backgroundColor: 'white', height:24, width:100}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{color: 'black', fontSize: 16}}>{text}</Text>
      </View>
    );
  };

// AdminPieChart takes in 'title', 'data' <- list, 'groupCol' <- string (column in data to group by), 
// 'groupCriteria' <- object {color1: value1, color2: value2, ...}
const AdminPieChart = ({title, data, groupCol, groupCriteria, width=300, height=300, chartConfig=defaultConfig}) => {
    const [chartData,setChartData] = useState(filterData(data, groupCol, groupCriteria));
    return (
        <>
        <View style={{height:48, width:"100%"}}>
            <Text
                style={{
                    color: 'black',
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 12,
                }}>
                {title}
            </Text>
        </View>
        <View style={styles.wrapper}>
            <PieChart
                data={chartData}
                strokeColor="white"
                strokeWidth={2}
                focusOnPress={true}
                onPress={(item,ind)=>{
                    if(item?.color){
                        let c = item.color;
                        console.log(groupCriteria[c])
                    }else{
                        console.log("Deselect")
                    } 
                }}
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'col',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              {
                Object.entries(groupCriteria).map(([color,key]) => {
                    return (renderLegend(key, color))
                })
              }
            </View>
        </View>
        </>
        
        
    )
}
const filterData = (data, groupCol, groupCriteria) => {
    let fieldName = {}
    let res = []
    for(const [color,key] of Object.entries(groupCriteria)) {
        fieldName[key] = 0
    }
    for(let i = 0; i < data.length; i++) {
        let field = data[i][groupCol];
        if(fieldName[field] === undefined) {
            fieldName[field] = 1;
        }
        else {
            fieldName[field] += 1;
        }
    }
    for(const [color,key] of Object.entries(groupCriteria)) {
        entry = {}
        entry["value"] = fieldName[key];
        entry["color"] = color;
        res.push(entry);
    }
    return res;
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
    }
})

export default AdminPieChart;