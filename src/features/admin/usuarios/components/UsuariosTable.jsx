// Componente de tabla de usuarios con filtros y acciones
// Supports 3 roles: superadmin, admin, usuario
// Only superadmin can change roles; superadmin rows are protected
// Table columns match the perfiles schema: id, nombre_completo, rol, email, activo, created_at

'use client';

import { useState, useMemo } from 'react';
import { alternarRol, toggleBloqueo } from '../actions';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { ResultModal } from '@/shared/components/modals/ResultModal';
import { FiSearch, FiFilter, FiUser, FiShield, FiSlash, FiCheck } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

// Role display config
const ROLE_CONFIG = {
  superadmin: {
    label: 'Super Admin',
    bgClass: 'bg-purple-100 text-purple-800',
    icon: MdAdminPanelSettings,
  },
  admin: {
    label: 'Admin',
    bgClass: 'bg-amber-100 text-amber-800',
    icon: FiShield,
  },
  usuario: {
    label: 'Usuario',
    bgClass: 'bg-blue-100 text-blue-800',
    icon: FiUser,
  },
};

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role?.toLowerCase()] || ROLE_CONFIG.usuario;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgClass}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}

/**
 * @param {Object} props
 * @param {Array} props.usuariosIniciales - List of users
 * @param {string} props.currentUserId - Logged-in user's ID
 * @param {string} props.currentUserRole - Logged-in user's role
 */
