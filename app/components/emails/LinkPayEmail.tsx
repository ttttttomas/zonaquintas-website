import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

interface LinkPagoEmailProps {
  nombreHuesped: string;
  nombrePropiedad: string;
  fechaIngreso: string;
  fechaEgreso: string;
  monto: number;
  linkPago: string;
}

export function LinkPagoEmail({
  nombreHuesped,
  nombrePropiedad,
  fechaIngreso,
  fechaEgreso,
  monto,
  linkPago,
}: LinkPagoEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>
        Tu reserva fue aceptada — completá el pago para confirmarla
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>¡Tu reserva fue aceptada!</Heading>

          <Text style={styles.text}>Hola {nombreHuesped},</Text>
          <Text style={styles.text}>
            El propietario de <strong>{nombrePropiedad}</strong> aceptó tu
            solicitud. Para confirmar la reserva, completá el pago antes de que
            el link expire.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.detail}>
            📅 Ingreso: <strong>{fechaIngreso}</strong>
          </Text>
          <Text style={styles.detail}>
            📅 Egreso: <strong>{fechaEgreso}</strong>
          </Text>
          <Text style={styles.detail}>
            💰 Total: <strong>${monto.toLocaleString("es-AR")} ARS</strong>
          </Text>

          <Hr style={styles.hr} />

          <Button href={linkPago} style={styles.button}>
            Completar pago
          </Button>

          <Text style={styles.footer}>
            Si no realizaste esta solicitud, ignorá este mail.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    fontFamily: "'Montserrat', Arial, sans-serif",
  },
  container: {
    maxWidth: "560px",
    margin: "40px auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
  },
  heading: {
    fontSize: "22px",
    color: "#18181b",
    marginBottom: "16px",
  },
  text: {
    fontSize: "15px",
    color: "#3f3f46",
    lineHeight: "1.6",
  },
  detail: {
    fontSize: "15px",
    color: "#3f3f46",
    margin: "6px 0",
  },
  hr: {
    borderColor: "#e4e4e7",
    margin: "24px 0",
  },
  button: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "8px",
  },
  footer: {
    fontSize: "12px",
    color: "#a1a1aa",
    marginTop: "32px",
  },
};
