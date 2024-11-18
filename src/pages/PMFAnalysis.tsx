import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { ProductMarketFit, Prototype, Feedback } from '../types';
import { getPrototypeById } from '../services/prototypes';
import { getFeedbackForPrototype } from '../services/feedback';
import { analyzeFeedback, generateInsights } from '../services/pmf';

export function PMFAnalysis() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();
  const [prototype, setPrototype] = useState<Prototype | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [pmfData, setPmfData] = useState<ProductMarketFit | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAnalysisData(id);
    }
  }, [id]);

  async function loadAnalysisData(prototypeId: string) {
    try {
      setLoading(true);
      
      const prototypeData = await getPrototypeById(prototypeId);
      if (!prototypeData) {
        throw new Error('Produto não encontrado');
      }
      setPrototype(prototypeData);

      const feedbackData = await getFeedbackForPrototype(prototypeId);
      setFeedback(feedbackData);

      const pmf = await analyzeFeedback(prototypeData, feedbackData);
      setPmfData(pmf);

      const insightData = await generateInsights(prototypeData, pmf);
      setInsights(insightData);

    } catch (error) {
      showError(
        'Erro ao carregar análise de Product Market Fit',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  if (!prototype || !pmfData) {
    return null;
  }

  const feedbackOverTime = feedback.reduce((acc, f) => {
    const date = f.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lineData = [{
    id: 'feedback',
    data: Object.entries(feedbackOverTime).map(([date, value]) => ({
      x: date,
      y: value
    }))
  }];

  const categoryData = Object.entries(feedback.reduce((acc, f) => {
    if (f.categories) {
      Object.entries(f.categories).forEach(([category, rating]) => {
        acc[category] = (acc[category] || 0) + rating;
      });
    }
    return acc;
  }, {} as Record<string, number>)).map(([category, total]) => ({
    category,
    value: total / feedback.length
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-itau-gray-800 mb-2">
          {prototype.title}
        </h1>
        <p className="text-itau-gray-600">{prototype.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">PMF Score</h3>
          <p className="text-3xl font-bold text-itau-orange">
            {pmfData.score}%
          </p>
        </div>
        
        {Object.entries(pmfData.metrics).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-3xl font-bold text-itau-blue">
              {(value * 100).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Feedback ao Longo do Tempo</h3>
          <div className="h-80">
            <ResponsiveLine
              data={lineData}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              xScale={{ type: 'time', format: '%Y-%m-%d' }}
              yScale={{ type: 'linear', min: 0 }}
              axisBottom={{
                format: '%b %d',
                tickRotation: -45
              }}
              curve="monotoneX"
              colors={['#EC7000']}
              pointSize={8}
              pointColor="#ffffff"
              pointBorderWidth={2}
              pointBorderColor="#EC7000"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Avaliação por Categoria</h3>
          <div className="h-80">
            <ResponsiveBar
              data={categoryData}
              keys={['value']}
              indexBy="category"
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              padding={0.3}
              colors={['#003F88']}
              axisBottom={{
                tickRotation: -45
              }}
              axisLeft={{
                format: v => `${(v * 100).toFixed(0)}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Análise</h3>
          <div className="prose max-w-none">
            {pmfData.analysis.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-itau-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recomendações</h3>
          <ul className="space-y-4">
            {pmfData.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-itau-gray-700"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-itau-orange text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Insights da IA</h3>
        <div className="prose max-w-none">
          {insights.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-itau-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}