import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PowerBIEmbedProps {
  fornecedorId?: number;
}

export default function PowerBIEmbed({ fornecedorId }: PowerBIEmbedProps) {
  // Report ID e Workspace ID do Power BI
  const REPORT_ID = "396a55c4-c192-4096-b577-28098675d8f0";
  const WORKSPACE_ID = "me";
  const TENANT_ID = "9072b93d-c9b5-426f-a79d-fdfa9a9361da";

  // URL de embedding do Power BI (permite visualização sem autenticação)
  const EMBED_URL = `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&groupId=${WORKSPACE_ID}&autoAuth=true&ctid=${TENANT_ID}`;

  // Link direto para abrir em nova aba
  const DIRECT_LINK = `https://app.powerbi.com/links/odI8chaycQ?ctid=${TENANT_ID}&pbi_source=linkShare`;

  return (
    <Card className="p-6 shadow-lg overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Dashboard Power BI
        </h3>
        <a
          href={DIRECT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
        >
          <ExternalLink size={16} />
          Abrir em nova aba
        </a>
      </div>

      <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
        <iframe
          title="Power BI Report"
          src={EMBED_URL}
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen={true}
          className="rounded-lg"
        />
      </div>

      <p className="text-xs text-slate-500 mt-4">
        💡 Dica: O dashboard Power BI exibe dados agregados de todos os fornecedores. 
        Atualize manualmente para ver as mudanças mais recentes.
      </p>
    </Card>
  );
}
