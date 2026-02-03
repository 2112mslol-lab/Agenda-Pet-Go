import { SEOPageTemplate } from "@/components/SEOPageTemplate";

const AgendaOnlineBanhoTosa = () => {
  return (
    <SEOPageTemplate
      title="Agenda Online para Banho e Tosa | Sistema Especializado"
      description="Gerencie seus serviços de banho e tosa com uma agenda online profissional. Controle horários, evite sobreposições e aumente sua produtividade."
      h1="Agenda Online para Banho e Tosa"
      intro="O fluxo de um banho e tosa é intenso. Nosso sistema foi pensado para que você gerencie cada slot de tempo com precisão, sem estresse."
      ctaText="Automatizar meu banho e tosa"
      benefits={[
        {
          title: "Controle de Tempo por Serviço",
          desc: "Cada serviço tem sua duração definida. O sistema bloqueia exatamente o tempo necessário, evitando atrasos acumulados."
        },
        {
          title: "Fluxo de Trabalho Otimizado",
          desc: "Visualize sua esteira de banho e tosa. Saiba quantos pets estão agendados para cada profissional e distribua a carga de trabalho."
        },
        {
          title: "Facilidade para o Tutor",
          desc: "O dono do pet escolhe o serviço específico e já vê o valor e tempo estimado, gerando mais transparência e confiança."
        },
        {
          title: "Fim das sobreposições",
          desc: "Nosso sistema impede que dois agendamentos caiam no mesmo horário para o mesmo profissional, garantindo qualidade no serviço."
        }
      ]}
    />
  );
};

export default AgendaOnlineBanhoTosa;
