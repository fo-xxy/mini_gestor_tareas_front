import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../api/axios';

export const useTasks = () => {
    const dispatch = useDispatch();
    
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [taskFormData, setTaskFormData] = useState({ title: '', description: '', status: 'pending' });


    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/getTasks');
            setTasks(data.data || []);
        } catch (err) {
            if (err.response?.status === 401) dispatch(logout());
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateTask = async (e) => {
        if (e) e.preventDefault();
        if (!taskFormData.title.trim()) return;

        try {
            setIsSaving(true);
            if (editingTaskId) {
                await api.put(`/updateTask/${editingTaskId}`, taskFormData);
            } else {
                await api.post('/insertTask', taskFormData);
            }
            setIsModalOpen(false);
            resetForm();
            await fetchTasks();
        } catch (err) {
            alert("Ocurrió un error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            setIsSaving(true);
            await api.delete(`/deleteTask/${taskToDelete.id}`);
            setTasks(tasks.filter(t => t.id !== taskToDelete.id));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (err) {
            alert("No se pudo eliminar la tarea.");
        } finally {
            setIsSaving(false);
        }
    };

    const openEditModal = (task) => {
        setEditingTaskId(task.id);
        setTaskFormData({ title: task.title, description: task.description, status: task.status });
        setIsModalOpen(true);
    };

    const openDeleteModal = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const resetForm = () => {
        setEditingTaskId(null);
        setTaskFormData({ title: '', description: '', status: 'pending' });
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch =
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' ? true : task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tasks, searchTerm, statusFilter]);

    useEffect(() => { fetchTasks(); }, []);

    return {
        tasks,
        filteredTasks,
        loading,
        isSaving,
        
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        isFilterOpen, setIsFilterOpen,

        isModalOpen, setIsModalOpen,
        isDeleteModalOpen, setIsDeleteModalOpen,
        taskFormData, setTaskFormData,
        taskToDelete,
        editingTaskId,

        handleCreateOrUpdateTask,
        confirmDeleteTask,
        openEditModal,
        openDeleteModal,
        resetForm
    };
};