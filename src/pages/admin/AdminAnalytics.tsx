import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/currency';
import { adminAPI } from '../../services/adminAPI';

interface SalesData {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  revenue: number;
  orders: number;
}

const AdminAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  const periodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getSalesAnalytics(selectedPeriod);
      
      if (response.success) {
        setSalesData(response.data.salesData);
        
        // Calculate totals
        const revenue = response.data.salesData.reduce((sum: number, item: SalesData) => sum + item.revenue, 0);
        const orders = response.data.salesData.reduce((sum: number, item: SalesData) => sum + item.orders, 0);
        
        setTotalRevenue(revenue);
        setTotalOrders(orders);
        setAverageOrderValue(orders > 0 ? revenue / orders : 0);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateObj: { year: number; month: number; day: number }) => {
    return new Date(dateObj.year, dateObj.month - 1, dateObj.day).toLocaleDateString();
  };

  const getMaxRevenue = () => {
    return Math.max(...salesData.map(item => item.revenue), 1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your store performance and sales trends</p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(averageOrderValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Sales Trend</h3>
              
              {salesData.length > 0 ? (
                <div className="space-y-4">
                  {/* Simple Bar Chart */}
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(salesData.length, 10)}, 1fr)` }}>
                    {salesData.slice(-10).map((item, index) => {
                      const height = (item.revenue / getMaxRevenue()) * 200;
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div className="text-xs text-gray-500 mb-2">
                            {formatPrice(item.revenue)}
                          </div>
                          <div
                            className="bg-primary-500 rounded-t w-full min-h-[20px]"
                            style={{ height: `${Math.max(height, 20)}px` }}
                          />
                          <div className="text-xs text-gray-600 mt-2 text-center">
                            {formatDate(item._id)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sales data will appear here once you have orders.
                  </p>
                </div>
              )}
            </div>

            {/* Daily Breakdown Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Daily Breakdown</h3>
              </div>
              
              {salesData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Order Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesData.slice().reverse().map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(item._id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.orders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatPrice(item.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(item.orders > 0 ? item.revenue / item.orders : 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No data available for the selected period.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;