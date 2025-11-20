import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const ALERTS = [
    { id: '1', title: '¡Tu pedido está en camino!', message: 'El repartidor llegará en 5 minutos.', time: 'Hace 2 min', icon: 'bicycle', color: '#FF4B3A' },
    { id: '2', title: 'Promoción exclusiva', message: '50% de descuento en tu próxima hamburguesa.', time: 'Hace 2 horas', icon: 'pricetag', color: '#FFD700' },
    { id: '3', title: 'Bienvenido a NawiDelivery', message: 'Gracias por registrarte. ¡Disfruta tu comida!', time: 'Ayer', icon: 'happy', color: '#4CAF50' },
];

export default function AlertsScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.alertItem}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alertas</Text>
            </View>
            <FlatList
                data={ALERTS}
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
    alertItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f9f9f9',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});
