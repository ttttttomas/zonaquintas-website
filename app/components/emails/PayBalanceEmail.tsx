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
  currency: string;
}

export function PayBalanceEmail({
  nombreHuesped,
  nombrePropiedad,
  monto,
  linkPago,
  currency
}: LinkPagoEmailProps) {

  const saldo = monto * 0.7;
  return (
    <Html lang="es">
      <Head />
      <Preview>
        ¡Es dia de completar el pago de tu estadia!
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Paga el saldo restante de la reserva en ZonaQuintas</Heading>

          <Text style={styles.text}>Hola {nombreHuesped},</Text>
          <Text style={styles.text}>
            Te adjuntamos el link de pago para completar el pago de la reserva de <strong>{nombrePropiedad}</strong>.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.detail}>
            Tenes un plazo de 24 horas para pagar el saldo restante de la reserva.
          </Text>
          <Text style={styles.detail}>
            De lo contrario, se te contactará de parte de ZonaQuintas para avisarte sobre la situación.
          </Text>
          <Text style={styles.detail}>
            💰 Saldo restante a pagar: <strong>${saldo.toLocaleString("es-AR")} {currency}</strong>
          </Text>

          <Hr style={styles.hr} />

          <Button href={linkPago} style={styles.button}>
            Completar pago
          </Button>

          <Text style={styles.footer}>
            Si notas algún inconveniente, comunícate con nosotros en <a href="https://www.zonaquintas.com/contact">https://www.zonaquintas.com/support</a>
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
