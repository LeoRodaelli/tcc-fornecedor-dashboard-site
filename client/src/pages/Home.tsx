import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, AlertCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  // Dados para o gráfico de pilares
  const pilaresData = scorecard
    ? [
        { name: "Qualidade", value: scorecard.score_qualidade },
        { name: "Comercial", value: scorecard.score_comercial },
        { name: "Entrega", value: scorecard.score_entrega },
      ]
    : [];

  // Dados para o gráfico de pizza
  const statusData = scorecard
    ? [
        {
          name: scorecard.status,
          value: scorecard.score_final,
          fill:
            scorecard.status === "verde"
              ? "#22c55e"
              : scorecard.status === "amarelo"
                ? "#eab308"
                : "#ef4444",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Fornecedores
          </h1>
          <p className="text-lg text-slate-600">
            Busque um fornecedor por seu código de material para visualizar o scorecard
          </p>
        </div>

        {/* Search Box */}
        <Card className="mb-8 p-6 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Digite o código do material (ex: ITM-001)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="pl-10 py-6 text-lg"
            />
            {loading && <Loader2 className="absolute right-3 top-3 animate-spin text-blue-500" size={20} />}
          </div>
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
            {/* Fornecedor Info */}
            <Card className="p-6 shadow-lg border-l-4 border-blue-500">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {fornecedor.nome}
                  </h2>
                  <div className="space-y-2 text-slate-700">
                    <p>
                      <span className="font-semibold">Código:</span> {fornecedor.codigo_material}
                    </p>
                    <p>
                      <span className="font-semibold">País:</span> {fornecedor.pais}
                    </p>
                    <p>
                      <span className="font-semibold">Comprador:</span> {fornecedor.comprador}
                    </p>
                    <p>
                      <span className="font-semibold">Gestor de Qualidade:</span>{" "}
                      {fornecedor.gestor_qualidade}
                    </p>
                  </div>
                </div>

                {/* Score Final Card */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm font-semibold mb-2">
                      SCORE FINAL
                    </p>
                    <p className="text-5xl font-bold text-blue-600 mb-3">
                      {scorecard.score_final}
                    </p>
                    <Badge className={`${getStatusColor(scorecard.status)} text-base px-4 py-2`}>
                      {getStatusLabel(scorecard.status)}
                    </Badge>
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
                },
                {
                  label: "Comercial",
                  value: scorecard.score_comercial,
                  max: 90,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Entrega",
                  value: scorecard.score_entrega,
                  max: 60,
                  color: "from-green-500 to-green-600",
                },
              ].map((pilar) => (
                <Card key={pilar.label} className="p-6 shadow-lg">
                  <p className="text-slate-600 text-sm font-semibold mb-4">
                    {pilar.label}
                  </p>
                  <div className="flex items-end justify-between mb-4">
                    <p className="text-4xl font-bold text-slate-900">
                      {pilar.value}
                    </p>
                    <p className="text-slate-500 text-sm">/ {pilar.max}</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${pilar.color} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${(pilar.value / pilar.max) * 100}%`,
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bar Chart - Pilares */}
              <Card className="p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Distribuição de Scores
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={pilaresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart - Status */}
              <Card className="p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Status Geral
                </h3>
                <div className="flex flex-col items-center justify-center h-48">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-slate-900 mb-2">
                      {((scorecard.score_final / 300) * 100).toFixed(1)}%
                    </p>
                    <p className="text-slate-600 text-sm">
                      {getStatusLabel(scorecard.status)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Status Legend */}
            <Card className="p-6 shadow-lg bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Critérios de Avaliação
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Verde (Excelência)</p>
                    <p className="text-sm text-slate-600">Score ≥ 240 (≥80%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Amarelo (Aceitável)</p>
                    <p className="text-sm text-slate-600">Score 180-239 (60-79%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Vermelho (Crítico)</p>
                    <p className="text-sm text-slate-600">Score &lt; 180 (&lt;60%)</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!fornecedor && !loading && !error && (
          <Card className="p-12 text-center shadow-lg">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 text-lg">
              Digite um código de material para começar
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}