import { Html, Head, Body, Container, Heading, Text, Hr, Preview } from "@react-email/components";

interface ContactoEmailProps {
    name: string;
    email: string;
    role: string;
    message: string;
    phone: string;
}

export function ContactoEmail({ name, email, role, message, phone }: ContactoEmailProps) {
    return (
        <Html lang="es">
            <Head />
            <Preview>Nuevo mensaje de contacto de {name}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Heading style={styles.heading}>Nuevo mensaje de contacto</Heading>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>{name}</Text>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{email}</Text>
                    <Text style={styles.label}>Rol</Text>
                    <Text style={styles.value}>{role}</Text>
                    <Text style={styles.label}>Teléfono</Text>
                    <Text style={styles.value}>{phone}</Text>
                    <Hr style={styles.hr} />
                    <Text style={styles.label}>Mensaje</Text>
                    <Text style={styles.mensaje}>{message}</Text>
                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: { backgroundColor: "#f4f4f5", fontFamily: "'Montserrat', Arial, sans-serif" },
    container: { maxWidth: "560px", margin: "40px auto", backgroundColor: "#fff", borderRadius: "12px", padding: "40px" },
    heading: { fontSize: "20px", color: "#18181b", marginBottom: "24px" },
    label: { fontSize: "12px", color: "#71717a", marginBottom: "2px", marginTop: "12px" },
    value: { fontSize: "15px", color: "#18181b", margin: "0" },
    hr: { borderColor: "#e4e4e7", margin: "24px 0" },
    mensaje: { fontSize: "15px", color: "#3f3f46", lineHeight: "1.6", whiteSpace: "pre-wrap" as const },
};