// src/pages/EmergencyContact/EmergencyContact.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { getEmergencyContactInfo } from "../../services/requestServices";

// Get browser GPS coords (prompts user for permission)
const getBrowserCoords = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  });

const EmergencyContact = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const normalize = (raw) => {
      if (raw && typeof raw === "object" && typeof raw.body === "string") {
        try {
          return JSON.parse(raw.body);
        } catch (e) {
          console.error("Failed to parse body:", e, raw.body);
          return null;
        }
      }
      return raw.body;
    };

    const fetchContacts = async () => {
      try {
        try {
          const { lat, lng } = await getBrowserCoords();
          const raw = await getEmergencyContactInfo({ lat, lng });
          const parsed = normalize(raw);
          if (alive) setApiData(parsed);
        } catch (geoErr) {
          console.warn("GPS failed / denied:", geoErr);
          const raw = await getEmergencyContactInfo();
          const parsed = normalize(raw);
          if (alive) setApiData(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch emergency contacts:", err);
        if (alive) setApiData(null);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchContacts();
    return () => {
      alive = false;
    };
  }, []);

  const dynamic = useMemo(() => {
    const services = apiData?.services || {};
    return {
      police: services.police || "911",
      fire: services.fire || "911",
      ambulance: services.ambulance || "911",
      suicide: services.suicide_helpline || "988",
    };
  }, [apiData]);

  const emergencyContacts = useMemo(
    () => [
      {
        category: t("CATEGORY_SAFETY"),
        contacts: [
          { name: t("POLICE"), phone: dynamic.police },
          { name: t("FIRE"), phone: dynamic.fire },
        ],
      },
      {
        category: t("CATEGORY_MEDICAL"),
        contacts: [
          { name: t("MEDICAL_EMERGENCY"), phone: dynamic.ambulance },
          { name: t("AMBULANCE"), phone: dynamic.ambulance },
          { name: t("MENTAL_HEALTH"), phone: dynamic.suicide },
          { name: t("SUICIDE_PREVENTION"), phone: dynamic.suicide },
        ],
      },
    ],
    [t, dynamic],
  );

  const locationLine = apiData?.resolved_location
    ? `${apiData.resolved_location.city}, ${apiData.resolved_location.state} (${apiData.resolved_location.country})`
    : null;

  const handleCall = (phone) => {
    const digits = String(phone).replace(/\D/g, "");
    Linking.openURL(`tel:${digits}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>

      <View style={styles.card}>
        <Text style={styles.title}>{t("EMERGENCY_CONTACTS")}</Text>

        <Text style={styles.subtitle}>{t("EMERGENCY_SUBTITLE")}</Text>

        <Text style={styles.statusLine}>
          {loading
            ? "Fetching emergency numbers..."
            : locationLine
              ? `Area Detected: ${locationLine}`
              : "Using default emergency numbers - USA"}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#3b82f6"
            style={styles.loader}
          />
        )}

        {emergencyContacts.map((section, idx) => (
          <View key={"section-"+idx} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>{section.category}</Text>
            </View>

            {section.contacts.map((contact, cidx) => (
              <TouchableOpacity
                key={contact+"-"+cidx}
                style={styles.contactItem}
                onPress={() => handleCall(contact.phone)}
                activeOpacity={0.7}
              >
                <Text style={styles.contactText}>
                  {contact.name + "—" + contact.phone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    // alignItems: "center",
  },
  backRow: {
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 900,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    // textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000000",
  },
  subtitle: {
    fontSize: 15,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 24,
  },
  statusLine: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 20,
  },
  loader: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionAccent: {
    width: 4,
    height: 26,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  contactItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#111827",
  },
});

export default EmergencyContact;