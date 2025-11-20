import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const FAVORITES = [
    { id: '1', name: 'Burger King', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80', rating: 4.5, deliveryTime: '20-30 min', deliveryFee: '$2.00' },
    { id: '2', name: 'Pizza Hut', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80', rating: 4.2, deliveryTime: '30-45 min', deliveryFee: '$3.50' },
    { id: '3', name: 'KFC', image: 'https://images.unsplash.com/photo-1513639776629-7b611594e29b?w=500&q=80', rating: 4.0, deliveryTime: '25-40 min', deliveryFee: '$1.50' },
];

export default function FavoritesScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/restaurant/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <View style={styles.row}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
                <Text style={styles.details}>🕒 {item.deliveryTime} • 🛵 {item.deliveryFee}</Text>
            </View>
            <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart" size={24} color="#FF4B3A" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={FAVORITES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
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
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f9f9f9',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        color: '#333',
    },
    details: {
        color: '#666',
        fontSize: 14,
    },
    heartButton: {
        padding: 10,
    },
});
