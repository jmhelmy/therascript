// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 100px)', // Adjust if you have a tall header
      textAlign: 'center',
      fontFamily: 'sans-serif',
      padding: '20px',
      color: '#334155', 
    }}>
      <h1 style={{
        fontSize: 'clamp(3rem, 10vw, 6rem)',
        fontWeight: 700,
        color: '#009DA3', // Your primary color
        margin: '0 0 0.5rem 0',
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '1rem',
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '1.125rem',
        marginBottom: '2rem',
        maxWidth: '400px',
        color: '#475569',
      }}>
        Oops! It seems the page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/" // Link to your homepage or dashboard
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          color: 'white',
          backgroundColor: '#009DA3',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#007c80')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#009DA3')}
      >
        Go Back Home
      </Link>
    </div>
  );
}