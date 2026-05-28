import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, AlertCircle, TrendingUp, Download, RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PowerBIEmbed from "@/components/PowerBIEmbed";

interface Fornecedor {
  id: number;
  codigo_material: string;
  nome: string;
  pais: string;
  comprador: string;
  gestor_qualidade: string;
}

interface Scorecard {
  fornecedor_id: number;
  score_qualidade: number;
  score_comercial: number;
  score_entrega: number;
  score_final: number;
  status: "verde" | "amarelo" | "vermelho";
}

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Buscar fornecedor quando o termo de busca muda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFornecedor(null);
      setScorecard(null);
      setError(null);
      return;
    }

    const fetchFornecedor = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/fornecedores/codigo/${searchTerm}`);
        if (!response.ok) {
          throw new Error("Fornecedor não encontrado");
        }
        const data = await response.json();
        setFornecedor(data);

        // Buscar scorecard
        const scorecardResponse = await fetch(`${API_BASE_URL}/scorecard/${data.id}`);
        if (scorecardResponse.ok) {
          const scorecardData = await scorecardResponse.json();
          setScorecard(scorecardData);

          // Adicionar à lista de buscas recentes
          setRecentSearches((prev) => {
            const filtered = prev.filter((s) => s !== searchTerm);
            return [searchTerm, ...filtered].slice(0, 5);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar fornecedor");
        setFornecedor(null);
        setScorecard(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchFornecedor, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verde":
        return "bg-green-100 text-green-800";
      case "amarelo":
        return "bg-yellow-100 text-yellow-800";
      case "vermelho":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verde":
        return "🟢 Excelência";
      case "amarelo":
        return "🟡 Aceitável";
      case "vermelho":
        return "🔴 Crítico";
      default:
        return "Desconhecido";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "verde":
        return "from-green-50 to-green-100";
      case "amarelo":
        return "from-yellow-50 to-yellow-100";
      case "vermelho":
        return "from-red-50 to-red-100";
      default:
        return "from-blue-50 to-blue-100";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "verde":
        return "text-green-600";
      case "amarelo":
        return "text-yellow-600";
      case "vermelho":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  // Dados para o gráfico de pilares
  const pilaresData = scorecard
    ? [
        { name: "Qualidade", value: scorecard.score_qualidade },
        { name: "Comercial", value: scorecard.score_comercial },
        { name: "Entrega", value: scorecard.score_entrega },
      ]
    : [];

  const exportarPDF = () => {
    if (!fornecedor || !scorecard) return;
    
    const conteudo = `
SCORECARD DE FORNECEDOR
=======================
Data: ${new Date().toLocaleDateString('pt-BR')}

INFORMAÇÕES DO FORNECEDOR
Código: ${fornecedor.codigo_material}
Nome: ${fornecedor.nome}
País: ${fornecedor.pais}
Comprador: ${fornecedor.comprador}
Gestor de Qualidade: ${fornecedor.gestor_qualidade}

SCORES
Qualidade: ${scorecard.score_qualidade}/150
Comercial: ${scorecard.score_comercial}/90
Entrega: ${scorecard.score_entrega}/60
Score Final: ${scorecard.score_final}/300

