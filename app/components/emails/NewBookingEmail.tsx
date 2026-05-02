import { Html, Head, Container, Text, Preview, Body, Section, Button } from '@react-email/components';

interface NewBookingEmailProps {
  ownerName: string;
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  currency: string;
  message: string;
}

export default function NewBookingEmail({ 
  ownerName, 
  guestName, 
  propertyTitle, 
  checkIn, 
  checkOut, 
  guests, 
  total, 
  currency,
  message,
}: NewBookingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nueva reserva en {propertyTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Text style={logoText}>Nueva reserva recibida</Text>
          </Section>
          <Section style={section}>
            <Text style={sectionText}>Hola {ownerName},</Text>
            <Text style={sectionText}>
              Recibiste una nueva reserva para tu propiedad:
            </Text>
          </Section>
          <Section style={propertySection}>
            <Text style={propertyTitleText}>{propertyTitle}</Text>
            <Text style={datesText}>
              {checkIn} → {checkOut} ({guests} huésped{guests > 1 ? 's' : ''})
            </Text>
            <Text style={totalText}>
              Total: {currency} {total.toLocaleString('es-AR')}
            </Text>
            <Text style={messageText}>
              {message}
            </Text>
            <Text style={guestNameText}>{guestName}</Text>
          </Section>
          <Section style={actionSection}>
            <Button 
              // href={`https://zonaquintas.com/reservations`} // TODO: Cambiar URL
              href={`https://localhost:3000/reservations`}
              style={button}
            >
              Ver reserva
            </Button>
          </Section>
          <Text style={footer}>
            Este es un correo automático de ZonaQuintas. No respondas a este mensaje.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const guestNameText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#52565d',
};

const messageText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#52565d',
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
  maxWidth: '100%',
  backgroundColor: '#ffffff',
};

const logo = {
  padding: '40px 0',
  textAlign: 'center' as const,
};

const logoText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1d1c48',
};

const section = {
  padding: '24px',
};

const sectionText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#52565d',
};

const propertySection = {
  padding: '24px',
  backgroundColor: '#f8f9ff',
  borderRadius: '8px',
  margin: '16px 0',
  textAlign: 'center' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const propertyTitleText = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1d1c48',
  marginBottom: '8px',
};

const datesText = {
  fontSize: '16px',
  color: '#6b7280',
  marginBottom: '8px',
};

const totalText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#059669',
};

const actionSection = {
  padding: '24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#28A745',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
};

const footer = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  padding: '24px',
};
