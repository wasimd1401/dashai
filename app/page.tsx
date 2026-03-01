export default function HomePage() {
  return (
    <main style={{ maxWidth: 840, margin: '3rem auto', fontFamily: 'system-ui, sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>ONYX Bodega</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>
        App base desplegada correctamente en Vercel.
      </p>
      <p style={{ lineHeight: 1.6 }}>
        Si antes veías <strong>NOT_FOUND</strong>, era porque este repositorio no tenía una aplicación web ni rutas válidas.
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>Ruta activa: <code>/</code></li>
        <li>Framework detectado: <code>Next.js (App Router)</code></li>
      </ul>
    </main>
  );
}
