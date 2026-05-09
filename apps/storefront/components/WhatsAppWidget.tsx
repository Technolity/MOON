'use client';

const WA_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? 'https://wa.me/';

export function WhatsAppWidget() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(0,0,0,0.28)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.20)';
      }}
    >
      {/* Official WhatsApp logo SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16 3C8.82 3 3 8.82 3 16c0 2.36.63 4.6 1.73 6.54L3 29l6.63-1.74A13.02 13.02 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 2c6.08 0 11 4.92 11 11s-4.92 11-11 11a10.97 10.97 0 0 1-5.57-1.51l-.4-.24-4.1 1.08 1.1-3.98-.26-.41A10.97 10.97 0 0 1 5 16C5 9.92 9.92 5 16 5zm-3.26 5.5c-.2 0-.52.07-.8.38-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.18 2.1 3.27 5.14 4.46.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.26-.7.26-1.3.18-1.43-.07-.12-.27-.2-.57-.34-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01z" />
      </svg>
    </a>
  );
}
