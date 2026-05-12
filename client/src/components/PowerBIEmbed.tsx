import { Card } from "@/components/ui/card";
import { AlertCircle, ExternalLink } from "lucide-react";

interface PowerBIEmbedProps {
  reportUrl?: string;
  showPlaceholder?: boolean;
}

export default function PowerBIEmbed({ 
  reportUrl = "https://app.powerbi.com/view?r=eyJrIjoiYTk1NWZkMzItNzg0ZC00YjE0LWI0NzAtYWY2OTAyOTQ1ZDAxIiwidCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9",
  showPlaceholder = true 
}: PowerBIEmbedProps) {
  return (
    <Card className="p-6 shadow-lg overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Dashboard Power BI
        </h3>
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
        >
          <ExternalLink size={16} />
          Abrir em nova aba
        </a>
      </div>

      {showPlaceholder ? (
        <div className="relative w-full h-96 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium mb-2">
              Dashboard Power BI
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Para visualizar o dashboard completo, clique no botão acima
            </p>
            <a
              href={reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
            >
              <ExternalLink size={16} />
              Abrir Dashboard
            </a>
          </div>
        </div>
      ) : (
        <iframe
          title="Power BI Report"
          src={reportUrl}
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen={true}
          className="rounded-lg"
        />
      )}

      <p className="text-xs text-slate-500 mt-4">
        💡 Dica: O dashboard Power BI exibe dados agregados de todos os fornecedores. 
        Atualize manualmente para ver as mudanças mais recentes.
      </p>
    </Card>
  );
}
