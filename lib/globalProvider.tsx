import React, { createContext, useContext, ReactNode } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";
import { ErrorBoundary } from "@/components/ErrorBoundry";

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProviderContent = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    refetch,
    error,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user;

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Text style={styles.retryText} onPress={refetch}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  return (
    <ErrorBoundary>
      <GlobalProviderContent children={children} />
    </ErrorBoundary>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default GlobalProvider;

