import { createContext ,useContext ,useState,useEffect } from "react";
import {  supabase } from "../supabase";



const AuthContext = createContext(null);

export function AuthProvider ({children}){


    const [user , setUser]=useState(null);
    const [loading ,setLoading]= useState(true);


    useEffect(()=>{

        let mounted = true;

        // 1. Check existing session التاكد من وجود جلسه للمستخدم

        const getInitialSession = async ()=>{

        const {data , error} = await supabase.auth.getSession();

        if(!mounted) return;

        if(error) {console.error(error);}

        setUser(data.session?.user ?? null);

        setLoading(false);
        }


        getInitialSession();


        // 1 Listen to authentication changes يعني استمع اللي تغييرات المصادقه
        const {  data: {subscription}  } = supabase.auth.onAuthStateChange((_event, session)=>{

            setUser(session?.user ?? null);
            setLoading(false);

        });



        // 3. Cleanup
        return () => {
        mounted = false;
        subscription.unsubscribe();
        }

    },[])




    return (

        <AuthContext.Provider value={{user,loading}}>
            {children}
        </AuthContext.Provider>


    );

    


}


export function useAuth() { return useContext(AuthContext);}

   
            
        
    