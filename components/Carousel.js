import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import config from './config';

const deviceWidth = config.deviceWidth;
const deviceHeight = config.deviceHeight;

const carouselHeight = Math.round(deviceHeight * 0.4);

const carouselData = [
    {
        title: 'Food and Essentials Support',
        image: require('../assets/landingPageImages/carousel_one.webp'),
    },
    {
        title: 'Clothing Support',
        image: require('../assets/landingPageImages/carousel_two.webp'),
    },
    {
        title: 'Education and Career Support',
        image: require('../assets/landingPageImages/carousel_three.webp'),
    },
    {
        title: 'Healthcare and Wellbeing Support',
        image: require('../assets/landingPageImages/carousel_four.webp'),
    },
    {
        title: 'Housing Support',
        image: require('../assets/landingPageImages/carousel_five.webp'),
    },
    {
        title: 'General Support',
        image: require('../assets/landingPageImages/carousel_six.webp'),
    },
];

const CarouselComponent = () => {
    const carouselRef = useRef(null);

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                ref={carouselRef}
                width={deviceWidth}
                height={carouselHeight}
                autoPlay
                autoPlayInterval={2500}
                data={carouselData}
                scrollAnimationDuration={800}
                loop
                mode="parallax"
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Image
                            source={item.image}
                            style={[styles.image, { width: deviceWidth, height: carouselHeight }]}
                            resizeMode="cover"
                        />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                        </View>
                    </View>
                )}
            />

           <View style={styles.arrowsContainer}>
                <TouchableOpacity
                    onPress={() => carouselRef.current?.scrollTo({ count: -1, animated: true })}
                >
                    <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => carouselRef.current?.scrollTo({ count: 1, animated: true })}
                >
                    <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
            </View>
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
    arrowsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 50,
    },
    arrowText: {
        fontSize: 32,
        color: '#4B5563',
        fontWeight: '600',
    },
});

export default CarouselComponent;
