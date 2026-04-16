import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  VictoryChart,
  VictoryBar,
  VictoryPie,
  VictoryAxis,
  VictoryLine,
  VictoryTooltip,
  VictoryLabel,
  VictoryTheme,
} from "victory-native";
import ChartContainer from "./charts/ChartContainer";
import resolutionTimeData from "../../../data/analytics/kpi_resolution_time_monthly.json";
import statusDistributionData from "../../../data/analytics/request_status_distribution_monthly.json";

const SCREEN_WIDTH = Dimensions.get("window").width - 48;

const SLA_TARGET = 240;
const SLA_WARNING = 200;

const STATUS_COLORS = {
  CREATED: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  RESOLVED: "#10b981",
};

const KPIAnalytics = () => {
  const [showStatusTable, setShowStatusTable] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [breakdownView, setBreakdownView] = useState("category");

  const resolutionData = useMemo(() => {
    const totals = {};
    const counts = {};
    resolutionTimeData.forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.avgResolutionHours;
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.entries(totals)
      .map(([category, total]) => ({
        x: category,
        y: Math.round(total / counts[category]),
        avgDays: (total / counts[category] / 24).toFixed(1),
      }))
      .sort((a, b) => b.y - a.y);
  }, []);

  const statusData = useMemo(() => {
    const totals = {};
    statusDistributionData.forEach((item) => {
      totals[item.status] = (totals[item.status] || 0) + item.requestCount;
    });
    return Object.entries(totals).map(([name, value]) => ({ x: name, y: value }));
  }, []);

  const totalRequests = useMemo(
    () => statusData.reduce((s, i) => s + i.y, 0),
    [statusData],
  );

  const breakdownData = useMemo(() => {
    if (!selectedSegment) return null;
    const filtered = statusDistributionData.filter(
      (i) => i.status === selectedSegment,
    );
    if (breakdownView === "category") {
      const map = {};
      filtered.forEach((item) => {
        map[item.month] = (map[item.month] || 0) + item.requestCount;
      });
      return Object.entries(map).map(([name, count]) => ({ name, count }));
    }
    return [{ name: "Region breakdown requires geographic data", count: 0 }];
  }, [selectedSegment, breakdownView]);

  const getResolutionColor = (hours) => {
    if (hours > SLA_TARGET) return "#ef4444";
    if (hours > SLA_WARNING) return "#f59e0b";
    return "#10b981";
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Chart 1: Request Status Distribution */}
      <ChartContainer
        title="Request Status Distribution"
        description="Breakdown by current status. Tap a segment for details."
      >
        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={() => {
              setShowStatusTable(!showStatusTable);
              setSelectedSegment(null);
            }}
            style={styles.btnBlue}
          >
            <Text style={styles.btnBlueText}>
              {showStatusTable ? "Chart View" : "Table View"}
            </Text>
          </TouchableOpacity>

          {selectedSegment && (
            <>
              <View style={styles.segmentBadge}>
                <Text style={styles.segmentBadgeText}>{selectedSegment}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedSegment(null)}
                style={styles.btnGray}
              >
                <Text style={styles.btnGrayText}>Clear</Text>
              </TouchableOpacity>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={breakdownView}
                  onValueChange={setBreakdownView}
                  style={styles.picker}
                  // iOS only style
                  itemStyle={styles.picker}
                >
                  <Picker.Item label="By Category" value="category" />
                  <Picker.Item label="By Region" value="region" />
                </Picker>
              </View>
            </>
          )}
        </View>

        {!showStatusTable ? (
          <>
            {/* Donut chart with center total overlay */}
            <View style={styles.donutContainer}>
              <VictoryPie
                data={statusData}
                width={SCREEN_WIDTH}
                height={220}
                innerRadius={70}
                padAngle={3}
                colorScale={statusData.map(
                  (d) => STATUS_COLORS[d.x] || "#6b7280",
                )}
                labels={({ datum }) => datum.x}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{ fill: "#fff", stroke: "#e5e7eb" }}
                    renderInPortal={false}
                  />
                }
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onPress: (_, props) => {
                        const name = props.datum.x;
                        setSelectedSegment((prev) =>
                          prev === name ? null : name,
                        );
                      },
                    },
                  },
                ]}
                style={{
                  data: {
                    stroke: ({ datum }) =>
                      selectedSegment === datum.x ? "#000" : "none",
                    strokeWidth: ({ datum }) =>
                      selectedSegment === datum.x ? 3 : 0,
                  },
                }}
              />
              {/* Center label overlay */}
              <View style={styles.donutCenter} pointerEvents="none">
                <Text style={styles.donutTotal}>{totalRequests}</Text>
                <Text style={styles.donutLabel}>Total Requests</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              {statusData.map((d) => (
                <View key={d.x} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: STATUS_COLORS[d.x] || "#6b7280" },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {d.x}: {d.y}
                  </Text>
                </View>
              ))}
            </View>

            {/* Breakdown panel */}
            {selectedSegment && breakdownData && (
              <View style={styles.breakdownPanel}>
                <Text style={styles.breakdownTitle}>
                  "{selectedSegment}" by {breakdownView}:
                </Text>
                {breakdownData.map((item, i) => (
                  <View key={i} style={styles.breakdownRow}>
                    <Text style={styles.breakdownName}>{item.name}</Text>
                    <Text style={styles.breakdownCount}>{item.count}</Text>
                  </View>
                ))}
                <Text style={styles.breakdownNote}>
                  Full breakdown requires additional data fields in JSON
                </Text>
              </View>
            )}
          </>
        ) : (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Count</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>%</Text>
            </View>
            {statusData.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.statusCell]}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: STATUS_COLORS[item.x] || "#6b7280" },
                    ]}
                  />
                  <Text style={styles.tableCellText}>{item.x}</Text>
                </View>
                <Text style={[styles.tableCell, styles.tableCellText]}>
                  {item.y}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellText]}>
                  {((item.y / totalRequests) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </ChartContainer>

      {/* Chart 2: Average Resolution Time by Category */}
      <ChartContainer
        title="Avg Resolution Time by Category"
        description={`SLA Target: ${SLA_TARGET / 24}d | Warning: ${SLA_WARNING / 24}d`}
      >
        <View style={styles.slaLegendRow}>
          <View style={styles.slaItem}>
            <View style={[styles.slaLine, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.slaText}>Exceeded SLA</Text>
          </View>
          <View style={styles.slaItem}>
            <View style={[styles.slaLine, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.slaText}>Approaching</Text>
          </View>
          <View style={styles.slaItem}>
            <View style={[styles.slaLine, { backgroundColor: "#10b981" }]} />
            <Text style={styles.slaText}>Within SLA</Text>
          </View>
        </View>

        <VictoryChart
          width={SCREEN_WIDTH}
          height={220}
          horizontal
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 100, right: 20 }}
        >
          <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 } }} />
          <VictoryAxis style={{ tickLabels: { fontSize: 9 } }} />
          <VictoryBar
            data={resolutionData}
            style={{
              data: {
                fill: ({ datum }) => getResolutionColor(datum.y),
              },
            }}
            labels={({ datum }) => `${datum.y}h`}
            labelComponent={<VictoryTooltip renderInPortal={false}/>}
          />
          {/* SLA reference lines */}
          <VictoryLine
            data={[
              { x: resolutionData[resolutionData.length - 1]?.x || "", y: SLA_TARGET },
              { x: resolutionData[0]?.x || "", y: SLA_TARGET },
            ]}
            style={{ data: { stroke: "#ef4444", strokeDasharray: "4,4", strokeWidth: 1 } }}
          />
          <VictoryLine
            data={[
              { x: resolutionData[resolutionData.length - 1]?.x || "", y: SLA_WARNING },
              { x: resolutionData[0]?.x || "", y: SLA_WARNING },
            ]}
            style={{ data: { stroke: "#f59e0b", strokeDasharray: "4,4", strokeWidth: 1 } }}
          />
        </VictoryChart>
      </ChartContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  btnBlue: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  btnBlueText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "500",
  },
  btnGray: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#6b7280",
    borderRadius: 4,
  },
  btnGrayText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "500",
  },
  segmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#d1fae5",
    borderRadius: 4,
  },
  segmentBadgeText: {
    fontSize: 11,
    color: "#065f46",
    fontWeight: "600",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    overflow: "hidden",
    height: 28,
    justifyContent: "center",
    minWidth: 100,
  },
  picker: {
    height: 28,
    fontSize: 11,
    color: "#374151",
  },
  donutContainer: {
    alignItems: "center",
    position: "relative",
  },
  donutCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  donutTotal: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  donutLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#6b7280",
  },
  breakdownPanel: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 8,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#dbeafe",
  },
  breakdownName: {
    fontSize: 11,
    color: "#1f2937",
    flex: 1,
  },
  breakdownCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1f2937",
  },
  breakdownNote: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 6,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableCellText: {
    fontSize: 12,
    color: "#1f2937",
  },
  statusCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  slaLegendRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  slaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slaLine: {
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  slaText: {
    fontSize: 10,
    color: "#6b7280",
  },
});

export default KPIAnalytics;
