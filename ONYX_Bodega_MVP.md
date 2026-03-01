# ONYX Bodega — Especificación MVP (Chile)

## A) UX / Pantallas (layout + componentes clave + textos)

### 1) Flujo completo
1. **Bienvenida + Onboarding (2–3 min)**
2. **Importar datos** (CSV / pegar tabla / ingreso manual)
3. **Mapeo y validación** (columnas, fechas, faltantes)
4. **Revisión y ajustes por producto**
5. **Dashboard accionable**
6. **Detalle por producto** (drawer/modal)

---

### 2) Pantalla: Bienvenida
**Objetivo:** explicar valor en 10 segundos.

**Layout**
- Encabezado: `ONYX Bodega`
- Texto corto: `Te ayudamos a reponer a tiempo y bajar la merma con tus ventas reales.`
- Botón principal: `Empezar`
- Botón secundario: `Ver plantilla CSV`

**Microcopy (estado inicial)**
- `No necesitas saber de tecnología. Te guiamos paso a paso.`

---

### 3) Pantalla: Onboarding (3 obligatorias + opcionales)

#### Preguntas obligatorias
1. **Tipo de negocio** (selector)
   - Restaurante
   - Almacén
   - Minimarket
   - Tienda de ropa
   - Farmacia
   - Otro
2. **Ubicación** (texto libre con sugerencias): `Ciudad / comuna`
3. **Volumen semanal de ventas promedio** (rango)
   - Bajo: `0 a 200 ventas/semana`
   - Medio: `201 a 800 ventas/semana`
   - Alto: `801+ ventas/semana`

#### Preguntas opcionales
- **Días de atención:** lunes a domingo (multi-select)
- **Horario de atención:** desde/hasta
- **Tiempo de entrega de proveedores (lead time):**
  - 1–2 días
  - 3–5 días
  - 7+ días

**Botón principal:** `Continuar`

**Validaciones + errores**
- `Elige el tipo de negocio para seguir.`
- `Ingresa tu ciudad o comuna.`
- `Selecciona un rango de ventas semanal.`

**Tooltip “¿qué significa esto?”**
- **Lead time:** `Es el tiempo que se demora tu proveedor en entregar desde que haces el pedido.`

---

### 4) Pantalla: Importar datos

#### Opción A: Subir CSV
- Dropzone + botón `Seleccionar archivo`
- Link: `Descargar plantilla CSV`
- Texto apoyo: `Acepta .csv con separador coma, punto y coma o tab.`

#### Opción B: Pegar tabla (Excel/Sheets)
- Caja grande tipo textarea
- Botón `Pegar y revisar`
- Parseo automático de columnas y separadores

#### Opción C: Ingreso manual rápido
- Tabla editable (10–30 productos)
- Columnas mínimas: producto, stock actual, unidad, ventas últimos 7 días
- Botón `Agregar fila`

**Estado vacío**
- `Aún no cargaste datos. Sube un CSV, pega una tabla o carga productos a mano.`

**Errores comunes**
- `No pudimos leer el archivo. Revisa que sea CSV y que no venga bloqueado.`
- `Tu archivo viene vacío.`
- `No encontramos la columna fecha de venta.`

---

### 5) Pantalla: Mapeo de columnas + validación

**Layout**
- Vista izquierda: vista previa de primeras 20 filas
- Vista derecha: mapeo obligatorio/opcional

**Campos obligatorios a mapear**
- fecha_venta
- producto
- cantidad_vendida
- stock_actual (desde tabla inventario o manual)

**Campos opcionales**
- precio_unitario_clp
- ingresos_clp
- fecha_vencimiento
- categoria
- lead_time_dias
- pack_size

**Validación simple**
- Fechas válidas: DD-MM-AAAA o AAAA-MM-DD
- Duplicados exactos (fecha + producto + cantidad)
- Faltantes en campos clave
- Cantidades negativas

**Mensajes de validación**
- `Fecha inválida en 12 filas. Usa DD-MM-AAAA o AAAA-MM-DD.`
- `Encontramos 8 filas duplicadas. Te recomendamos eliminarlas.`
- `Falta producto en 5 filas.`
- `Hay cantidades negativas en 2 filas.`

**Acciones**
- `Corregir automáticamente lo posible`
- `Descargar errores`
- `Continuar igual` (si errores no críticos)

