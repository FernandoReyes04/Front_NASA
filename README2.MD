# 🌦️ Campeche Weather API

**Campeche Weather API** es un proyecto en **FastAPI** que permite consultar, comparar y clasificar condiciones climáticas basadas en **probabilidades históricas**.  
No realiza pronósticos deterministas, sino análisis de probabilidad histórica para categorías como *very hot/cold*, *very windy*, *very wet*, y *very uncomfortable*.

---

## Instalación 
Se debera instalar los requerimientos del mismo proyecto en un entorno vitual de python (requirements.txt) En caso de Windows debera instarlos manualmente, en caso de usar linux, podra ejecutarlos en sricpts, recuerda darle permiso a los dos para ejecutar cambios

## Estructura
La estructura se base en donde los routers tenemos los EndPoinst de la Api 
# Services 
seria donde tendriamos la manera de extraer los datos o el modelo de estadistica para calcular la estimación en base de estadistica 


## Deploy
Para el deply de la api deben realizar la instalacion de las dependencias de la API y realizar el comando para prederlo
# Opción manual
 - source .venv/bin/activate
- uvicorn app.main:app --reload --port 8000 <--- comando para ejecutar la api


## Consumo de la API desde React

A continuación se muestra cómo consumir los endpoints desde una aplicación React (Fetch o Axios). La API expone CORS y por defecto permite http://localhost:3000.

- URL base local por defecto: http://localhost:8000
- Endpoints:
  - GET /health
  - GET /v1/factors
  - GET /v1/metadata
  - POST /v1/analyze

Sugerencia: define la URL base en variables de entorno del frontend.
- Create React App: REACT_APP_API_BASE=http://localhost:8000
- Vite: VITE_API_BASE=http://localhost:8000

Ejemplo de helper (Axios):

```js
// src/api.js
import axios from "axios";

const API_BASE = import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});
```

Ejemplo con Fetch sin dependencias:

```js
const API_BASE = import.meta?.env?.VITE_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:8000";

async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

1) GET /health

- Verifica el estado del servicio.

Axios:
```js
const { data } = await api.get("/health");
console.log(data.status, data.timestamp);
```

Fetch:
```js
const data = await getJson("/health");
```

2) GET /v1/factors

- Lista de factores válidos para usar en /v1/analyze.

Axios:
```js
const { data } = await api.get("/v1/factors");
// data => { factors: ["temperature","precipitation","windspeed","humidity","comfort"] }
```

3) GET /v1/metadata

- Devuelve unidades, variables POWER por factor y fuentes.

Axios:
```js
const { data } = await api.get("/v1/metadata");
// data => { factors, units, power_variables, sources }
```

4) POST /v1/analyze

- Calcula estadísticas históricas en una ventana de días alrededor de una fecha objetivo, para uno o más factores.
- Body esperado (JSON) según el esquema del backend:

```json
{
  "latitude": 19.845,
  "longitude": -90.525,
  "month": 6,
  "day": 15,
  "start_year": 1990,
  "end_year": 2020,
  "half_window_days": 10,
  "factors": ["temperature", "precipitation", "windspeed", "humidity", "comfort"]
}
```

- Restricciones principales validadas por el backend:
  - latitude entre -90 y 90, longitude entre -180 y 180
  - month 1-12, day válido para el mes (con años bisiestos)
  - start_year y end_year >= 1981 y end_year >= start_year
  - half_window_days entre 0 y 30
  - factors no vacío; admitidos: temperature, precipitation, windspeed, humidity, comfort

Axios:
```js
const payload = {
  latitude: 19.845,
  longitude: -90.525,
  month: 6,
  day: 15,
  start_year: 1990,
  end_year: 2020,
  half_window_days: 10,
  factors: ["temperature", "precipitation", "windspeed", "humidity", "comfort"],
};

const { data } = await api.post("/v1/analyze", payload);
if (!data.ok) {
  // El servicio devuelve { ok: false, message: "..." } ante entradas inválidas o falta de datos
  throw new Error(data.message || "Solicitud inválida");
}
console.log(data.results); // resultados por factor
```

Fetch:
```js
const res = await fetch(`${API_BASE}/v1/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const data = await res.json();
if (!res.ok || !data.ok) {
  throw new Error(data.message || `HTTP ${res.status}`);
}
```

Manejo de errores recomendado en React:

```js
try {
  setLoading(true);
  const { data } = await api.post("/v1/analyze", payload);
  if (!data.ok) throw new Error(data.message);
  setResults(data.results);
} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}
```

Notas de CORS y configuración del backend:
- El backend usa FastAPI con CORSMiddleware.
- Variables en .env (backend) relevantes: ALLOW_ORIGINS y APP_PORT.
  - Ejemplo en .env.example:
    - ALLOW_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
- Si tu frontend corre en otra URL/puerto, añade esa URL a ALLOW_ORIGINS y reinicia la API.

Consejos de producción (frontend):
- Usa una variable de entorno para la URL base (VITE_API_BASE / REACT_APP_API_BASE).
- Considera un proxy inverso (Nginx) y HTTPS.
- Maneja timeouts y reintentos para redes móviles.
