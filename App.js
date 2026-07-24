import React, { useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COFFEE_TYPES = [
  { id: 'espresso', label: 'Espresso', icon: 'cafe' },
  { id: 'latte', label: 'Latte', icon: 'cafe' },
  { id: 'cappuccino', label: 'Cappuccino', icon: 'cafe' },
  { id: 'americano', label: 'Americano', icon: 'cafe' },
];

const FONT_FAMILY = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function App() {
  const [orders, setOrders] = useState([]);
  const listRef = useRef(null);
  const numColumns = 2;
  const cardWidth = useMemo(() => (Dimensions.get('window').width - 64) / 2, []);

  const addOrder = (type) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    const newOrder = {
      id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      type,
      timestamp,
    };

    setOrders((current) => {
      const next = [...current, newOrder];
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      return next;
    });
  };

  const clearOrders = () => setOrders([]);

  const renderCoffeeCard = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.coffeeCard, { width: cardWidth }, pressed && styles.cardPressed]}
      onPress={() => addOrder(item.label)}
    >
      <View style={styles.iconBadge}>
        <Ionicons name={item.icon} size={24} color="#f4e4c1" />
      </View>
      <Text style={styles.coffeeTitle}>{item.label}</Text>
      <Text style={styles.coffeeSubtitle}>Tap to place an order</Text>
    </Pressable>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderIconWrap}>
        <Ionicons name="cafe" size={18} color="#6b4423" />
      </View>
      <Text style={styles.orderText}>{`${item.type} • ${item.timestamp}`}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f5f1e8', '#e8dcc8']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>Daily Brew</Text>
            <Text style={styles.title}>Coffee Order Tracker</Text>
            <Text style={styles.subtitle}>Track every coffee run in one cozy place.</Text>
          </View>
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.clearButton, pressed && styles.clearPressed]} onPress={clearOrders}>
            <Ionicons name="trash-outline" size={20} color="#4a2c2a" />
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        </View>

        <FlatList
          data={COFFEE_TYPES}
          renderItem={renderCoffeeCard}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
          contentContainerStyle={styles.coffeeGrid}
        />

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Order History</Text>
          <View style={styles.listCard}>
            {orders.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="cafe-outline" size={28} color="#6b4423" />
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptyText}>Choose a coffee above to add it to the list.</Text>
              </View>
            ) : (
              <FlatList
                ref={listRef}
                data={orders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.orderListContent}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  eyebrow: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: '#6b4423',
    marginBottom: 4,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    fontWeight: '700',
    color: '#2d1b1a',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 22,
    color: '#4a2c2a',
    maxWidth: 240,
  },
  clearButton: {
    minWidth: 120,
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(244, 228, 193, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#4a2c2a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  clearPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  clearText: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    fontWeight: '600',
    color: '#4a2c2a',
  },
  coffeeGrid: {
    gap: 12,
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coffeeCard: {
    minHeight: 132,
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'rgba(255, 250, 242, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(107, 68, 35, 0.12)',
    justifyContent: 'space-between',
    shadowColor: '#6b4423',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a2c2a',
    marginBottom: 12,
  },
  coffeeTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
    color: '#2d1b1a',
    marginBottom: 6,
  },
  coffeeSubtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    color: '#6b4423',
    lineHeight: 18,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '700',
    color: '#2d1b1a',
    marginBottom: 12,
  },
  listCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 248, 238, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.08)',
    padding: 16,
    minHeight: 220,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
    color: '#4a2c2a',
  },
  emptyText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    color: '#6b4423',
    textAlign: 'center',
    maxWidth: 260,
  },
  orderListContent: {
    paddingBottom: 8,
    gap: 10,
  },
  orderItem: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f1e8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4e4c1',
  },
  orderText: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    fontWeight: '600',
    color: '#2d1b1a',
  },
});
