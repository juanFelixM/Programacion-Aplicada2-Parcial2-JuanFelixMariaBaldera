import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  comprarVehiculo,
  getVehiculoById,
  removeToken,
} from '@/services/api';

function formatPrecio(precio: number | string | undefined) {
  const num = Number(precio);
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-ES')}`;
}

export default function VehiculoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarDetalle = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVehiculoById(id);
      setVehiculo(data);
    } catch (err: any) {
      if (err?.status === 401) {
        await removeToken();
        router.replace('/');
        return;
      }
      setError(err?.message || 'No se pudo cargar el detalle del vehículo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarDetalle();
    }
  }, [id]);

  const ejecutarCompra = async () => {
    setComprando(true);
    setError('');
    setSuccess('');
    try {
      await comprarVehiculo(id, 'transferencia');
      setSuccess('¡Compra realizada con éxito mediante transferencia!');
      setVehiculo((prev: any) =>
        prev ? { ...prev, estado: 'vendido' } : prev
      );
    } catch (err: any) {
      if (err?.status === 401) {
        await removeToken();
        router.replace('/');
        return;
      }
      setError(err?.message || 'No se pudo completar la compra.');
    } finally {
      setComprando(false);
    }
  };

  const confirmarCompra = () => {
    const titulo = 'Confirmar compra';
    const mensaje = `¿Deseas comprar ${vehiculo?.marca} ${vehiculo?.modelo} por ${formatPrecio(vehiculo?.precio)} mediante transferencia?`;

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`${titulo}\n\n${mensaje}`)) {
        ejecutarCompra();
      }
      return;
    }

    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: ejecutarCompra },
    ]);
  };

  const disponible =
    String(vehiculo?.estado || '').toLowerCase() === 'disponible';

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

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Cargando detalle...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#b91c1c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {success ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={18} color="#15803d" />
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          {vehiculo ? (
            <View style={styles.card}>
              {vehiculo.imagen ? (
                <Image
                  source={{ uri: vehiculo.imagen }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="car-sport" size={56} color="#94a3b8" />
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.headerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.marca}>{vehiculo.marca}</Text>
                    <Text style={styles.modelo}>{vehiculo.modelo}</Text>
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
                      {(vehiculo.estado || 'desconocido').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.precio}>
                  {formatPrecio(vehiculo.precio)}
                </Text>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID del vehículo</Text>
                  <Text style={styles.detailValue}>#{vehiculo.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Marca</Text>
                  <Text style={styles.detailValue}>{vehiculo.marca}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Modelo</Text>
                  <Text style={styles.detailValue}>{vehiculo.modelo}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Año</Text>
                  <Text style={styles.detailValue}>
                    {vehiculo.anio ?? vehiculo.año ?? '-'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <Text style={styles.detailValue}>{vehiculo.estado}</Text>
                </View>

                {disponible ? (
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      comprando && styles.disabledButton,
                    ]}
                    onPress={confirmarCompra}
                    disabled={comprando}
                    activeOpacity={0.85}
                  >
                    {comprando ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <Ionicons
                          name="card-outline"
                          size={20}
                          color="#ffffff"
                        />
                        <Text style={styles.buyButtonText}>
                          Comprar (Transferencia)
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}
        </ScrollView>
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
    paddingVertical: 12,
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
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
  },
  container: {
    padding: 20,
    paddingTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  successText: {
    color: '#15803d',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 210,
    backgroundColor: '#e2e8f0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 20,
  },
  headerRow: {
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
    letterSpacing: 0.8,
  },
  modelo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  precio: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
