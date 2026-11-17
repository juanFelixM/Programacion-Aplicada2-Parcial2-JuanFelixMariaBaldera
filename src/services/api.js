import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL =
  Constants.expoConfig?.extra?.apiUrl || 'https://vicecity-motors-api.vercel.app';

const TOKEN_KEY = '@vicecity_token';
const USER_KEY = '@vicecity_user';

export async function saveToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function saveUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (response.status === 401
        ? 'Sesión expirada o credenciales inválidas.'
        : `Error del servidor (${response.status})`);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    await saveToken(data.token);
  }
  const user = data?.usuario || data?.user || data?.data?.usuario || data?.data?.user;
  if (user) {
    await saveUser(user);
  }
  return data;
}

export async function registro(nombre, email, password) {
  return await request('/auth/registro', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
}

export async function getVehiculos(soloDisponibles = false) {
  const query = soloDisponibles ? '?estado=disponible' : '';
  const data = await request(`/vehiculos${query}`, { method: 'GET' });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.vehiculos)) return data.vehiculos;
  return [];
}

export async function getVehiculoById(id) {
  const data = await request(`/vehiculos/${id}`, { method: 'GET' });
  return data?.data || data?.vehiculo || data;
}

export async function comprarVehiculo(vehiculoId, metodoPago = 'transferencia') {
  return await request('/ventas', {
    method: 'POST',
    body: JSON.stringify({ vehiculoId: Number(vehiculoId), metodoPago }),
  });
}

export async function getMisCompras() {
  const data = await request('/ventas', { method: 'GET' });
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.ventas)) return data.ventas;
  return [];
}