STATUS: ${getStatusLabel(scorecard.status)}
Percentual: ${((scorecard.score_final / 300) * 100).toFixed(1)}%
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(conteudo));
    element.setAttribute("download", `scorecard-${fornecedor.codigo_material}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Dashboard de Fornecedores
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Busque um fornecedor por seu código de material para visualizar o scorecard completo e análise detalhada de performance.
            </p>
          </div>

          {/* Search Box */}
          <Card className="mb-8 p-6 shadow-lg border-0">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Digite o código do material (ex: ITM-001)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="pl-12 py-6 text-lg border-slate-200"
              />
              {loading && <Loader2 className="absolute right-4 top-4 animate-spin text-blue-500" size={20} />}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchTerm && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-600 mb-3">Buscas Recentes</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setSearchTerm(search)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            </Card>
          )}

          {/* Results */}
          {fornecedor && scorecard && (
            <div className="space-y-8">
              {/* Fornecedor Info Card */}
              <Card className="p-6 shadow-lg border-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      {fornecedor.nome}
                    </h2>
                    <div className="space-y-3 text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Código:</span> <span className="font-mono">{fornecedor.codigo_material}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">País:</span> {fornecedor.pais}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Comprador:</span> {fornecedor.comprador}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Gestor de Qualidade:</span> {fornecedor.gestor_qualidade}
                      </p>
                    </div>
                  </div>

                  {/* Score Final Card */}
                  <div className={`flex flex-col justify-center items-center bg-gradient-to-br ${getStatusBgColor(scorecard.status)} rounded-lg p-8`}>
                    <div className="text-center">
                      <p className="text-slate-600 text-sm font-semibold mb-2">
                        SCORE FINAL
                      </p>
                      <p className={`text-6xl font-bold mb-3 ${getStatusTextColor(scorecard.status)}`}>
                        {scorecard.score_final}
                      </p>
                      <Badge className={`${getStatusColor(scorecard.status)} text-base px-4 py-2 mb-4`}>
                        {getStatusLabel(scorecard.status)}
                      </Badge>
                      <p className="text-2xl font-bold text-slate-900">
                        {((scorecard.score_final / 300) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Scores by Pillar */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Qualidade",
                    value: scorecard.score_qualidade,
                    max: 150,
                    color: "from-purple-500 to-purple-600",
                    icon: "📊",
                  },
                  {
                    label: "Comercial",
                    value: scorecard.score_comercial,
                    max: 90,
                    color: "from-blue-500 to-blue-600",
                    icon: "💼",
                  },
                  {
                    label: "Entrega",
                    value: scorecard.score_entrega,
                    max: 60,
                    color: "from-green-500 to-green-600",
                    icon: "🚚",
                  },
                ].map((pilar) => (
                  <Card key={pilar.label} className="p-6 shadow-lg border-0">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-600 text-sm font-semibold">
                        {pilar.icon} {pilar.label}
                      </p>
                      <p className="text-slate-500 text-sm font-medium">{(pilar.value / pilar.max * 100).toFixed(0)}%</p>
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <p className="text-4xl font-bold text-slate-900">
                        {pilar.value}
                      </p>
                      <p className="text-slate-500 text-sm">/ {pilar.max}</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${pilar.color} h-3 rounded-full transition-all duration-500`}
                        style={{
                          width: `${(pilar.value / pilar.max) * 100}%`,
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bar Chart - Pilares */}
                <Card className="p-6 shadow-lg border-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Distribuição de Scores
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={pilaresData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Export Button */}
                <Card className="p-6 shadow-lg border-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Ações
                    </h3>
                    <p className="text-slate-600 text-sm mb-6">
                      Exporte o scorecard deste fornecedor para análise offline ou compartilhamento.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={exportarPDF}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      <Download size={18} />
                      Exportar Scorecard
                    </button>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
                    >
                      <RotateCcw size={18} />
                      Nova Busca
                    </button>
                  </div>
                </Card>
              </div>

              {/* Power BI Dashboard */}
              <PowerBIEmbed showPlaceholder={true} />

              {/* Status Legend */}
              <Card className="p-6 shadow-lg border-0 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Critérios de Avaliação
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                      🟢
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Verde (Excelência)</p>
                      <p className="text-sm text-slate-600">Score ≥ 240 (≥80%)</p>
                      <p className="text-xs text-slate-500 mt-1">Fornecedor com excelente performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-2xl">
                      🟡
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Amarelo (Aceitável)</p>
                      <p className="text-sm text-slate-600">Score 180-239 (60-79%)</p>
                      <p className="text-xs text-slate-500 mt-1">Fornecedor aceitável com pontos a melhorar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-2xl">
                      🔴
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Vermelho (Crítico)</p>
                      <p className="text-sm text-slate-600">Score &lt; 180 (&lt;60%)</p>
                      <p className="text-xs text-slate-500 mt-1">Fornecedor com performance crítica</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!fornecedor && !loading && !error && (
            <Card className="p-12 text-center shadow-lg border-0">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Comece sua busca
              </h3>
              <p className="text-slate-600 text-lg">
                Digite um código de material acima para visualizar o scorecard do fornecedor
              </p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
