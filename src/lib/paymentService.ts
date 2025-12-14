import { createClient } from '@supabase/supabase-js';
import { Database } from './supabaseTypes';
import { Flight, BookingDetails } from '@/store/bookingStore';

// Initialize Supabase client
// For demo purposes, we'll try to read from env, but if missing, we'll fallback to a mock mode
// In a real scenario, these must be present.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : null;

export interface CreateBookingParams {
    flight: Flight;
    bookingDetails: BookingDetails;
    totalPrice: number;
}

export const createBooking = async ({ flight, bookingDetails, totalPrice }: CreateBookingParams) => {
    console.log('Creating booking...', { flight, bookingDetails, totalPrice });

    // Fallback for demo if no Supabase credentials
    if (!supabase) {
        console.warn('Supabase not configured. Using mock booking.');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return [{
            id: `mock-${Date.now()}`,
            created_at: new Date().toISOString(),
            flight_id: flight.id,
            user_id: 'mock-user',
            ...bookingDetails,
            total_price: totalPrice,
            status: 'confirmed'
        }];
    }

    // Actual Supabase implementation would go here
    // For now returning empty or we can implement the insert
    const { data, error } = await supabase
        .from('bookings')
        .insert([
            {
                flight_id: flight.id,
                ...bookingDetails,
                total_price: totalPrice,
                status: 'pending' // Initial status
            }
        ])
        .select();

    if (error) {
        console.error('Error creating booking:', error);
        throw error;
    }

    return data;
};

export const fetchMyBookings = async () => {
    console.log('Fetching bookings...');
    // Fallback/Mock
    if (!supabase) {
        return [{
            id: 'mock-booking-1',
            created_at: new Date().toISOString(),
            flight_id: 'fl-123',
            user_id: 'mock-user',
            origin: 'New York (JFK)',
            destination: 'London (LHR)',
            flight_number: 'AM-101',
            departure_time: new Date(Date.now() + 86400000).toISOString(),
            status: 'confirmed',
            total_price: 45000
        }];
    }

    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }

    return data;
};
