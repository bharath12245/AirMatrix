export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            bookings: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string | null
                    flight_id: string
                    airline: string
                    flight_number: string
                    origin: string
                    destination: string
                    departure_time: string
                    arrival_time: string
                    total_price: number
                    status: 'confirmed' | 'pending' | 'cancelled'
                    passenger_count: number
                    passenger_details: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id?: string | null
                    flight_id: string
                    airline: string
                    flight_number: string
                    origin: string
                    destination: string
                    departure_time: string
                    arrival_time: string
                    total_price: number
                    status?: 'confirmed' | 'pending' | 'cancelled'
                    passenger_count: number
                    passenger_details: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string | null
                    flight_id?: string
                    airline?: string
                    flight_number?: string
                    origin?: string
                    destination?: string
                    departure_time?: string
                    arrival_time?: string
                    total_price?: number
                    status?: 'confirmed' | 'pending' | 'cancelled'
                    passenger_count?: number
                    passenger_details?: Json
                }
            }
        }
    }
}
