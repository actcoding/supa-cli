import { supabase } from '@/components/supabase/client.ts'
import { Session } from '@supabase/supabase-js'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

type Props = PropsWithChildren
type Context = {
    session: Session|null
}

const SupabaseContext = createContext<Context>({} as Context)

export default function SupabaseProvider(props: Props) {
    const [session, setSession] = useState<Session|null>(null)

    const context = useMemo<Context>(() => ({
        session,
    }), [session])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {data: { subscription }} = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (import.meta.env.DEV) {
                    console.log(event)
                }

                if (event === 'SIGNED_OUT') {
                    setSession(null)
                } else if (session) {
                    setSession(session)
                }
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [setSession])

    return (
        <SupabaseContext.Provider value={context}>
            {props.children}
        </SupabaseContext.Provider>
    )
}

export function useSupabase() {
    return useContext(SupabaseContext)
}
