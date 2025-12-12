export interface User {
    id: number;
    email: string;
    role: 'admin' | 'user';
}

export interface Show {
    id: number;
    name: string;
    specialty: string;
    start_time: string;
    end_time: string;
    total_slots: number;
    available_slots: number;
    duration_minutes: number;
}

export interface Booking {
    id: number;
    user_id: number;
    show_id: number;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    booked_at: string;
    show_name?: string;
    specialty?: string;
    start_time?: string;
}
