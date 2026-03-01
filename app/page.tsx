'use client';

import { useMemo, useState } from 'react';

type Severity = 'Alta' | 'Media' | 'Baja';
type Confidence = Severity;

type SalesRow = {
  fecha_venta: Date;
  producto: string;
  cantidad_vendida: number;
  precio_unitario_clp?: number;
  ingresos_clp?: number;
};

type InventoryRow = {
  producto: string;
  stock_actual: number;
  unidad: string;
  fecha_vencimiento?: Date;
  categoria?: string;
  vida_util_dias?: number;
  lead_time_dias?: number;
  pack_size?: number;
  proveedor?: string;
};

type Card = {
  title: string;
  severity: Severity;
  recommended_action: string;
  key_numbers: Record<string, string>;
  confidence: Confidence;
  explanation: string;
};

type Onboarding = {
  tipoNegocio: 'restaurante' | 'almacen' | 'minimarket' | 'farmacia' | 'ropa' | 'otro';
  ubicacion: string;
  volumen: 'bajo' | 'medio' | 'alto';
};

type ParseResult<T> = {
  rows: T[];
  errors: string[];
};

const DATASET_RESTAURANTE_VENTAS = `fecha_venta,producto,cantidad_vendida,precio_unitario_clp,ingresos_clp
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
2026-02-22,Pan Hallulla,38,120,4560`;

const DATASET_RESTAURANTE_INV = `producto,stock_actual,unidad,fecha_vencimiento,categoria,vida_util_dias,lead_time_dias,pack_size,proveedor
Pollo Entero,18,unidad,2026-02-28,carnes,4,2,1,Avícola Sur
Papas Prefritas 1kg,20,unidad,2026-06-30,congelados,120,3,10,Distribuidora Andes
Bebida Cola 1.5L,30,unidad,2026-12-31,bebidas,180,3,12,Bebidas Chile
Leche Entera 1L,16,unidad,2026-03-05,lácteos,10,2,12,Lácteos del Valle
Pan Hallulla,70,unidad,2026-02-24,pan,2,1,50,Panadería Central`;

const DATASET_MINI_VENTAS = `fecha_venta,producto,cantidad_vendida,precio_unitario_clp,ingresos_clp
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
2026-02-22,Yogurt Frutilla 125g,17,450,7650`;

const DATASET_MINI_INV = `producto,stock_actual,unidad,fecha_vencimiento,categoria,vida_util_dias,lead_time_dias,pack_size,proveedor
Coca-Cola 1.5L,40,unidad,2026-11-30,bebidas,180,3,12,CCU Distribución
Arroz Grado 1 1kg,55,unidad,,abarrotes,365,4,10,Mayorista Centro
Fideos Spaghetti 400g,60,unidad,,abarrotes,365,4,20,Pastas Chile
Detergente Líquido 3L,22,unidad,,limpieza,365,5,6,Higiene Hogar SPA
Yogurt Frutilla 125g,35,unidad,2026-03-06,lácteos,12,2,24,Lácteos del Sur`;

const CATEGORIA_VIDA_UTIL: Record<string, number> = {
  'lácteos': 10,
  pan: 2,
  verduras: 5,
  carnes: 4,
  embutidos: 12,
  bebidas: 90,
  limpieza: 365,
  abarrotes: 365
};

function formatCLP(value: number): string {
  return `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function parseNumber(raw: string): number | null {
  if (!raw?.trim()) return null;
  const cleaned = raw.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseDate(raw: string): Date | null {
  const value = raw?.trim();
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(`${value}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split('-');
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function detectSeparator(text: string): string {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) || '';
  const score = [',', ';', '\t'].map((sep) => ({ sep, count: firstLine.split(sep).length }));
  return score.sort((a, b) => b.count - a.count)[0]?.sep || ',';
}

function parseDelimited(text: string): { headers: string[]; rows: string[][] } {
  const sep = detectSeparator(text);
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(sep).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split(sep).map((v) => v.trim()));
  return { headers, rows };
}

