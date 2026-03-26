import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
  VictoryTooltip,
  VictoryTheme,
} from "victory-native";
import ChartContainer from "./charts/ChartContainer";
import { getBeneficiariesTrendAnalysis } from "../../../services/analyticsServices";
import beneficiariesGrowthDataFallback from "../../../data/analytics/beneficiaries_growth_monthly.json";
import beneficiariesByCountryDataFallback from "../../../data/analytics/beneficiaries_by_country_monthly.json";

const SCREEN_WIDTH = Dimensions.get("window").width - 48;

const BeneficiariesAnalytics = () => {
  const [showTop10Only, setShowTop10Only] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setApiLoading(true);
        const response = await getBeneficiariesTrendAnalysis();
        setApiData(response);
        setApiError(null);
      } catch (error) {
        setApiError(error);
      } finally {
        setApiLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  const beneficiariesGrowthData = useMemo(() => {
    if (!apiData) return beneficiariesGrowthDataFallback;
    const body = apiData.body || apiData;
    if (Array.isArray(body)) return body;
    const trendData =
      body.beneficiaries_trend ||
      body.beneficiariesTrend ||
      body.monthly ||
      body["1_year"] ||
      body.beneficiaries;
    if (Array.isArray(trendData) && trendData.length > 0) {
      return trendData.map((item) => ({
        month: item.month || item.date || item.period,
        newBeneficiaries:
          item.newBeneficiaries ?? item.new_beneficiaries ?? item.count ?? 0,
      }));
    }
    return beneficiariesGrowthDataFallback;
  }, [apiData]);

  const beneficiariesByCountryData = useMemo(() => {
    if (!apiData) return beneficiariesByCountryDataFallback;
    const body = apiData.body || apiData;
    const countryData =
      body.country ||
      body.countries ||
      body.beneficiaries_by_country ||
      body.beneficiariesByCountry;
    if (Array.isArray(countryData) && countryData.length > 0) {
      return countryData.map((item) => ({
        month: item.month || item.date,
        country: item.country || item.country_name,
        beneficiaryCount:
          item.beneficiaryCount ?? item.beneficiary_count ?? item.count ?? 0,
      }));
    }
    return beneficiariesByCountryDataFallback;
  }, [apiData]);

  const growthChartData = useMemo(() => {
    let cumulative = 0;
    return beneficiariesGrowthData.map((item) => {
      cumulative += item.newBeneficiaries;
      return {
        x: formatMonth(item.month),
        newBeneficiaries: item.newBeneficiaries,
        cumulativeTotal: cumulative,
      };
    });
  }, [beneficiariesGrowthData]);

  const countryData = useMemo(() => {
    const totals = {};
    beneficiariesByCountryData.forEach((item) => {
      totals[item.country] = (totals[item.country] || 0) + item.beneficiaryCount;
    });
    const sorted = Object.entries(totals)
      .map(([country, count]) => ({ x: country, y: count }))
      .sort((a, b) => b.y - a.y);
    return showTop10Only ? sorted.slice(0, 10) : sorted;
  }, [showTop10Only, beneficiariesByCountryData]);

  if (apiLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading beneficiaries data...</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {apiError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            Could not load live data. Showing fallback data.
          </Text>
        </View>
      )}

      {/* Chart 1: Growth Trend — bars (new) + line (cumulative) */}
      <ChartContainer
        title="Beneficiary Growth Trend"
        description="Monthly new beneficiaries (bars) and cumulative total (line)"
      >
        <VictoryChart
          width={SCREEN_WIDTH}
          height={220}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 50, right: 50 }}
        >
          <VictoryAxis
            tickFormat={(t) => t}
            style={{ tickLabels: { fontSize: 8, angle: -30 } }}
          />
          {/* Left axis — new beneficiaries */}
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fontSize: 9 } }}
          />
          {/* Right axis — cumulative */}
          <VictoryAxis
            dependentAxis
            orientation="right"
            style={{ tickLabels: { fontSize: 9 } }}
          />
          <VictoryBar
            data={growthChartData.map((d) => ({
              x: d.x,
              y: d.newBeneficiaries,
            }))}
            style={{ data: { fill: "#8b5cf6" } }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryLine
            data={growthChartData.map((d) => ({
              x: d.x,
              y: d.cumulativeTotal,
            }))}
            style={{
              data: { stroke: "#10b981", strokeWidth: 2 },
            }}
          />
        </VictoryChart>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#8b5cf6" }]} />
            <Text style={styles.legendText}>New Beneficiaries</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: "#10b981" }]} />
            <Text style={styles.legendText}>Cumulative Total</Text>
          </View>
        </View>
      </ChartContainer>

      {/* Chart 2: Beneficiaries by Country */}
      <ChartContainer
        title="Beneficiaries by Country"
        description="Geographic distribution of beneficiaries"
      >
        <TouchableOpacity
          onPress={() => setShowTop10Only(!showTop10Only)}
          style={[styles.pill, showTop10Only && styles.pillActive]}
        >
          <Text
            style={[
              styles.pillText,
              showTop10Only && styles.pillTextActive,
            ]}
          >
            {showTop10Only ? "Top 10 Only ✓" : "Show All"}
          </Text>
        </TouchableOpacity>

        <VictoryChart
          width={SCREEN_WIDTH}
          height={Math.max(220, countryData.length * 24 + 60)}
          horizontal
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 110, right: 20 }}
        >
          <VictoryAxis dependentAxis style={{ tickLabels: { fontSize: 9 } }} />
          <VictoryAxis style={{ tickLabels: { fontSize: 9 } }} />
          <VictoryBar
            data={countryData}
            style={{ data: { fill: "#8b5cf6" } }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>

        {/* Top 10 summary */}
        {showTop10Only && (
          <View style={styles.summaryPanel}>
            <Text style={styles.summaryTitle}>Top 10 Countries Summary</Text>
            <View style={styles.summaryGrid}>
              {countryData.map((item, index) => (
                <View key={index} style={styles.summaryRow}>
                  <Text style={styles.summaryCountry}>
                    {index + 1}. {item.x}
                  </Text>
                  <Text style={styles.summaryCount}>{item.y}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ChartContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: "#6b7280",
  },
  errorBanner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fefce8",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#92400e",
  },
  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
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
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
    marginBottom: 8,
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
  summaryPanel: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  summaryRow: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  summaryCountry: {
    fontSize: 11,
    color: "#6b7280",
    flex: 1,
  },
  summaryCount: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1f2937",
  },
});

export default BeneficiariesAnalytics;
