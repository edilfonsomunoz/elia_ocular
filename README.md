# Sistema de Autenticación con React 18 + Vite + Tailwind CSS & FastAPI + SQLAlchemy 2 + MySQL

Un sistema de autenticación completo de producción con inicio de sesión por correo electrónico y contraseña, registro de nuevos usuarios, persistencia en base de datos MySQL, hashing seguro con Bcrypt y tokens JWT Bearer.

---

## 🛠 Tecnologías Utilizadas

- **Frontend**:
  - React 18
  - Vite (Servidor de desarrollo ultra rápido)
  - Tailwind CSS (Diseño responsivo con glassmorphic UI)
  - React Router DOM v6 (Gestión de rutas privadas y públicas)
  - Axios (Cliente HTTP con interceptores JWT)
  - Lucide React (Iconografía moderna)

- **Backend**:
  - FastAPI (Framework de Python asíncrono y de alto rendimiento)
  - SQLAlchemy 2.0 (ORM declarativo con sintaxis moderna `Mapped` y `mapped_column`)
  - PyMySQL (Driver oficial para MySQL)
  - PyJWT & Passlib / Bcrypt (Seguridad, hashing y tokens JWT)
  - Pydantic v2 (Validación de datos y schemas)

- **Base de Datos**:
  - MySQL Server 8.0+

---

## 📂 Estructura del Proyecto

```text
eliaocular/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py               # Inyección de dependencias (DB y Usuario autenticado)
│   │   │   └── v1/
│   │   │       ├── api.py            # Router principal API v1
│   │   │       └── endpoints/
│   │   │           └── auth.py       # Endpoints /register, /login, /me
│   │   ├── core/
│   │   │   ├── config.py             # Configuración Pydantic Settings (.env)
│   │   │   └── security.py           # Bcrypt hashing y generación/decodificación JWT
│   │   ├── db/
│   │   │   ├── base.py               # DeclarativeBase de SQLAlchemy 2.0
│   │   │   └── session.py            # Motor de conexión y fábrica de sesiones MySQL
│   │   ├── models/
│   │   │   └── user.py               # Modelo SQLAlchemy 2.0 de la tabla 'users'
│   │   ├── schemas/
│   │   │   ├── token.py              # Esquema Pydantic del Token JWT
│   │   │   └── user.py               # Esquemas de Registro, Login y Respuesta de Usuario
│   │   └── main.py                   # Entrada de FastAPI y configuración de CORS
│   ├── .env.example                  # Plantilla de variables de entorno
│   ├── .env                          # Configuración local de base de datos MySQL
│   ├── init_db.py                    # Script de creación automática de la BD MySQL y tablas
│   └── requirements.txt              # Dependencias de Python
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js              # Instancia Axios con Interceptor de Token JWT
│   │   │   └── auth.js               # Funciones cliente de la API de autenticación
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Barra de navegación superior
│   │   │   └── ProtectedRoute.jsx    # Guard de rutas protegidas
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Contexto global de estado de autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Vista de Inicio de Sesión
│   │   │   ├── Register.jsx          # Vista de Registro de Usuario
│   │   │   └── Dashboard.jsx         # Vista protegida del usuario autenticado
│   │   ├── App.jsx                   # Enrutador principal de la aplicación
│   │   ├── index.css                 # Configuración de Tailwind CSS y animaciones
│   │   └── main.jsx                  # Punto de montaje de React 18
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🚀 Guía de Inicio Rápido

### 1. Configurar el Backend (FastAPI + MySQL)

1. **Asegurar que MySQL esté en ejecución** en tu sistema (ejemplo en `localhost:3306`).
2. **Navegar a la carpeta del backend**:
   ```bash
   cd backend
   ```
3. **Crear y activar un entorno virtual de Python (Opcional pero recomendado)**:
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En Linux/macOS:
   source venv/bin/activate
   ```
4. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Configurar el archivo `.env`**:
   Verifica y ajusta la cadena de conexión MySQL en `backend/.env`:
   ```env
   DATABASE_URL="mysql+pymysql://root:TU_CONTRASEÑA@localhost:3306/eliaocular_db"
   ```
6. **Inicializar la Base de Datos y Tablas**:
   Ejecuta el script de inicialización automática que creará la base de datos `eliaocular_db`, la tabla `users` y un usuario admin de prueba:
   ```bash
   python init_db.py
   ```
7. **Iniciar el servidor FastAPI**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   La API estará corriendo en `http://localhost:8000`. Puedes abrir la documentación interactiva en `http://localhost:8000/docs`.

---

### 2. Configurar el Frontend (React 18 + Vite + Tailwind)

1. **Navegar a la carpeta del frontend**:
   ```bash
   cd frontend
   ```
2. **Instalar paquetes de Node**:
   ```bash
   npm install
   ```
3. **Iniciar el servidor de desarrollo Vite**:
   ```bash
   npm run dev
   ```
4. **Abrir en el navegador**: `http://localhost:5173`.

---

## 🔐 Endpoints Principales de Autenticación

- `POST /api/v1/auth/register`: Registro de usuario (Correo, Nombre completo y Contraseña).
- `POST /api/v1/auth/login`: Inicio de sesión (Retorna el JWT Access Token).
- `GET /api/v1/auth/me`: Obtener los datos del usuario autenticado (Requiere `Authorization: Bearer <token>`).

---

## 👤 Credenciales de Prueba por Defecto (Creadas por `init_db.py`)

- **Correo**: `admin@example.com`
- **Contraseña**: `admin123456`

