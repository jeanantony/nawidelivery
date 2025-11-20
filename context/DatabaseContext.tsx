import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, Order, OrderItem } from '../lib/types';
import { useAuth } from './AuthContext';

type DatabaseContextType = {
    profile: Profile | null;
    orders: Order[];
    loading: boolean;
    refreshProfile: () => Promise<void>;
    refreshOrders: () => Promise<void>;
    createOrder: (total: number, items: { name: string; quantity: number; price: number }[]) => Promise<{ error: any }>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
};

const DatabaseContext = createContext<DatabaseContextType>({
    profile: null,
    orders: [],
    loading: true,
    refreshProfile: async () => { },
    refreshOrders: async () => { },
    createOrder: async () => ({ error: null }),
    updateProfile: async () => ({ error: null }),
});

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        if (!user) {
            setProfile(null);
            return;
        }

        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist (likely created before trigger), create it
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({ id: user.id, full_name: user.email?.split('@')[0] || 'Usuario' })
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile:', createError);
                    return;
                }
                data = newProfile;
            } else if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            if (data) {
                setProfile(data);
            }
        } catch (e) {
            console.error('Unexpected error in refreshProfile:', e);
        }
    };

    const refreshOrders = async () => {
        if (!user) {
            setOrders([]);
            return;
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        items:order_items(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
    };

    const createOrder = async (total: number, items: { name: string; quantity: number; price: number }[]) => {
        if (!user) return { error: 'No user' };

        try {
            // 1. Create Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total,
                    status: 'pending',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                item_name: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            await refreshOrders();
            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: 'No user' };

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    useEffect(() => {
        if (user) {
            setLoading(true);
            Promise.all([refreshProfile(), refreshOrders()]).then(() => setLoading(false));
        } else {
            setProfile(null);
            setOrders([]);
            setLoading(false);
        }
    }, [user]);

    return (
        <DatabaseContext.Provider
            value={{
                profile,
                orders,
                loading,
                refreshProfile,
                refreshOrders,
                createOrder,
                updateProfile,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};
