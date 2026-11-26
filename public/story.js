/* Història «Només era un compliment» (ficció pedagògica; cap persona real).
   Mòdul compartit pel navegador i per l'API.
   - aina: impacte de l'opció en com viu la situació l'Aina (−2 a +2)
   - text: cadenes, {quote}, {aside}; qualsevol element pot dur {if:"node:clau"}
   - next: id de node, id de final, o "END" (final calculat pel recorregut) */
export const STORY = {
  start: "benvinguda",
  nodes: {
    benvinguda: {
      title: "La benvinguda", scene: "benvinguda",
      tags: ["Micromasclismes", "Comentaris sobre el físic"],
      text: [
        "Formes part de l'equip tècnic d'una entitat d'habitatge social. Dilluns s'incorpora l'Aina, una educadora nova.",
        "A la pausa del cafè, en Marc, que fa anys que treballa a l'entitat, li diu davant de tothom:",
        { quote: "«Amb aquest somriure ens alegraràs el dia a l'oficina, eh? A veure si així venim més contents a treballar.»" },
        "Algunes persones riuen. L'Aina somriu i mira el seu cafè."
      ],
      question: "Què fas en aquest moment?",
      options: [
        { key: "A", aina: 0, next: "xat", label: "Somric. És un comentari amable i no vull que l'Aina se senti encara més observada.",
          conseq: "La conversa continua. Ningú hi torna a pensar… llevat, potser, de l'Aina.",
          learn: "Els «compliments» sobre el físic en un context laboral situen una dona nova pel seu aspecte i no per la seva feina. Que semblin amables és justament el que fa que costi tant identificar-los." },
        { key: "B", aina: 1, next: "xat", label: "Canvio de tema i pregunto a l'Aina per la seva experiència en altres serveis.",
          conseq: "L'Aina s'anima a parlar del seu últim projecte. El focus passa a la seva feina.",
          learn: "Redirigir la conversa és una manera discreta de no seguir el joc i de tornar el reconeixement a la professionalitat. No posa nom al problema, però trenca la dinàmica." },
        { key: "C", aina: 1, next: "xat", label: "Més tard, li pregunto en privat com ha viscut el primer dia.",
          conseq: "L'Aina et diu que ha estat una mica incòmode, «però bé, ja hi estic acostumada». Us afegiu al Teams i quedeu per dinar algun dia.",
          learn: "«Ja hi estic acostumada» resumeix la normalització. Obrir un espai de confiança, sense pressionar, pot ser clau més endavant." }
      ]
    },
    xat: {
      title: "Els missatges del Teams", scene: "xat",
      tags: ["Violència digital", "Assetjament sexual en l'àmbit laboral"],
      text: [
        "Tres setmanes després, prepareu amb l'Aina un informe per a una visita. Mentre comparteix la pantalla amb tu, li apareixen notificacions del xat privat de Teams. Són d'en Marc:",
        { quote: "«Avui estàs especialment guapa 😍»" },
        { quote: "«No aconsegueixo concentrar-me amb tu davant…»" },
        "L'Aina tanca la finestra de pressa i fa una rialleta incòmoda: «Ja… em va escrivint coses així. Jo li poso una emoticona i canvio de tema».",
        { if: "benvinguda:C", aside: "Recordes el que et va dir l'Aina el primer dia: «ja hi estic acostumada»." }
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: -1, next: "nuria", label: "No dic res. És el seu xat privat i no em vull ficar on no em demanen.",
          conseq: "Continueu amb l'informe com si res. Els missatges d'en Marc continuen arribant durant la tarda.",
          learn: "El silenci de qui ho veu també és un missatge: deixa la persona sola i fa que la conducta sembli normal. Els comentaris de caràcter sexual no desitjats i repetits en un canal de feina poden constituir assetjament sexual en l'àmbit laboral (Llei 5/2008, modificada per la Llei 17/2020)." },
        { key: "B", aina: 1, next: "nuria", label: "Quan acabem, li pregunto amb calma com se sent amb aquests missatges.",
          conseq: "L'Aina s'ho pensa una estona: «Em fa sentir incòmoda, la veritat. Però no vull semblar una exagerada». Li dius que el que sent és legítim.",
          learn: "Preguntar sense jutjar i validar el malestar ajuda la persona a posar paraules al que li passa. No cal tenir totes les respostes per acompanyar." },
        { key: "C", aina: 0, next: "nuria", label: "Li dic que hauria de deixar-li clar a en Marc que pari.",
          conseq: "L'Aina assenteix: «Sí, tens raó, li hauria de dir alguna cosa…». Però se la veu preocupada.",
          learn: "Posar límits és un dret, però la responsabilitat d'aturar la conducta no és de qui la rep. Si només li diem què hauria de fer, sense oferir suport, la deixem sola davant del que pugui passar." }
      ]
    },
    nuria: {
      title: "«Era un compliment»", scene: "nuria",
      tags: ["Culpabilització", "Complicitat de l'entorn"],
      text: [
        "Uns dies després, en Marc li torna a escriure. L'Aina li respon per Teams que prefereix que faci servir el xat només per a qüestions professionals. Ell contesta:",
        { quote: "«Mare meva, que seriosa que ets. Era un compliment, tampoc se't pot dir res.»" },
        { if: "xat:B", aside: "L'Aina t'ho explica i et diu que va trigar mitja hora a escriure aquell missatge." },
        { if: "xat:C", aside: "L'Aina t'ho explica: «Ja li he dit, com em vas dir. I mira què m'ha contestat»." },
        "A la pausa del cafè, en Marc ho explica rient: «L'Aina és una estirada, ja no se li pot dir res». Aquella tarda, la Núria, una companya de l'equip, t'escriu per Teams:",
        { quote: "«Has sentit en Marc? Diu que l'Aina s'ha posat molt seriosa per un compliment… Tampoc n'hi ha per a tant, no? Ell és així, no ho fa amb mala intenció.»" }
      ],
      question: "Què li contestes?",
      options: [
        { key: "A", aina: -1, next: "cuina", label: "«Sí, ja el coneixem…» i canvio de tema.",
          conseq: "La Núria t'envia una emoticona de riure. La conversa s'acaba aquí, i la versió d'en Marc continua circulant.",
          learn: "«No ho fa amb mala intenció» desplaça el debat de l'efecte a la intenció. La violència masclista es defineix pel dany i per la relació de poder, no per com se la imagina qui l'exerceix." },
        { key: "B", aina: 1, next: "cuina", label: "Li dic que l'Aina té tot el dret a posar un límit, i que el problema són els missatges, no la seva resposta.",
          conseq: "La Núria tarda a contestar: «Vist així… potser sí. No ho havia pensat». Et diu que, si cal, et donarà suport.",
          learn: "Quan una dona posa un límit i se l'acusa d'exagerar, la culpa canvia de costat. Desmuntar aquest relat davant de l'entorn és una de les eines més potents per trencar la complicitat." },
        { key: "C", aina: 0, next: "cuina", label: "Li dic que no m'hi vull posar, que és cosa d'ells dos.",
          conseq: "La Núria respon: «Ja, millor no ficar-s'hi». La conversa s'acaba.",
          learn: "Tractar-ho com «una cosa entre dues persones» amaga la relació de poder i la dimensió col·lectiva: tot l'equip està escoltant la versió d'en Marc." }
      ]
    },
    cuina: {
      title: "Una pregunta a la cuina", scene: "cuina",
      tags: ["Por a no ser creguda"],
      text: [
        "Una setmana després, l'Aina et troba a la cuina. Està nerviosa:",
        { quote: "«Des que li vaig dir que parés, en Marc em mira malament a les reunions, i sé que va dient que soc una estirada. Em sento incòmoda cada vegada que coincidim. Tu creus que exagero?»" },
        { if: "benvinguda:C", aside: "T'ho pregunta a tu perquè el primer dia ja vau parlar." }
      ],
      question: "Què li respons?",
      options: [
        { key: "A", aina: 0, next: "aina", label: "Li dic que no exagera, però que potser és millor deixar passar uns dies, a veure si es calma.",
          conseq: "L'Aina respira: «Gràcies. Esperaré una mica». Els dies passen, i en Marc continua igual.",
          learn: "Validar és important, però «esperar que es calmi» posa el temps a favor de qui exerceix la violència. La incomoditat de l'Aina ja és un senyal que cal escoltar." },
        { key: "B", aina: 2, next: "aina", label: "Li dic que no exagera, que el que li passa té nom, i li pregunto què necessita.",
          conseq: "L'Aina se t'asseu al costat: «Necessitava que algú m'ho digués». Abans de marxar, et demana si en podeu parlar demà amb calma.",
          learn: "Nomenar la violència i preguntar què necessita retorna el control a la persona. Escoltar sense jutjar és el primer pas de tot acompanyament." },
        { key: "C", aina: -2, next: "F_silenci", label: "Li dic que en Marc és així amb tothom i que no s'hi capfiqui.",
          conseq: "L'Aina assenteix i marxa. Durant les setmanes següents parla menys a les reunions i desactiva les notificacions del Teams.",
          learn: "Restar-hi importància deixa la persona sola i reforça la seva por de no ser creguda. La violència que no es nomena continua." }
      ]
    },
    aina: {
      title: "L'Aina vol saber què pot fer", scene: "aina",
      tags: ["Autonomia de la persona"],
      text: [
        "L'endemà, l'Aina et diu:",
        { quote: "«Tinc por que pensin que exagero o que no sé acceptar un compliment. No vull muntar un drama, però tampoc vull que això continuï. Tu què faries?»" }
      ],
      question: "Què li proposes?",
      options: [
        { key: "A", aina: -1, next: "coord", label: "Li dic que no pateixi: ho explicaré jo avui mateix a la coordinadora.",
          conseq: "Parles amb la coordinadora aquella mateixa tarda. L'Aina se n'assabenta després i se sent desplaçada, però accepta anar a la reunió.",
          learn: "Actuar per protegir és important, però decidir per la persona afectada li treu el control. Llevat de situacions de risc greu, l'acompanyament ha de respectar els seus temps i la seva voluntat." },
        { key: "B", aina: 2, next: "coord", label: "L'escolto, li explico quines opcions té, li recomano guardar captures dels missatges i m'ofereixo a acompanyar-la quan decideixi.",
          conseq: "L'Aina s'ho pensa uns dies. Desa les captures dels missatges de Teams i decideix explicar-ho a la coordinadora. Et demana que l'acompanyis.",
          learn: "Escoltar, informar i acompanyar sense pressionar ajuda la persona a recuperar el control. Conservar els missatges amb la data és important si més endavant decideix activar el protocol." },
        { key: "C", aina: -1, next: "coord", label: "Li suggereixo que en parli directament amb en Marc per aclarir-ho entre ells.",
          conseq: "L'Aina ho intenta. En Marc li diu que «s'ho pren tot a la valenta» i que «abans la gent sabia acceptar un compliment». Ella en surt pitjor i decideix explicar-ho a la coordinadora. Et demana que l'acompanyis.",
          learn: "La mediació entre la persona agredida i la que agredeix no és recomanable en situacions de violència masclista: parteix d'una relació de poder desigual i pot exposar-la a més dany." }
      ]
    },
    coord: {
      title: "El despatx de coordinació", scene: "coord",
      tags: ["Minimització institucional"],
      text: [
        "La Xènia, la coordinadora, llegeix les captures i escolta l'Aina amb atenció. Quan acaba, diu:",
        { quote: "«Ho sento molt, de debò. Mira, en Marc és molt efusiu amb tothom, però és un gran professional i porta molts anys aquí. Si et sembla, hi parlo jo, discretament, i ho deixem aquí. No cal posar en marxa tota la maquinària, oi?»" },
        "L'Aina et mira, dubtosa."
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: -1, next: "rumor", label: "No dic res. Sembla una solució ràpida i discreta, i és l'Aina qui ha de decidir.",
          conseq: "L'Aina accepta, sense gaire convicció. La Xènia parla amb en Marc aquella setmana.",
          learn: "Les solucions «discretes» poden semblar més amables, però sovint protegeixen l'organització i la persona que agredeix. L'Aina té dret a decidir, i per decidir necessita conèixer totes les opcions." },
        { key: "B", aina: 2, next: "represalies", label: "Recordo amb respecte que l'entitat té un protocol i que l'Aina té dret a activar-lo si ho vol.",
          conseq: "La Xènia s'incomoda un moment, però reconeix que té raó. L'Aina demana un dia per pensar-s'ho i, finalment, activa el protocol.",
          learn: "El protocol de prevenció i actuació davant l'assetjament sexual i per raó de sexe no és «maquinària»: és una garantia de drets. Recordar-ho també és acompanyar." },
        { key: "C", aina: 1, next: "represalies", label: "Proposo que l'Aina s'ho pensi uns dies abans de decidir res.",
          conseq: "Tres dies després, l'Aina torna al despatx de la Xènia amb les idees clares: vol activar el protocol.",
          learn: "No cal decidir-ho tot en una reunió. Donar temps és respectar el ritme de la persona i evitar decisions preses sota pressió." }
      ]
    },
    rumor: {
      title: "Al passadís", scene: "rumor",
      tags: ["Represàlies", "Aïllament"],
      text: [
        "Dues setmanes després, en Marc es creua amb l'Aina al passadís i li diu, en veu baixa:",
        { quote: "«Ja m'han dit que vas anar a queixar-te a la Xènia per quatre compliments. Tranquil·la, que ja no et diré res més. Mai més.»" },
        "Des d'aleshores, en Marc no li respon els missatges de feina al Teams i la deixa fora del xat del projecte que comparteixen. L'Aina t'ho explica, trasbalsada."
      ],
      question: "Què li dius?",
      options: [
        { key: "A", aina: 1, next: "represalies", label: "Li proposo activar ara el protocol, i l'acompanyo.",
          conseq: "Aquesta vegada l'Aina ho té clar. Activa el protocol i hi afegeix el que ha passat al passadís i al Teams.",
          learn: "Quan una solució informal fracassa, el protocol continua sent una opció. Les represàlies contra qui denuncia també són violència i cal recollir-les." },
        { key: "B", aina: -2, next: "F_tancat", label: "Li dic que, almenys, ja no li escriu. Potser és millor així.",
          conseq: "L'Aina no hi insisteix. Però a partir d'aleshores se sent invisible dins l'equip.",
          learn: "L'aïllament i el buit són formes de violència difícils de veure perquè no fan soroll. Que s'hagin acabat els missatges no vol dir que s'hagi acabat la violència." },
        { key: "C", aina: -1, next: "represalies", label: "Li recomano que demani a la Xènia que hi torni a parlar.",
          conseq: "La Xènia hi torna a parlar. No canvia res. Finalment, l'Aina decideix activar el protocol.",
          learn: "Repetir una solució que no ha funcionat allarga el patiment. Els canals formals existeixen precisament per quan la via informal no protegeix." }
      ]
    },
    represalies: {
      title: "La reunió d'equip", scene: "represalies",
      tags: ["Violència de segon ordre"],
      text: [
        "El protocol està en marxa i en Marc sap que acompanyes l'Aina. A la reunió d'equip, quan proposes un canvi en l'organització de les visites als habitatges, comenta:",
        { quote: "«Compte, que ara hem d'anar amb peus de plom amb el que diem. No fos cas que algú es prengui malament un bon dia.»" },
        "Algunes persones riuen. L'endemà, et treu del canal de coordinació del Teams.",
        { if: "nuria:B", aside: "La Núria et mira des de l'altra banda de la taula." }
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: -1, next: "entrevista", label: "Decideixo no tornar a intervenir a les reunions fins que tot s'acabi.",
          conseq: "Deixes de proposar coses. En Marc continua fent comentaris i ningú més s'atreveix a dir res.",
          learn: "El que vius té nom: violència de segon ordre, la que pateixen les persones que donen suport a les víctimes. La Llei 17/2020 la reconeix." },
        { key: "B", aina: 1, next: "entrevista", label: "Ho documento i ho comunico a la comissió del protocol com a possible represàlia.",
          conseq: "La comissió ho recull i recorda a tot l'equip, sense donar noms, que les represàlies estan prohibides. Els comentaris s'aturen i tornes al canal.",
          learn: "Comunicar la violència de segon ordre protegeix qui acompanya i, indirectament, la víctima. Qui fa costat no ho hauria de pagar." },
        { key: "C", aina: 0, next: "entrevista", label: "Li responc davant de tothom, a la mateixa reunió.",
          conseq: "La reunió es tensa i la Xènia talla la conversa. Al passadís, algú et diu: «Al final, sou igual de conflictius l'un com l'altre».",
          learn: "Respondre en calent és comprensible, però sovint converteix la violència en un «conflicte entre dues persones» i dilueix la responsabilitat." }
      ]
    },
    entrevista: {
      title: "L'entrevista", scene: "entrevista",
      tags: ["Revictimització", "Violència institucional"],
      text: [
        "Acompanyes l'Aina a l'entrevista amb la comissió del protocol. A mitja conversa, una de les persones de la comissió li pregunta:",
        { quote: "«I per què no li vas dir des del primer dia que no t'agradava? Si li contestaves amb emoticones, potser ell va pensar que t'agradava…»" },
        "L'Aina abaixa la mirada."
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: 2, next: "tornada", label: "Intervinc amb respecte: recordo que la pregunta posa el focus en ella i proposo tornar als fets.",
          conseq: "Hi ha un silenci incòmode. La persona es disculpa i l'entrevista continua centrada en els missatges d'en Marc. L'Aina et mira i respira.",
          learn: "Preguntar «per què» a la víctima (per què va contestar amb emoticones, per què no ho va dir abans) és revictimització. Respondre amb evasives per evitar conflictes és una estratègia de supervivència, no un consentiment." },
        { key: "B", aina: -2, next: "tornada", label: "No dic res. No em correspon i no vull interferir.",
          conseq: "L'Aina intenta justificar-se. L'entrevista continua, però ella en surt amb la sensació d'haver estat jutjada.",
          learn: "Acompanyar no és només ser-hi: també és vetllar perquè el procés no torni a fer mal. Callar davant d'una pregunta culpabilitzadora també la valida." },
        { key: "C", aina: 1, next: "tornada", label: "Demano una pausa i, fora de la sala, ho comento amb la persona responsable.",
          conseq: "Durant la pausa ho comentes amb la persona responsable, que ho entén i canvia l'enfocament. Quan torneu, l'entrevista se centra en els fets.",
          learn: "Hi ha moltes maneres de frenar la revictimització. El que importa és no deixar passar la pregunta: el procés ha de protegir, no qüestionar." }
      ]
    },
    tornada: {
      title: "Després de la resolució", scene: "tornada",
      tags: ["Reparació col·lectiva"],
      text: [
        "Unes setmanes després, la comissió resol el cas: en Marc rep una sanció i canvia de servei. A la reunió d'equip següent, algú comenta:",
        { quote: "«Doncs ara ja no es podrà dir a ningú que fa bona cara. Haurem d'anar tots amb el manual sota el braç.»" },
        "Hi ha un silenci llarg. L'Aina és a la sala."
      ],
      question: "Què proposes?",
      options: [
        { key: "A", aina: 1, next: "END", label: "Proposo una formació per a tot l'equip i un acord sobre l'ús respectuós dels xats de Teams.",
          conseq: "Algunes persones bufen, però la proposta tira endavant. L'acord d'ús dels xats el redacta el mateix equip.",
          learn: "La reparació no és només individual: també és col·lectiva. Revisar els espais compartits, també els digitals, evita que la situació es repeteixi." },
        { key: "B", aina: -1, next: "END", label: "Proposo passar pàgina i no tornar-ne a parlar, per no fer-ho més gran.",
          conseq: "Tothom hi està d'acord, alleujat. L'Aina també assenteix, però el comentari queda a l'aire, sense resposta.",
          learn: "Tancar en fals deixa intactes les idees que van fer possible la violència. «Ja no es pot dir res» és un missatge que cal desmuntar, no ignorar: la diferència entre un compliment i l'assetjament és si és desitjat i si es respecta un no." },
        { key: "C", aina: -2, next: "END", label: "Proposo que l'Aina expliqui a l'equip com s'ha sentit, perquè tothom ho entengui.",
          conseq: "L'Aina s'encén de vermell. Diu que no, que prefereix no parlar-ne. Tothom la mira.",
          learn: "Demanar a la víctima que faci pedagogia davant del grup l'exposa de nou. La responsabilitat de canviar és de l'equip i de l'entitat, no seva." }
      ]
    }
  },
  endings: {
    F_bo: { title: "Un espai que protegeix", tone: "Final de reparació", scene: "fi_bo",
      text: "El protocol segueix el seu curs. L'Aina continua a l'equip i se sent part d'aquest equip. L'entitat organitza una formació sobre assetjament sexual i violència de segon ordre, i l'equip redacta el seu propi acord d'ús dels xats. Ara, quan algú fa un comentari fora de lloc, hi ha qui diu: «Això no»." },
    F_mig: { title: "El procés acaba, però a quin preu?", tone: "Final agredolç", scene: "fi_mig",
      text: "El cas es resol formalment. Però l'Aina explica a una amiga que la part més dura no van ser els missatges, sinó tot el que va venir després: haver de justificar-se, sentir-se observada, dubtar de si exagerava." },
    F_baix: { title: "Resolt sobre el paper", tone: "Final de tancament en fals", scene: "fi_sola",
      text: "El protocol es tanca amb una sanció. Però l'Aina, esgotada, demana un canvi de servei sis mesos després. A l'equip, la frase «ara ja no es pot dir res» encara circula." },
    F_silenci: { title: "El que no es nomena", tone: "Final de silenci", scene: "fi_sola",
      text: "L'Aina no torna a preguntar res a ningú. Tres mesos després demana un canvi de servei. Al cap d'unes setmanes, en Marc comença a escriure «compliments» per Teams a la persona que la substitueix." },
    F_tancat: { title: "El silenci com a norma", tone: "Final d'aïllament", scene: "fi_sola",
      text: "En Marc no torna a escriure-li cap missatge. Ni res més: per a ell, l'Aina ha deixat d'existir. A l'avaluació anual, algú escriu que a l'Aina «li costa integrar-se a l'equip». Ningú no relaciona una cosa amb l'altra." }
  },
  types: ["Micromasclismes", "Violència digital", "Assetjament sexual en l'àmbit laboral", "Culpabilització", "Minimització institucional", "Represàlies i aïllament", "Violència de segon ordre", "Revictimització"]
};

export const nodeOf = (id) => STORY.nodes[id];
export const optOf = (n, k) => nodeOf(n)?.options.find(o => o.key === k);

/* Final calculat pel recorregut */
export function endingFor(history) {
  const total = history.reduce((s, h) => s + (optOf(h.node, h.choice)?.aina || 0), 0);
  const hit = (n, k) => history.some(h => h.node === n && h.choice === k);
  let end = total >= 8 ? "F_bo" : total >= 3 ? "F_mig" : "F_baix";
  if (end === "F_bo" && (hit("entrevista", "B") || hit("tornada", "C"))) end = "F_mig";
  return end;
}