function parseSalesCsv(text: string): ParseResult<SalesRow> {
  const errors: string[] = [];
  const { headers, rows } = parseDelimited(text);
  const index = (name: string) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const iFecha = index('fecha_venta');
  const iProd = index('producto');
  const iCant = index('cantidad_vendida');
  const iPrecio = index('precio_unitario_clp');
  const iIngresos = index('ingresos_clp');

  if (iFecha < 0 || iProd < 0 || iCant < 0) {
    errors.push('Faltan columnas obligatorias en ventas: fecha_venta, producto, cantidad_vendida.');
    return { rows: [], errors };
  }

  const parsed: SalesRow[] = [];
  rows.forEach((r, idx) => {
    const fecha = parseDate(r[iFecha] || '');
    const producto = (r[iProd] || '').trim();
    const cantidad = parseNumber(r[iCant] || '');
    if (!fecha) errors.push(`Fila ${idx + 2}: fecha inválida.`);
    if (!producto) errors.push(`Fila ${idx + 2}: producto vacío.`);
    if (cantidad === null || cantidad < 0) errors.push(`Fila ${idx + 2}: cantidad_vendida inválida.`);

    if (fecha && producto && cantidad !== null && cantidad >= 0) {
      parsed.push({
        fecha_venta: fecha,
        producto,
        cantidad_vendida: cantidad,
        precio_unitario_clp: iPrecio >= 0 ? parseNumber(r[iPrecio] || '') || undefined : undefined,
        ingresos_clp: iIngresos >= 0 ? parseNumber(r[iIngresos] || '') || undefined : undefined
      });
    }
  });

  return { rows: parsed, errors };
}

function parseInventoryCsv(text: string): ParseResult<InventoryRow> {
  const errors: string[] = [];
  const { headers, rows } = parseDelimited(text);
  const index = (name: string) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const iProd = index('producto');
  const iStock = index('stock_actual');
  const iUnidad = index('unidad');

  if (iProd < 0 || iStock < 0 || iUnidad < 0) {
    errors.push('Faltan columnas obligatorias en inventario: producto, stock_actual, unidad.');
    return { rows: [], errors };
  }

  const iVenc = index('fecha_vencimiento');
  const iCat = index('categoria');
  const iVida = index('vida_util_dias');
  const iLead = index('lead_time_dias');
  const iPack = index('pack_size');
  const iProv = index('proveedor');

  const parsed: InventoryRow[] = [];
  rows.forEach((r, idx) => {
    const producto = (r[iProd] || '').trim();
    const stock = parseNumber(r[iStock] || '');
    const unidad = (r[iUnidad] || 'unidad').trim() || 'unidad';

    if (!producto) errors.push(`Fila ${idx + 2}: producto vacío.`);
    if (stock === null || stock < 0) errors.push(`Fila ${idx + 2}: stock_actual inválido.`);

    if (producto && stock !== null && stock >= 0) {
      parsed.push({
        producto,
        stock_actual: stock,
        unidad,
        fecha_vencimiento: iVenc >= 0 ? parseDate(r[iVenc] || '') || undefined : undefined,
        categoria: iCat >= 0 ? (r[iCat] || '').trim().toLowerCase() || undefined : undefined,
        vida_util_dias: iVida >= 0 ? parseNumber(r[iVida] || '') || undefined : undefined,
        lead_time_dias: iLead >= 0 ? parseNumber(r[iLead] || '') || undefined : undefined,
        pack_size: iPack >= 0 ? parseNumber(r[iPack] || '') || undefined : undefined,
        proveedor: iProv >= 0 ? (r[iProv] || '').trim() || undefined : undefined
      });
    }
  });

  return { rows: parsed, errors };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map((v) => (v - mean) ** 2)));
}

function getLeadTimeDefault(tipo: Onboarding['tipoNegocio']): number {
  if (tipo === 'restaurante') return 2;
  if (tipo === 'minimarket' || tipo === 'almacen' || tipo === 'farmacia') return 4;
  if (tipo === 'ropa') return 7;
  return 3;
}

function getCoverageGoal(volumen: Onboarding['volumen']): number {
  if (volumen === 'alto') return 7;
  if (volumen === 'medio') return 6;
  return 5;
}

function getBufferDays(slider: number): number {
  if (slider < 34) return 3;
  if (slider < 67) return 2;
  return 1;
}

function confidenceFrom(days: number, cv: number, errorRate: number): Confidence {
  let score = 0;
  score += days >= 56 ? 40 : days >= 28 ? 30 : days >= 14 ? 20 : 10;
  score += cv < 0.5 ? 30 : cv <= 1 ? 20 : 10;
  score += errorRate < 0.02 ? 30 : errorRate <= 0.1 ? 20 : 10;
  if (score >= 80) return 'Alta';
  if (score >= 50) return 'Media';
  return 'Baja';
}

