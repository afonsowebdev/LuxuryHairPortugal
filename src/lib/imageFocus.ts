/**
 * Ponto de foco (CSS object-position) para cada fotografia real do sistema.
 *
 * Estas fotos são retratos altos (cabeça + cabelo longo), mas são recortadas
 * em muitas proporções diferentes pelo site — cartões (4:5), tiles de
 * categoria (3:4), banners largos (até 4:1) e galerias. Com o corte central
 * padrão (`object-position: 50% 50%`), um banner largo cortava a fotografia
 * mesmo a meio, tirando a cara de fora e deixando a imagem com um ar
 * descentrado/deslocado. Este mapa fixa o ponto de foco certo por imagem, para
 * que o assunto (rosto, penteado) fique sempre enquadrado e centrado,
 * qualquer que seja a proporção da caixa onde a imagem é usada.
 *
 * A foto das box braids (box-braids-castanhas-frontal.jpg) foi reeditada em
 * vez de compensada por CSS: a fotografia original tinha muito pouco espaço
 * de fundo acima da cabeça (~4% da altura, contra ~12% na foto da peruca
 * cacheada), por isso nenhuma combinação de zoom/posição por CSS conseguia
 * igualar as duas sem cortar o cabelo. Estendemos a parede de fundo por cima
 * e recortámos com as mesmas proporções (largura da cabeça e espaço no topo)
 * da foto de referência — por isso já não precisa de nenhum ajuste especial
 * aqui, só do ponto de foco normal.
 */
const FOCUS_POINTS: Record<string, string> = {
  "/assets/produtos/perucas/peruca-preta-cacheada-frontal.jpg": "50% 15%",
  "/assets/produtos/perucas/peruca-preta-cacheada-perfil.jpg": "50% 15%",
  "/assets/produtos/perucas/peruca-loira-ondulada-frontal.jpg": "50% 15%",
  "/assets/produtos/box-braids/box-braids-castanhas-frontal.jpg": "50% 13%",
  "/assets/produtos/box-braids/box-braids-castanhas-detalhe-lace.jpg": "50% 60%",
  "/assets/modelos/retrato-pestanas-fundo-bordeaux-01.jpg": "50% 20%",
  "/assets/modelos/retrato-pestanas-fundo-bordeaux-02.jpg": "50% 15%",
  "/assets/modelos/retrato-pestanas-fundo-bordeaux-03.jpg": "50% 15%",
  "/assets/modelos/modelo-aplicacao-pestanas.jpg": "62% 30%",
  "/assets/modelos/lifestyle-sacos-luxury-hair.jpg": "50% 40%",
};

const DEFAULT_FOCUS = "50% 20%";

export function getImageFocus(src?: string): string {
  if (!src) return "50% 50%";
  return FOCUS_POINTS[src] ?? DEFAULT_FOCUS;
}
