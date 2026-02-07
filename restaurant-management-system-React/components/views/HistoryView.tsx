import React from 'react';
import { DailySalesRecord } from '../../types';
import { ChevronDown, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

interface HistoryViewProps {
  records: Record<string, DailySalesRecord>;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records }) => {
  const sortedDates = Object.keys(records).sort((a, b) => {
      // Assuming dd/mm/yyyy
      const [da, ma, ya] = a.split('/').map(Number);
      const [db, mb, yb] = b.split('/').map(Number);
      return new Date(yb, mb-1, db).getTime() - new Date(ya, ma-1, da).getTime();
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📜</span> سجل المبيعات
        </h2>
        <p className="text-gray-500 text-sm mt-1">أرشيف العمليات اليومية</p>
      </div>

      {sortedDates.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-20"/>
              <p>لا يوجد سجلات سابقة</p>
          </div>
      ) : (
          <div className="space-y-4">
              {sortedDates.map(date => {
                  const record = records[date];
                  return (
                      <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                          <details className="w-full">
                              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs flex-col leading-none">
                                          <span>{date.split('/')[0]}</span>
                                          <span className="text-[10px] opacity-70">{date.split('/')[1]}/{date.split('/')[2]}</span>
                                      </div>
                                      <div>
                                          <h3 className="font-bold text-gray-800">تقرير يوم {date}</h3>
                                          <p className="text-xs text-gray-500">{record.ordersCount} طلب • {record.savedAt?.split(' ')[1] || ''}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <div className="text-right">
                                          <p className="font-bold text-green-600">R$ {record.totalSales.toFixed(2)}</p>
                                          <p className="text-[10px] text-gray-400">صافي: R$ {record.netProfit.toFixed(2)}</p>
                                      </div>
                                      <ChevronDown className="text-gray-400 transition-transform group-open:rotate-180" size={20} />
                                  </div>
                              </summary>
                              
                              <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                                          <p className="text-xs text-gray-500">المبيعات</p>
                                          <p className="font-bold text-gray-800">R$ {record.totalSales.toFixed(2)}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                                          <p className="text-xs text-gray-500">التوصيل</p>
                                          <p className="font-bold text-gray-800">{record.deliveryCount} <span className="text-[10px] font-normal text-red-500">(-R$ {record.deliveryCost})</span></p>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                                          <p className="text-xs text-gray-500">الطلبات</p>
                                          <p className="font-bold text-gray-800">{record.ordersCount}</p>
                                      </div>
                                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                                          <p className="text-xs text-gray-500">الصافي</p>
                                          <p className="font-bold text-green-600">R$ {record.netProfit.toFixed(2)}</p>
                                      </div>
                                  </div>

                                  <div className="text-sm">
                                      <h4 className="font-bold mb-2 text-gray-700 text-xs">أفضل الأصناف مبيعاً</h4>
                                      <div className="flex flex-wrap gap-2">
                                          {Object.entries(record.itemsSold || {})
                                              .sort((a,b) => (b[1] as {quantity: number}).quantity - (a[1] as {quantity: number}).quantity)
                                              .slice(0, 5)
                                              .map(([name, data]) => {
                                                const d = data as { quantity: number };
                                                return (
                                                  <span key={name} className="px-2 py-1 bg-white border rounded text-xs text-gray-600">
                                                      {name} <span className="font-bold text-gray-800">({d.quantity})</span>
                                                  </span>
                                                );
                                              })
                                          }
                                      </div>
                                  </div>
                              </div>
                          </details>
                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default HistoryView;