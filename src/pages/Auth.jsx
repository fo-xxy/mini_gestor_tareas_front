import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import api from '../api/axios';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Auth = () => {

  const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        if (error) setError('');
        if (successMsg) setSuccessMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const url = isLogin ? '/login' : '/register';
            const { data } = await api.post(url, formData);

            if (isLogin) {

              dispatch(setCredentials({
                    token: data.data.token,
                    user: { email: formData.email }
                }));
                navigate('/tasks');
            } else {

              setIsLogin(true);
                setSuccessMsg('¡Registro exitoso! Ya puedes iniciar sesión.');

                setFormData(prev => ({ ...prev, name: '', password: '' }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Algo salió mal. Por favor, verifica tus datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 py-8">
            <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                
                <div className="p-8 pt-10">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {isLogin ? 'Bienvenido' : 'Crear cuenta'}
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm">
                            {isLogin ? 'Ingresa tus credenciales' : 'Regístrate para comenzar'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="text-red-500 shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-red-700 font-bold leading-none mb-1">Error de acceso</p>
                                <p className="text-[11px] text-red-600 font-medium leading-tight">{error}</p>
                            </div>
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                            <p className="text-xs text-emerald-700 font-bold self-center">{successMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="group transition-all">
                                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">Nombre</label>
                                <div className="relative mt-1">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="group transition-all">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">Correo electrónico</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div className="group transition-all">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-widest">Contraseña</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl mt-6 shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? 'Entrar a mi cuenta' : 'Crear cuenta ahora'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50/80 p-6 border-t border-slate-100 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        {isLogin ? "¿No tienes cuenta? Registrate gratis" : "¿Ya tienes cuenta? Inicia sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;