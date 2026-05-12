import { Card } from "@/components/ui/card";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PowerBIEmbedProps {
  fornecedorId?: number;
}

export default function PowerBIEmbed({ fornecedorId }: PowerBIEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchPowerBIToken = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar token de acesso
        const tokenResponse = await fetch(`${API_BASE_URL}/powerbi/token`);
        if (!tokenResponse.ok) {
          throw new Error("Erro ao obter token Power BI");
        }

        const tokenData = await tokenResponse.json();
        setAccessToken(tokenData.access_token);

        // Buscar configurações
        const configResponse = await fetch(`${API_BASE_URL}/powerbi/config`);
        if (!configResponse.ok) {
          throw new Error("Erro ao obter configurações Power BI");
        }

        const configData = await configResponse.json();

        // Construir URL de embed
        const url = `https://app.powerbi.com/reportEmbed?reportId=${configData.report_id}&groupId=${configData.workspace_id}&autoAuth=true&ctid=9072b93d-c9b5-426f-a79d-fdfa9a9361da`;
        setEmbedUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar Power BI");
        console.error("Erro ao buscar token Power BI:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerBIToken();
  }, [fornecedorId]);

  if (loading) {
    return (
      <Card className="p-6 shadow-lg overflow-hidden">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-blue-500 mb-4 animate-spin" />
            <p className="text-slate-600 font-medium">Carregando Dashboard Power BI...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-lg overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Dashboard Power BI
          </h3>
        </div>
        <div className="relative w-full h-96 bg-red-50 rounded-lg border border-red-200 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <p className="text-red-600 font-medium mb-2">
              Erro ao carregar Dashboard
            </p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Dashboard Power BI
        </h3>
        <a
          href="https://app.powerbi.com/groups/me/reports/396a55c4-c192-4096-b577-28098675d8f0/1a7527734d9d87d79760?experience=power-bi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
        >
          <ExternalLink size={16} />
          Abrir em nova aba
        </a>
      </div>

      {embedUrl ? (
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-100">
          <iframe
            title="Power BI Report"
            src={embedUrl}
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen={true}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="relative w-full h-96 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium mb-2">
              Dashboard Power BI
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Para visualizar o dashboard completo, clique no botão acima
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-4">
        💡 Dica: O dashboard Power BI exibe dados agregados de todos os fornecedores. 
        Atualize manualmente para ver as mudanças mais recentes.
      </p>
    </Card>
  );
}
