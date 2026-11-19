# programacion4-react

Soluciones de React de Programación IV (UTN, Tecnicatura Universitaria en Programación, 2026).

```
programacion4-react/
├── ejercicios-basicos/        un proyecto Vite con los 7 ejercicios de "React desde cero"
└── frontend-endpoints/        las 8 prácticas de endpoints, cada una con el proyecto completo
    ├── practica1/
    ├── ...
    └── practica8/
```

## Ejercicios básicos

Un único proyecto Vite en TypeScript. Cada ejercicio es un componente en su propio archivo (`src/Ej1.tsx` … `src/Ej7.tsx`) y `App.tsx` muestra los siete, cada uno con su título.

```powershell
cd ejercicios-basicos
npm install
npm run dev
```

## Frontend endpoints

Cada carpeta `practicaN` es un proyecto Vite completo y funcionando **hasta esa práctica inclusive** (por ejemplo, `practica3` incluye las prácticas 1, 2 y 3).

| Carpeta | Agrega | Endpoint |
|---|---|---|
| `practica1` | Detalle de un usuario al hacer clic | `GET /user/{id}` |
| `practica2` | "Cargando..." y el `detail` de los errores | `GET /user` |
| `practica3` | Buscar por nombre, con Buscar y Limpiar | `GET /user/search/{name}` |
| `practica4` | Mis roles en el saludo | `GET /user/{id}` |
| `practica5` | Alta de usuario | `POST /user` |
| `practica6` | Alternar Todos / Solo mayores | `GET /user_mayores` |
| `practica7` | Borrar un usuario | `DELETE /user/{id}` |
| `practica8` | Sesión vencida: un 401 vuelve al login con "Tu sesión venció" | todos |

Las prácticas 1 a 7 usan `fetch` directo en cada componente, como pide la consigna ("con lo visto hasta el paso 7"). `practica8` es la versión final: además de la sesión vencida, ya tiene aplicada la solución a la práctica 9 (la capa del paso 8: un único `apiFetch` en `src/api/client.ts`, funciones por recurso en `src/api/users.ts` y el hook `useFetch`), separación en `pages/` y `components/`, y un diseño con botones para ingresar con los usuarios de prueba.

### Cómo correr una práctica

Necesitan la API de clase `clase-1-sqlmodel` corriendo en `http://localhost:8000`:

```powershell
# desde la carpeta clase-1-sqlmodel
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Y después, en la práctica:

```powershell
cd frontend-endpoints/practica8
copy .env.example .env     # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Abrir <http://localhost:5174> (usar `localhost`, no `127.0.0.1`).

Usuarios de prueba (contraseña `123`):

| Email | Rol | Puede |
|---|---|---|
| `mgomez@email.com` | ADMIN | ver, crear y borrar usuarios |
| `sfer@email.com` | REGULAR | solo ver (crear y borrar responden 403) |

## Respuestas a los "para pensar"

**Práctica 1. ¿Por qué la lista no trae todos los datos de todos los usuarios?**
`GET /user` devuelve solo `id` y `name` porque es lo único que necesita la lista. Con 10.000 usuarios, traer email, edad, país y roles de todos haría una respuesta enorme: la base tendría que resolver los joins con países y roles para todos, viajarían muchos más datos y el navegador los tendría que guardar, aunque se mire el detalle de uno o dos. El detalle con `GET /user/{id}` cuesta un pedido más, pero es chico y se hace solo cuando hace falta. Además, la API expone lo mínimo indispensable (no reparte los emails de todos).

**Práctica 3. Buscar `#` con y sin `encodeURIComponent`.**
Con `encodeURIComponent` sale `GET /user/search/%23` y la API responde `[]` (nadie tiene `#` en el nombre). Sin él, el navegador toma el `#` como inicio del fragmento de la URL (el ancla), que nunca se envía al servidor: sale `GET /user/search/`, la API redirige (307) a `/user/search`, que coincide con `GET /user/{id}` con `id = "search"`, y responde 422 porque "search" no es un número. Lo mismo pasa con `?`, `/` o `%`: cualquier texto que escriba el usuario hay que codificarlo antes de meterlo en la URL.

**Práctica 5. Con `sfer`, ¿qué responde la API?**
`403 Forbidden` con `{"detail": "Missing permission: write_users"}`: el token es válido (está autenticado), pero su rol REGULAR no tiene el permiso `write_users`. El front muestra ese `detail`.

**Práctica 7. ¿Les parece bien que el botón Borrar aparezca igual?**
No del todo: con `sfer` el botón aparece, se confirma y recién ahí la API responde `403 Missing permission: delete_users`, así que el usuario descubre que no podía hacerlo después de intentarlo. Lo correcto es que el front conozca los permisos del usuario logueado y oculte o deshabilite lo que no puede hacer. Igual, ocultar el botón es solo experiencia de usuario: la seguridad la sigue dando la API, porque cualquiera puede mandar el `DELETE` a mano.

**Práctica 9. Código repetido antes del paso 8.**
Conteo sobre el código con las prácticas 1 a 8 resueltas con `fetch` directo:

| Qué | Veces | Archivos |
|---|---|---|
| `import.meta.env.VITE_API_URL` | 6 | 4 (`App`, `CreateUserForm`, `UserDetail`, `UserList`) |
| ``Authorization: `Bearer ${token}` `` | 5 (lo usan 6 pedidos) | 3 |
| `if (!response.ok)` | 7 | 4 |
| `useState` para loading y error | 8 | 4 |

Además: el chequeo `status === 401` 6 veces, el mensaje de error de red 4 veces y la prop `onUnauthorized` pasando por componentes que no la usan.

Si el backend cambia el header del token hay que tocar **3 archivos y 5 lugares**. Si se olvidan de uno, TypeScript no lo detecta (es un string), el build pasa y la app anda; pero ese pedido sale sin el token donde la API lo espera, la API lo rechaza y, por la práctica 8, el usuario queda afuera con "Tu sesión venció" justo al usar esa función, aunque su sesión esté bien. La solución es la del paso 8, aplicada en `practica8`: un único `apiFetch` que arma la URL, agrega el token, revisa `response.ok` y maneja el 401, y un hook `useFetch` para loading/error. Ahí el cambio de header es **1 archivo y 1 línea**.
