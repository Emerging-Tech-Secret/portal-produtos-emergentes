import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, LineChart, PieChart } from '@nivo/core';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { ProductMarketFit, Prototype, User } from '../types';
import { analyzeFeedback, generateInsights } from '../services/pmf';
import { getPrototypes } from '../services/prototypes';
import { getFeedbackForPrototype } from '../services/feedback';

export function AdminDashboard() {
  const { user } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();
  const [selectedPrototype, setSelectedPrototype] = useState<Prototype | null>(null);
  const [pmfData, setPmfData] = useState<ProductMarketFit | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const prototypes = await getPrototypes(false);
      if (prototypes.length > 0) {
        setSelectedPrototype(prototypes[0]);
        await analyzePrototype(prototypes[0]);
      }
    } catch (error) {
      showError(
        'Não foi possível carregar os dados do dashboard.',
        error instanceof Error ? error.stack : String(error)
      );
    } finally {
      setLoading(false);
    }
  }

  async function analyzePrototype(prototype: Prototype) {
    try {
      const feedback = await getFeedbackForPrototype(prototype.id);
      const pmf = await analyzeFeedback(prototype, feedback);
      setPmfData(pmf);
      
      const newInsights = await generateInsights(prototype, pmf);
      setInsights(newInsights);
    } catch (error) {
      showError(
        'Erro ao analisar o produto.',
        error instanceof Error ? error.stack : String(error)
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-itau-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-itau-gray-800 mb-8">
        Dashboard Administrativo
      </h1>

      {/* PMF Score Overview */}
      {pmfData && (
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
      )}

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Análise de PMF</h3>
          <div className="prose max-w-none">
            {pmfData?.analysis.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-itau-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recomendações</h3>
          <ul className="space-y-4">
            {pmfData?.recommendations.map((rec, index) => (
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

      {/* AI-Generated Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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