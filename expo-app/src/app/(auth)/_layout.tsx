import { Redirect, Stack } from 'expo-router';

import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgTop },
      }}
    />
  );
}
