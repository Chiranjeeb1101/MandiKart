import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { useLocation } from '../../context/LocationContext';

export default function DeliveryAddressScreen({ navigation }: any) {
  const { savedAddresses, selectedAddressId, selectSavedAddress, deleteSavedAddress } = useLocation();

  const handleDelete = (id: string, label: string) => {
    if (savedAddresses.length <= 1) {
      if (Platform.OS === 'web') {
        window.alert('You must keep at least one saved delivery address.');
      } else {
        Alert.alert('Cannot Delete', 'You must keep at least one saved delivery address.');
      }
      return;
    }

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Delete address "${label}"?`)) {
        deleteSavedAddress(id);
      }
    } else {
      Alert.alert('Delete Address', `Are you sure you want to delete this address?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSavedAddress(id) },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={22} color={Colors.primary} />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Saved Delivery Addresses ({savedAddresses.length})</Text>

        {/* Saved Addresses List */}
        {savedAddresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <TouchableOpacity
              key={addr.id}
              style={[styles.addressCard, isSelected && styles.addressCardSelected]}
              onPress={() => selectSavedAddress(addr.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                    <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                      {addr.type || 'HOME'}
                    </Text>
                  </View>
                  {addr.isDefault && (
                    <View style={styles.defaultTag}>
                      <Text style={styles.defaultTagText}>DEFAULT</Text>
                    </View>
                  )}
                </View>

                <View style={styles.rightActions}>
                  <TouchableOpacity
                    onPress={() => handleDelete(addr.id, addr.fullName)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={isSelected ? Colors.primary : Colors.gray400}
                  />
                </View>
              </View>

              <Text style={styles.name}>{addr.fullName}</Text>
              <Text style={styles.address}>{addr.formattedAddress}</Text>
              <Text style={styles.phone}>📞 {addr.phone}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Deliver Here & Continue"
          onPress={() => navigation.navigate('CheckoutReview')}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: Spacing.md, gap: Spacing.md },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  addText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  addressCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    gap: 4,
    ...Shadows.sm,
  },
  addressCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F8FCF9',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { backgroundColor: Colors.gray100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeSelected: { backgroundColor: Colors.primaryLight },
  badgeText: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary },
  badgeTextSelected: { color: Colors.primary },
  defaultTag: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  defaultTagText: { fontSize: 10, fontWeight: '800', color: '#B45309' },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deleteBtn: { padding: 2 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  address: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginTop: 2, marginBottom: 4 },
  phone: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.md,
  },
});