export function UsuariosTable({ usuariosIniciales = [], currentUserId, currentUserRole }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroRol, setFiltroRol] = useState(null);
  const [ordenamiento, setOrdenamiento] = useState('fecha-desc');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [modalResultadoAbierto, setModalResultadoAbierto] = useState(false);
  const [resultadoExito, setResultadoExito] = useState(true);
  const [mensajeResultado, setMensajeResultado] = useState({ titulo: '', mensaje: '' });

  const isSuperadmin = currentUserRole === 'superadmin';

  // ─── Filtering & sorting ───
  const usuariosFiltrados = useMemo(() => {
    let resultado = [...usuarios];

    if (searchTerm) {
      resultado = resultado.filter(u => {
        const n = u.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase());
        const e = u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return n || e;
      });
    }

    if (filtroRol !== null) {
      resultado = resultado.filter(u => u.rol?.toLowerCase() === filtroRol);
    }

    resultado.sort((a, b) => {
      const rolOrder = { superadmin: 0, admin: 1, usuario: 2 };
      const oa = rolOrder[a.rol?.toLowerCase()] ?? 2;
      const ob = rolOrder[b.rol?.toLowerCase()] ?? 2;
      if (oa !== ob) return oa - ob;

      switch (ordenamiento) {
        case 'nombre-asc': return (a.nombre_completo || '').localeCompare(b.nombre_completo || '');
        case 'nombre-desc': return (b.nombre_completo || '').localeCompare(a.nombre_completo || '');
        case 'fecha-asc': return new Date(a.created_at) - new Date(b.created_at);
        case 'fecha-desc': return new Date(b.created_at) - new Date(a.created_at);
        default: return 0;
      }
    });

    return resultado;
  }, [usuarios, searchTerm, filtroRol, ordenamiento]);

  // ─── Stats ───
  const estadisticas = useMemo(() => ({
    total: usuarios.length,
    superadmins: usuarios.filter(u => u.rol?.toLowerCase() === 'superadmin').length,
    admins: usuarios.filter(u => u.rol?.toLowerCase() === 'admin').length,
    usuarios: usuarios.filter(u => !u.rol || u.rol?.toLowerCase() === 'usuario').length,
  }), [usuarios]);

  // ─── Actions ───
  const manejarToggleRol = (usuario) => {
    const rolActual = usuario.rol?.toLowerCase() || 'usuario';
    if (rolActual === 'superadmin') return;
    if (usuario.id === currentUserId) return;

    const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin';
    setAccionPendiente({ tipo: 'rol', usuario, nuevoRol });
    setModalAbierto(true);
  };

  const manejarToggleBloqueo = (usuario) => {
    if (usuario.id === currentUserId) return;
    if (usuario.rol?.toLowerCase() === 'superadmin') return;

    const bloquear = !usuario.bloqueado;
    setAccionPendiente({ tipo: 'bloqueo', usuario, bloquear });
    setModalAbierto(true);
  };

  const confirmarAccion = async () => {
    if (!accionPendiente) return;
    setCargandoAccion(true);

    try {
      let resultado;
      if (accionPendiente.tipo === 'bloqueo') {
        resultado = await toggleBloqueo(accionPendiente.usuario.id, accionPendiente.bloquear);
      } else {
        resultado = await alternarRol(accionPendiente.usuario.id, accionPendiente.nuevoRol);
      }

      setModalAbierto(false);

      if (resultado.error) {
        setResultadoExito(false);
        setMensajeResultado({ titulo: 'Error', mensaje: resultado.error });
        setModalResultadoAbierto(true);
        setAccionPendiente(null);
        return;
      }

      // Update local state
      setUsuarios(prev =>
        prev.map(u => {
          if (u.id === accionPendiente.usuario.id) {
            if (accionPendiente.tipo === 'bloqueo') {
              return { ...u, bloqueado: accionPendiente.bloquear };
            }
            return { ...u, rol: accionPendiente.nuevoRol };
          }
          return u;
        })
      );

      const nombre = accionPendiente.usuario.nombre_completo || 'el usuario';
      setResultadoExito(true);
      if (accionPendiente.tipo === 'bloqueo') {
        setMensajeResultado({
          titulo: '¡Listo!',
          mensaje: accionPendiente.bloquear
            ? `${nombre} fue bloqueado. Ya no podrá acceder al sistema.`
            : `${nombre} fue desbloqueado. Ya puede acceder normalmente.`
        });
      } else {
        setMensajeResultado({
          titulo: '¡Listo!',
          mensaje: `${nombre} ahora es ${accionPendiente.nuevoRol === 'admin' ? 'Administrador' : 'Usuario'}.`
        });
      }
      setModalResultadoAbierto(true);
      setAccionPendiente(null);
    } catch (error) {
      setModalAbierto(false);
      setResultadoExito(false);
      setMensajeResultado({ titulo: 'Error inesperado', mensaje: 'Intentá de nuevo.' });
      setModalResultadoAbierto(true);
      setAccionPendiente(null);
    } finally {
      setCargandoAccion(false);
    }
  };

  const obtenerMensajeModal = () => {
    if (!accionPendiente) return { titulo: '', mensaje: '' };
    const { usuario, nuevoRol, tipo, bloquear } = accionPendiente;
    const nombre = usuario.nombre_completo || 'este usuario';

    if (tipo === 'bloqueo') {
      return {
        titulo: bloquear ? 'Bloquear Usuario' : 'Desbloquear Usuario',
        mensaje: bloquear
          ? `¿Seguro que querés bloquear a ${nombre}?\n\nNo podrá acceder al cotizador, calculadora ni a ninguna herramienta.`
          : `¿Seguro que querés desbloquear a ${nombre}?\n\nPodrá volver a usar el sistema normalmente.`
      };
    }

    const haciendoAdmin = nuevoRol === 'admin';
    return {
      titulo: haciendoAdmin ? 'Hacer Administrador' : 'Quitar Administrador',
      mensaje: haciendoAdmin
        ? `¿Seguro que querés dar permisos de admin a ${nombre}?\n\nPodrá gestionar blog y códigos de cliente.`
        : `¿Seguro que querés quitar los permisos de admin de ${nombre}?\n\nSolo podrá usar el cotizador y calculadora.`
    };
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-';
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const mensajeModal = obtenerMensajeModal();

  // ─── Can user be modified? ───
  const canModify = (usuario) => {
    if (!isSuperadmin) return false;
    if (usuario.id === currentUserId) return false;
    if (usuario.rol?.toLowerCase() === 'superadmin') return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[140px]">
          <div className="bg-sky-50 rounded-lg p-2 shrink-0">
            <FiUser className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Total</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.total}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[140px]">
          <div className="bg-purple-50 rounded-lg p-2 shrink-0">
            <MdAdminPanelSettings className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Super Admin</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.superadmins}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[140px]">
          <div className="bg-amber-50 rounded-lg p-2 shrink-0">
            <FiShield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Admins</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.admins}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[140px]">
          <div className="bg-blue-50 rounded-lg p-2 shrink-0">
            <FiUser className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Usuarios</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.usuarios}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FiFilter className="w-5 h-5" />
          Filtros y Búsqueda
        </h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
            <select
              value={filtroRol === null ? 'todos' : filtroRol}
              onChange={(e) => setFiltroRol(e.target.value === 'todos' ? null : e.target.value)}
              className="cursor-pointer w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="todos">Todos los roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Administradores</option>
              <option value="usuario">Usuarios</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ordenar por</label>
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="cursor-pointer w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="fecha-desc">Más reciente</option>
              <option value="fecha-asc">Más antiguo</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Registro</th>
                {isSuperadmin && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={isSuperadmin ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                    <FiUser className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No se encontraron usuarios con los filtros aplicados</p>
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => {
                  const isMe = usuario.id === currentUserId;
                  const isSA = usuario.rol?.toLowerCase() === 'superadmin';
                  const modifiable = canModify(usuario);

                  return (
                    <tr key={usuario.id} className={`transition-colors ${isMe ? 'bg-sky-50/40' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {usuario.nombre_completo || 'Sin nombre'}
                          </span>
                          {isMe && (
                            <span className="ml-2 text-xs text-sky-500 font-medium">(vos)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {usuario.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <RoleBadge role={usuario.rol} />
                          {usuario.bloqueado && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <FiSlash className="w-3 h-3 mr-0.5" />
                              Bloqueado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatearFecha(usuario.created_at)}
                      </td>
                      {isSuperadmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {modifiable ? (
                              <>
                                <button
                                  onClick={() => manejarToggleRol(usuario)}
                                  className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    usuario.rol?.toLowerCase() === 'admin'
                                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                                  }`}
                                >
                                  <FiShield className="w-3.5 h-3.5 mr-1" />
                                  {usuario.rol?.toLowerCase() === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                </button>
                                <button
                                  onClick={() => manejarToggleBloqueo(usuario)}
                                  className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    usuario.bloqueado
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                  }`}
                                >
                                  {usuario.bloqueado ? (
                                    <><FiCheck className="w-3.5 h-3.5 mr-1" /> Desbloquear</>
                                  ) : (
                                    <><FiSlash className="w-3.5 h-3.5 mr-1" /> Bloquear</>
                                  )}
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                {isSA ? 'Protegido' : isMe ? 'Sos vos' : '—'}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-200">
          {usuariosFiltrados.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <FiUser className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => {
              const isMe = usuario.id === currentUserId;
              const modifiable = canModify(usuario);

              return (
                <div key={usuario.id} className={`p-3 space-y-2 ${isMe ? 'bg-sky-50/40' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <FiUser className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {usuario.nombre_completo || 'Sin nombre'}
                        {isMe && <span className="text-sky-500 ml-1">(vos)</span>}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 ml-5">{usuario.email || '-'}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <RoleBadge role={usuario.rol} />
                  </div>

                  <p className="text-xs text-slate-500">
                    Registro: {formatearFecha(usuario.created_at)}
                  </p>

                  {isSuperadmin && modifiable && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => manejarToggleRol(usuario)}
                        className={`cursor-pointer flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${
                          usuario.rol?.toLowerCase() === 'admin'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        <FiShield className="w-3.5 h-3.5 mr-1" />
                        {usuario.rol?.toLowerCase() === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                      </button>
                      <button
                        onClick={() => manejarToggleBloqueo(usuario)}
                        className={`cursor-pointer flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${
                          usuario.bloqueado
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        {usuario.bloqueado ? (
                          <><FiCheck className="w-3.5 h-3.5 mr-1" /> Desbloquear</>
                        ) : (
                          <><FiSlash className="w-3.5 h-3.5 mr-1" /> Bloquear</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setAccionPendiente(null); }}
        onConfirm={confirmarAccion}
        title={mensajeModal.titulo}
        message={mensajeModal.mensaje}
        isLoading={cargandoAccion}
        confirmTone="primary"
      />

      {/* Result modal */}
      <ResultModal
        isOpen={modalResultadoAbierto}
        onClose={() => setModalResultadoAbierto(false)}
        isSuccess={resultadoExito}
        title={mensajeResultado.titulo}
        message={mensajeResultado.mensaje}
      />
    </div>
  );
}
