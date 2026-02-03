import { SEOPageTemplate } from "@/components/SEOPageTemplate";

const AgendamentoPetShop = () => {
  return (
    <SEOPageTemplate
      title="Agendamento para Pet Shop | Organize sua Agenda Online"
      description="Descubra como um sistema de agendamento online pode transformar seu pet shop. Acabe com os furos na agenda e automatize marcações via WhatsApp."
      h1="Agendamento Online para Pet Shop"
      intro="Dê ao seu cliente a liberdade de agendar banho, tosa e consultas a qualquer hora do dia ou da noite, sem que você precise parar o que está fazendo."
      ctaText="Criar agenda agora"
      benefits={[
        {
          title: "Elimine o vai e vem no WhatsApp",
          desc: "Em vez de trocar 10 mensagens para marcar um horário, envie apenas o seu link. O cliente vê os horários livres e resolve sozinho."
        },
        {
          title: "Reduza o esquecimento",
          desc: "Com o agendamento digital, seu cliente recebe confirmação e você tem o controle total de quem deve comparecer em cada período."
        },
        {
          title: "Organização por Profissional",
          desc: "Defina quais serviços cada funcionário realiza e deixe que o sistema filtre as disponibilidades de forma inteligente."
        },
        {
          title: "Acesso de qualquer lugar",
          desc: "Gerencie sua agenda pelo celular ou computador. Saiba sua rotina do dia seguinte antes mesmo de chegar ao pet shop."
        }
      ]}
    />
  );
};

export default AgendamentoPetShop;
