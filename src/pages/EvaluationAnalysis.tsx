import React, { useState, useEffect } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { MessageSquare, TrendingUp, Brain } from 'lucide-react';
import { useError } from '../contexts/ErrorContext';
import { getAllEvaluations, analyzeEvaluations } from '../services/evaluations';
import { PortalEvaluation, EvaluationAnalysis } from '../types';

export function EvaluationAnalysis() {
  const { showError } = useError();
  const [evaluations, setEvaluations] = useState<PortalEvaluation[]>([]);
  const [analysis, setAnalysis] = useState<EvaluationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadEvaluations();
  }, []);

  async function loadEvaluations() {
    try {
      setLoading(true);
      const data = await getAllEvaluations();
      setEvaluations(data);
      if (data.length > 0) {
        await performAnalysis(data);
      }
    } catch (error) {
      showError(
        'Erro ao carregar avaliações',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function performAnalysis(data: PortalEvaluation[]) {
    try {
      setAnalyzing(true);
      const result = await analyzeEvaluations(data);
      setAnalysis(result);
    } catch (error) {
      showError(
        'Erro ao analisar avaliações',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  const averageLikertScores = evaluations.reduce(
    (acc, curr) => {
      Object.entries(curr.likertResponses).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  Object.keys(averageLikertScores).forEach(key => {
    averageLikertScores[key] /= evaluations.length;
  });

  const radarData = [
    {
      category: "Métricas",
      ...averageLikertScores
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-itau-gray-800 mb-6">
            Avaliação por Categoria
          </h2>
          <div className="h-[400px]">
            <ResponsiveRadar
              data={radarData}
              keys={Object.keys(averageLikertScores)}
              indexBy="category"
              maxValue={5}
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              curve="linearClosed"
              borderWidth={2}
              borderColor={{ from: 'color' }}
              gridLevels={5}
              gridShape="circular"
              gridLabelOffset={36}
              enableDots={true}
              dotSize={8}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={2}
              dotBorderColor={{ from: 'color' }}
              enableDotLabel={true}
              dotLabel="value"
              dotLabelYOffset={-12}
              colors={{ scheme: 'category10' }}
              fillOpacity={0.25}
              blendMode="multiply"
              animate={true}
            />
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-itau-gray-800 mb-6">
            Distribuição de Sentimento
          </h2>
          {analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {(analysis.sentimentDistribution.positive * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-800">Positivo</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-gray-600">
                    {(analysis.sentimentDistribution.neutral * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-800">Neutro</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {(analysis.sentimentDistribution.negative * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-red-800">Negativo</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold text-itau-gray-800 mb-6 flex items-center gap-2">
            <Brain className="w-8 h-8 text-itau-orange" />
            Insights da IA
          </h2>
          {analyzing ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-itau-gray-700">
                  Resumo da Análise
                </h3>
                <p className="text-itau-gray-600">{analysis.summary}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-itau-gray-700 mb-4">
                  Recomendações
                </h3>
                <ul className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-itau-gray-600"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-itau-orange text-white rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-itau-gray-700 mb-4">
                  Tendências Identificadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="bg-itau-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className={`w-5 h-5 ${
                          trend.trend > 0 ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <h4 className="font-semibold text-itau-gray-700">
                          {trend.category}
                        </h4>
                      </div>
                      <p className="text-sm text-itau-gray-600">
                        {trend.insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-itau-gray-600 text-center py-8">
              Nenhuma análise disponível
            </p>
          )}
        </div>
      </div>
    </div>
  );
}