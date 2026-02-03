import { SEOPageTemplate } from "@/components/SEOPageTemplate";

const SistemaParaPetShop = () => {
  return (
    <SEOPageTemplate
      title="Sistema para Pet Shop | Simples, Rápido e Acessível"
      description="O sistema para pet shop ideal para quem busca simplicidade. Gestão de agendamentos, clientes e serviços por um preço que cabe no seu bolso."
      h1="Sistema para Gerenciar seu Pet Shop"
      intro="Seu negócio não precisa de um sistema complexo e caro. Você precisa de algo que funcione, organize sua rotina e não custe uma fortuna."
      ctaText="Começar agora por R$ 29,90"
      benefits={[
        {
          title: "Preço Justo e Acessível",
          desc: "Um plano único com tudo liberado. Sem taxas escondidas e por um valor menor que um banho avulso do seu pet shop."
        },
        {
          title: "Sem Instalação Complicada",
          desc: "Funciona direto no navegador do celular ou computador. Você cria sua conta e já começa a usar em menos de 2 minutos."
        },
        {
          title: "Dashboard Intuitivo",
          desc: "Não perca tempo tentando entender sistemas complexos. Nossa interface é limpa e direta ao ponto: agendamentos e gestão."
        },
        {
          title: "Liberdade de Contrato",
          desc: "Acreditamos na qualidade do nosso serviço. Por isso não exigimos fidelidade. Você usa enquanto fizer sentido para o seu negócio."
        }
      ]}
    />
  );
};

export default SistemaParaPetShop;
