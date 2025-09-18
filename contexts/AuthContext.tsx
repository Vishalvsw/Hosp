import React, { createContext, useState, ReactNode } from 'react';
import type { User, UserRole } from '../types';

// Mock users database with passwords for demonstration
const initialUsers: Record<string, User> = {
    'alex.admin@hms.pro': {
        id: '0',
        name: 'Alex Admin',
        email: 'alex.admin@hms.pro',
        role: 'admin',
        title: 'System Administrator',
        password: 'password123',
    },
    'carol.evans@hms.pro': {
        id: '1',
        name: 'Dr. Carol Evans',
        email: 'carol.evans@hms.pro',
        role: 'doctor',
        title: 'Cardiologist',
        password: 'password123',
    },
    'nancy.nurse@hms.pro': {
        id: '2',
        name: 'Nancy Nurse',
        email: 'nancy.nurse@hms.pro',
        role: 'nurse',
        title: 'Head Nurse',
        password: 'password123',
    },
    'rita.receptionist@hms.pro': {
        id: '3',
        name: 'Rita Receptionist',
        email: 'rita.receptionist@hms.pro',
        role: 'receptionist',
        title: 'Front Desk',
        password: 'password123',
    },
    'pat.patient@email.com': {
        id: '4',
        name: 'Pat Patient',
        email: 'pat.patient@email.com',
        role: 'patient',
        title: 'Patient',
        password: 'password123',
    },
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
    switchRole: (role: UserRole) => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    roles: UserRole[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<Record<string, User>>(initialUsers);

    const login = async (email: string, password: string): Promise<boolean> => {
        const existingUser = users[email.toLowerCase()];
        if (existingUser && existingUser.password === password) {
            setUser(existingUser);
            return true;
        }
        return false;
    };

    const register = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
        const emailLower = email.toLowerCase();
        if (users[emailLower]) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        const newUser: User = {
            id: String(Object.keys(users).length + 1),
            name,
            email: emailLower,
            password,
            role,
            title: role.charAt(0).toUpperCase() + role.slice(1), // e.g., 'Patient'
        };
        setUsers(prevUsers => ({ ...prevUsers, [emailLower]: newUser }));
        setUser(newUser);
        return { success: true, message: 'Registration successful!' };
    };

    const logout = () => {
        setUser(null);
    };

    const switchRole = (role: UserRole) => {
        // In a real app, this would be more complex. For demo, we find a user with that role.
        const userWithRole = Object.values(users).find(u => u.role === role);
        if (userWithRole) {
            setUser(userWithRole);
        }
    };

    const hasRole = (roles: UserRole | UserRole[]) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(user.role);
    };
    
    const isAuthenticated = !!user;
    const availableRoles = ['admin', 'doctor', 'nurse', 'receptionist', 'patient'] as UserRole[];

    const value = { user, isAuthenticated, login, logout, register, switchRole, hasRole, roles: availableRoles };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};