import React, { createContext, useState, ReactNode } from 'react';
import type { User, UserRole } from '../types';

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
    admin: {
        id: '0',
        name: 'Alex Admin',
        email: 'alex.admin@hms.pro',
        role: 'admin',
        title: 'System Administrator',
    },
    doctor: {
        id: '1',
        name: 'Dr. Carol Evans',
        email: 'carol.evans@hms.pro',
        role: 'doctor',
        title: 'Cardiologist',
    },
    nurse: {
        id: '2',
        name: 'Nancy Nurse',
        email: 'nancy.nurse@hms.pro',
        role: 'nurse',
        title: 'Head Nurse',
    },
    receptionist: {
        id: '3',
        name: 'Rita Receptionist',
        email: 'rita.receptionist@hms.pro',
        role: 'receptionist',
        title: 'Front Desk',
    },
    patient: {
        id: '4',
        name: 'Pat Patient',
        email: 'pat.patient@email.com',
        role: 'patient',
        title: 'Patient',
    },
};


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    switchRole: (role: UserRole) => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    roles: UserRole[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Start logged in as admin for demo purposes
    const [user, setUser] = useState<User | null>(mockUsers.admin);

    const switchRole = (role: UserRole) => {
        const newUser = mockUsers[role];
        if (newUser) {
            setUser(newUser);
        }
    };

    const hasRole = (roles: UserRole | UserRole[]) => {
        if (!user) return false;
        // Admin has access to everything
        if (user.role === 'admin') return true;
        
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(user.role);
    };
    
    const isAuthenticated = !!user;
    const availableRoles = Object.keys(mockUsers) as UserRole[];

    const value = { user, isAuthenticated, switchRole, hasRole, roles: availableRoles };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};