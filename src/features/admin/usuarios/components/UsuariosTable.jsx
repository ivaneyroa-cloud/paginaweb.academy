// Componente de tabla de usuarios con filtros y acciones
// Maneja la visualización, filtrado y acciones sobre los usuarios del sistema

'use client';

import { useState, useMemo } from 'react';
import { alternarVIP, alternarBloqueo, alternarRol } from '../actions';
import { ConfirmModal } from '@/shared/components/modals/ConfirmModal';
import { ResultModal } from '@/shared/components/modals/ResultModal';

// Importamos iconos desde react-icons que usaremos en la interfaz
import { FiSearch, FiFilter, FiUser, FiShield, FiLock, FiUnlock } from 'react-icons/fi';
import { HiOutlineStar, HiStar } from 'react-icons/hi';
import { TbSortAscending, TbSortDescending } from 'react-icons/tb';

/**
 * Componente principal de la tabla de gestión de usuarios
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.usuariosIniciales - Lista inicial de usuarios desde el servidor
 */
export function UsuariosTable({ usuariosIniciales = [] }) {
  // ===============================================
  // ESTADOS DEL COMPONENTE
  // ===============================================

  // Guardamos los usuarios originales que vienen del servidor
  const [usuarios, setUsuarios] = useState(usuariosIniciales);

  // Estado para la búsqueda por texto (nombre o email)
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para los filtros de VIP y Bloqueado
  // null = sin filtro, true = activo, false = inactivo
  // const [filtroVIP, setFiltroVIP] = useState(null);       // DESACTIVADO temporalmente
  // const [filtroBloqueado, setFiltroBloqueado] = useState(null); // DESACTIVADO temporalmente

  // Filtro por rol: null = todos, 'admin' = solo admins, 'usuario' = solo usuarios
  const [filtroRol, setFiltroRol] = useState(null);

  // Estado para el ordenamiento
  // Puede ser: 'nombre-asc', 'nombre-desc', 'fecha-asc', 'fecha-desc'
  const [ordenamiento, setOrdenamiento] = useState('fecha-desc');

  // Estados para el modal de confirmación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);
  const [cargandoAccion, setCargandoAccion] = useState(false);

  // Estados para el modal de resultado
  const [modalResultadoAbierto, setModalResultadoAbierto] = useState(false);
  const [resultadoExito, setResultadoExito] = useState(true);
  const [mensajeResultado, setMensajeResultado] = useState({ titulo: '', mensaje: '' });

  // ===============================================
  // LÓGICA DE FILTRADO Y ORDENAMIENTO
  // ===============================================

  /**
   * useMemo nos permite calcular la lista filtrada solo cuando cambian
   * las dependencias, evitando cálculos innecesarios en cada render
   */
  const usuariosFiltrados = useMemo(() => {
    let resultado = [...usuarios];

    // FILTRO 1: Búsqueda por texto (nombre o email)
    if (searchTerm) {
      resultado = resultado.filter(usuario => {
        const nombreCoincide = usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailCoincide = usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return nombreCoincide || emailCoincide;
      });
    }

    // FILTRO 2: Filtro VIP — DESACTIVADO temporalmente
    // if (filtroVIP !== null) {
    //   resultado = resultado.filter(usuario => usuario.es_vip === filtroVIP);
    // }

    // FILTRO 3: Filtro Bloqueado — DESACTIVADO temporalmente
    // if (filtroBloqueado !== null) {
    //   resultado = resultado.filter(usuario => usuario.esta_bloqueado === filtroBloqueado);
    // }

    // FILTRO 4: Filtro por Rol
    if (filtroRol !== null) {
      resultado = resultado.filter(usuario => usuario.rol?.toLowerCase() === filtroRol);
    }

    // PASO FINAL: Ordenamiento
    // IMPORTANTE: Los admins siempre van primero, independiente del ordenamiento
    resultado.sort((a, b) => {
      // Primero verificamos si alguno es admin
      const esAdminA = a.rol?.toLowerCase() === 'admin';
      const esAdminB = b.rol?.toLowerCase() === 'admin';

      // Si uno es admin y el otro no, el admin va primero
      if (esAdminA && !esAdminB) return -1;
      if (!esAdminA && esAdminB) return 1;

      // Si ambos son del mismo tipo de rol, aplicamos el ordenamiento seleccionado
      switch (ordenamiento) {
        case 'nombre-asc':
          return (a.nombre_completo || '').localeCompare(b.nombre_completo || '');
        case 'nombre-desc':
          return (b.nombre_completo || '').localeCompare(a.nombre_completo || '');
        case 'fecha-asc':
          return new Date(a.updated_at) - new Date(b.updated_at);
        case 'fecha-desc':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });

    return resultado;
  }, [usuarios, searchTerm, /* filtroVIP, filtroBloqueado, */ filtroRol, ordenamiento]);

  // ===============================================
  // ESTADÍSTICAS DE USUARIOS
  // ===============================================

  /**
   * Calculamos las estadísticas generales de los usuarios
   * useMemo evita recalcular en cada render, solo cuando cambia la lista
   */
  const estadisticas = useMemo(() => {
    const totalUsuarios = usuarios.length;
    const totalAdmins = usuarios.filter(u => u.rol?.toLowerCase() === 'admin').length;
    // const usuariosVIP = usuarios.filter(u => u.es_vip).length;           // DESACTIVADO temporalmente
    // const usuariosBloqueados = usuarios.filter(u => u.esta_bloqueado).length; // DESACTIVADO temporalmente

    return {
      total: totalUsuarios,
      admins: totalAdmins,
      // vip: usuariosVIP,           // DESACTIVADO temporalmente
      // bloqueados: usuariosBloqueados, // DESACTIVADO temporalmente
    };
  }, [usuarios]);

  // ===============================================
  // MANEJADORES DE ACCIONES
  // ===============================================

  /**
   * Prepara y abre el modal de confirmación para alternar VIP
   */
  // const manejarToggleVIP = (usuario) => {   // DESACTIVADO temporalmente
  //   setAccionPendiente({
  //     tipo: 'vip',
  //     usuario: usuario,
  //     nuevoEstado: !usuario.es_vip
  //   });
  //   setModalAbierto(true);
  // };

  /**
   * Prepara y abre el modal de confirmación para alternar bloqueo
   */
  // const manejarToggleBloqueo = (usuario) => {   // DESACTIVADO temporalmente
  //   setAccionPendiente({
  //     tipo: 'bloqueo',
  //     usuario: usuario,
  //     nuevoEstado: !usuario.esta_bloqueado
  //   });
  //   setModalAbierto(true);
  // };

  /**
   * Prepara y abre el modal de confirmación para cambiar el rol (admin ↔ usuario)
   */
  const manejarToggleRol = (usuario) => {
    const esAdmin = usuario.rol?.toLowerCase() === 'admin';
    setAccionPendiente({
      tipo: 'rol',
      usuario: usuario,
      nuevoRol: esAdmin ? 'usuario' : 'admin'
    });
    setModalAbierto(true);
  };

  /**
   * Ejecuta la acción confirmada por el usuario
   */
  const confirmarAccion = async () => {
    if (!accionPendiente) return;

    setCargandoAccion(true);

    try {
      let resultado;

      // Ejecutamos la acción correspondiente en el servidor
      if (accionPendiente.tipo === 'vip') {
        resultado = await alternarVIP(accionPendiente.usuario.id, accionPendiente.nuevoEstado);
      } else if (accionPendiente.tipo === 'bloqueo') {
        resultado = await alternarBloqueo(accionPendiente.usuario.id, accionPendiente.nuevoEstado);
      } else if (accionPendiente.tipo === 'rol') {
        resultado = await alternarRol(accionPendiente.usuario.id, accionPendiente.nuevoRol);
      }

      // Cerramos el modal de confirmación primero
      setModalAbierto(false);

      // Si hubo un error, mostramos modal de error
      if (resultado.error) {
        setResultadoExito(false);
        setMensajeResultado({
          titulo: 'Error en la operación',
          mensaje: resultado.error
        });
        setModalResultadoAbierto(true);
        setAccionPendiente(null);
        return;
      }

      // IMPORTANTE: Actualizamos el estado local para reflejar el cambio instantáneamente
      // Esto evita tener que recargar toda la página
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u => {
          if (u.id === accionPendiente.usuario.id) {
            return {
              ...u,
              // Actualizamos el campo correspondiente
              ...(accionPendiente.tipo === 'vip'
                ? { es_vip: accionPendiente.nuevoEstado }
                : accionPendiente.tipo === 'bloqueo'
                  ? { esta_bloqueado: accionPendiente.nuevoEstado }
                  : { rol: accionPendiente.nuevoRol }
              ),
              updated_at: new Date().toISOString()
            };
          }
          return u;
        })
      );

      // Mostramos modal de éxito
      setResultadoExito(true);
      setMensajeResultado({
        titulo: '¡Operación exitosa!',
        mensaje: accionPendiente.tipo === 'vip'
          ? `El estado VIP de ${accionPendiente.usuario.nombre_completo} se ha ${accionPendiente.nuevoEstado ? 'activado' : 'desactivado'} correctamente.`
          : accionPendiente.tipo === 'bloqueo'
            ? `El usuario ${accionPendiente.usuario.nombre_completo} ha sido ${accionPendiente.nuevoEstado ? 'bloqueado' : 'desbloqueado'} correctamente.`
            : `El rol de ${accionPendiente.usuario.nombre_completo} ha sido cambiado a ${accionPendiente.nuevoRol === 'admin' ? 'Administrador' : 'Usuario'} correctamente.`
      });
      setModalResultadoAbierto(true);
      setAccionPendiente(null);

    } catch (error) {
      console.error('Error ejecutando acción:', error);

      // Cerramos el modal de confirmación
      setModalAbierto(false);

      // Mostramos modal de error
      setResultadoExito(false);
      setMensajeResultado({
        titulo: 'Error inesperado',
        mensaje: 'Hubo un error al procesar la solicitud. Por favor intenta de nuevo.'
      });
      setModalResultadoAbierto(true);
      setAccionPendiente(null);
    } finally {
      setCargandoAccion(false);
    }
  };

  // ===============================================
  // FUNCIONES AUXILIARES PARA EL RENDER
  // ===============================================

  /**
   * Obtiene el mensaje del modal según la acción pendiente
   */
  const obtenerMensajeModal = () => {
    if (!accionPendiente) return { titulo: '', mensaje: '' };

    const { tipo, usuario, nuevoEstado, nuevoRol } = accionPendiente;
    const nombre = usuario.nombre_completo || 'este usuario';

    if (tipo === 'vip') {
      return {
        titulo: nuevoEstado ? 'Activar estado VIP' : 'Desactivar estado VIP',
        mensaje: `¿Estás seguro de que deseas ${nuevoEstado ? 'activar' : 'desactivar'} el estado VIP de **${nombre}**?`
      };
    } else if (tipo === 'bloqueo') {
      return {
        titulo: nuevoEstado ? 'Bloquear usuario' : 'Desbloquear usuario',
        mensaje: `¿Estás seguro de que deseas ${nuevoEstado ? 'bloquear' : 'desbloquear'} a **${nombre}**?`
      };
    } else {
      // tipo === 'rol'
      const haciendoAdmin = nuevoRol === 'admin';
      const accion = haciendoAdmin ? 'dar permisos de administrador a' : 'quitar los permisos de administrador de';
      const advertencia = haciendoAdmin ? '\n\nEste usuario tendrá acceso completo a los paneles de administración.' : '';
      return {
        titulo: haciendoAdmin ? 'Hacer Administrador' : 'Quitar Administrador',
        mensaje: `¿Estás seguro de que deseas ${accion} **${nombre}**?${advertencia}`
      };
    }
  };

  /**
   * Formatea una fecha ISO a un formato legible
   */
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // ===============================================
  // RENDER DEL COMPONENTE
  // ===============================================

  const mensajeModal = obtenerMensajeModal();
  const tonoConfirmacion = accionPendiente?.tipo === 'bloqueo'
    ? 'danger'
    : accionPendiente?.tipo === 'rol' && accionPendiente?.nuevoRol === 'admin'
      ? 'primary'
      : 'primary';

  return (
    <div className="space-y-6">
      {/* ========== TARJETAS DE ESTADÍSTICAS ========== */}
      <div className="flex flex-wrap gap-3">
        {/* Card: Total de Usuarios */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[160px]">
          <div className="bg-sky-50 rounded-lg p-2 shrink-0">
            <FiUser className="w-5 h-5 text-sky-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Total</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.total}</p>
          </div>
        </div>

        {/* Card: Administradores */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[160px]">
          <div className="bg-amber-50 rounded-lg p-2 shrink-0">
            <FiShield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Admins</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.admins}</p>
          </div>
        </div>

        {/* Card: Usuarios VIP — DESACTIVADA temporalmente */}
        {/* <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[160px]">
          <div className="bg-purple-50 rounded-lg p-2 shrink-0">
            <HiStar className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">VIP</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.vip}</p>
          </div>
        </div> */}

        {/* Card: Bloqueados — DESACTIVADA temporalmente */}
        {/* <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 min-w-[160px]">
          <div className="bg-red-50 rounded-lg p-2 shrink-0">
            <FiLock className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-0.5">Bloqueados</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{estadisticas.bloqueados}</p>
          </div>
        </div> */}
      </div>

      {/* ========== SECCIÓN DE FILTROS ========== */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FiFilter className="w-5 h-5" />
          Filtros y Búsqueda
        </h2>

        {/* Barra de búsqueda */}
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

        {/* Filtros y Ordenamiento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro VIP — DESACTIVADO temporalmente */}
          {/* <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado VIP
            </label>
            <select
              value={filtroVIP === null ? 'todos' : filtroVIP.toString()}
              onChange={(e) => setFiltroVIP(
                e.target.value === 'todos' ? null : e.target.value === 'true'
              )}
              className="cursor-pointer w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="todos">Todos</option>
              <option value="true">Solo VIP</option>
              <option value="false">No VIP</option>
            </select>
          </div> */}

          {/* Filtro Bloqueado — DESACTIVADO temporalmente */}
          {/* <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estado de Bloqueo
            </label>
            <select
              value={filtroBloqueado === null ? 'todos' : filtroBloqueado.toString()}
              onChange={(e) => setFiltroBloqueado(
                e.target.value === 'todos' ? null : e.target.value === 'true'
              )}
              className="cursor-pointer w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="todos">Todos</option>
              <option value="false">Activos</option>
              <option value="true">Bloqueados</option>
            </select>
          </div> */}

          {/* Filtro por Rol */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rol
            </label>
            <select
              value={filtroRol === null ? 'todos' : filtroRol}
              onChange={(e) => setFiltroRol(
                e.target.value === 'todos' ? null : e.target.value
              )}
              className="cursor-pointer w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="usuario">Usuarios</option>
            </select>
          </div>

          {/* Selector de Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ordenar por
            </label>
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

        {/* Contador de resultados */}
        <div className="text-sm text-slate-600">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </div>
      </div>

      {/* ========== TABLA DE USUARIOS ========== */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Versión Desktop de la tabla */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Rol
                </th>
                {/* Columna VIP — DESACTIVADA temporalmente */}
                {/* <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                  VIP
                </th> */}
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {usuariosFiltrados.length === 0 ? (
                // Mensaje cuando no hay resultados
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <FiUser className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No se encontraron usuarios con los filtros aplicados</p>
                  </td>
                </tr>
              ) : (
                // Renderizamos cada usuario
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                    {/* Nombre */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {usuario.nombre_completo || 'Sin nombre'}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {usuario.email || '-'}
                      </span>
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.rol?.toLowerCase() === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}>
                        <FiShield className="w-3 h-3 mr-1" />
                        {usuario.rol || 'Usuario'}
                      </span>
                    </td>

                    {/* Columna Estado VIP — DESACTIVADA temporalmente */}
                    {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                      {usuario.es_vip ? (
                        <HiStar className="w-5 h-5 text-purple-500 mx-auto" />
                      ) : (
                        <HiOutlineStar className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td> */}

                    {/* Estado de Bloqueo */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {usuario.esta_bloqueado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiLock className="w-3 h-3 mr-1" />
                          Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiUnlock className="w-3 h-3 mr-1" />
                          Activo
                        </span>
                      )}
                    </td>

                    {/* Fecha de actualización */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatearFecha(usuario.updated_at)}
                    </td>

                    {/* Botones de Acción */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* Botón Toggle VIP — DESACTIVADO temporalmente */}
                        {/* <button
                          onClick={() => manejarToggleVIP(usuario)}
                          className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            usuario.es_vip
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                          }`}
                        >
                          {usuario.es_vip ? (
                            <>
                              <HiStar className="w-3.5 h-3.5 mr-1" />
                              Quitar VIP
                            </>
                          ) : (
                            <>
                              <HiOutlineStar className="w-3.5 h-3.5 mr-1" />
                              Hacer VIP
                            </>
                          )}
                        </button> */}

                        {/* Botón Toggle Bloqueo — DESACTIVADO temporalmente */}
                        {/* <button
                          onClick={() => manejarToggleBloqueo(usuario)}
                          className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            usuario.esta_bloqueado
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                          }`}
                        >
                          {usuario.esta_bloqueado ? (
                            <>
                              <FiUnlock className="w-3.5 h-3.5 mr-1" />
                              Desbloquear
                            </>
                          ) : (
                            <>
                              <FiLock className="w-3.5 h-3.5 mr-1" />
                              Bloquear
                            </>
                          )}
                        </button> */}

                        {/* Botón Toggle Admin */}
                        <button
                          onClick={() => manejarToggleRol(usuario)}
                          className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${usuario.rol?.toLowerCase() === 'admin'
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                            }`}
                        >
                          {usuario.rol?.toLowerCase() === 'admin' ? (
                            <>
                              <FiShield className="w-3.5 h-3.5 mr-1" />
                              Quitar Admin
                            </>
                          ) : (
                            <>
                              <FiShield className="w-3.5 h-3.5 mr-1" />
                              Hacer Admin
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Versión Mobile (cards) */}
        <div className="md:hidden divide-y divide-slate-200">
          {usuariosFiltrados.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              <FiUser className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No se encontraron usuarios con los filtros aplicados</p>
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="p-3 space-y-2">
                {/* Nombre y Email */}
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <FiUser className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {usuario.nombre_completo || 'Sin nombre'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 ml-5">{usuario.email || '-'}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${usuario.rol?.toLowerCase() === 'admin'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    <FiShield className="w-3 h-3 mr-0.5" />
                    {usuario.rol || 'Usuario'}
                  </span>

                  {/* Badge VIP — DESACTIVADO temporalmente */}
                  {/* {usuario.es_vip && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <HiStar className="w-3 h-3 mr-0.5" />
                      VIP
                    </span>
                  )} */}

                  {usuario.esta_bloqueado ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <FiLock className="w-3 h-3 mr-0.5" />
                      Bloqueado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FiUnlock className="w-3 h-3 mr-0.5" />
                      Activo
                    </span>
                  )}
                </div>

                {/* Fecha */}
                <p className="text-xs text-slate-500">
                  Actualizado: {formatearFecha(usuario.updated_at)}
                </p>

                {/* Acciones */}
                <div className="flex gap-2">
                  {/* Botón VIP — DESACTIVADO temporalmente (Mobile) */}
                  {/* <button
                    onClick={() => manejarToggleVIP(usuario)}
                    className={`cursor-pointer flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${
                      usuario.es_vip
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {usuario.es_vip ? (
                      <>
                        <HiStar className="w-3.5 h-3.5 mr-1" />
                        Quitar VIP
                      </>
                    ) : (
                      <>
                        <HiOutlineStar className="w-3.5 h-3.5 mr-1" />
                        Hacer VIP
                      </>
                    )}
                  </button> */}

                  {/* Botón Bloqueo — DESACTIVADO temporalmente (Mobile) */}
                  {/* <button
                    onClick={() => manejarToggleBloqueo(usuario)}
                    className={`cursor-pointer flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${
                      usuario.esta_bloqueado
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                    }`}
                  >
                    {usuario.esta_bloqueado ? (
                      <>
                        <FiUnlock className="w-3.5 h-3.5 mr-1" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <FiLock className="w-3.5 h-3.5 mr-1" />
                        Bloquear Cuenta
                      </>
                    )}
                  </button> */}

                  {/* Botón Toggle Admin — Mobile */}
                  <button
                    onClick={() => manejarToggleRol(usuario)}
                    className={`cursor-pointer flex-1 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${usuario.rol?.toLowerCase() === 'admin'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                  >
                    <FiShield className="w-3.5 h-3.5 mr-1" />
                    {usuario.rol?.toLowerCase() === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========== MODAL DE CONFIRMACIÓN ========== */}
      <ConfirmModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setAccionPendiente(null);
        }}
        onConfirm={confirmarAccion}
        title={mensajeModal.titulo}
        message={mensajeModal.mensaje}
        isLoading={cargandoAccion}
        confirmTone={tonoConfirmacion}
      />

      {/* ========== MODAL DE RESULTADO (ÉXITO/ERROR) ========== */}
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
