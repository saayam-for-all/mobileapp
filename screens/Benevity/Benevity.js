import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import heartHandIcon from "../../assets/donate_buttons/hearticon.png";

const { width, height } = Dimensions.get('window');

const companies = [
  { name: "Microsoft", url: "https://microsoft.benevity.org/" },
  { name: "Amazon", url: "https://amazon.benevity.org/" },
  { name: "Apple", url: "https://apple.benevity.org/" },
  { name: "Google", url: "https://google.benevity.org/" },
  { name: "Salesforce", url: "https://salesforce.benevity.org/" },
  { name: "Oracle", url: "https://oracle.benevity.org/" },
  { name: "Nvidia", url: "https://nvidia.benevity.org/" },
  { name: "Visa", url: "https://visa.benevity.org/" },
  { name: "Intel", url: "https://intel.benevity.org/" },
  { name: "Cisco", url: "https://cisco.benevity.org/" },
];

const BenevityInfo = () => {
  const handleExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this URL");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open URL");
    }
  };

  const MonitorIcon = () => (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>💻</Text>
    </View>
  );

  const SearchIcon = () => (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>🔍</Text>
    </View>
  );

  return (
    <ScrollView style={styles.benevityPageContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.benevityHeader}>
        <Text style={styles.headerTitle}>Double Your Impact through Benevity</Text>
        <Text style={styles.benevityDesc}>
          Many companies offer donation or volunteer matching through Benevity.{"\n"}
          If your employer is one of them, you can help Saayam for All even more.
        </Text>
        <View style={styles.benevityInfoCard}>
          <Text style={styles.infoCardText}>Charity Name: Saayam for All</Text>
          <Text style={styles.infoCardText}>Charity Identifier: 840-932798273</Text>
          <Text style={styles.infoCardText}>IRS Federal EIN: 9308382873</Text>
          <TouchableOpacity
            style={styles.benevitySearchBtn}
            onPress={() => handleExternalLink("https://benevity.com")}
          >
            <Text style={styles.searchBtnText}>Search on Benevity</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.benevityHowSection}>
        <Text style={styles.sectionTitle}>How to Donate</Text>
        <Text style={styles.benevityHowDesc}>
          Follow these steps to donate or volunteer through Benevity.
        </Text>
        <View style={styles.benevityHowSteps}>
          <View style={styles.benevityStep}>
            <View style={styles.benevityStepCircle}>
              <Text style={styles.stepCircleText}>1</Text>
            </View>
            <MonitorIcon />
            <Text style={styles.benevityStepTitle}>Go to Your Company's Portal</Text>
            <Text style={styles.benevityStepDesc}>
              Log in to your company's giving or volunteer portal where all your
              corporate social responsibility programs are listed.
            </Text>
          </View>

          <View style={styles.benevityStep}>
            <View style={styles.benevityStepCircle}>
              <Text style={styles.stepCircleText}>2</Text>
            </View>
            <SearchIcon />
            <Text style={styles.benevityStepTitle}>Search for "Saayam for All"</Text>
            <Text style={styles.benevityStepDesc}>
              Type "Saayam for All" into the portal's search bar to locate our
              cause and explore how you can support us.
            </Text>
          </View>

          <View style={styles.benevityStep}>
            <View style={styles.benevityStepCircle}>
              <Text style={styles.stepCircleText}>3</Text>
            </View>
            <View style={styles.benevityIconContainer}>
              <Image
                source={heartHandIcon}
                style={styles.benevityStepIcon}
              />
            </View>
            <Text style={styles.benevityStepTitle}>Log Your Hours or Donate</Text>
            <Text style={styles.benevityStepDesc}>
              Track your volunteer hours or make a financial donation – your
              company may even match your efforts!
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.benevityCorporateSection}>
        <Text style={styles.sectionTitle}>Corporate Matching and Giving Programs</Text>
        <Text style={styles.benevityCorpDesc}>
          You can find the links for which you can donate.
        </Text>
        <View style={styles.benevityCorpTableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Company Name</Text>
            <Text style={styles.tableHeaderText}>Link to Portal</Text>
          </View>
          {companies.map((company) => (
            <View key={company.name} style={styles.tableRow}>
              <Text style={styles.tableCell}>{company.name}</Text>
              <TouchableOpacity
                style={styles.tableLinkCell}
                onPress={() => handleExternalLink(company.url)}
              >
                <Text style={styles.tableLink}>{company.url}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  benevityPageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  benevityHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: width < 768 ? 28 : 35,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  benevityDesc: {
    color: '#666',
    fontSize: width < 480 ? 14 : 17,
    marginBottom: 28,
    maxWidth: 600,
    lineHeight: 24,
    textAlign: 'center',
  },
  benevityInfoCard: {
    backgroundColor: '#e9f1fe',
    borderRadius: 16,
    padding: width < 768 ? 20 : 35,
    maxWidth: 600,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  infoCardText: {
    marginBottom: 12,
    color: '#000',
    fontSize: width < 480 ? 15 : 16,
    textAlign: 'center',
  },
  benevitySearchBtn: {
    marginTop: 35,
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: width < 480 ? 10 : 14,
    paddingHorizontal: width < 480 ? 20 : 35,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: width < 480 ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  benevityHowSection: {
    marginVertical: 60,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: width < 768 ? 24 : width < 480 ? 21 : 29,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
  },
  benevityHowDesc: {
    color: '#666',
    fontSize: width < 480 ? 14 : 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  benevityHowSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
    paddingHorizontal: 20,
  },
  benevityStep: {
    backgroundColor: '#e9f1fe',
    borderRadius: 12,
    paddingTop: width < 768 ? 50 : 60,
    paddingBottom: width < 768 ? 20 : 30,
    paddingHorizontal: 25,
    width: width < 768 ? width - 80 : 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    marginBottom: 20,
  },
  benevityStepCircle: {
    backgroundColor: '#007bff',
    borderRadius: 22.5,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -22.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  stepCircleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
  },
  benevityIconContainer: {
    backgroundColor: '#e9f1fe',
    borderRadius: 35,
    width: width < 768 ? 60 : 70,
    height: width < 768 ? 60 : 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width < 768 ? 10 : 15,
    marginBottom: width < 768 ? 15 : 20,
  },
  benevityStepIcon: {
    width: width < 768 ? 30 : 35,
    height: width < 768 ? 30 : 35,
    resizeMode: 'contain',
  },
  iconContainer: {
    backgroundColor: '#e9f1fe',
    borderRadius: 35,
    width: width < 768 ? 60 : 70,
    height: width < 768 ? 60 : 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width < 768 ? 10 : 15,
    marginBottom: width < 768 ? 15 : 20,
  },
  iconText: {
    fontSize: width < 768 ? 24 : 28,
  },
  benevityStepTitle: {
    fontSize: width < 480 ? 16 : 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  benevityStepDesc: {
    color: '#777',
    fontSize: width < 480 ? 13 : 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  benevityCorporateSection: {
    marginVertical: 60,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  benevityCorpDesc: {
    color: '#666',
    fontSize: width < 480 ? 14 : 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  benevityCorpTableContainer: {
    maxWidth: 900,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f7fcff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderText: {
    flex: 1,
    padding: width < 600 ? 10 : 18,
    fontWeight: '700',
    color: '#222',
    fontSize: width < 600 ? 15 : 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    padding: width < 600 ? 10 : 18,
    color: '#333',
    fontSize: width < 600 ? 15 : 16,
  },
  tableLinkCell: {
    flex: 1,
    padding: width < 600 ? 10 : 18,
    justifyContent: 'center',
  },
  tableLink: {
    color: '#007bff',
    fontSize: width < 600 ? 13 : 16,
    textDecorationLine: 'underline',
  },
});

export default BenevityInfo;