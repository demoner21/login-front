import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../shared/ui/Skeleton';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen bg-white overflow-hidden">
                <div className="hidden md:flex w-64 flex-col gap-4 border-r border-gray-100 p-4">
                    <div className="flex justify-center mb-6">
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-lg" />
                        ))}
                    </div>
                    <div className="mt-auto">
                         <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
                         <Skeleton className="h-6 w-32" />
                         <div className="flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                         </div>
                    </div>

                    <div className="flex-1 bg-gray-50 p-6 space-y-6 overflow-hidden">
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
                            <Skeleton className="h-64 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;