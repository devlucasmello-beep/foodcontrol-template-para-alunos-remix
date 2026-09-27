import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoCompanyUsers } from "@/lib/demoData";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", garcom: "Garçom", cozinha: "Cozinha", caixa: "Caixa", entregador: "Entregador" };

export const Route = createFileRoute("/demo/equipe")({
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Equipe" description={`${demoCompanyUsers.length} membros cadastrados`} />
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Função</th><th className="p-3">Último acesso</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {demoCompanyUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.nome}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3"><Badge variant="outline">{ROLE_LABEL[u.role] ?? u.role}</Badge></td>
                <td className="p-3 text-muted-foreground">{formatDistanceToNow(new Date(u.ultimo_login), { addSuffix: true, locale: ptBR })}</td>
                <td className="p-3"><Badge variant={u.ativo ? "default" : "secondary"}>{u.ativo ? "Ativo" : "Inativo"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  ),
});

