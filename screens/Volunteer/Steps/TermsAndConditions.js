import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function TermsAndConditions({ isAcknowledged, setIsAcknowledged }) {
  const [isScrollEnd, setIsScrollEnd] = useState(false);  // To track if user scrolled to the end
  const scrollViewRef = useRef(null);  // Reference for ScrollView

  // Handle scroll detection to check if user reached the end
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      setIsScrollEnd(true); // Enable agreement toggle when scrolled to the bottom
    }
  };

  const handleToggleCheck = () => {
    if (!isScrollEnd) {
      Alert.alert('', 'Please read all the terms and conditions.');
      return;
    }
    setIsAcknowledged(!isAcknowledged);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review & Acknowledge Terms</Text>
      <Text style={styles.description}>
        Please read the following document carefully and acknowledge that you have understood its contents.
      </Text>

      {/* Scrollable Terms and Conditions */}
      <ScrollView
        style={styles.termsBox}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}  // Handles scroll events more frequently
      >
        <Text style={styles.termsText}>
          <Text style={styles.sectionTitle}>Volunteer Agreement for Saayam for All</Text>
          {'\n\n'}
          
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          {'\n'}
          This Volunteer Agreement ("Agreement") is entered into between Saayam for All ("Organization") and the 
          volunteer ("Volunteer") upon acceptance. By signing or agreeing electronically, the Volunteer 
          acknowledges their understanding and acceptance of the terms herein, which govern their participation 
          in any volunteer activities with the Organization.
          {'\n\n'}
          <Text style={styles.sectionTitle}>2. Volunteer Role and Responsibilities</Text>{'\n'}
          The Volunteer agrees to fulfill the roles and responsibilities assigned by the Organization, which may 
          include, but are not limited to, assisting in various tasks as needed by individuals or communities 
          requesting help. The Volunteer agrees to:{'\n'}
          - Engage in activities assigned by the Organization in a diligent, responsible, and professional manner.{'\n'}
          - Communicate promptly with the Organization regarding availability, progress, and challenges.{'\n'}
          - Complete assigned tasks promptly and to the best of their ability, adhering to any specified deadlines.{'\n\n'}

          <Text style={styles.sectionTitle}>3. Code of Conduct</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer agrees to maintain the highest standards of ethical behavior while representing the Organization. This includes:{'\n'}
            - Treating all individuals with respect and dignity, regardless of race, religion, gender, sexual orientation, age, or disability.{'\n'}
            - Refraining from any form of discrimination, harassment, or unprofessional behavior.{'\n'}
            - Avoiding conflicts of interest and ensuring that personal interests do not interfere with their volunteer duties.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>4. Confidentiality Agreement</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer acknowledges that during their service, they may be privy to confidential, proprietary, or personal information relating to the Organization, other volunteers, or individuals seeking assistance. The Volunteer agrees to:{'\n'}
            - Maintain confidentiality of all information, both during & after the term of this Agreement.{'\n'}
            - Use such information solely for the purpose of fulfilling their volunteer responsibilities.{'\n'}
            - Not disclose any confidential information to third parties without the explicit written consent of the Organization.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>5. Data Protection and Privacy</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer agrees to comply with all applicable data protection laws and regulations, including but not limited to the General Data Protection Regulation (GDPR) or any other local data protection laws. The Volunteer agrees to:{'\n'}
            - Handle all personal data in accordance with the Organization’s data protection policies.{'\n'}
            - Protect the integrity and confidentiality of any personal data accessed during volunteer activities.{'\n'}
            - Immediately report any data breaches or incidents of unauthorized access to the Organization.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>6. Intellectual Property</Text>{'\n'}
          <Text style={styles.sectionText}>
            Any work, materials, or intellectual property created by the Volunteer in the course of their volunteer activities shall be the sole property of the Organization. The Volunteer agrees to:{'\n'}
            - Assign all rights, titles, and interests in such intellectual property to the Organization.{'\n'}
            - Refrain from using, reproducing, or distributing any intellectual property created during their service without the Organization’s explicit consent.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>7. Liability Waiver and Assumption of Risk</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer acknowledges that participation in volunteer activities may involve inherent risks, including but not limited to physical injury, emotional distress, or property damage. The Volunteer agrees to:{'\n'}
            - Assume all risks associated with their volunteer activities, including any travel or transportation risks.{'\n'}
            - Release, waive, and discharge the Organization, its officers, directors, employees, and affiliates from any and all liability, claims, or demands arising out of or relating to their volunteer activities.{'\n'}
            - Acknowledge that the Organization does not provide insurance coverage for volunteers, and the Volunteer is responsible for obtaining any necessary insurance.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>8. Indemnification</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer agrees to indemnify and hold harmless the Organization, its officers, directors, employees, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising out of or related to the Volunteer’s actions or omissions during their service.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>9. Commitment and Expectations</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer agrees to commit to the responsibilities and timeframes as communicated by the Organization. If the Volunteer is unable to fulfill these commitments, they agree to:{'\n'}
            - Notify the Organization as soon as possible, providing a valid reason for their unavailability.{'\n'}
            - Work collaboratively with the Organization to ensure a smooth transition of responsibilities, if necessary.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>10. Training and Supervision</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Organization will provide necessary training and supervision to the Volunteer. The Volunteer agrees to:{'\n'}
            - Attend all required training sessions.{'\n'}
            - Adhere to instructions and guidelines provided by the Organization’s supervisors or staff.{'\n'}
            - Seek clarification or assistance when needed to perform their duties effectively.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>11. Health and Safety</Text>{'\n'}
          <Text style={styles.sectionText}>
            The Volunteer acknowledges their responsibility to follow all health and safety guidelines provided by the Organization. The Volunteer agrees to:{'\n'}
            - Report any unsafe conditions or incidents immediately to the Organization.{'\n'}
            - Take reasonable precautions to protect their health and safety as well as that of others during their volunteer activities.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>12. Dispute Resolution</Text>{'\n'}
          <Text style={styles.sectionText}>
            In the event of any disputes arising out of or related to this Agreement, the parties agree to attempt to resolve the matter through good faith negotiations. If a resolution cannot be reached, the parties agree to submit to mediation or arbitration, as mutually agreed, before pursuing any legal action.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>13. Governing Law</Text>{'\n'}
          <Text style={styles.sectionText}>
            This Agreement shall be governed by and construed in accordance with global laws applicable to the activities and interactions facilitated by the Organization. Any legal proceedings arising out of or related to this Agreement shall be brought in the appropriate courts of a jurisdiction mutually agreed upon by both parties.{'\n\n'}
          </Text>

          <Text style={styles.sectionTitle}>14. Acknowledgment and Consent</Text>{'\n'}
          <Text style={styles.sectionText}>
            By agreeing to this document, the Volunteer acknowledges that they have read, understood, and accepted these terms. The Volunteer agrees to abide by all the guidelines, policies, and expectations outlined herein and understands that their volunteer status is contingent upon adherence to this Agreement.{'\n'}
          </Text>
        </Text>
      </ScrollView>

      {/* Text-based Toggle for Agreement */}
      <TouchableOpacity 
        onPress={handleToggleCheck} 
        style={styles.agreementContainer}
      >
        <View style={[styles.indicator, isAcknowledged ? styles.checked : styles.unchecked]} />
        <Text style={[styles.label, !isScrollEnd && styles.disabledText]}>
          I have read and understood the document
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 3, // Reduce padding to make it more compact
  },
  title: {
    fontSize: 25, // Slightly smaller font to reduce space
    fontWeight: 'bold',
    marginBottom: 10, // Reduce margin
    color: '#111827',
  },
  description: {
    fontSize: 15, // Adjust font size
    color: '#374151',
    marginBottom: 12, // Reduce margin
  },
  termsBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 15, // Slightly smaller radius
    padding: 10, // Reduce padding inside the terms box
    backgroundColor: '#F9FAFB',
    marginBottom: 15, // Reduce bottom margin
  },
  termsText: {
    fontSize: 15, // Smaller text to fit more content in less space
    color: '#374151',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 17, // Slightly smaller section title size
    marginBottom: 5,
    color: '#111827',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1, // Reduce margin
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  unchecked: {
    backgroundColor: '#D1D5DB',
  },
  checked: {
    backgroundColor: '#34D399',
  },
  label: {
    fontSize: 17, // Reduce font size of the label
    color: '#111827',
  },
  disabledText: {
    color: '#9CA3AF',  // Grey color for disabled text
  },
});
