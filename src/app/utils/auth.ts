export const AUTH_STORAGE_KEY = 'aerotursUser';
const USER_STORE_KEY = 'aerotursRegisteredUsers';

export type AuthUser = {
  id_usuario: number;
  correo: string;
  nombre: string;
  rol: string;
  id_rol: number;
};

type StoredUser = AuthUser & {
  password: string;
  tipo_documento?: string;
  numero_documento?: string;
  ciudad?: string;
  pais?: string;
  telefono_principal?: string;
  fecha_nacimiento?: string;
};

const API_BASE_URL = 'http://localhost:3000';

const defaultUsers: StoredUser[] = [
  {
    id_usuario: 1,
    correo: 'admin@aeroturs.com',
    password: 'admin123',
    nombre: 'Administrador',
    rol: 'Super Administrador',
    id_rol: 1,
  },
  {
    id_usuario: 2,
    correo: 'agente@aeroturs.com',
    password: 'agente123',
    nombre: 'Agente AEROTURS',
    rol: 'Agente de Aerolinea',
    id_rol: 2,
  },
  {
    id_usuario: 3,
    correo: 'cliente@aeroturs.com',
    password: 'cliente123',
    nombre: 'Cliente Demo',
    rol: 'Cliente',
    id_rol: 3,
  },
];

function getLocalUsers(): StoredUser[] {
  const raw = localStorage.getItem(USER_STORE_KEY);
  if (!raw) {
    return [...defaultUsers];
  }

  try {
    const stored = JSON.parse(raw) as StoredUser[];
    return [...defaultUsers, ...stored];
  } catch {
    return [...defaultUsers];
  }
}

function saveLocalUsers(users: StoredUser[]) {
  const stored = users.filter((user) => !defaultUsers.some((demo) => demo.correo === user.correo));
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(stored));
}

function createAuthUser(user: StoredUser): AuthUser {
  return {
    id_usuario: user.id_usuario,
    correo: user.correo,
    nombre: user.nombre,
    rol: user.rol,
    id_rol: user.id_rol,
  };
}

function setAuthenticatedUser(user: AuthUser) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('aeroturs-auth-change'));
}

export async function login(correo: string, password: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, password }),
    });

    if (response.ok) {
      const data = await response.json().catch((error) => {
        console.error('Login JSON parse error:', error);
        return null;
      });

      if (data?.success && data.user) {
        const authUser: AuthUser = {
          id_usuario: data.user.id_usuario,
          correo: data.user.correo,
          nombre: data.user.nombre || data.user.correo.split('@')[0],
          rol: data.user.rol || 'Cliente',
          id_rol: data.user.id_rol,
        };

        setAuthenticatedUser(authUser);
        return authUser;
      }
    }
  } catch (error) {
    console.error('Backend login error:', error);
  }

  const users = getLocalUsers();
  const localUser = users.find(
    (user) => user.correo.toLowerCase() === correo.trim().toLowerCase() && user.password === password,
  );

  if (!localUser) {
    return null;
  }

  const authUser = createAuthUser(localUser);
  setAuthenticatedUser(authUser);
  return authUser;
}

export async function register(userData: {
  correo: string;
  password: string;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  pais: string;
  telefono_principal: string;
  fecha_nacimiento: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json().catch((error) => {
        console.error('Register JSON parse error:', error);
        return null;
      });

      if (data) {
        return data;
      }
    }
  } catch (error) {
    console.error('Backend register error:', error);
  }

  const users = getLocalUsers();

  if (users.some((user) => user.correo.toLowerCase() === userData.correo.trim().toLowerCase())) {
    return { success: false, message: 'El correo electrónico ya está registrado' };
  }

  if (users.some((user) => user.numero_documento === userData.numero_documento)) {
    return { success: false, message: 'El número de documento ya está registrado' };
  }

  const nextId = Math.max(...users.map((user) => user.id_usuario), 0) + 1;
  const newUser: StoredUser = {
    id_usuario: nextId,
    correo: userData.correo,
    password: userData.password,
    nombre: `${userData.nombres} ${userData.apellidos}`,
    rol: 'Cliente',
    id_rol: 3,
    tipo_documento: userData.tipo_documento,
    numero_documento: userData.numero_documento,
    ciudad: userData.ciudad,
    pais: userData.pais,
    telefono_principal: userData.telefono_principal,
    fecha_nacimiento: userData.fecha_nacimiento,
  };

  saveLocalUsers([...users, newUser]);
  return { success: true, message: 'Usuario registrado exitosamente' };
}

export function getAuthUser(): AuthUser | null {
  const savedUser = sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthUser());
}

export function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event('aeroturs-auth-change'));
}
