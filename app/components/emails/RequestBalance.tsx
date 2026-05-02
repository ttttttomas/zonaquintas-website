import { Html, Head, Container, Text, Preview, Body, Section } from '@react-email/components';

interface NewBookingEmailProps {
  clientName: string;
  bankAccount: string;
  totalArs: number;
  totalUsd: number;
}

export default function RequestBalance({ 
  clientName, 
  bankAccount,
  totalArs,
  totalUsd,
}: NewBookingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nueva peticion de transferencia</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Text style={logoText}>Peticion de {clientName}</Text>
          </Section>
          <Section style={section}>
            <Text style={sectionText}>Montos a transferir:</Text>
            <Text style={sectionText}>
              Monto en ARS: {totalArs.toLocaleString('es-AR')}
            </Text>
            <Text style={sectionText}>
              Monto en USD: {totalUsd.toLocaleString('es-AR')}
            </Text>
          </Section>
          <Section style={sectionText}>
            <Text style={sectionText}>CBU o Alias: {bankAccount}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
