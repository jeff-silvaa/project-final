import type { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  width?: number | string;
  icon?: ReactNode;
}

export default function PillButton({
  label,
  onPress,
  variant = 'solid',
  width = '100%',
  icon,
}: PillButtonProps) {
  const isSolid = variant === 'solid';
  const containerStyle = {
    ...styles.button,
    width,
    backgroundColor: isSolid ? '#fff' : 'transparent',
    borderWidth: isSolid ? 0 : 1.5,
    borderColor: '#fff',
  } as ViewStyle;

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.8}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, { color: isSolid ? '#111' : '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
