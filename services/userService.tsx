import { supabase } from "@/lib/supabase";

export const getUserData = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', userId)
            .single();

        if (error) {
            return { success: false, msg: error.message };
        }

        return { success: true, data };
    } catch (error: unknown) {
        console.log('got error: ', error);
        return { success: false, msg: error instanceof Error ? error.message : String(error) };
    }
};
