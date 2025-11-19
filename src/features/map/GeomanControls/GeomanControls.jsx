import { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

export const GeomanControls = ({ onShapeCreated, onShapeEdited, onShapeRemoved }) => {
    const map = useMap();
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const toolbarRef = useRef(null);

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
                toggleButton.onclick = (e) => {
                    e.stopPropagation(); // Evita que o clique se propague para o mapa
                    setIsExpanded(prev => !prev);
                };
                toolbar.prepend(toggleButton);
            }
        }

        const handleCreate = (e) => {
            const { layer, shape } = e;
            if (shape === 'Polygon' || shape === 'Rectangle') {
                onShapeCreated?.({ shape, latlngs: layer.getLatLngs(), layer });
            } else if (shape === 'Circle') {
                onShapeCreated?.({ shape, center: layer.getLatLng(), radius: layer.getRadius(), layer });
            }
            setIsExpanded(false); // Fecha o menu após desenhar
        };

        const handleEdit = (e) => onShapeEdited?.({ layer: e.layer });
        const handleRemove = (e) => onShapeRemoved?.({ layer: e.layer });

        map.on('pm:create', handleCreate);
        map.on('pm:edit', handleEdit);
        map.on('pm:remove', handleRemove);

        return () => {
            map.off('pm:create', handleCreate);
            map.off('pm:edit', handleEdit);
            map.off('pm:remove', handleRemove);
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