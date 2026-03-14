export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        width: '100%',
        borderTop: '1px solid var(--ctz-border)',
        background: 'var(--ctz-bg-secondary)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Legal — left */}
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'var(--ctz-text-muted)',
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          © {year} Shippar Global Logistics S.R.L. — Todos los derechos reservados
        </p>

        {/* Tagline — right */}
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'var(--ctz-text-muted)',
            fontWeight: 500,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          Comercio sin fronteras
        </p>
      </div>
    </footer>
  );
}