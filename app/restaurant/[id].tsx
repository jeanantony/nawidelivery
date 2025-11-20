import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SectionList, Share, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '../../context/CartContext';

const MENU_SECTIONS = [
    {
        title: 'Hamburguesas',
        data: [
            { id: '1', name: 'Combo Whopper', price: '$8.50', description: 'Whopper, papas medianas y refresco', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80' },
            { id: '2', name: 'King de Pollo', price: '$7.00', description: 'Sandwich de pollo crujiente', image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500&q=80' },
            { id: '3', name: 'Bacon King', price: '$9.50', description: 'Doble carne, queso y mucho tocino', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
        ]
    },
    {
        title: 'Complementos',
        data: [
            { id: '4', name: 'Nuggets x10', price: '$5.50', description: '10 piezas de pollo empanizado', image: 'https://images.unsplash.com/photo-1562967960-f55430ed519d?w=500&q=80' },
            { id: '5', name: 'Papas Fritas', price: '$3.50', description: 'Papas crujientes medianas', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd0a58?w=500&q=80' },
            { id: '6', name: 'Aros de Cebolla', price: '$3.90', description: 'Aros de cebolla dorados', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80' },
        ]
    },
    {
        title: 'Bebidas',
        data: [
            { id: '7', name: 'Coca Cola', price: '$2.00', description: 'Lata 355ml', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' },
            { id: '8', name: 'Fanta', price: '$2.00', description: 'Lata 355ml', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80' },
        ]
    },
    {
        title: 'Postres',
        data: [
            { id: '9', name: 'Helado de Vainilla', price: '$2.50', description: 'Cono suave de vainilla', image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500&q=80' },
            { id: '10', name: 'Pie de Manzana', price: '$3.00', description: 'Caliente y crujiente', image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=500&q=80' },
        ]
    }
];

export default function RestaurantDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart, count, total } = useCart();
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAdd = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price.replace('$', '')),
            image: item.image,
            restaurantId: id as string,
        });
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `¡Mira este restaurante en NawiDelivery! Burger King: https://nawidelivery.com/restaurant/${id}`,
            });
        } catch (error) {
            Alert.alert('Error', 'No se pudo compartir.');
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Here you would typically save to the database
    };

    const renderHeader = () => (
        <View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80' }} style={styles.headerImage} />
                <View style={styles.headerOverlay} />

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF4B3A" : "#fff"} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.restaurantName}>Burger King</Text>
                <View style={styles.metaContainer}>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>4.5</Text>
                    </View>
                    <Text style={styles.metaText}>• Hamburguesas • Americana</Text>
                </View>
                <View style={styles.deliveryInfo}>
                    <Text style={styles.metaText}>🕒 20-30 min • 🛵 $2.00 envío</Text>
                </View>
                <Text style={styles.sectionTitle}>Menú</Text>
            </View>
        </View>
    );

    const renderMenuItem = ({ item }: { item: any }) => (
        <View style={styles.menuItem}>
            <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <TouchableOpacity style={styles.addButton} onPress={() => handleAdd(item)}>
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SectionList
                sections={MENU_SECTIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderMenuItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
            />

            {/* Floating Cart Button */}
            {count > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.viewCartButton} onPress={() => router.push('/(tabs)/cart')}>
                        <View style={styles.cartCount}>
                            <Text style={styles.cartCountText}>{count}</Text>
                        </View>
                        <Text style={styles.viewCartText}>Ver Carrito</Text>
                        <Text style={styles.cartTotal}>${total.toFixed(2)}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: 100, // Space for footer
    },
    imageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    headerActions: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    content: {
        backgroundColor: '#fff',
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom: 0,
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
    },
    ratingText: {
        fontWeight: 'bold',
        marginLeft: 4,
        color: '#333',
    },
    metaText: {
        color: '#666',
        fontSize: 16,
    },
    deliveryInfo: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 24, // Larger for the main "Menú" title
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    sectionHeader: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    menuItem: {
        flexDirection: 'row',
        marginBottom: 15,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f9f9f9',
    },
    menuInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    menuDescription: {
        color: '#666',
        fontSize: 12,
        marginBottom: 5,
    },
    menuPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4B3A',
    },
    menuImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginLeft: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#FF4B3A',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    viewCartButton: {
        backgroundColor: '#FF4B3A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
    },
    cartCount: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    cartCountText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    viewCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartTotal: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
