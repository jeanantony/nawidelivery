import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PROMOTIONS = [
    { id: '1', title: 'Mega Combo Familiar', discount: '30% OFF', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80', code: 'FAMILIA30' },
    { id: '2', title: 'Envío Gratis', discount: 'En tu primer pedido', image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500&q=80', code: 'ENVIOFREE' },
    { id: '3', title: '2x1 en Sushi', discount: 'Solo hoy', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80', code: 'SUSHI2X1' },
];

export default function PromotionsScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.promoCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.discount}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.code}>Código: {item.code}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Promociones</Text>
            </View>
            <FlatList
                data={PROMOTIONS}
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        padding: 20,
    },
    promoCard: {
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
        justifyContent: 'space-between',
    },
    badge: {
        backgroundColor: '#FF4B3A',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    code: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.9,
    },
});
