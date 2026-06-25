// src/features/task/share-task-modal.tsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, X, Loader2, Trash2 } from 'lucide-react';
import { aclAPI, usersSearchAPI, UserSearchResult } from '@/service/api';
import { ACL, Permission } from '@/types/acl';
import { Task } from '@/types/task';

interface ShareTaskModalProps {
    task: Task;
    onClose: () => void;
}

type PermissionLevel = 'read' | 'write';

export const ShareTaskModal = ({ task, onClose }: ShareTaskModalProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const [permission, setPermission] = useState<PermissionLevel>('read');
    const [isSharing, setIsSharing] = useState(false);
    const [currentAccess, setCurrentAccess] = useState<ACL[]>([]);
    const [isLoadingAccess, setIsLoadingAccess] = useState(true);

    const fetchAccess = useCallback(async () => {
        setIsLoadingAccess(true);
        try {
            const response = await aclAPI.getForResource(task.id, 'TASK');
            setCurrentAccess(response.data ?? []);
        } catch {
            setCurrentAccess([]);
        } finally {
            setIsLoadingAccess(false);
        }
    }, [task.id]);

    useEffect(() => {
        fetchAccess();
    }, [fetchAccess]);

    const handleSearch = useCallback(async (value: string) => {
        setQuery(value);
        setSelectedUser(null);
        if (value.trim().length < 3) {
            setResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await usersSearchAPI.search(value.trim());
            setResults(response.data ?? []);
        } catch {
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleShare = async () => {
        if (!selectedUser) return;
        setIsSharing(true);
        try {
            const permissions = permission === 'write' ? Permission.Read | Permission.Write : Permission.Read;
            await aclAPI.grant({
                resource_id: task.id,
                resource_type: 'TASK',
                grantee_type: 'USER',
                grantee_id: selectedUser.id,
                permissions,
            });
            toast.success(`Tarefa compartilhada com ${selectedUser.name}`);
            setSelectedUser(null);
            setQuery('');
            fetchAccess();
        } catch (err: any) {
            toast.error('Erro ao compartilhar', { description: err.response?.data?.error || 'Tente novamente.' });
        } finally {
            setIsSharing(false);
        }
    };

    const handleRevoke = async (acl: ACL) => {
        try {
            await aclAPI.revoke(task.id, 'TASK', acl.grantee_type, acl.grantee_id);
            toast.success('Acesso revogado');
            fetchAccess();
        } catch {
            toast.error('Erro ao revogar acesso');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Compartilhar tarefa</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>

            <p className="text-sm text-gray-500 mb-4 truncate">"{task.title}"</p>

            <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por email (mín. 3 caracteres)"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                />
                {isSearching && <Loader2 size={16} className="absolute right-3 top-3 text-gray-400 animate-spin" />}
            </div>

            {results.length > 0 && !selectedUser && (
                <div className="border border-gray-200 rounded-md divide-y mb-3 max-h-40 overflow-y-auto">
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => { setSelectedUser(user); setResults([]); setQuery(user.email); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </button>
                    ))}
                </div>
            )}

            {selectedUser && (
                <div className="mb-3 p-3 bg-blue-50 rounded-md flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                        <p className="text-xs text-gray-500">{selectedUser.email}</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível de acesso</label>
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={permission === 'read'} onChange={() => setPermission('read')} className="h-4 w-4 text-blue-700" />
                        <span className="text-sm text-gray-700">Apenas visualizar</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={permission === 'write'} onChange={() => setPermission('write')} className="h-4 w-4 text-blue-700" />
                        <span className="text-sm text-gray-700">Pode editar</span>
                    </label>
                </div>
            </div>

            <button
                onClick={handleShare}
                disabled={!selectedUser || isSharing}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition mb-5"
            >
                {isSharing ? 'Compartilhando...' : 'Compartilhar'}
            </button>

            <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quem já tem acesso</h3>
                {isLoadingAccess ? (
                    <p className="text-sm text-gray-400">Carregando...</p>
                ) : currentAccess.length === 0 ? (
                    <p className="text-sm text-gray-400">Ninguém além de você tem acesso ainda.</p>
                ) : (
                    <ul className="space-y-2">
                        {currentAccess.map((acl) => (
                            <li key={`${acl.grantee_type}-${acl.grantee_id}`} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{acl.grantee_id ?? 'Público'}</span>
                                <button onClick={() => handleRevoke(acl)} className="text-gray-400 hover:text-red-600" title="Revogar acesso">
                                    <Trash2 size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};