import { differenceInDays } from "date-fns";
import { Link } from "@tanstack/react-router";
import type { CompanyMembership } from "@/hooks/useAuth";

export function TrialBanner({ membership }: { membership: CompanyMembership }) {
  const c = membership.company;
  if (!c) return null;
  if (c.status === "inadimplente") {
    return (
      <div className="bg-orange-500 text-white px-4 py-2 text-sm flex items-center justify-between">
        <span>Pagamento em atraso. Regularize para manter o serviço ativo.</span>
        <Link to="/app/configuracoes" className="underline font-medium">Ir para cobrança</Link>
      </div>
    );
  }
  if (c.status === "suspended") {
    return (
      <div className="bg-red-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <span>Conta suspensa. Apenas Cobrança está disponível.</span>
        <Link to="/app/configuracoes" className="underline font-medium">Cobrança</Link>
      </div>
    );
  }
  if (c.status === "trial") {
    const days = differenceInDays(new Date(c.trial_ate), new Date());
    if (days < 3) {
      return (
        <div className="bg-yellow-400 text-yellow-950 px-4 py-2 text-sm flex items-center justify-between">
          <span>Seu trial termina em {Math.max(0, days)} dia{days === 1 ? "" : "s"}.</span>
          <Link to="/app/configuracoes" className="underline font-medium">Assinar plano</Link>
        </div>
      );
    }
  }
  return null;
}

