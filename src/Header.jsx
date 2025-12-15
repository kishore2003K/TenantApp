// Header.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SidebarMenu from './SidebarMenu';

export default function Header({
  onPress,
  onNavigate,
  showMenu = true,
  unreadCount = 0,
  onToggleNotifications,
}) {
  const handleNotificationPress = () => {
    // Only toggle the notification dropdown, don't navigate to Notifications page
    if (typeof onToggleNotifications === 'function') {
      onToggleNotifications();
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.topBar}>
        {showMenu ? (
          <SidebarMenu onSelect={onPress} onNavigate={onNavigate} />
        ) : (
          <View style={{ width: 40 }} />
        )}

        <View style={styles.logoBox}>
          <Image
            source={require('../assets/images/sglobal-icon.jpg')}
            style={styles.logoImage}
          />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotificationPress}
          activeOpacity={0.8}
        >
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
          <Image
            source={require('../assets/images/notification.png')}
            style={styles.topIconImage}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 64, // stable height across devices
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
  },
  iconButton: {
    padding: 8,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topIconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    tintColor: '#374151',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