**Tooltip**
- **Duplicado:** `Es una fila repetida exactamente igual. Puede inflar tus ventas.`

---

### 6) Pantalla: Revisión / Ajustes

Tabla por producto con edición rápida:
- Producto
- Unidad: unidad / caja / kg / lt
- Conversión caja→unidades (pack size)
- Proveedor
- Lead time (días)
- Categoría: perecible / no perecible
- Vida útil (días) si no hay fecha de vencimiento

**Control de estrategia (slider)**
`Evitar quiebres`  <----->  `No inmovilizar plata`

- Izquierda (evitar quiebres): sube stock de seguridad
- Derecha (no inmovilizar): baja stock de seguridad

**Texto bajo slider**
- `Más a la izquierda: menos riesgo de quedarte sin stock, pero compras antes.`
- `Más a la derecha: menos plata inmovilizada, pero más riesgo de quiebre.`

---

### 7) Pantalla: Dashboard

#### Bloque 1: Prioridades de hoy (Top 5)
Tarjetas con acciones inmediatas.

#### Bloque 2: Ojo esta semana
Riesgos de merma y quiebre próximos 7 días.

#### Bloque 3: Próxima semana
Días con más movimiento y productos con posible alza.

### Regla de contenido de cada tarjeta (siempre)
1. **Qué está pasando**
2. **Por qué importa**
3. **Qué hacer ahora**
4. **Confianza:** Alta / Media / Baja

**Estado vacío del dashboard**
- `Todavía no hay suficientes datos para darte recomendaciones. Carga al menos 14 días de ventas.`

**Error de cálculo**
- `No pudimos calcular recomendaciones para algunos productos. Revisa datos faltantes en stock o ventas.`

---

### 8) Detalle por producto (drawer/modal)

**Secciones**
- Ventas últimos 30 días (línea simple)
- Stock actual
- Recomendación de pedido:
  - cantidad sugerida
  - fecha límite para pedir
- Riesgo de merma:
  - unidades en riesgo
  - sugerencia concreta: descuento, combo, reducir compra

**Ejemplo microcopy accionable**
- `Pide 12 unidades de Leche Entera antes del miércoles para no quedarte sin stock.`
- `Hay riesgo de merma: te van a sobrar ~8 unidades si las ventas siguen igual. Activa promo 2x1 desde el viernes.`

---

### 9) Biblioteca de microcopy (lista rápida)

**Estados vacíos**
- `No hay productos aún. Carga tu inventario para empezar.`
- `No hay alertas urgentes hoy. Buen trabajo.`

**Errores comunes**
- `Formato de fecha no reconocido.`
- `El producto “Pan Hallulla” aparece con nombres distintos. Te recomendamos unificar.`

**Validaciones**
- `La cantidad vendida debe ser mayor o igual a 0.`
- `El stock actual no puede estar vacío.`

**Tooltips**
- **Días de cobertura:** `Cuántos días te alcanza el stock actual si vendes al ritmo esperado.`
- **Stock de seguridad:** `Un colchón para no quedarte sin stock por variaciones en ventas o atrasos.`
- **Confianza:** `Qué tan firme es la recomendación según cantidad y calidad de tus datos.`

---

## B) Esquema de datos (mínimo viable y práctico)

### 1) Entidades mínimas

#### Ventas
- `fecha_venta` (obligatorio)
- `producto` (obligatorio)
- `cantidad_vendida` (obligatorio)
- `precio_unitario_clp` (opcional)
- `ingresos_clp` (opcional)

#### Inventario
- `producto` (obligatorio)
- `stock_actual` (obligatorio)
- `unidad` (obligatorio)
- `fecha_vencimiento` (opcional)

#### Metadatos de producto
- `producto` (obligatorio)
- `categoria` (opcional recomendado)
- `vida_util_dias` (opcional, usado si no hay vencimiento)
- `lead_time_dias` (opcional recomendado)
- `pack_size` (opcional, caja→unidades)
- `proveedor` (opcional)

---

### 2) Plantilla CSV (columnas exactas)

#### Archivo: `ventas.csv`
```csv
fecha_venta,producto,cantidad_vendida,precio_unitario_clp,ingresos_clp
```

#### Archivo: `inventario.csv`
```csv
producto,stock_actual,unidad,fecha_vencimiento,categoria,vida_util_dias,lead_time_dias,pack_size,proveedor
```

