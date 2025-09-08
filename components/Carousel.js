import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

const carouselData = [
    {
        title: 'Food and Essentials Support',
        image: require('../assets/landingPageImages/carousel_one.jpg'),
    },
    {
        title: 'Clothing Support',
        image: require('../assets/landingPageImages/carousel_two.jpg'),
    },
    {
        title: 'Education and Career Support',
        image: require('../assets/landingPageImages/carousel_three.jpg'),
    },
    {
        title: 'Healthcare and Wellbeing Support',
        image: require('../assets/landingPageImages/carousel_four.jpg'),
    },
    {
        title: 'Housing Support',
        image: require('../assets/landingPageImages/carousel_five.jpg'),
    },
    {
        title: 'General Support',
        image: require('../assets/landingPageImages/carousel_six.jpg'),
    },
];

const CarouselComponent = () => {
    return (
        <View style={styles.carouselContainer}>
            <Carousel
                width={screenWidth * 1.0}
                height={200}
                autoPlay
                data={carouselData}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Image source={item.image} style={styles.image} resizeMode="cover" />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                    </View>
                )}
                mode="parallax"
                loop
            />
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 10,
    },
    slide: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 16,
    },
    titleContainer: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 12,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CarouselComponent;