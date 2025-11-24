import { supabase } from '@/lib/supabase';
import { Event } from '@/types/event';

/**
 * Fetches all events from the Supabase database
 * @returns Promise with array of events or null if error
 */
export async function fetchEvents(): Promise<Event[] | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching events:', error);
    return null;
  }
}
