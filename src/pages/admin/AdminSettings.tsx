import React, { useState, useEffect } from 'react';
import { 
  CogIcon,
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Elegance Store',
      siteDescription: 'Premium Pakistani Fashion Store',
      contactEmail: 'admin@elegance.pk',
      contactPhone: '+92-300-1234567',
      address: 'Karachi, Pakistan'
    },
    shipping: {
      freeShippingThreshold: 5000,
      standardShippingCost: 200,
      expressShippingCost: 400,
      codAvailable: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      lowStockAlerts: true,
      lowStockThreshold: 10
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  const handleSave = (section: string) => {
    // In a real app, this would save to backend
    toast.success(`${section} settings saved successfully!`);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store configuration and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={settings.general.contactEmail}
                          onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.general.contactPhone}
                          onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <textarea
                        value={settings.general.address}
                        onChange={(e) => updateSetting('general', 'address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave('General')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Shipping Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Free Shipping Threshold (PKR)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => updateSetting('shipping', 'freeShippingThreshold', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Orders above this amount get free shipping
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Standard Shipping Cost (PKR)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.standardShippingCost}
                          onChange={(e) => updateSetting('shipping', 'standardShippingCost', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Express Shipping Cost (PKR)
                        </label>
                        <input
                          type="number"
                          value={settings.shipping.expressShippingCost}
                          onChange={(e) => updateSetting('shipping', 'expressShippingCost', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="codAvailable"
                        checked={settings.shipping.codAvailable}
                        onChange={(e) => updateSetting('shipping', 'codAvailable', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="codAvailable" className="ml-2 text-sm text-gray-700">
                        Enable Cash on Delivery
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave('Shipping')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Order Alerts</h4>
                          <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.orderAlerts}
                          onChange={(e) => updateSetting('notifications', 'orderAlerts', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Low Stock Alerts</h4>
                          <p className="text-sm text-gray-500">Get notified when products are low in stock</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.lowStockAlerts}
                          onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        value={settings.notifications.lowStockThreshold}
                        onChange={(e) => updateSetting('notifications', 'lowStockThreshold', parseInt(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Alert when stock falls below this number
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave('Notifications')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Automatically log out after this period of inactivity
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        value={settings.security.passwordExpiry}
                        onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Require password change after this many days
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Security Recommendations
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Enable two-factor authentication for better security</li>
                              <li>Use a strong, unique password</li>
                              <li>Regularly review admin access logs</li>
                              <li>Keep your browser and system updated</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSave('Security')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;