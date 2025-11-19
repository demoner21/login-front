import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Settings } from 'lucide-react';
import shp from 'shpjs';
import { useMap } from '@/context/MapContext';
import UploadIcon from '@/shared/ui/icons/UploadIcon';

export const Topbar = () => {
    const location = useLocation();
    const { setGeojson } = useMap();
    const isMapPage = location.pathname.includes('/farm-map');

    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target.result;
                const geojson = await shp.parseZip(arrayBuffer);
                setGeojson(geojson);
            } catch (error) {
                console.error("Error parsing shapefile:", error);
            }
        };
        reader.readAsArrayBuffer(file);
        // Reset input value to allow uploading the same file again
        event.target.value = null; 
    }, [setGeojson]);

    return (
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">

            <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Farm Map</h1>
            </div>

            <div className="flex items-center space-x-6">
                {isMapPage && (
                    <>
                        <label 
                            htmlFor="shapefile-upload-topbar" 
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            title="Carregar Shapefile (.zip)"
                        >
                            <UploadIcon className="h-6 w-6" />
                        </label>
                        <input
                            id="shapefile-upload-topbar"
                            type="file"
                            accept=".zip"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </>
                )}

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <button className="text-gray-500 hover:text-gray-700">
                    <Bell className="h-6 w-6" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <Settings className="h-6 w-6" />
                </button>
                <button className="h-9 w-9 overflow-hidden rounded-full">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="User avatar"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};