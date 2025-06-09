import { Ionicons } from "@expo/vector-icons";
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('Nicolas');
  
  const users = [
    {
      id: 1,
      name: 'Nicolas Alvarez',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      featuredImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=80&h=80&fit=crop&crop=center',
      avatarBg: '#E0E7FF',
    },
    {
      id: 2,
      name: 'Nicolas Blanco',
      rating: 7.9,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      featuredImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&h=80&fit=crop&crop=center',
      avatarBg: '#FEF3C7',
    },
    {
      id: 3,
      name: 'Nicolas Campos',
      rating: 6.2,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      featuredImage: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop&crop=center',
      avatarBg: '#DBEAFE',
    },
  ];

  const UserCard = ({ user }: { user: any }) => {
    const [avatarError, setAvatarError] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
      <TouchableOpacity 
        className="bg-gray-100 rounded-2xl p-4 mb-4 flex-row items-center"
        activeOpacity={0.7}
      >
        {/* User Avatar */}
        <View className="mr-4">
          {!avatarError ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-12 h-12 rounded-full"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: user.avatarBg }}
            >
              <Ionicons name="person" size={24} color="#6B7280" />
            </View>
          )}
        </View>

        {/* User Info */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {user.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-sm font-medium text-gray-700 ml-1">
              {user.rating}
            </Text>
          </View>
        </View>

        {/* Featured Image */}
        <View className="flex-row items-center">
          {!imageError ? (
            <Image
              source={{ uri: user.featuredImage }}
              className="w-16 h-16 rounded-xl mr-3"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <View className="w-16 h-16 rounded-xl mr-3 bg-orange-100 items-center justify-center">
              <Ionicons name="restaurant-outline" size={24} color="#FB923C" />
            </View>
          )}
          
          {/* More Options */}
          <TouchableOpacity 
            className="p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        {/* Header */}
        <View className="px-4 pt-2">
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-4">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar usuarios..."
              className="flex-1 ml-2 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Usuarios
          </Text>

          {/* Filter and Sort Bar */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row">
              <TouchableOpacity className="flex-row items-center mr-4">
                <Text className="text-gray-700 mr-1">Filtrar</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-gray-700 mr-1">Ordenar</Text>
                <Ionicons name="chevron-down-outline" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-sm text-gray-500">99 resultados</Text>
          </View>
        </View>

        {/* Users List */}
        <View className="flex-1">
          <ScrollView 
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 0 }}
          >
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
            
            {/* Extra spacing for bottom navigation */}
            <View className="h-24" />
          </ScrollView>
        </View>

      
      </SafeAreaView>
    </View>
  );
};

export default ProfileSearchScreen;