import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PowerBIEmbedProps {
  fornecedorId?: number;
}

export default function PowerBIEmbed({ fornecedorId }: PowerBIEmbedProps) {
  // Link público compartilhado do Power BI
  const POWERBI_LINK = "https://app.powerbi.com/links/odI8chaycQ?ctid=9072b93d-c9b5-426f-a79d-fdfa9a9361da&pbi_source=linkShare";

  return (
    <Card className="p-6 shadow-lg overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Dashboard Power BI
        </h3>
        <a
          href={POWERBI_LINK}
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
          src={POWERBI_LINK}
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