**Default opinado:** separar ventas e inventario en 2 CSV simplifica carga y reduce errores de mezcla.

---

## C) Motor de insights (núcleo determinístico + LLM opcional solo redacción)

### 1) Principio
- Cálculo base **determinístico** (reglas claras y trazables)
- LLM opcional solo para transformar resultados en texto natural

---

### 2) Pronóstico de demanda (7–14 días)

#### Paso 1: demanda diaria base
- Si hay ≥ 28 días de datos:
  - `promedio_movil_28 = promedio(últimos 28 días)`
- Si hay 14–27 días:
  - `promedio_movil_14 = promedio(últimos 14 días)`
- Si hay <14 días:
  - `promedio_disponible = promedio(días disponibles)`

#### Paso 2: estacionalidad por día de semana (si hay suficientes datos)
Aplicar solo si hay ≥ 42 días.
- `factor_dow = promedio_ventas_día_semana / promedio_global`
- `demanda_día = promedio_movil * factor_dow`

Si no hay suficientes datos:
- `demanda_día = promedio_movil` (sin factor)

#### Fallback por pocos datos
- 0–3 días: usar promedio simple + marcar confianza baja
- Producto sin ventas históricas: usar categoría (mediana de categoría) o mínimo 1 unidad/día para perecibles rotación alta

---

### 3) Reposición

#### Variables
- `D = demanda_diaria_estimada`
- `LT = lead_time_dias`
- `SS = stock_seguridad`
- `Stock = stock_actual`

#### Fórmulas
- `demanda_durante_LT = D * LT`
- `punto_reposicion = demanda_durante_LT + SS`
- `stock_objetivo = D * (LT + cobertura_objetivo_dias) + SS`
- `cantidad_sugerida = max(0, stock_objetivo - Stock)`
- `dias_cobertura = Stock / max(D, 0.1)`

#### Definición de stock de seguridad (simple y robusta)
- `SS = D * buffer_dias`
- `buffer_dias` depende del slider:
  - Evitar quiebres: 3 días
  - Balanceado: 2 días
  - No inmovilizar plata: 1 día

#### Fecha límite para pedir
- `fecha_quiebre_estimada = hoy + dias_cobertura`
- `fecha_limite_pedir = fecha_quiebre_estimada - LT`

---

### 4) Merma

#### Caso A: con fecha de vencimiento
- Para cada lote/producto:
  - `venta_esperada_hasta_vencimiento = D * dias_hasta_vencer`
  - `exceso = stock_lote - venta_esperada_hasta_vencimiento`
- Si `exceso > 0` => riesgo de merma

#### Caso B: sin fecha de vencimiento
Usar vida útil por categoría:
- `venta_esperada_vida_util = D * vida_util_dias`
- `exceso = Stock - venta_esperada_vida_util`
- Si `exceso > 0` => riesgo de merma por sobrestock

#### Sugerencias automáticas
- Exceso bajo: `activar descuento suave (5%–10%)`
- Exceso medio: `combo o 2x`
- Exceso alto: `reducir próxima compra + promo agresiva`

---

### 5) Confianza (Alta / Media / Baja)

Puntaje sugerido (0–100):
- Datos (días disponibles):
  - ≥56 días: +40
  - 28–55: +30
  - 14–27: +20
  - <14: +10
- Variabilidad (coeficiente variación, CV):
  - CV < 0.5: +30
  - 0.5–1.0: +20
  - >1.0: +10
- Calidad de datos (faltantes/duplicados):
  - <2% errores: +30
  - 2%–10%: +20
  - >10%: +10

Mapeo:
- 80–100 = **Alta**
- 50–79 = **Media**
- <50 = **Baja**

**Default opinado:** mostrar confianza en cada tarjeta evita decisiones ciegas.

---

## D) Reglas de personalización (desde onboarding)

### 1) Según tipo de negocio

#### Restaurante
- Lead time default: 1–2 días
- Umbral quiebre: alerta si cobertura < 3 días
- Perecibles más sensibles (pan, lácteos, verduras, carnes)
- Cadencia sugerida: compra 3–6 veces por semana

#### Almacén / minimarket
- Lead time default: 3–5 días
- Umbral quiebre: alerta si cobertura < 5 días
- No perecibles relevantes (arroz, fideos, limpieza)
- Cadencia sugerida: compra 1–3 veces por semana

