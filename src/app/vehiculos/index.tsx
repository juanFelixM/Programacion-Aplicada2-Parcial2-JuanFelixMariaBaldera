import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getToken, getVehiculos, removeToken } from '@/services/api';

function formatPrecio(precio: number | string | undefined) {
  const num = Number(precio);
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-ES')}`;
}

export default function VehiculosScreen() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const cargarVehiculos = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        router.replace('/');
        return;
      }
      const data = await getVehiculos(soloDisponibles);
      setVehiculos(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (err?.status === 401) {
        await removeToken();
        router.replace('/');
        return;
      }
      setError(err?.message || 'Error al cargar los vehículos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, [soloDisponibles]);

  useFocusEffect(
    useCallback(() => {
      cargarVehiculos();
    }, [soloDisponibles])
  );

  const handleCerrarSesion = async () => {
    await removeToken();
    router.replace('/');
  };

  const renderVehiculo = ({ item }: { item: any }) => {
    const disponible =
      String(item?.estado || '').toLowerCase() === 'disponible';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/vehiculos/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.marca}>{item.marca || 'Marca'}</Text>
            <Text style={styles.modelo}>{item.modelo || 'Modelo'}</Text>
          </View>
          <View
            style={[
              styles.badge,
              disponible ? styles.badgeDisponible : styles.badgeVendido,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                disponible
                  ? styles.badgeTextDisponible
                  : styles.badgeTextVendido,
              ]}
            >
              {(item.estado || 'desconocido').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={15} color="#64748b" />
            <Text style={styles.metaText}>{item.anio ?? item.año ?? '-'}</Text>
          </View>
          <Text style={styles.precio}>{formatPrecio(item.precio)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brand}>VICE CITY MOTORS</Text>
          <Text style={styles.title}>Catálogo</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/compras')}
          >
            <Ionicons name="receipt-outline" size={20} color="#0f172a" />
            <Text style={styles.iconBtnText}>Mis compras</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.logoutBtn]}
            onPress={handleCerrarSesion}
          >
            <Ionicons name="log-out-outline" size={20} color="#b91c1c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !soloDisponibles && styles.filterChipActive,
          ]}
          onPress={() => setSoloDisponibles(false)}
        >
          <Text
            style={[
              styles.filterChipText,
              !soloDisponibles && styles.filterChipTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            soloDisponibles && styles.filterChipActive,
          ]}
          onPress={() => setSoloDisponibles(true)}
        >
          <Text
            style={[
              styles.filterChipText,
              soloDisponibles && styles.filterChipTextActive,
            ]}
          >
            Solo disponibles
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => cargarVehiculos()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Cargando vehículos...</Text>
        </View>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderVehiculo}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => cargarVehiculos(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="car-outline" size={44} color="#94a3b8" />
              <Text style={styles.emptyText}>
                No hay vehículos para mostrar.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f6f9',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748b',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  logoutBtn: {
    paddingHorizontal: 10,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    flex: 1,
  },
  retryText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 13,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingTop: 6,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  marca: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  modelo: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeDisponible: {
    backgroundColor: '#dcfce7',
  },
  badgeVendido: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextDisponible: {
    color: '#15803d',
  },
  badgeTextVendido: {
    color: '#b91c1c',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  precio: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#64748b',
  },
});
