# CAW

<p align="center">
  <img src="public/furious.png" alt="CAW — mascota del proyecto" width="160" />
</p>

**CAW!** — *…¿cómo venimos hoy?*

CAW es una app web para cargar un YAML de proyecto, seguir el avance de etapas anidadas y editarlo en el navegador. Un solo archivo describe el proyecto, un rango numérico define la escala, y un árbol de *stages* se consolida en un porcentaje global.

## Funciones

- **Cargar YAML** desde disco o abrir ejemplos incluidos
- **State** — torta, avance total, tabla de etapas y árbol de desglose
- **Source** — YAML resaltado, con copia al portapapeles
- **Edition** — editar nombre, rango y árbol de stages
- **Pesos opcionales** — prefijo `(N)nombre` para la participación entre hermanos (p. ej. `(70)planning`)
- **Validación** — campos obligatorios, claves duplicadas, valores fuera de rango, y pesos que no pueden superar 100% entre hermanos
- **Guía de formato** — ayuda integrada en `/help`

## Formato YAML

Todo proyecto necesita tres campos de primer nivel:

| Campo | Descripción |
|-------|-------------|
| `name` | Título del proyecto |
| `range` | Escala de progreso para hojas, p. ej. `0..5` |
| `stages` | Árbol anidado: ramas son objetos, hojas son números dentro de `range` |

Ejemplo mínimo:

```yaml
name: My project
range: 0..5

stages:
  planning:
    research: 3
    budget: 2
  delivery: 1
```

### Pesos opcionales

Antepone un número entre paréntesis al nombre del stage. Los pesos aplican **entre hermanos** del mismo nivel y deben sumar **100**. CAW rechaza archivos donde los pesos explícitos superen 100.

```yaml
stages:
  (50)planning:
    (40)research:
      destination: 5
    (35)budget:
      flights: 4
    (25)logistics:
      visas: 5
  (30)booking:
    hotels: 4
  (20)travel:
    outbound: 5
```

- Los stages sin peso reciben el porcentaje restante entre hermanos
- Si los pesos indicados suman menos de 100 y no hay hermanos sin peso, se escalan proporcionalmente
- En **State** y **Edition**, el progreso se muestra como **logrado / tope** (p. ej. `35% / 50%`)

La guía completa está en `/help` dentro de la app.

## Ejemplos incluidos

| Archivo | Descripción |
|---------|-------------|
| [`public/examples/template.yml`](public/examples/template.yml) | Plantilla mínima con pesos en la raíz |
| [`public/examples/house.yml`](public/examples/house.yml) | Obra en construcción, árbol profundo, sin pesos |
| [`public/examples/travel.yml`](public/examples/travel.yml) | Planificación de viaje a Patagonia, con pesos en varios niveles |

## Puesta en marcha

Requisito: **Node.js 18+**

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

Otros comandos:

```bash
npm run build    # build de producción → dist/
npm run preview  # previsualizar el build
```

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Inicio |
| `/lets-see` | Cargar y ver un proyecto |
| `/lets-see?example=basic` | Abrir ejemplo básico (*house*) |
| `/lets-see?example=advanced` | Abrir ejemplo avanzado (*Patagonia*, con pesos) |
| `/lets-see?example=1` | Alias del ejemplo básico (compatibilidad) |
| `/help` | Guía de formato y descargas |

## Stack

- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite 6](https://vite.dev/)
- [js-yaml](https://github.com/nodeca/js-yaml) para parseo y serialización

Tipografía: Plus Jakarta Sans (títulos), IBM Plex Sans / Mono (UI y YAML).

## Estructura del repo

```
public/examples/     YAML de ejemplo servidos como estáticos
src/
  components/        UI: gráficos, editores, pestañas, validación
  pages/             Home, LetsSee (workspace), Help
  utils/             Validación YAML, análisis de stages, pesos, árbol de edición
  styles/            Tokens, layout, temas state / edition / yaml
```

## Cálculo del progreso

1. **Hojas** — el valor numérico se mapea a 0–100% según `range`
2. **Ramas** — promedio ponderado de hijos (partes iguales si no hay pesos)
3. **Total** — promedio ponderado de stages raíz
4. **Tope de visualización** — el peso del padre define el techo en State/Edition; la UI muestra contribución vs. tope (p. ej. bajo `(50)planning`, los hijos usan ese 50% como techo del proyecto)

---

*Paleta amanecer patagónico, estética de notas de campo.*
