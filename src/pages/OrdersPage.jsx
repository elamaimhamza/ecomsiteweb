import React from 'react';
import { Package, Calendar, ArrowRight, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  // Données de test (À remplacer par tes données API réelles plus tard)
  const orders = [
    { id: 'ORD-7829', date: '08 Dec 2023', total: '145.00 €', status: 'Livré', items: 3 },
    { id: 'ORD-7830', date: '01 Dec 2023', total: '24.99 €', status: 'En cours', items: 1 },
    { id: 'ORD-7831', date: '20 Nov 2023', total: '89.50 €', status: 'Annulé', items: 2 },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-700 border-green-200';
      case 'En cours': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Annulé': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header de la page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              Mes Commandes
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Retrouvez ici l'historique et le statut de vos achats.
            </p>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Référence</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Total</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">{order.items} article(s)</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {order.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                          {order.status === 'Livré' && <CheckCircle size={12} />}
                          {order.status === 'En cours' && <Clock size={12} />}
                          {order.status === 'Annulé' && <XCircle size={12} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Détails <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucune commande</h3>
              <p className="text-gray-500 mt-1">Vous n'avez pas encore passé de commande.</p>
              <Link to="/" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Commencer mes achats
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;