import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Correctly importing the FontAwesome icon library

const { width } = Dimensions.get('window'); // Get screen width for pagination

const WelcomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    {
      title: 'Welcome to Saayam',
      description: 'A non-profit organization - is your gateway to assistance and support in times of need. Saayam means Help in Telugu, Sahay in Sanskrit/Hindi, Bangzhu in Mandarin, and Ayuda in Spanish.',
    },
    {
      title: 'Our Mission',
      description: 'We aim to support individuals facing crises by connecting them with the right resources and providing timely assistance.',
    },
    {
      title: 'Get Involved',
      description: 'Join us in our mission by volunteering, donating, or spreading the word about our cause.',
    },
  ];

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderDots = () => {
    return data.map((_, i) => (
      <View
        key={i}
        style={[styles.dot, { backgroundColor: i === currentIndex ? '#007bff' : '#ccc' }]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: 'https://via.placeholder.com/300' }} // Replace with your image URL or local image
        style={styles.image}
      />

      {/* Dots Indicator between image and text */}
      <View style={styles.dotContainer}>
        {renderDots()}
      </View>

      {/* FlatList for Swiping Text */}
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.description}</Text>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Buttons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.buttonWhite}>
          <FontAwesome name="heart" size={20} color="#000" />
          <Text style={styles.buttonTextBlack}>Donate</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonBlue}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlue}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  page: {
    width: width - 40, // Use screen width minus padding
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10, // Adjust spacing between the dots and the text
    marginTop: 10, // Adjust spacing between the image and the dots
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWhite: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonBlue: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextBlack: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default WelcomeScreen;
