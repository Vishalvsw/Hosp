
import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from '../components/icons/LockIcon';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100">
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <LockIcon className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="mt-4 text-4xl font-bold text-slate-800">Access Denied</h1>
            <p className="mt-2 text-slate-600">You do not have permission to view this page.</p>
            <Link 
                to="/dashboard" 
                className="mt-6 inline-block bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-cyan-700 transition-colors"
            >
                Go to Dashboard
            </Link>
        </div>
    </div>
  );
};
