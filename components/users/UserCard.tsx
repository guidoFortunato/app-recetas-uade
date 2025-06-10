import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const UserCard = ({ user }: { user: any }) => {
  return (
    <TouchableOpacity
      className="bg-gray-100 rounded-2xl p-4 py-7 mb-10 flex-row items-center relative"
      activeOpacity={0.7}
    >
      {/* User Avatar */}
      <View className="absolute left-4 top-16">
        <Image
          source={{ uri: user.avatar }}
          className="w-12 h-12 rounded-full"
        />
      </View>

      {/* User Info */}
      <View className="flex justify-center">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          {user.name} <Ionicons name="star" size={14} color="#FFD700" />{" "}
          <Text className="text-sm font-medium text-gray-700 ml-1">
            {user.rating}
          </Text>
        </Text>
      </View>

      {/* Featured Image */}
      <View className="flex-row items-center">
        {/* <Image
          source={{ uri: user.featuredImage }}
          className="w-16 h-16 rounded-xl mr-3"
          resizeMode="cover"
        /> */}

        {/* More Options */}
        {/* <TouchableOpacity className="p-1" activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};
