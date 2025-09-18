import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Configure system settings and user preferences.</p>
        </div>
      <div className="bg-white p-6 rounded-lg shadow h-96 flex items-center justify-center">
        <p className="text-slate-500 text-lg">System settings and configurations will be implemented here.</p>
      </div>
    </div>
  );
};
