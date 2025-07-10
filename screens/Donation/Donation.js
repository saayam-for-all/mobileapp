import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  StyleSheet,
  Dimensions,
  ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Import your local images
import BenevityLogo from "../../assets/donate_buttons/benevity.png";
import CharityNavLogo from "../../assets/donate_buttons/CharityNav.png";
import PayPalLogo from "../../assets/donate_buttons/PayPal.png";
// import StripeLogo from "../../assets/donate_buttons/Stripe.png";
StripeLogo = ''
import donateImgBg from "../../assets/donate_img_bg.png";
import SaayamLogo from "../../assets/saayamforall.jpeg"

const { width, height } = Dimensions.get('window');

const Donate = () => {
  const navigation = useNavigation();
  const [openFaq, setOpenFaq] = useState(null);
  const [showStripeDonation, setShowStripeDonation] = useState(false);
  const [donationType, setDonationType] = useState("one-time");
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    if (showStripeDonation) {
      // For React Native, you'll need to integrate with Stripe React Native SDK
      // This replaces the web script loading logic
    }
  }, [showStripeDonation]);

  const handleStripeClick = () => {
    setShowStripeDonation(true);
  };

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

  const selectType = (type) => {
    setDonationType(type);
  };

  const faqItems = [
    {
      question: "Are donations tax deductible?",
      answer: "Yes, Saayam For All is a registered 501(c)(3) non-profit organization. All donations are tax deductible to the extent allowed by law.",
    },
    {
      question: "How will my donation be used?",
      answer: "Your donation will be used to support our various programs, including volunteer coordination, assistance programs, and operational costs to maintain our platform.",
    },
    {
      question: "Can I cancel recurring donations?",
      answer: "Yes, you can cancel by contacting our support team.",
    },
  ];

  const donationOptions = [
    {
      key: "paypal",
      label: "PayPal",
      img: PayPalLogo,
      alt: "PayPal",
      href: "https://www.paypal.com/donate/?hosted_button_id=4KLWNM5JWKJ4S",
    },
    {
      key: "stripe",
      label: "Stripe",
      img: StripeLogo,
      alt: "Donate",
      href: null,
    },
    {
      key: "charity",
      label: "Charity Navigator",
      img: CharityNavLogo,
      alt: "Charity Navigator",
      href: "https://www.charitynavigator.org/ein/932798273",
    },
    {
      key: "benevity",
      label: "Benevity",
      img: BenevityLogo,
      alt: "Benevity",
      href: "https://Benevity.org",
    },
  ];

  if (showStripeDonation) {
    return (
      <View style={styles.donateContainer}>
        <View style={styles.stripeCard}>
          <View style={{postion:'relative', width: '100%'}}>
            <TouchableOpacity
              onPress={() => setShowStripeDonation(false)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Back to Donate</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => selectType("one-time")}
              style={[styles.tabBtn, donationType === "one-time" && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, donationType === "one-time" && styles.tabBtnActiveText]}>
                One-Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectType("monthly")}
              style={[styles.tabBtn, donationType === "monthly" && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, donationType === "monthly" && styles.tabBtnActiveText]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <Image source={SaayamLogo} resizeMode="cover" style={styles.logo}/>

          <View style={[styles.donationSection, donationType !== "one-time" && styles.hidden]}>
            <View style={styles.oneTimeButtonContainer}>
              <TouchableOpacity style={styles.stripePaymentButton}>
                <Text style={styles.stripePaymentButtonText}>Donate with Stripe</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.donationSection, donationType !== "monthly" && styles.hidden]}>
            <View style={styles.monthlyButtonContainer}>
              <TouchableOpacity style={styles.stripePaymentButton}>
                <Text style={styles.stripePaymentButtonText}>Subscribe with Stripe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.donateContainer} showsVerticalScrollIndicator={false}>
      <ImageBackground source={donateImgBg} resizeMode="cover" style={styles.donateImageOverlayBg}>
        <View style={styles.donateCardOverlay}>
          <Text style={styles.donateTitle}>Make a donation</Text>
          <Text style={styles.donateSubtitle}>
            Your donation helps us create lasting change in communities across the globe.
          </Text>
          <View style={styles.donationOptionsGrid}>
            {donationOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.donationOptionBtn,
                  selectedOption === opt.key && styles.donationOptionBtnSelected
                ]}
                onPress={() => {
                  setSelectedOption(opt.key);
                  if (opt.key === "stripe") {
                    handleStripeClick();
                  } else if (opt.key === "benevity") {
                    navigation.navigate("Benevity");
                  } else if (opt.href) {
                    handleExternalLink(opt.href);
                  }
                }}
              >
                {
                  opt?.img ?
                  (<Image
                    source={opt.img}
                    style={styles.donationOptionIcon}
                  />) : (<Text style={styles.donationOptionIcon}>
                    {opt.alt}
                  </Text>)
                }
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>FAQ's</Text>
        <View style={styles.faqList}>
          {faqItems.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFaq(index)}>
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Text style={[styles.faqIcon, openFaq === index && styles.faqIconRotated]}>
                  ▼
                </Text>
              </TouchableOpacity>
              {openFaq === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  donateContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  donateImageOverlayBg: {
    position: 'relative',
    width: '100%',
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 32,
    minHeight: 400,
  },
  donateCardOverlay: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxWidth: 500,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#181818',
    marginBottom: 6,
    textAlign: 'center',
  },
  donateSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 21,
  },
  donationOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '6%',
    justifyContent: 'space-between',
    marginBottom: 24,
    width: '100%',
  },
  donationOptionBtn: {
    backgroundColor: '#fff',
    borderWidth: 2.5,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  donationOptionBtnSelected: {
    borderColor: '#0070ba',
    backgroundColor: '#eaf4fb',
    shadowOpacity: 0.13,
  },
  donationOptionIcon: {
    height: 25,
    lineHeight: 25,
    width: 60,
    resizeMode: 'contain',
    color: 'navy',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center',
    paddingVertical: 0,
  },
  faqSection: {
    paddingHorizontal: 16,
  },
  faqTitle: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
  },
  faqList: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 600,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginTop: 20,
  },
  faqQuestion: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#787777',
    flex: 1,
  },
  faqIcon: {
    fontSize: 16,
    color: '#888',
    marginLeft: 12,
  },
  faqIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    paddingBottom: 12,
  },
  faqAnswerText: {
    color: '#666',
    lineHeight: 20,
    fontSize: 14,
  },
  // Stripe payment screen styles
  stripeCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    margin: 20,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    fontWeight: '500',
  },
  tabBtnActive: {
    backgroundColor: '#dbeafe',
  },
  tabBtnText: {
    color: '#4b5563',
    fontSize: 16,
  },
  tabBtnActiveText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  donationSection: {
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none',
  },
  oneTimeButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  monthlyButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  stripePaymentButton: {
    backgroundColor: '#6772e5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  stripePaymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: '50%',
    maxHeight: 250,
    aspectRatio: 1,
    backgroundColor: 'black'
  }
});

export default Donate;