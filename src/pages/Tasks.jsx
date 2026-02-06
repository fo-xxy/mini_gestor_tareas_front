import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTasks } from '../hooks/useTasks';
import {
    LogOut, Plus, Search, Trash2, Edit3,
    CheckCircle, Clock, Loader2, Filter, X
} from 'lucide-react';

const Tasks = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const {
        filteredTasks, loading, isSaving,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        isFilterOpen, setIsFilterOpen,
        isModalOpen, setIsModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        taskFormData, setTaskFormData,
        taskToDelete, editingTaskId,
        handleCreateOrUpdateTask, confirmDeleteTask, openEditModal, openDeleteModal, resetForm
    } = useTasks();

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">

                            <span className="font-bold text-slate-800 hidden sm:block">Mini gestor de tareas</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block border-r border-slate-100 pr-4">
                                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.email}</p>
                                <p className="text-[10px] text-green-500 font-medium uppercase tracking-wider">Sesión Activa</p>
                            </div>
                            <button
                                onClick={() => dispatch(logout())}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
                            >
                                <LogOut size={20} />
                                <span className="text-xs font-semibold sm:hidden">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gestión de Tareas</h2>
                        <p className="text-slate-500 text-sm font-medium">Tienes {filteredTasks.length} tareas disponibles.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar tareas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64 transition-all"
                            />
                        </div>

                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Plus size={20} /> Nueva Tarea
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto min-h-[250px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-5 text-xs uppercase tracking-widest font-bold text-slate-400">Tarea</th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-widest font-bold text-slate-400 hidden md:table-cell">Descripción</th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-widest font-bold text-slate-400 relative">
                                        <div className="flex items-center gap-2">
                                            <span>Estado</span>
                                            <button
                                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                                className={`p-1 rounded-md transition-colors ${statusFilter !== 'all' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200 text-slate-400'}`}
                                            >
                                                <Filter size={14} />
                                            </button>
                                        </div>
                                        {isFilterOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>

                                                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                                                    {[
                                                        { val: 'all', label: 'Ver Todos' },
                                                        { val: 'pending', label: 'Pendiente' },
                                                        { val: 'in_progress', label: 'En Progreso' },
                                                        { val: 'done', label: 'Completado' }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.val}
                                                            onClick={() => { setStatusFilter(option.val); setIsFilterOpen(false); }}
                                                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${statusFilter === option.val
                                                                ? 'text-blue-600 bg-blue-50'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </th>
                                    <th className="px-6 py-5 text-xs uppercase tracking-widest font-bold text-slate-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                                        </td>
                                    </tr>
                                ) : filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="px-6 py-5 font-bold text-slate-700">{task.title}</td>
                                        <td className="px-6 py-5 text-sm text-slate-500 hidden md:table-cell">
                                            <div className="truncate max-w-xs">{task.description}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEditModal(task)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => openDeleteModal(task)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">{editingTaskId ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdateTask} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Título</label>
                                <input
                                    required
                                    type="text"
                                    value={taskFormData.title}
                                    className="w-full mt-1.5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Descripción</label>
                                <textarea
                                    rows="3"
                                    value={taskFormData.description}
                                    className="w-full mt-1.5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Estado</label>
                                <select
                                    value={taskFormData.status}
                                    className="w-full mt-1.5 bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                                >
                                    <option value="pending">Pendiente</option>
                                    <option value="in_progress">En Progreso</option>
                                    <option value="done">Completado</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl">
                                    Cancelar
                                </button>
                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-500" size={30} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">¿Eliminar tarea?</h3>
                        <p className="text-slate-500 text-sm mb-8 px-2">
                            Estás a punto de borrar <span className="font-bold text-slate-700">"{taskToDelete?.title}"</span>. Esta acción no se puede deshacer.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteTask}
                                disabled={isSaving}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-red-100"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        done: "bg-emerald-50 text-emerald-700 border-emerald-200",
        in_progress: "bg-blue-50 text-blue-700 border-blue-200",
        pending: "bg-slate-50 text-slate-600 border-slate-200"
    };
    const labels = { done: "Completado", in_progress: "En Progreso", pending: "Pendiente" };
    const icons = {
        done: <CheckCircle size={12} />,
        in_progress: <Clock size={12} className="animate-pulse" />,
        pending: <Clock size={12} />
    };

    return (
        <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {icons[status]} {labels[status]}
        </span>
    );
};

export default Tasks;