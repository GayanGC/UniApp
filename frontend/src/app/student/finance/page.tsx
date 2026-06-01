'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserRole, FinanceSummary, PaymentInvoice, ChartDataPoint, InvoiceStatus, InvoiceType } from '@/types';
import BrandHeader from '@/components/BrandHeader';
import { apiService } from '@/services/api';
import { Wallet, CreditCard, Award, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StudentFinanceContent() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, invRes, chartRes] = await Promise.all([
          apiService.getFinanceSummary(),
          apiService.getFinanceInvoices(),
          apiService.getFinanceChartData(),
        ]);
        setSummary(sumRes);
        setInvoices(invRes);
        setChartData(chartRes);
      } catch (err) {
        console.error('Failed to load finance data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <BrandHeader subtitle="Finance & Scholarships" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BrandHeader subtitle="Finance & Scholarships" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Due */}
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] relative overflow-hidden group hover:-translate-y-1 transition duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></div>
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Due</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  Rs. {summary?.totalDue.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] relative overflow-hidden group hover:-translate-y-1 transition duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></div>
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Total Paid</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  Rs. {summary?.totalPaid.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Active Scholarships */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)] relative overflow-hidden group hover:-translate-y-1 transition duration-300">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out -z-10"></div>
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Active Scholarships</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summary?.activeScholarships} Granted
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              Financial Trajectory
            </h2>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickFormatter={(val) => `Rs.${val}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="paid" name="Paid Fees" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPaid)" />
                <Area type="monotone" dataKey="received" name="Scholarships Received" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoices Ledger */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Invoice & Scholarship Ledger
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No financial records found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{inv.title}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {inv.type === InvoiceType.CREDIT ? (
                          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                            Scholarship (CREDIT)
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                            Fee (DEBIT)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {inv.status === InvoiceStatus.PAID ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            PAID
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${inv.type === InvoiceType.CREDIT ? 'text-blue-600' : 'text-gray-900'}`}>
                        {inv.type === InvoiceType.CREDIT ? '+' : ''} Rs. {Number(inv.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function StudentFinancePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <StudentFinanceContent />
    </ProtectedRoute>
  );
}