#### Farmacia
- Lead time default: 3–5 días
- Umbral quiebre: cobertura < 7 días en productos críticos
- Cadencia sugerida: compra 1–2 veces por semana

#### Ropa
- Lead time default: 7+ días
- Umbral quiebre: cobertura < 14 días
- Merma menos por vencimiento, más por baja rotación

**Default opinado:** presets por rubro aceleran onboarding y mejoran recomendaciones desde día 1.

---

### 2) Según ubicación en Chile (sin APIs externas)
- Uso solo contextual (sin clima ni tráfico externo).
- Ejemplo de ajuste manual sugerido:
  - comunas con alta congestión logística: sugerir +1 día al lead time
  - zonas más aisladas: sugerir +2 días

Texto UI:
- `Ajustamos una recomendación inicial según tu comuna. Puedes editarla cuando quieras.`

---

### 3) Según volumen semanal
- **Bajo:** buffer más conservador en plata (1–2 días)
- **Medio:** balanceado (2 días)
- **Alto:** priorizar continuidad operacional (2–3 días)

---

### 4) Presets concretos

#### Lead time típico
- Rápido: 1–2 días
- Medio: 3–5 días
- Largo: 7+ días

#### Umbrales de alertas
- **Alerta Alta:** cobertura < lead time
- **Alerta Media:** cobertura entre lead time y lead time + 2 días
- **Alerta Baja:** cobertura > lead time + 2 días

#### Vida útil por categoría (si no hay vencimiento)
- Lácteos: 10 días
- Pan: 2 días
- Verduras: 5 días
- Carnes: 4 días
- Embutidos: 12 días
- Bebidas: 90 días
- Limpieza: 365 días

#### Cadencia sugerida de compra
- Restaurante: 4 veces por semana
- Minimarket: 2 veces por semana
- Almacén pequeño: 2 veces por semana
- Farmacia: 2 veces por semana
- Ropa: 1 vez por semana

---

## E) Plantillas de salida (tarjetas en español, formato estructurado)

### 1) Plantilla — Alerta de reposición
```json
{
  "title": "Reponer: {producto}",
  "severity": "Alta|Media|Baja",
  "recommended_action": "Pide {cantidad_sugerida} {unidad} de {producto} antes del {fecha_limite} para no quedar sin stock.",
  "key_numbers": {
    "stock_actual": "{n} {unidad}",
    "demanda_diaria_estimada": "{n} {unidad}/día",
    "dias_cobertura": "{n} días",
    "fecha_quiebre_estimada": "{fecha}",
    "cantidad_sugerida": "{n} {unidad}"
  },
  "confidence": "Alta|Media|Baja",
  "explanation": "Tus ventas recientes y el tiempo de entrega del proveedor muestran que te puedes quedar sin stock pronto."
}
```

---

### 2) Plantilla — Riesgo de merma
```json
{
  "title": "Riesgo de merma: {producto}",
  "severity": "Alta|Media|Baja",
  "recommended_action": "Hay riesgo de merma de ~{unidades_riesgo} {unidad}. {accion_sugerida}",
  "key_numbers": {
    "stock_actual": "{n} {unidad}",
    "venta_esperada": "{n} {unidad}",
    "unidades_en_riesgo": "{n} {unidad}",
    "fecha_vencimiento_o_vida_util": "{fecha|n días}"
  },
  "confidence": "Alta|Media|Baja",
  "explanation": "Si las ventas siguen al ritmo actual, parte del stock no se alcanzará a vender a tiempo."
}
```

---

### 3) Plantilla — Pronóstico de demanda
```json
{
  "title": "Demanda próxima: {producto}",
  "severity": "Alta|Media|Baja",
  "recommended_action": "Prepárate para vender ~{demanda_7d} {unidad} en los próximos 7 días. Ajusta tu compra hoy.",
  "key_numbers": {
    "demanda_7_dias": "{n} {unidad}",
    "demanda_14_dias": "{n} {unidad}",
    "dia_mas_movid": "{dia_semana}",
    "variacion_vs_semana_pasada": "{+/-n}%"
  },
  "confidence": "Alta|Media|Baja",
  "explanation": "Calculamos este pronóstico con tus ventas recientes y, cuando alcanza, con patrón por día de semana."
}
```

---

