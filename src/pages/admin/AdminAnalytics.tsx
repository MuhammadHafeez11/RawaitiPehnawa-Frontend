import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
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

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface TopProduct {
  _id: string;
  totalSold: number;
  revenue: number;
  product: {
    name: string;
    images: Array<{ url: string }>;
  };
}

const AdminAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [previousPeriodRevenue, setPreviousPeriodRevenue] = useState(0);

  const periodOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    loadAnalytics();
    loadDashboardStats();
  }, [selectedPeriod]);

  const loadDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data.stats);
        setTopProducts(response.data.topProducts || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [currentResponse, previousResponse] = await Promise.all([
        adminAPI.getSalesAnalytics(selectedPeriod),
        adminAPI.getSalesAnalytics(getPreviousPeriod(selectedPeriod))
      ]);
      
      if (currentResponse.success) {
        setSalesData(currentResponse.data.salesData);
        
        // Calculate current period totals
        const revenue = currentResponse.data.salesData.reduce((sum: number, item: SalesData) => sum + item.revenue, 0);
        const orders = currentResponse.data.salesData.reduce((sum: number, item: SalesData) => sum + item.orders, 0);
        
        setTotalRevenue(revenue);
        setTotalOrders(orders);
        setAverageOrderValue(orders > 0 ? revenue / orders : 0);
        
        // Calculate previous period for comparison
        if (previousResponse.success) {
          const prevRevenue = previousResponse.data.salesData.reduce((sum: number, item: SalesData) => sum + item.revenue, 0);
          setPreviousPeriodRevenue(prevRevenue);
        }
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviousPeriod = (period: string) => {
    // For comparison, we'll use the same period but shifted back
    return period; // Simplified for now
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Period Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(totalRevenue)}
                    </p>
                    {previousPeriodRevenue > 0 && (
                      <div className="flex items-center mt-1">
                        {getGrowthPercentage(totalRevenue, previousPeriodRevenue) >= 0 ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${
                          getGrowthPercentage(totalRevenue, previousPeriodRevenue) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.abs(getGrowthPercentage(totalRevenue, previousPeriodRevenue)).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Period Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                  </div>
                  <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatPrice(averageOrderValue)}
                    </p>
                  </div>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardStats?.totalCustomers || 0}
                    </p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-indigo-600" />
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
                </div>
                <div className="p-6">
                  {topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {topProducts.slice(0, 5).map((item, index) => (
                        <div key={item._id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                          </div>
                          <img
                            src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{item.totalSold} sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.revenue)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No sales data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Breakdown Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Daily Breakdown</h3>
                </div>
                
                {salesData.length > 0 ? (
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesData.slice().reverse().map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(item._id)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {item.orders}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(item.revenue)}
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
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;