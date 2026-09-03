import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

export default function ReviewListScreen({ navigation }: any) {
  const reviews = [
    { id: '1', user: 'Anil Kumar', rating: 5, date: '12 Aug 2023', text: 'Very fresh and good quality. Delivered on time.' },
    { id: '2', user: 'Sunita Sharma', rating: 4, date: '10 Aug 2023', text: 'Good quality but delivery was a bit late.' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>All Reviews</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.user}>{item.user}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={14} color={s <= item.rating ? Colors.accent : Colors.gray300} />
              ))}
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700' },
  card: { backgroundColor: 'transparent', padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  user: { fontWeight: '600', fontSize: 15 },
  date: { color: Colors.textSecondary, fontSize: 12 },
  stars: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  text: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },
});

