/** Las 5 etapas del §10.4. El texto es el del brief, sin reescribir. */
export type Etapa = {
  numero: string;
  titulo: string;
  texto: string;
  necesitamos: string;
};

export const etapas: Etapa[] = [
  {
    numero: "01",
    titulo: "Conocer al cliente",
    texto:
      "Hablamos de tu negocio antes de hablar de tecnología: cómo trabajás hoy, qué te hace perder tiempo y qué te preguntan tus clientes todo el día. De ahí sale qué hay que construir, y a veces qué no.",
    necesitamos: "Una charla.",
  },
  {
    numero: "02",
    titulo: "Diseñar propuesta a medida",
    texto:
      "Te llevamos una propuesta escrita con alcance, plazo y precio. Lo que entra y lo que no queda claro desde el principio: nada de «después vemos».",
    necesitamos: "Que la leas y nos digas si el alcance es el correcto.",
  },
  {
    numero: "03",
    titulo: "Desarrollo completo",
    texto:
      "Construimos por partes y te vamos mostrando. No desaparecemos tres semanas para volver con algo que no esperabas.",
    necesitamos:
      "El contenido: fotos, textos y precios. Es lo que más atrasa un proyecto: cuanto antes llega, antes se termina.",
  },
  {
    numero: "04",
    titulo: "Revisar con el cliente",
    texto:
      "Antes de entregar revisamos todo con vos y contra nuestra propia checklist de usabilidad: que se entienda, que funcione en el celular y que cargue rápido. Lo que no pasa, se corrige.",
    necesitamos: "Que lo pruebes y nos digas qué no se entiende.",
  },
  {
    numero: "05",
    titulo: "Entrega",
    texto:
      "Te lo entregamos funcionando y a tu nombre: el dominio, el hosting y los accesos son tuyos. Te mostramos cómo usarlo y quedamos disponibles para el mantenimiento.",
    necesitamos: "Nada. Ya está andando.",
  },
];
