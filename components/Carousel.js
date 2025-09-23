import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated';
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
    const progress = useSharedValue(0);

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                width={deviceWidth}
                height={carouselHeight}
                autoPlay
                autoPlayInterval={2500}
                data={carouselData}
                scrollAnimationDuration={800}
                loop
                mode="parallax"
                onProgressChange={(_, absoluteProgress) => {
                    progress.value = absoluteProgress;
                }}
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

            <View style={styles.pagination}>
                {carouselData.map((_, i) => (
                    <PaginationDot
                        key={i}
                        index={i}
                        total={carouselData.length}
                        progress={progress}
                    />
                ))}
            </View>
        </View>
    );
};

const PaginationDot = ({ index, total, progress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    let current = progress.value;

    let distance = Math.abs(index - (current % total));
    if (distance > total / 2) {
      distance = total - distance;
    }

    const scale = interpolate(distance, [0, 1], [1.1, 0.9], 'clamp');
    const opacity = interpolate(distance, [0, 1], [1, 0.4], 'clamp');

    return { transform: [{ scale }], opacity };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
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
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 6,
        backgroundColor: '#342626ff',
    },
});

export default CarouselComponent;
