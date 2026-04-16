import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  VictoryChart,
  VictoryArea,
  VictoryBar,
  VictoryAxis,
  VictoryStack,
  VictoryLegend,
  VictoryTooltip,
  VictoryTheme,
} from "victory-native";
import ChartContainer from "./charts/ChartContainer";
import requestsVolumeData from "../../../data/analytics/requests_volume_monthly.json";
import requestsByCategoryRegionData from "../../../data/analytics/requests_by_category_region_monthly.json";

const SCREEN_WIDTH = Dimensions.get("window").width - 48;

const COUNTRY_COLORS = {
  India: "#3b82f6",
  USA: "#10b981",
  Canada: "#f59e0b",
  Australia: "#ef4444",
  "United Kingdom": "#8b5cf6",
};

const TIME_FILTERS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "1yr", label: "1Y" },
  { id: "all", label: "All" },
];

const RequestsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("total");

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  const volumeData = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    if (timeRange === "7d") cutoff.setDate(now.getDate() - 7);
    else if (timeRange === "30d") cutoff.setDate(now.getDate() - 30);
    else if (timeRange === "1yr") cutoff.setFullYear(now.getFullYear() - 1);

    const filtered =
      timeRange === "all"
        ? requestsVolumeData
        : requestsVolumeData.filter(
            (item) => new Date(item.month + "-01") >= cutoff,
          );

    return filtered.map((item) => ({
      x: formatMonth(item.month),
      y: item.requestCount,
    }));
  }, [timeRange]);

  const top5Countries = useMemo(() => {
    const totals = {};
    requestsByCategoryRegionData.forEach((item) => {
      totals[item.country] = (totals[item.country] || 0) + item.requestCount;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, total]) => ({ country, total }));
  }, []);

  const stackedData = useMemo(() => {
    const top5Names = top5Countries.map((c) => c.country);
    let filtered =
      selectedCategory === "all"
        ? requestsByCategoryRegionData
        : requestsByCategoryRegionData.filter(
            (i) => i.category === selectedCategory,
          );
    if (selectedCountry !== "all") {
      filtered = filtered.filter((i) => i.country === selectedCountry);
    }

    const categoryMap = {};
    filtered.forEach((item) => {
      if (!categoryMap[item.category]) categoryMap[item.category] = {};
      categoryMap[item.category][item.country] =
        (categoryMap[item.category][item.country] || 0) + item.requestCount;
    });

    let result = Object.entries(categoryMap).map(([category, byCountry]) => {
      const total = Object.values(byCountry).reduce((s, v) => s + v, 0);
      return { category, byCountry, total };
    });

    if (sortBy === "total") result.sort((a, b) => b.total - a.total);
    else result.sort((a, b) => a.category.localeCompare(b.category));

    const visibleCountries =
      selectedCountry !== "all" ? [selectedCountry] : top5Names;

    return { result, visibleCountries };
  }, [selectedCountry, selectedCategory, sortBy, top5Countries]);

  const countries = useMemo(
    () => [...new Set(requestsByCategoryRegionData.map((i) => i.country))].sort(),
    [],
  );
  const categories = useMemo(
    () =>
      [...new Set(requestsByCategoryRegionData.map((i) => i.category))].sort(),
    [],
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Chart 1: Request Volume Trend */}
      <ChartContainer title="Request Volume Trend">
        <View style={styles.filterRow}>
          {TIME_FILTERS.map(({ id, label }) => (
            <TouchableOpacity
              key={id}
              onPress={() => setTimeRange(id)}
              style={[styles.pill, timeRange === id && styles.pillActive]}
            >
              <Text
                style={[
                  styles.pillText,
                  timeRange === id && styles.pillTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <VictoryChart
          width={SCREEN_WIDTH}
          height={220}
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{ tickLabels: { fontSize: 9, angle: -30 } }}
          />
          <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 10 } }} />
          <VictoryArea
            data={volumeData}
            style={{
              data: {
                fill: "rgba(59,130,246,0.2)",
                stroke: "#3b82f6",
                strokeWidth: 2,
              },
            }}
            labels={({ datum }) => `${datum.y}`}
            labelComponent={<VictoryTooltip renderInPortal={false}/>}
          />
        </VictoryChart>
      </ChartContainer>

      {/* Chart 2: Requests by Category & Region */}
      <ChartContainer
        title="Requests by Category & Region"
        description="Geographic distribution across categories"
      >
        {/* Filters */}
        <View style={styles.filterRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
              // iOS only style
              itemStyle={styles.picker}
            >
              <Picker.Item label="All Categories" value="all" />
              {categories.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
          <View style={[styles.pickerWrapper, { marginLeft: 6 }]}>
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
        </View>

        {/* Top 5 badges */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.badgesRow}
        >
          {top5Countries.map(({ country, total }, index) => (
            <View
              key={country}
              style={[
                styles.badge,
                {
                  borderLeftColor: COUNTRY_COLORS[country] || "#6b7280",
                },
              ]}
            >
              <Text style={styles.badgeRank}>#{index + 1}</Text>
              <Text style={styles.badgeCountry}>{country}</Text>
              <Text style={styles.badgeTotal}>({total})</Text>
            </View>
          ))}
        </ScrollView>

        <VictoryChart
          width={SCREEN_WIDTH}
          height={220}
          horizontal
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 100, right: 20 }}
        >
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fontSize: 9 } }}
          />
          <VictoryAxis
            style={{ tickLabels: { fontSize: 9 } }}
          />
          <VictoryStack>
            {stackedData.visibleCountries.map((country) => (
              <VictoryBar
                key={country}
                data={stackedData.result.map((d) => ({
                  x: d.category,
                  y: d.byCountry[country] || 0,
                }))}
                style={{
                  data: { fill: COUNTRY_COLORS[country] || "#6b7280" },
                }}
                name={country}
              />
            ))}
          </VictoryStack>
        </VictoryChart>

        {/* Legend */}
        <View style={styles.legendRow}>
          {stackedData.visibleCountries.map((country) => (
            <View key={country} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COUNTRY_COLORS[country] || "#6b7280" },
                ]}
              />
              <Text style={styles.legendLabel}>{country}</Text>
            </View>
          ))}
        </View>
      </ChartContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
  pillActive: {
    backgroundColor: "#3b82f6",
  },
  pillText: {
    fontSize: 11,
    color: "#374151",
  },
  pillTextActive: {
    color: "#ffffff",
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
  badgesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderLeftWidth: 3,
    borderRadius: 12,
    marginRight: 6,
    gap: 3,
  },
  badgeRank: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9ca3af",
  },
  badgeCountry: {
    fontSize: 10,
    fontWeight: "500",
    color: "#374151",
  },
  badgeTotal: {
    fontSize: 10,
    color: "#9ca3af",
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  legendLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
});

export default RequestsAnalytics;
