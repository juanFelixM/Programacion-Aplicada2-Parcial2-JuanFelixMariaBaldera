import React, { useCallback, useState } from 'react';
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
import { getMisCompras, removeToken } from '@/services/api';

function formatPrecio(monto: number | string | undefined) {
  const num = Number(monto);
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-ES')}`;
}

function formatFecha(fechaStr: string | undefined) {
  if (!fechaStr) return 'Fecha no disponible';
  const date = new Date(fechaStr);
  if (Number.isNaN(date.getTime())) return fechaStr;
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MisComprasScreen() {
  const router = useRouter();
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const cargarCompras = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data = await getMisCompras();
      setCompras(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (err?.status === 401) {
        await removeToken();
        router.replace('/');
        return;
      }
      setError(err?.message || 'No se pudo cargar el historial de compras.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarCompras();
    }, [])
  );

  const renderCompra = ({ item }: { item: any }) => {
    const vehiculo = item?.vehiculo;
    const tituloVehiculo = vehiculo
      ? `${vehiculo.marca || ''} ${vehiculo.modelo || ''}`.trim()
      : item?.marca && item?.modelo
        ? `${item.marca} ${item.modelo}`
        : `Vehículo #${item?.vehiculoId ?? item?.id ?? '-'}`;

    const monto =
      item?.monto ?? item?.total ?? item?.precio ?? vehiculo?.precio ?? 0;
    const fecha = item?.fecha ?? item?.fechaVenta ?? item?.createdAt;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="car-sport-outline" size={20} color="#0f172a" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehiculoTitle}>{tituloVehiculo}</Text>
            <Text style={styles.fechaText}>{formatFecha(fecha)}</Text>
          </View>
          <Text style={styles.monto}>{formatPrecio(monto)}</Text>
        </View>

        {item?.metodoPago ? (
          <View style={styles.footerRow}>
            <Text style={styles.metodoLabel}>Método de pago:</Text>
            <Text style={styles.metodoValue}>
              {String(item.metodoPago).toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
          <Text style={styles.backText}>Catálogo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.brand}>VICE CITY MOTORS</Text>
        <Text style={styles.title}>Mis compras</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => cargarCompras()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading && !refreshing ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Cargando tus compras...</Text>
        </View>
      ) : (
        <FlatList
          data={compras}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderCompra}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => cargarCompras(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={44} color="#94a3b8" />
              <Text style={styles.emptyText}>
                Aún no has realizado ninguna compra.
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
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
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
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehiculoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  fechaText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  monto: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metodoLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  metodoValue: {
    fontSize: 12,
    fontWeight: '700',
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
