import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// O leaflet-geoman-free não publica tipos oficiais.
// Aqui estendemos o L.Map com a API do `.pm` que usamos neste componente.
declare module 'leaflet' {
    interface PM {
        addControls: (options: Record<string, unknown>) => void;
        removeControls: () => void;
        controlsVisible: () => boolean;
        setGlobalOptions: (options: Record<string, unknown>) => void;
        getToolbar: () => HTMLElement | null;
    }

    interface Map {
        pm: PM;
    }

    interface Layer {
        pm?: unknown;
    }
}

type PmShape = 'Polygon' | 'Rectangle' | 'Circle' | string;

interface PmCreateEvent {
    layer: L.Layer & {
        getLatLngs?: () => L.LatLng[] | L.LatLng[][] | L.LatLng[][][];
        getLatLng?: () => L.LatLng;
        getRadius?: () => number;
    };
    shape: PmShape;
}

interface PmEditEvent {
    layer: L.Layer;
}

interface PmRemoveEvent {
    layer: L.Layer;
}

export interface ShapeCreatedPayload {
    shape: PmShape;
    layer: L.Layer;
    latlngs?: L.LatLng[] | L.LatLng[][] | L.LatLng[][][];
    center?: L.LatLng;
    radius?: number;
}

export interface ShapeEditedPayload {
    layer: L.Layer;
}

export interface ShapeRemovedPayload {
    layer: L.Layer;
}

interface GeomanControlsProps {
    onShapeCreated?: (payload: ShapeCreatedPayload) => void;
    onShapeEdited?: (payload: ShapeEditedPayload) => void;
    onShapeRemoved?: (payload: ShapeRemovedPayload) => void;
}

export const GeomanControls = ({ onShapeCreated, onShapeEdited, onShapeRemoved }: GeomanControlsProps) => {
    const map = useMap();
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const toolbarRef = useRef<HTMLElement | null>(null);

    // Efeito para detectar o tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsExpanded(false); // Reseta o estado expandido em desktop
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Efeito para inicializar os controles do Geoman e listeners (executa apenas uma vez)
    useEffect(() => {
        map.pm.addControls({
            position: 'topright',
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: true,
            drawPolygon: true,
            drawCircle: true,
            drawText: false,
            editMode: true,
            dragMode: true,
            cutPolygon: false,
            removalMode: true,
        });

        map.pm.setGlobalOptions({
            pathOptions: {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
                weight: 2,
            },
        });

        const toolbar = map.pm.getToolbar();
        if (toolbar) {
            toolbarRef.current = toolbar;
            // Adiciona o botão de toggle apenas uma vez
            if (!toolbar.querySelector('.leaflet-pm-btn-toggle')) {
                const toggleButton = document.createElement('a');
                toggleButton.className = 'leaflet-buttons-control-button leaflet-pm-btn-toggle';
                toggleButton.innerHTML = '<div class="control-icon"></div>';
                toggleButton.title = 'Ferramentas de Desenho';
                toggleButton.onclick = (e: MouseEvent) => {
                    e.stopPropagation(); // Evita que o clique se propague para o mapa
                    setIsExpanded(prev => !prev);
                };
                toolbar.prepend(toggleButton);
            }
        }

        const handleCreate = (e: PmCreateEvent) => {
            const { layer, shape } = e;
            if (shape === 'Polygon' || shape === 'Rectangle') {
                onShapeCreated?.({ shape, latlngs: layer.getLatLngs?.(), layer });
            } else if (shape === 'Circle') {
                onShapeCreated?.({ shape, center: layer.getLatLng?.(), radius: layer.getRadius?.(), layer });
            }
            setIsExpanded(false); // Fecha o menu após desenhar
        };

        const handleEdit = (e: PmEditEvent) => onShapeEdited?.({ layer: e.layer });
        const handleRemove = (e: PmRemoveEvent) => onShapeRemoved?.({ layer: e.layer });

        map.on('pm:create', handleCreate as L.LeafletEventHandlerFn);
        map.on('pm:edit', handleEdit as L.LeafletEventHandlerFn);
        map.on('pm:remove', handleRemove as L.LeafletEventHandlerFn);

        return () => {
            map.off('pm:create', handleCreate as L.LeafletEventHandlerFn);
            map.off('pm:edit', handleEdit as L.LeafletEventHandlerFn);
            map.off('pm:remove', handleRemove as L.LeafletEventHandlerFn);
            if (map.pm.controlsVisible()) { // Use controlsVisible() para verificar
                map.pm.removeControls();
            }
        };
    }, [map, onShapeCreated, onShapeEdited, onShapeRemoved]);

    // Efeito para aplicar/remover classes CSS com base no estado (isMobile, isExpanded)
    useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        if (isMobile) {
            map.getContainer().classList.add('leaflet-touch');
            toolbar.classList.add('mobile-collapsible', 'leaflet-pm-toolbar-mobile');
            if (isExpanded) {
                toolbar.classList.add('expanded');
            } else {
                toolbar.classList.remove('expanded');
            }
        } else {
            map.getContainer().classList.remove('leaflet-touch');
            toolbar.classList.remove('mobile-collapsible', 'leaflet-pm-toolbar-mobile', 'expanded');
        }
    }, [isMobile, isExpanded, map]);

    return null;
};