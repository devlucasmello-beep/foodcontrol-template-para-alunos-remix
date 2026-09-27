import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
type Session=any;type User=any;
import {callBackend} from "@/blink/backend";
import {useQueryClient} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "garcom" | "cozinha" | "entregador" | "caixa" | "demo";

export type CompanyMembership = {
  company_id: string;
  role: AppRole;
  ativo: boolean;
  company: {
    id: string;
    name: string;
    slug: string;
    cor_primaria: string;
    status: "trial" | "active" | "inadimplente" | "suspended" | "inactive";
    plano: "starter" | "pro" | "enterprise";
    trial_ate: string;
    valor_mensal: number;
  } | null;
};

type AuthCtx = {
  user: User | null;
  session: Session | null;
  email: string | null;
  membership: CompanyMembership | null;
  companyId: string | null;
  isSuperAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc=useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [membership, setMembership] = useState<CompanyMembership | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadContext = async (u: User) => {
    const ctx=await callBackend('/api/bootstrap');
    setMembership(ctx.companyUser&&ctx.company?{...ctx.companyUser,company:ctx.company}:null);
    setIsSuperAdmin(!!ctx.isSuperAdmin);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e:string, s:any) => {
      setSession(s);
      if (s?.user) setTimeout(() => loadContext(s.user).catch(()=>{}), 0);
      else { setMembership(null); setIsSuperAdmin(false); }
    });
    supabase.auth.getSession().then(async ({ data }:any) => {
      setSession(data.session);
      if (data.session?.user) await loadContext(data.session.user).catch(()=>{});
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        email: session?.user?.email ?? null,
        membership,
        companyId: membership?.company_id ?? null,
        isSuperAdmin,
        loading,
        refresh: async () => { if (session?.user) await loadContext(session.user); },
        signOut: async () => { await supabase.auth.signOut();qc.clear();sessionStorage.removeItem("food-company"); },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

