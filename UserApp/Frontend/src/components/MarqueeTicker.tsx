import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TickerItem {
  name: string;
  price: string;
  imageUrl: string;
}

interface Props {
  items: TickerItem[];
  speed?: number;
}

const ITEM_WIDTH = 150;

export default function MarqueeTicker({ items, speed = 50 }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const totalWidth = items.length * ITEM_WIDTH;

  useEffect(() => {
    translateX.setValue(0);
    const duration = (totalWidth / speed) * 1000;

    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [items.length]);

  // Double the items for seamless loop
  const doubled = [...items, ...items];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.track,
          { transform: [{ translateX }] },
        ]}
      >
        {doubled.map((item, i) => (
          <View key={`${item.name}-${i}`} style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.textWrap}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  track: {
    flexDirection: 'row',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ITEM_WIDTH,
    paddingHorizontal: 6,
    gap: 6,
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  price: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
});