### 4) Ejemplos de texto final (listos para UI)
- `Pide 12 unidades de Leche Entera antes del miércoles para no quedarte sin stock.`
- `Hay riesgo de merma: te van a sobrar ~8 yogures si las ventas siguen igual. Activa combo 2x$2.500 hoy.`
- `El viernes suele moverse más bebida. Considera subir tu pedido en 15%.`

---

## F) Plan técnico de implementación (MVP)

### 1) Stack recomendado
**Opción elegida: A) Next.js + API Route + TypeScript**

**Justificación breve (opinado):** un solo proyecto para frontend + lógica de cálculo, rápido de desplegar y fácil de mantener para MVP sin auth.

---

### 2) Almacenamiento (sin auth)
- `localStorage` para:
  - perfil onboarding
  - datasets normalizados
  - configuración slider/presets
  - historial de última corrida
- Exportar/importar perfil JSON:
  - Botones: `Exportar respaldo` / `Importar respaldo`

Formato sugerido:
```json
{
  "profile": {"tipo_negocio":"minimarket","ubicacion":"Santiago, Ñuñoa","volumen":"medio"},
  "settings": {"bias":"balanceado"},
  "data": {"ventas":[],"inventario":[],"productos":[]},
  "updated_at":"2026-03-01T10:30:00Z"
}
```

---

### 3) Parsing CSV

#### Reglas
- Detección de separador: `,` `;` `\t`
- Parseo de fechas:
  - DD-MM-AAAA
  - AAAA-MM-DD
- Normalización de números:
  - aceptar `1.000`, `1000`, `1,5` (convertir a decimal interno)

#### Mapeo de columnas
- Interfaz de mapeo manual asistida por sugerencias (`fecha`, `producto`, `cantidad`, etc.)

#### Validaciones
- Campos obligatorios presentes
- Fechas parseables
- cantidades >= 0
- detección de duplicados exactos

---

### 4) Módulos
- `parser/`
  - ingestión CSV/tabla pegada
- `normalizer/`
  - nombres producto (trim, minúsculas internas, alias)
- `forecast-engine/`
  - promedio móvil + factor día de semana + fallback
- `replenishment-engine/`
  - punto reposición, cobertura, cantidad sugerida
- `waste-engine/`
  - riesgo por vencimiento / vida útil
- `card-generator/`
  - plantillas + redacción en español simple
- `formatters/`
  - CLP: `$12.990`

---

### 5) Tests (mínimo ejecutable)
- Unit tests parser:
  - separadores
  - fechas válidas
  - columnas faltantes
- Unit tests motor:
  - cálculo demanda base
  - punto de reposición
  - días de cobertura
  - merma con/sin vencimiento
- Snapshot tests tarjetas:
  - texto en español simple
  - formato CLP correcto

---

### 6) Datasets de ejemplo (inline, CSV corto)

#### Dataset 1 — Restaurante

**ventas_restaurante.csv**
```csv
fecha_venta,producto,cantidad_vendida,precio_unitario_clp,ingresos_clp
2026-02-20,Pollo Entero,8,6990,55920
2026-02-20,Papas Prefritas 1kg,6,2590,15540
2026-02-20,Bebida Cola 1.5L,10,1790,17900
2026-02-20,Leche Entera 1L,5,1290,6450
2026-02-20,Pan Hallulla,40,120,4800
2026-02-21,Pollo Entero,9,6990,62910
2026-02-21,Papas Prefritas 1kg,7,2590,18130
2026-02-21,Bebida Cola 1.5L,12,1790,21480
2026-02-21,Leche Entera 1L,4,1290,5160
2026-02-21,Pan Hallulla,45,120,5400
2026-02-22,Pollo Entero,7,6990,48930
2026-02-22,Papas Prefritas 1kg,5,2590,12950
2026-02-22,Bebida Cola 1.5L,9,1790,16110
2026-02-22,Leche Entera 1L,6,1290,7740
2026-02-22,Pan Hallulla,38,120,4560
```

**inventario_restaurante.csv**
```csv
producto,stock_actual,unidad,fecha_vencimiento,categoria,vida_util_dias,lead_time_dias,pack_size,proveedor
Pollo Entero,18,unidad,2026-02-28,carnes,4,2,1,Avícola Sur
Papas Prefritas 1kg,20,unidad,2026-06-30,congelados,120,3,10,Distribuidora Andes
Bebida Cola 1.5L,30,unidad,2026-12-31,bebidas,180,3,12,Bebidas Chile
Leche Entera 1L,16,unidad,2026-03-05,lácteos,10,2,12,Lácteos del Valle
Pan Hallulla,70,unidad,2026-02-24,pan,2,1,50,Panadería Central
```

