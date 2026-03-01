type Severity = 'Alta' | 'Media' | 'Baja';

type Priority = {
  title: string;
  severity: Severity;
  what: string;
  why: string;
  action: string;
  confidence: Severity;
};

const priorities: Priority[] = [
  {
    title: 'Reponer Leche Entera 1L',
    severity: 'Alta',
    what: 'Te quedan 2,1 días de stock.',
    why: 'Tu proveedor demora 2 días y podrías quebrarte el jueves.',
    action: 'Pide 12 unidades hoy antes de las 16:00.',
    confidence: 'Alta'
  },
  {
    title: 'Pan Hallulla con riesgo de merma',
    severity: 'Media',
    what: 'Te podrían sobrar ~18 unidades antes de mañana.',
    why: 'La vida útil es corta y la venta bajó 12% esta semana.',
    action: 'Activa promo 2x$500 desde las 18:00.',
    confidence: 'Media'
  },
  {
    title: 'Sube demanda de bebida el viernes',
    severity: 'Media',
    what: 'El viernes suele venderse +22% vs promedio diario.',
    why: 'Patrón repetido en tus últimas 6 semanas.',
    action: 'Suma 8 unidades extra en el próximo pedido.',
    confidence: 'Alta'
  }
];

function Badge({ children, tone = 'neutral' }: { children: string; tone?: 'neutral' | 'high' | 'medium' | 'low' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function InsightCard({ title, severity, what, why, action, confidence }: Priority) {
  const tone = severity === 'Alta' ? 'high' : severity === 'Media' ? 'medium' : 'low';
  const confidenceTone = confidence === 'Alta' ? 'high' : confidence === 'Media' ? 'medium' : 'low';

  return (
    <article className="card">
      <div className="card-head">
        <h3>{title}</h3>
        <Badge tone={tone}>{severity}</Badge>
      </div>

      <div className="card-content">
        <p>
          <strong>Qué está pasando:</strong> {what}
        </p>
        <p>
          <strong>Por qué importa:</strong> {why}
        </p>
        <p>
          <strong>Qué hacer ahora:</strong> {action}
        </p>
      </div>

      <div className="card-footer">
        <span>Confianza</span>
        <Badge tone={confidenceTone}>{confidence}</Badge>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="container">
      <header className="hero">
        <div>
          <p className="eyebrow">ONYX Bodega · MVP</p>
          <h1>Evita quiebres de stock y baja la merma sin enredos</h1>
          <p className="lead">
            Recomendaciones claras para decidir hoy: qué reponer, cuánto pedir y qué producto está en riesgo de merma.
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" className="btn btn-primary">
            Cargar CSV
          </button>
          <button type="button" className="btn btn-secondary">
            Pegar tabla
          </button>
          <button type="button" className="btn btn-ghost">
            Ingreso manual
          </button>
        </div>
      </header>

      <section className="grid three">
        <article className="stat">
          <p className="stat-label">Prioridades de hoy</p>
          <p className="stat-value">3 acciones</p>
          <p className="stat-note">1 urgente · 2 importantes</p>
        </article>

        <article className="stat">
          <p className="stat-label">Compra sugerida hoy</p>
          <p className="stat-value">$128.900</p>
          <p className="stat-note">Para cubrir próximos 7 días</p>
        </article>

        <article className="stat">
          <p className="stat-label">Merma estimada semanal</p>
          <p className="stat-value">$22.400</p>
          <p className="stat-note">Puede bajar con 2 promociones</p>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Prioridades de hoy</h2>
          <p>Estas son las recomendaciones más accionables ahora.</p>
        </div>

        <div className="cards">
          {priorities.map((item) => (
            <InsightCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="section split">
        <article className="panel">
          <h3>Onboarding rápido</h3>
          <ul>
            <li>
              <strong>Tipo de negocio:</strong> Minimarket
            </li>
            <li>
              <strong>Ubicación:</strong> Santiago, Ñuñoa
            </li>
            <li>
              <strong>Volumen semanal:</strong> Medio (201–800 ventas)
            </li>
          </ul>
          <p className="hint">Puedes ajustar lead time y estrategia cuando quieras.</p>
        </article>

        <article className="panel">
          <h3>Control de estrategia</h3>
          <p className="slider-label">
            <span>Evitar quiebres</span>
            <span>No inmovilizar plata</span>
          </p>
          <input aria-label="Balance de estrategia" type="range" min={0} max={100} defaultValue={35} />
          <p className="hint">Configuración actual: más cerca de evitar quiebres (stock de seguridad de 3 días).</p>
        </article>
      </section>
    </main>
  );
}
