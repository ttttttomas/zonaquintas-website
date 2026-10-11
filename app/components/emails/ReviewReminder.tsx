import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";

export default function ReviewReminder({ name, person, quinta, checkOut, deadline, href, role }: {
  name: string; person: string; quinta: string; checkOut: string; deadline: string; href: string; role: "guest" | "owner";
}) {
  const action = role === "guest" ? "Calificar anfitrión" : "Calificar huésped";
  return <Html><Head /><Preview>Contanos cómo fue tu experiencia en ZonaQuintas</Preview>
    <Body style={{ backgroundColor: "#f7faf8", fontFamily: "Arial, sans-serif", color: "#17251c" }}>
      <Container style={{ maxWidth: 520, margin: "32px auto", padding: 28, backgroundColor: "#fff", borderRadius: 14 }}>
        <Heading style={{ fontSize: 24 }}>Tu opinión ayuda a la comunidad</Heading>
        <Text>Hola, {name}. Tu reserva en {quinta} terminó el {checkOut}. Podés calificar a {person} como {role === "guest" ? "anfitrión" : "huésped"} hasta el {deadline}.</Text>
        <Text>Tu reseña se mostrará cuando ambos hayan calificado o venza el plazo. Contá tu experiencia con honestidad.</Text>
        <Button href={href} style={{ backgroundColor: "#176744", color: "#fff", padding: "12px 20px", borderRadius: 8 }}>{action}</Button>
        <Text style={{ color: "#607266", fontSize: 12 }}>Te enviamos este recordatorio porque participaste en esa reserva y todavía no calificaste. Podés desactivar estos avisos en Mi perfil.</Text>
      </Container>
    </Body>
  </Html>;
}
