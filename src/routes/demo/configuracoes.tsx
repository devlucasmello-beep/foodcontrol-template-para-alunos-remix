import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoCompany } from "@/lib/demoData";
import { toast } from "sonner";

export const Route = createFileRoute("/demo/configuracoes")({
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Dados do restaurante, branding e horários" />

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Dados do restaurante</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div><Label>Nome</Label><Input defaultValue={demoCompany.name} /></div>
          <div><Label>CNPJ</Label><Input defaultValue={demoCompany.cnpj} /></div>
          <div><Label>E-mail</Label><Input defaultValue={demoCompany.email} /></div>
          <div><Label>Telefone</Label><Input defaultValue={demoCompany.telefone} /></div>
          <div><Label>WhatsApp</Label><Input defaultValue={demoCompany.whatsapp} /></div>
          <div><Label>Slug (link público)</Label><Input defaultValue={demoCompany.slug} /></div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Branding</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Cor primária</Label>
            <div className="flex gap-2"><Input defaultValue={demoCompany.cor_primaria} /><div className="h-10 w-10 rounded border" style={{ background: demoCompany.cor_primaria }} /></div>
          </div>
          <div><Label>Logo URL</Label><Input placeholder="https://…" /></div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Entrega</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div><Label>Taxa padrão</Label><Input type="number" defaultValue={demoCompany.delivery_fee} /></div>
          <div><Label>Pedido mínimo</Label><Input type="number" defaultValue={demoCompany.min_order} /></div>
          <div><Label>Plano</Label><Input defaultValue={demoCompany.plano} disabled /></div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Horários de funcionamento</h3>
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          {Object.entries(demoCompany.business_hours).map(([dia, h]) => (
            <div key={dia} className="flex justify-between border rounded p-2">
              <span className="capitalize font-medium">{dia}</span><span className="text-muted-foreground">{h}</span>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={() => toast.success("Configurações salvas (demo)")}>Salvar alterações</Button>
    </div>
  ),
});

