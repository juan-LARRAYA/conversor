"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analytics, AnalyticsData } from "@/lib/analytics";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function StatsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyticsData = analytics.getData();
    setData(analyticsData);
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <p className="text-[#4ec9b0] text-xl">Cargando estadísticas...</p>
      </div>
    );
  }

  // Prepare data for charts
  const buttonClicksData = Object.entries(data.buttonClicks).map(([name, value]) => ({
    name: name.replace(/_/g, " ").toUpperCase(),
    clicks: value,
  }));

  const conversionByTypeData = [
    { name: "Binario", value: data.conversionStats.byType.binary, color: "#9cdcfe" },
    { name: "Decimal", value: data.conversionStats.byType.decimal, color: "#ce9178" },
    { name: "Hexadecimal", value: data.conversionStats.byType.hexadecimal, color: "#c586c0" },
  ];

  // Group events by hour for timeline
  const eventsTimeline = data.events.reduce((acc: any[], event) => {
    const hour = new Date(event.timestamp).getHours();
    const existing = acc.find(item => item.hour === hour);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ hour, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.hour - b.hour);

  // Device breakdown
  const deviceData = data.sessions.reduce((acc: any[], session) => {
    const existing = acc.find(item => item.name === session.device);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: session.device || "Unknown", value: 1 });
    }
    return acc;
  }, []);

  // Browser breakdown
  const browserData = data.sessions.reduce((acc: any[], session) => {
    const existing = acc.find(item => item.name === session.browser);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: session.browser || "Unknown", value: 1 });
    }
    return acc;
  }, []);

  // Location breakdown
  const locationData = data.sessions.reduce((acc: any[], session) => {
    if (!session.country) return acc;
    const existing = acc.find(item => item.country === session.country);
    if (existing) {
      existing.sessions++;
    } else {
      acc.push({ country: session.country, sessions: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.sessions - a.sessions);

  const totalSessions = data.sessions.length;
  const totalEvents = data.events.length;
  const totalConversions = data.conversionStats.total;

  const COLORS = ['#4ec9b0', '#007acc', '#c586c0', '#ce9178', '#f48771'];

  return (
    <div className="min-h-screen bg-[#1e1e1e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4ec9b0] mb-2">
              Estadísticas de Uso
            </h1>
            <p className="text-[#858585]">
              Panel de analytics y métricas de la aplicación
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-[#007acc] hover:bg-[#005a9e] text-white font-semibold rounded transition-all"
          >
            ← Volver al Conversor
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <div className="text-[#858585] text-sm mb-2">Total Sesiones</div>
            <div className="text-3xl font-bold text-[#4ec9b0]">{totalSessions}</div>
          </div>
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <div className="text-[#858585] text-sm mb-2">Total Eventos</div>
            <div className="text-3xl font-bold text-[#007acc]">{totalEvents}</div>
          </div>
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <div className="text-[#858585] text-sm mb-2">Conversiones</div>
            <div className="text-3xl font-bold text-[#ce9178]">{totalConversions}</div>
          </div>
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <div className="text-[#858585] text-sm mb-2">Promedio/Sesión</div>
            <div className="text-3xl font-bold text-[#c586c0]">
              {totalSessions > 0 ? (totalEvents / totalSessions).toFixed(1) : 0}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Button Clicks */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Clicks por Botón/Acción
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buttonClicksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" />
                <XAxis dataKey="name" tick={{ fill: '#858585', fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#858585' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#252526', border: '1px solid #3e3e42', borderRadius: '8px' }}
                  labelStyle={{ color: '#4ec9b0' }}
                />
                <Bar dataKey="clicks" fill="#4ec9b0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Types */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Conversiones por Tipo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conversionByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#252526', border: '1px solid #3e3e42', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Actividad por Hora del Día
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eventsTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3e3e42" />
                <XAxis dataKey="hour" tick={{ fill: '#858585' }} label={{ value: 'Hora', position: 'insideBottom', offset: -5, fill: '#858585' }} />
                <YAxis tick={{ fill: '#858585' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#252526', border: '1px solid #3e3e42', borderRadius: '8px' }}
                  labelStyle={{ color: '#4ec9b0' }}
                />
                <Line type="monotone" dataKey="count" stroke="#007acc" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Dispositivos Utilizados
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#252526', border: '1px solid #3e3e42', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Browsers Table */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Navegadores
            </h2>
            <div className="space-y-2">
              {browserData.map((browser, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-[#1e1e1e] rounded border border-[#3e3e42]"
                >
                  <span className="text-[#d4d4d4]">{browser.name}</span>
                  <span className="text-[#4ec9b0] font-semibold">{browser.value} sesiones</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Table */}
          <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
              Ubicaciones (Top Países)
            </h2>
            <div className="space-y-2">
              {locationData.slice(0, 5).map((location, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-[#1e1e1e] rounded border border-[#3e3e42]"
                >
                  <span className="text-[#d4d4d4]">{location.country}</span>
                  <span className="text-[#4ec9b0] font-semibold">{location.sessions} sesiones</span>
                </div>
              ))}
              {locationData.length === 0 && (
                <p className="text-[#858585] text-center py-4">
                  No hay datos de ubicación disponibles
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sessions Detail */}
        <div className="bg-[#252526] border border-[#3e3e42] rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#4ec9b0] mb-4">
            Detalles de Sesiones
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3e3e42]">
                  <th className="text-left p-3 text-[#858585] font-semibold">ID Sesión</th>
                  <th className="text-left p-3 text-[#858585] font-semibold">Primera Visita</th>
                  <th className="text-left p-3 text-[#858585] font-semibold">Última Visita</th>
                  <th className="text-left p-3 text-[#858585] font-semibold">Dispositivo</th>
                  <th className="text-left p-3 text-[#858585] font-semibold">Navegador</th>
                  <th className="text-left p-3 text-[#858585] font-semibold">Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.slice(0, 10).map((session, index) => (
                  <tr key={index} className="border-b border-[#3e3e42] hover:bg-[#1e1e1e]">
                    <td className="p-3 text-[#d4d4d4] font-mono text-xs">
                      {session.sessionId.substring(0, 12)}...
                    </td>
                    <td className="p-3 text-[#d4d4d4]">
                      {new Date(session.firstVisit).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-3 text-[#d4d4d4]">
                      {new Date(session.lastVisit).toLocaleDateString('es-ES')}
                    </td>
                    <td className="p-3 text-[#4ec9b0]">{session.device}</td>
                    <td className="p-3 text-[#ce9178]">{session.browser}</td>
                    <td className="p-3 text-[#c586c0]">
                      {session.city && session.country
                        ? `${session.city}, ${session.country}`
                        : session.country || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#858585] text-sm">
          <p>Analytics implementado con localStorage y Recharts</p>
          <p className="mt-2">
            💡 Métricas observadas: Clicks, Conversiones, Dispositivos, Ubicación, Navegadores
          </p>
        </div>
      </div>
    </div>
  );
}
