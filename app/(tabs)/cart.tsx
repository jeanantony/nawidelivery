import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '../../context/DatabaseContext';
import { useCart } from '../../context/CartContext';

export default function CartScreen() {
    const router = useRouter();
    const { createOrder } = useDatabase();
    const { items, total: subtotal, updateQuantity, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const deliveryFee = 2.00;
    const total = subtotal + deliveryFee - discount;

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === 'NAWI10') {
            const discountAmount = subtotal * 0.10;
            setDiscount(discountAmount);
            Alert.alert('¡Éxito!', 'Cupón aplicado: 10% de descuento.');
        } else {
            setDiscount(0);
            Alert.alert('Error', 'Cupón inválido.');
        }
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;

        setLoading(true);
        const { error } = await createOrder(total, items);
        setLoading(false);

        if (error) {
            Alert.alert('Error', 'No se pudo crear el pedido. Inténtalo de nuevo.');
            console.error(error);
        } else {
            clearCart();
            setDiscount(0);
            setCoupon('');
            Alert.alert('¡Pedido Creado!', 'Tu orden ha sido enviada exitosamente.', [
                { text: 'Ver mis pedidos', onPress: () => router.replace('/(tabs)/orders') }
            ]);
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Tu Carrito</Text>
                </View>
                <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="cart-outline" size={64} color="#ccc" />
                    <Text style={{ marginTop: 20, fontSize: 18, color: '#666' }}>Tu carrito está vacío</Text>
                    <TouchableOpacity
                        style={[styles.checkoutButton, { marginTop: 30, paddingHorizontal: 40 }]}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.checkoutText}>Ir a comprar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tu Carrito</Text>
            </View>

            <ScrollView style={styles.content}>
                {items.map((item, index) => (
                    <View key={index} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.quantityControl}>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                                <Ionicons name="remove" size={20} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.qty}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                                <Ionicons name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.couponContainer}>
                    <TextInput
                        style={styles.couponInput}
                        placeholder="Código de cupón"
                        value={coupon}
                        onChangeText={setCoupon}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon}>
                        <Text style={styles.applyButtonText}>Aplicar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Descuento</Text>
                            <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-${discount.toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.checkoutButton, loading && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    <Text style={styles.checkoutText}>
                        {loading ? 'Procesando...' : 'Ordenar'}
                    </Text>
                </TouchableOpacity>
            </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        color: '#FF4B3A',
        fontWeight: 'bold',
        marginTop: 5,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    qty: {
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
    summary: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#666',
        fontSize: 16,
    },
    summaryValue: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF4B3A',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    checkoutButton: {
        backgroundColor: '#FF4B3A',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    couponContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    couponInput: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    applyButton: {
        backgroundColor: '#333',
        borderRadius: 12,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
