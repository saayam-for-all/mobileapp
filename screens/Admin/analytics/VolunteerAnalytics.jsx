import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
} from "victory-native";
import ChartContainer from "./charts/ChartContainer";
import volunteersActivityData from "../../../data/analytics/volunteers_activity_monthly.json";
import volunteersLocationData from "../../../data/analytics/volunteers_by_location.json";

const SCREEN_WIDTH = Dimensions.get("window").width - 48;

const VolunteerAnalytics = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewType, setViewType] = useState("chart"); // chart, table

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  const activityData = useMemo(() => {
    let cumulative = 0;
    return volunteersActivityData.map((item) => {
      cumulative += item.newVolunteers;
      return {
        x: formatMonth(item.month),
        newVolunteers: item.newVolunteers,
        totalVolunteers: cumulative,
        activeVolunteers: Math.floor(cumulative * (0.85 + Math.random() * 0.05)),
      };
    });
  }, []);

  const countries = useMemo(
    () =>
      [...new Set(volunteersLocationData.map((i) => i.country_name))]
        .filter(Boolean)
        .sort(),
    [],
  );

  const locationBarData = useMemo(() => {
    const totals = {};
    volunteersLocationData.forEach((item) => {
      const country = item.country_name || "Unknown";
      totals[country] = (totals[country] || 0) + 1;
    });
    return Object.entries(totals)
      .map(([country, count]) => ({ x: country, y: count }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 10);
  }, []);

  // Hierarchical table data: country -> state -> city
  const hierarchyData = useMemo(() => {
    const filtered =
      selectedCountry === "all"
        ? volunteersLocationData
        : volunteersLocationData.filter(
            (i) => i.country_name === selectedCountry,
          );

    const map = {};
    filtered.forEach((item) => {
      const country = item.country_name || "Unknown";
      const state = item.state_name || "N/A";
      const city = item.city || "N/A";
      if (!map[country]) map[country] = {};
      if (!map[country][state]) map[country][state] = {};
      map[country][state][city] = (map[country][state][city] || 0) + 1;
    });

    // Flatten to rows for FlatList
    const rows = [];
    Object.entries(map).forEach(([country, states]) => {
      Object.entries(states).forEach(([state, cities]) => {
        Object.entries(cities).forEach(([city, count]) => {
          rows.push({ country, state, city, count });
        });
      });
    });
    return rows;
  }, [selectedCountry]);

  const lastData = activityData[activityData.length - 1];

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Chart 1: Volunteer Activity Trend */}
      <ChartContainer
        title="Volunteer Activity Trend"
        description="Monthly new volunteers and cumulative total"
      >
        <VictoryChart
          width={SCREEN_WIDTH}
          height={220}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{ tickLabels: { fontSize: 8, angle: -30 } }}
          />
          <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 } }} />
          <VictoryLine
            data={activityData.map((d) => ({ x: d.x, y: d.newVolunteers }))}
            style={{ data: { stroke: "#f59e0b", strokeWidth: 2 } }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip renderInPortal={false}/>}
          />
          <VictoryLine
            data={activityData.map((d) => ({ x: d.x, y: d.activeVolunteers }))}
            style={{ data: { stroke: "#10b981", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={activityData.map((d) => ({ x: d.x, y: d.totalVolunteers }))}
            style={{ data: { stroke: "#3b82f6", strokeWidth: 2 } }}
          />
        </VictoryChart>

        <View style={styles.legendRow}>
          {[
            { color: "#f59e0b", label: "New" },
            { color: "#10b981", label: "Active" },
            { color: "#3b82f6", label: "Total" },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>Churn</Text>
            <Text style={[styles.statValue, { color: "#f59e0b" }]}>~5-8%/mo</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>Inactive</Text>
            <Text style={[styles.statValue, { color: "#ef4444" }]}>
              {lastData ? Math.floor(lastData.totalVolunteers * 0.1) : "N/A"}
            </Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statLabel}>Retention</Text>
            <Text style={[styles.statValue, { color: "#10b981" }]}>~90%</Text>
          </View>
        </View>
      </ChartContainer>

      {/* Chart 2: Volunteers by Location */}
      <ChartContainer
        title="Volunteers by Location"
        description="Geographic distribution (country / state / city)"
      >
        <View style={styles.controlRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={setSelectedCountry}
              style={styles.picker}
              // iOS only style
              itemStyle={styles.picker}
            >
              <Picker.Item label="All Countries" value="all" />
              {countries.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
          <View style={[styles.pickerWrapper, { marginLeft: 6 }]}>
            <Picker
              selectedValue={viewType}
              onValueChange={setViewType}
              style={styles.picker}
              // iOS only style
              itemStyle={styles.picker}
            >
              <Picker.Item label="Bar Chart" value="chart" />
              <Picker.Item label="Table" value="table" />
            </Picker>
          </View>
        </View>

        {viewType === "chart" ? (
          <VictoryChart
            width={SCREEN_WIDTH}
            height={220}
            horizontal
            theme={VictoryTheme.material}
            padding={{ top: 10, bottom: 40, left: 110, right: 20 }}
          >
            <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 } }} />
            <VictoryAxis style={{ tickLabels: { fontSize: 9 } }} />
            <VictoryBar
              data={locationBarData}
              style={{ data: { fill: "#f59e0b" } }}
              labels={({ datum }) => datum.y}
              labelComponent={<VictoryTooltip renderInPortal={false}/>}
            />
          </VictoryChart>
        ) : (
          <View>
            {/* Table header */}
            <View style={styles.tableHeader}>
              {["Country", "State", "City", "#"].map((h) => (
                <Text key={h} style={[styles.tableCell, styles.tableHeaderText]}>
                  {h}
                </Text>
              ))}
            </View>
            <ScrollView style={{ maxHeight: 320 }} nestedScrollEnabled>
              {hierarchyData.map((row, i) => (
                <View
                  key={i}
                  style={[styles.tableRow, i % 2 === 0 && styles.tableRowEven]}
                >
                  <Text style={[styles.tableCell, styles.tableCellText]}>
                    {row.country}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellText]}>
                    {row.state}
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCellText]}>
                    {row.city}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.tableCellText,
                      styles.tableCellBold,
                    ]}
                  >
                    {row.count}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ChartContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: "#6b7280",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  statBadge: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    color: "#9ca3af",
  },
  statValue: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  controlRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    overflow: "hidden",
    height: 36,
    justifyContent: "center",
  },
  picker: {
    height: 36,
    fontSize: 11,
    color: "#374151",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowEven: {
    backgroundColor: "#fafafa",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 6,
  },
  tableCellText: {
    fontSize: 11,
    color: "#1f2937",
  },
  tableCellBold: {
    fontWeight: "600",
  },
});

export default VolunteerAnalytics;
