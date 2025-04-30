import React, { useState, useEffect } from 'react';
import { Plus, Minus, PieChart, History, ListChecks, Building2, User } from 'lucide-react';
import IncomeDialog from '@/components/IncomeDialog';
import ExpenseDialog from '@/components/ExpenseDialog';
import "./HomeDashboard.css";

const HomeDashboard = () => {
  const [isCompany, setIsCompany] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-mode', isCompany ? 'company' : 'personal');
  }, [isCompany]);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <header className="mb-12 relative">
        <div className="absolute right-0 top-0">
          <button
            onClick={() => setIsCompany(!isCompany)}
            className="glass-morphism rounded-full p-2 pr-4 flex items-center space-x-2 hover:shadow-lg transition-all"
          >
            <div className="relative w-14 h-8 rounded-full bg-gray-200 transition-colors duration-300">
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 shadow-sm flex items-center justify-center ${
                  isCompany ? 'translate-x-6 bg-blue-400' : 'translate-x-0 bg-emerald-400'
                }`}
              >
                {isCompany ? (
                  <Building2 className="w-3 h-3 text-white" />
                ) : (
                  <User className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {isCompany ? 'Pessoa Jurídica' : 'Pessoa Física'}
            </span>
          </button>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-medium text-gray-900 mb-2">
            {isCompany ? 'Finanças Empresariais' : 'Finanças Pessoais'}
          </h1>
          <p className="text-gray-500">Controle simples e intuitivo</p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <IncomeDialog />
          <ExpenseDialog />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            icon={<PieChart strokeWidth={1.5} />}
            label="Relatórios"
            description="Visualize seus dados"
            color="purple"
          />
          <QuickAction
            icon={<History strokeWidth={1.5} />}
            label="Histórico"
            description="Veja transações passadas"
            color="amber"
          />
          <QuickAction
            icon={<ListChecks strokeWidth={1.5} />}
            label="Lista de Tarefas"
            description="Organize suas atividades"
            color="teal"
          />
        </div>
      </main>
    </div>
  );
};

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  color: 'purple' | 'amber' | 'teal';
}> = ({ icon, label, description, color }) => {
  const colorClasses = {
    purple: 'bg-white text-purple-600 hover:bg-purple-100',
    amber: 'bg-white text-amber-600 hover:bg-amber-100',
    teal: 'bg-white text-teal-600 hover:bg-teal-100'
  };

  return (
    <button
      className={`${colorClasses[color]} p-6 rounded-2xl hover:shadow-lg transition-all`}
      type="button"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default HomeDashboard; 