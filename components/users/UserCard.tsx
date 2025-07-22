import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface User {
  alias: string;
  apellido: string;
  email: string;
  estadoRegistro: string;
  fechaRegistro: string;
  idUsuario: number;
  nombre: string;
  tipoUsuario: string;
}

export const UserCard = ({ user }: { user: User }) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para obtener el estado en español
  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'completo':
        return 'Completo';
      case 'pendiente':
        return 'Pendiente';
      default:
        return estado;
    }
  };

  // Función para obtener el tipo de usuario en español
  const getTipoUsuarioLabel = (tipo: string) => {
    switch (tipo) {
      case 'alumno':
        return 'Alumno';
      case 'profesor':
        return 'Profesor';
      case 'admin':
        return 'Administrador';
      default:
        return tipo;
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-6 mb-4 border border-gray-200 shadow-sm"
      activeOpacity={0.7}
    >
      {/* Header con nombre completo y tipo de usuario */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            {user.nombre} {user.apellido}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text className="text-sm text-gray-600 ml-1">
              {getTipoUsuarioLabel(user.tipoUsuario)}
            </Text>
          </View>
        </View>
        
        {/* Estado de registro */}
        <View className={`px-3 py-1 rounded-full ${
          user.estadoRegistro === 'completo' 
            ? 'bg-green-100' 
            : 'bg-yellow-100'
        }`}>
          <Text className={`text-xs font-medium ${
            user.estadoRegistro === 'completo' 
              ? 'text-green-700' 
              : 'text-yellow-700'
          }`}>
            {getEstadoLabel(user.estadoRegistro)}
          </Text>
        </View>
      </View>

      {/* Información de contacto */}
      <View className="space-y-3">
        {/* Alias */}
        <View className="flex-row items-center">
          <Ionicons name="at-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-2">
            <Text className="font-medium">Alias:</Text> @{user.alias}
          </Text>
        </View>

        {/* Email */}
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-2 flex-1">
            <Text className="font-medium">Email:</Text> {user.email}
          </Text>
        </View>

        {/* Fecha de registro */}
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-2">
            <Text className="font-medium">Registrado:</Text> {formatDate(user.fechaRegistro)}
          </Text>
        </View>

        {/* ID de usuario */}
        {/* <View className="flex-row items-center">
          <Ionicons name="id-card-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-2">
            <Text className="font-medium">ID:</Text> #{user.idUsuario}
          </Text>
        </View> */}
      </View>

      {/* Botón de acción (opcional) */}
      {/* <TouchableOpacity 
        className="mt-4 bg-blue-500 rounded-lg py-2 px-4 self-start"
        activeOpacity={0.7}
      >
        <Text className="text-white text-sm font-medium text-center">
          Ver recetas
        </Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};
