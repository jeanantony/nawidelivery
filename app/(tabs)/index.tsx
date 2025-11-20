import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: '1', name: 'Hamburguesas', icon: 'fast-food' },
  { id: '2', name: 'Pizza', icon: 'pizza' },
  { id: '3', name: 'Sushi', icon: 'fish' },
  { id: '4', name: 'Bebidas', icon: 'beer' },
  { id: '5', name: 'Postres', icon: 'ice-cream' },
];

const RESTAURANTS = [
  {
    id: '1',
    name: 'Burger King',
    rating: 4.5,
    time: '15-25 min',
    deliveryFee: '$2.00',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
  },
  {
    id: '2',
    name: 'Pizza Hut',
    rating: 4.2,
    time: '30-45 min',
    deliveryFee: '$3.50',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
  },
  {
    id: '3',
    name: 'Sushi Master',
    rating: 4.8,
    time: '20-40 min',
    deliveryFee: '$1.50',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
  },
];

import { useDatabase } from '../../context/DatabaseContext';

// ... imports

import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// ... imports

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile, refreshProfile } = useDatabase();

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [])
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon as any} size={24} color="#fff" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurant = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.id}` as any)}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.restaurantDetails}>{item.time} • Envío {item.deliveryFee}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {profile?.full_name || 'Usuario'}</Text>
            <Text style={styles.location}>📍 {profile?.address || 'Agrega tu dirección'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={40} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="¿Qué se te antoja hoy?"
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Popular Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurantes Populares</Text>
          <FlatList
            data={RESTAURANTS}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Let main ScrollView handle scrolling
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#333',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FF4B3A',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantDetails: {
    color: '#666',
    fontSize: 14,
  },
});
