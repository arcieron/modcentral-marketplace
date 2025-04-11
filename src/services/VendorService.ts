
import { supabase } from "@/integrations/supabase/client";
import { Vendor } from "@/types";

export const getVendorByUserId = async (userId: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching vendor:", error);
      throw error;
    }
    
    return data as Vendor;
  } catch (error) {
    console.error("Error in getVendorByUserId:", error);
    return null;
  }
};

export const updateVendorStripeStatus = async (
  userId: string, 
  stripeConnectStatus: 'pending' | 'active' | 'rejected'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendors')
      .update({ stripe_connect_status: stripeConnectStatus })
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error updating vendor stripe status:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateVendorStripeStatus:", error);
    return false;
  }
};

export const createVendor = async (userId: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert([{ user_id: userId }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating vendor:", error);
      throw error;
    }
    
    return data as Vendor;
  } catch (error) {
    console.error("Error in createVendor:", error);
    return null;
  }
};