function severityFromCoverage(coverage: number, leadTime: number): Severity {
  if (coverage < leadTime) return 'Alta';
  if (coverage < leadTime + 2) return 'Media';
  return 'Baja';
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function keyDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildInsights(sales: SalesRow[], inventory: InventoryRow[], onboarding: Onboarding, slider: number, errorRate: number) {
  const invMap = new Map(inventory.map((row) => [row.producto.toLowerCase(), row]));
  const products = new Set<string>();
  sales.forEach((s) => products.add(s.producto));
  inventory.forEach((i) => products.add(i.producto));

  const byProduct = new Map<string, SalesRow[]>();
  sales.forEach((s) => {
    const arr = byProduct.get(s.producto) || [];
    arr.push(s);
    byProduct.set(s.producto, arr);
  });

  const now = new Date();
  const reorderCards: Card[] = [];
  const wasteCards: Card[] = [];
  const forecastCards: Card[] = [];

  products.forEach((product) => {
    const rows = byProduct.get(product) || [];
    const dailyMap = new Map<string, number>();
    rows.forEach((r) => {
      const k = keyDate(r.fecha_venta);
      dailyMap.set(k, (dailyMap.get(k) || 0) + r.cantidad_vendida);
    });

    const dates = rows.map((r) => r.fecha_venta.getTime()).sort((a, b) => a - b);
    const spanDays = dates.length ? Math.max(1, Math.floor((dates[dates.length - 1] - dates[0]) / 86400000) + 1) : 1;

    const windowDays = Math.min(28, Math.max(7, spanDays));
    const series: number[] = [];
    for (let i = windowDays - 1; i >= 0; i -= 1) {
      const d = addDays(now, -i);
      series.push(dailyMap.get(keyDate(d)) || 0);
    }

    let demand = average(series);
    if (demand <= 0) demand = 1;

    const cv = stddev(series) / Math.max(demand, 0.1);
    const confidence = confidenceFrom(spanDays, cv, errorRate);

    const inv = invMap.get(product.toLowerCase());
    const stock = inv?.stock_actual ?? 0;
    const unidad = inv?.unidad || 'unidad';
    const leadTime = inv?.lead_time_dias || getLeadTimeDefault(onboarding.tipoNegocio);
    const coverageGoal = getCoverageGoal(onboarding.volumen);
    const bufferDays = getBufferDays(slider);
    const stockSeguridad = demand * bufferDays;
    const stockObjetivo = demand * (leadTime + coverageGoal) + stockSeguridad;
    const cantidadSugerida = Math.max(0, Math.ceil(stockObjetivo - stock));
    const cobertura = stock / Math.max(demand, 0.1);
    const fechaQuiebre = addDays(now, Math.floor(cobertura));
    const fechaLimite = addDays(fechaQuiebre, -Math.ceil(leadTime));

    const sev = severityFromCoverage(cobertura, leadTime);

    if (cantidadSugerida > 0) {
      reorderCards.push({
        title: `Reponer: ${product}`,
        severity: sev,
        recommended_action: `Pide ${cantidadSugerida} ${unidad} de ${product} antes del ${formatDate(fechaLimite)} para no quedarte sin stock.`,
        key_numbers: {
          'Stock actual': `${stock.toFixed(0)} ${unidad}`,
          'Demanda diaria': `${demand.toFixed(1)} ${unidad}/día`,
          'Días de cobertura': `${cobertura.toFixed(1)} días`,
          'Fecha de quiebre': formatDate(fechaQuiebre)
        },
        confidence,
        explanation: 'Se calculó con ventas recientes, lead time y stock de seguridad según tu estrategia.'
      });
    }

    const cat = inv?.categoria || '';
    const vidaUtil = inv?.vida_util_dias || CATEGORIA_VIDA_UTIL[cat] || 30;
    let diasLimite = vidaUtil;
    if (inv?.fecha_vencimiento) diasLimite = daysBetween(now, inv.fecha_vencimiento);
    const ventaEsperada = demand * diasLimite;
    const riesgo = Math.max(0, stock - ventaEsperada);
    const wasteSeverity: Severity = riesgo > demand * 3 ? 'Alta' : riesgo > demand ? 'Media' : 'Baja';

    if (riesgo > 0) {
      const accion = riesgo > demand * 3 ? 'Haz promo agresiva y reduce tu próxima compra.' : 'Activa descuento o combo esta semana.';
      wasteCards.push({
        title: `Riesgo de merma: ${product}`,
        severity: wasteSeverity,
        recommended_action: `Te podrían sobrar ~${Math.round(riesgo)} ${unidad}. ${accion}`,
        key_numbers: {
          'Stock actual': `${stock.toFixed(0)} ${unidad}`,
          'Venta esperada': `${Math.round(ventaEsperada)} ${unidad}`,
          'Unidades en riesgo': `${Math.round(riesgo)} ${unidad}`,
          'Límite': inv?.fecha_vencimiento ? formatDate(inv.fecha_vencimiento) : `${vidaUtil} días`
        },
        confidence,
        explanation: 'Comparando tu stock con lo que deberías vender antes del vencimiento/vida útil.'
      });
    }

    forecastCards.push({
      title: `Demanda próxima: ${product}`,
      severity: demand > average(series.slice(0, Math.max(1, series.length - 7))) * 1.15 ? 'Alta' : 'Media',
      recommended_action: `Prepárate para vender ~${Math.round(demand * 7)} ${unidad} en los próximos 7 días. Ajusta tu compra hoy.`,
      key_numbers: {
        'Demanda 7 días': `${Math.round(demand * 7)} ${unidad}`,
        'Demanda 14 días': `${Math.round(demand * 14)} ${unidad}`,
        'Demanda diaria': `${demand.toFixed(1)} ${unidad}/día`
      },
      confidence,
      explanation: 'Estimación por promedio móvil reciente con fallback para pocos datos.'
    });
  });

  const totalCompra = reorderCards.reduce((acc, card) => {
    const match = card.recommended_action.match(/Pide (\d+)/);
    const qty = match ? Number(match[1]) : 0;
    return acc + qty * 1500;
  }, 0);

  const totalMerma = wasteCards.reduce((acc, card) => {
    const match = card.recommended_action.match(/~(\d+)/);
    const qty = match ? Number(match[1]) : 0;
    return acc + qty * 900;
  }, 0);

  return {
    reorderCards: reorderCards.sort((a, b) => (a.severity < b.severity ? 1 : -1)).slice(0, 5),
    wasteCards: wasteCards.sort((a, b) => (a.severity < b.severity ? 1 : -1)).slice(0, 5),
    forecastCards: forecastCards.slice(0, 5),
    metrics: {
      totalCompra,
      totalMerma
    }
  };
}

function Badge({ children, tone }: { children: string; tone: 'high' | 'medium' | 'low' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function toneFromSeverity(severity: Severity): 'high' | 'medium' | 'low' {
  if (severity === 'Alta') return 'high';
  if (severity === 'Media') return 'medium';
  return 'low';
}

function CardView({ card }: { card: Card }) {
  return (
    <article className="card">
      <div className="card-head">
        <h3>{card.title}</h3>
        <Badge tone={toneFromSeverity(card.severity)}>{card.severity}</Badge>
      </div>
      <p>
        <strong>Qué hacer ahora:</strong> {card.recommended_action}
      </p>
      <ul className="numbers">
        {Object.entries(card.key_numbers).map(([k, v]) => (
          <li key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </li>
        ))}
      </ul>
      <p className="hint">{card.explanation}</p>
      <div className="card-footer">
        <span>Confianza</span>
        <Badge tone={toneFromSeverity(card.confidence)}>{card.confidence}</Badge>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [onboarding, setOnboarding] = useState<Onboarding>({
    tipoNegocio: 'minimarket',
    ubicacion: 'Santiago, Ñuñoa',
    volumen: 'medio'
  });
  const [strategy, setStrategy] = useState(35);
  const [ventasCsv, setVentasCsv] = useState(DATASET_MINI_VENTAS);
  const [invCsv, setInvCsv] = useState(DATASET_MINI_INV);
  const [messages, setMessages] = useState<string[]>([]);
  const [parsed, setParsed] = useState<{ sales: SalesRow[]; inv: InventoryRow[] }>({ sales: [], inv: [] });

  const insights = useMemo(() => {
    const totalRows = parsed.sales.length + parsed.inv.length;
    const errorRate = messages.length > 0 ? messages.length / Math.max(totalRows + messages.length, 1) : 0;
    return buildInsights(parsed.sales, parsed.inv, onboarding, strategy, errorRate);
  }, [parsed, onboarding, strategy, messages]);

  const runAnalysis = () => {
    const sales = parseSalesCsv(ventasCsv);
    const inv = parseInventoryCsv(invCsv);
    const errors = [...sales.errors, ...inv.errors];
    setMessages(errors.length ? errors : ['Datos cargados correctamente.']);
    setParsed({ sales: sales.rows, inv: inv.rows });
  };

  return (
    <main className="container">
      <header className="hero">
        <div>
          <p className="eyebrow">ONYX Bodega · MVP funcional</p>
          <h1>Evita quiebres y baja merma con recomendaciones accionables</h1>
          <p className="lead">Carga ventas + inventario en CSV y obtén acciones concretas con confianza Alta/Media/Baja.</p>
        </div>
      </header>

      <section className="section split">
        <article className="panel">
          <h3>Onboarding</h3>
          <div className="form-grid">
            <label>
              Tipo de negocio
              <select
                value={onboarding.tipoNegocio}
                onChange={(e) => setOnboarding((v) => ({ ...v, tipoNegocio: e.target.value as Onboarding['tipoNegocio'] }))}
              >
                <option value="restaurante">Restaurante</option>
                <option value="almacen">Almacén</option>
                <option value="minimarket">Minimarket</option>
                <option value="farmacia">Farmacia</option>
                <option value="ropa">Ropa</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <label>
              Ubicación
              <input value={onboarding.ubicacion} onChange={(e) => setOnboarding((v) => ({ ...v, ubicacion: e.target.value }))} />
            </label>
            <label>
              Volumen semanal
              <select
                value={onboarding.volumen}
                onChange={(e) => setOnboarding((v) => ({ ...v, volumen: e.target.value as Onboarding['volumen'] }))}
              >
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </label>
          </div>
          <p className="slider-label">
            <span>Evitar quiebres</span>
            <span>No inmovilizar plata</span>
          </p>
          <input type="range" min={0} max={100} value={strategy} onChange={(e) => setStrategy(Number(e.target.value))} />
        </article>

        <article className="panel">
          <h3>Importar datos</h3>
          <div className="hero-actions">
            <button className="btn btn-secondary" type="button" onClick={() => { setVentasCsv(DATASET_RESTAURANTE_VENTAS); setInvCsv(DATASET_RESTAURANTE_INV); }}>
              Cargar ejemplo restaurante
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => { setVentasCsv(DATASET_MINI_VENTAS); setInvCsv(DATASET_MINI_INV); }}>
              Cargar ejemplo minimarket
            </button>
            <button className="btn btn-primary" type="button" onClick={runAnalysis}>
              Analizar ahora
            </button>
          </div>
          <label>
            ventas.csv
            <textarea value={ventasCsv} onChange={(e) => setVentasCsv(e.target.value)} rows={8} />
          </label>
          <label>
            inventario.csv
            <textarea value={invCsv} onChange={(e) => setInvCsv(e.target.value)} rows={8} />
          </label>
          <ul className="messages">
            {messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid three">
        <article className="stat">
          <p className="stat-label">Prioridades de hoy</p>
          <p className="stat-value">{insights.reorderCards.length + insights.wasteCards.length}</p>
          <p className="stat-note">Top acciones accionables</p>
        </article>
        <article className="stat">
          <p className="stat-label">Compra sugerida</p>
          <p className="stat-value">{formatCLP(insights.metrics.totalCompra)}</p>
          <p className="stat-note">Estimado para evitar quiebres</p>
        </article>
        <article className="stat">
          <p className="stat-label">Merma en riesgo</p>
          <p className="stat-value">{formatCLP(insights.metrics.totalMerma)}</p>
          <p className="stat-note">Si no ajustas promociones/compra</p>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Prioridades de hoy (Reposición)</h2>
        </div>
        <div className="cards">{insights.reorderCards.length ? insights.reorderCards.map((c) => <CardView key={c.title} card={c} />) : <p className="hint">No hay alertas de reposición por ahora.</p>}</div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Ojo esta semana (Merma)</h2>
        </div>
        <div className="cards">{insights.wasteCards.length ? insights.wasteCards.map((c) => <CardView key={c.title} card={c} />) : <p className="hint">Sin riesgo de merma relevante con los datos actuales.</p>}</div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Próxima semana (Pronóstico)</h2>
        </div>
        <div className="cards">{insights.forecastCards.map((c) => <CardView key={c.title} card={c} />)}</div>
      </section>
    </main>
  );
}