---

#### Dataset 2 — Minimarket

**ventas_minimarket.csv**
```csv
fecha_venta,producto,cantidad_vendida,precio_unitario_clp,ingresos_clp
2026-02-20,Coca-Cola 1.5L,14,1890,26460
2026-02-20,Arroz Grado 1 1kg,11,1490,16390
2026-02-20,Fideos Spaghetti 400g,13,990,12870
2026-02-20,Detergente Líquido 3L,4,5490,21960
2026-02-20,Yogurt Frutilla 125g,18,450,8100
2026-02-21,Coca-Cola 1.5L,16,1890,30240
2026-02-21,Arroz Grado 1 1kg,12,1490,17880
2026-02-21,Fideos Spaghetti 400g,15,990,14850
2026-02-21,Detergente Líquido 3L,3,5490,16470
2026-02-21,Yogurt Frutilla 125g,20,450,9000
2026-02-22,Coca-Cola 1.5L,12,1890,22680
2026-02-22,Arroz Grado 1 1kg,10,1490,14900
2026-02-22,Fideos Spaghetti 400g,14,990,13860
2026-02-22,Detergente Líquido 3L,5,5490,27450
2026-02-22,Yogurt Frutilla 125g,17,450,7650
```

**inventario_minimarket.csv**
```csv
producto,stock_actual,unidad,fecha_vencimiento,categoria,vida_util_dias,lead_time_dias,pack_size,proveedor
Coca-Cola 1.5L,40,unidad,2026-11-30,bebidas,180,3,12,CCU Distribución
Arroz Grado 1 1kg,55,unidad,,abarrotes,365,4,10,Mayorista Centro
Fideos Spaghetti 400g,60,unidad,,abarrotes,365,4,20,Pastas Chile
Detergente Líquido 3L,22,unidad,,limpieza,365,5,6,Higiene Hogar SPA
Yogurt Frutilla 125g,35,unidad,2026-03-06,lácteos,12,2,24,Lácteos del Sur
```

---

## G) Criterios de aceptación (definición de “listo”)

### 1) Onboarding (pass/fail)
- **PASS** si obliga 3 preguntas clave antes de continuar.
- **PASS** si guarda respuestas en localStorage.
- **FAIL** si deja avanzar sin tipo de negocio, ubicación o volumen.

### 2) Importación (pass/fail)
- **PASS** si acepta CSV, pegado de tabla e ingreso manual.
- **PASS** si detecta separador automáticamente.
- **FAIL** si no permite mapear columnas manualmente.

### 3) Validación (pass/fail)
- **PASS** si detecta fechas inválidas, duplicados y faltantes obligatorios.
- **PASS** si muestra mensaje claro en español simple.
- **FAIL** si solo muestra errores técnicos.

### 4) Dashboard (pass/fail)
- **PASS** si muestra 3 bloques: Prioridades de hoy, Ojo esta semana, Próxima semana.
- **PASS** si cada tarjeta incluye qué pasa, por qué importa, qué hacer ahora y confianza.
- **FAIL** si entrega solo gráficos sin acción concreta.

### 5) Exactitud de reposición (coherente y explicable)
- **PASS** si cada recomendación trae números trazables: demanda estimada, cobertura, fecha límite, cantidad sugerida.
- **FAIL** si no se puede explicar de dónde salió una recomendación.

### 6) Merma (explicable y accionable)
- **PASS** si detecta riesgo con vencimiento o vida útil, y propone acción concreta.
- **FAIL** si alerta merma sin sugerencia práctica.

### 7) Calidad del lenguaje (español claro + CLP)
- **PASS** si todo texto está en español claro (es-CL), sin jerga innecesaria.
- **PASS** si moneda siempre en formato CLP local (`$1.990`, `$12.500`, `$250.000`).
- **FAIL** si mezcla formatos de moneda o usa lenguaje técnico sin explicación.

---

### Cierre de alcance MVP
Este MVP de **ONYX Bodega** prioriza utilidad inmediata: recomendaciones claras, confiables y accionables para decidir compras hoy, sin complejidad técnica ni dependencia de integración externa en v1.
