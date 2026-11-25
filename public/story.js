/* Història «El xat de l'equip» (ficció pedagògica; cap persona real).
   Mòdul compartit pel navegador i per l'API.
   - aina: impacte de l'opció en com viu la situació l'Aina (−2 a +2)
   - text: cadenes, {quote}, {aside}; qualsevol element pot dur {if:"node:clau"}
   - next: id de node, id de final, o "END" (final calculat pel recorregut) */
export const STORY = {
  start: "benvinguda",
  nodes: {
    benvinguda: {
      title: "La benvinguda", scene: "benvinguda",
      tags: ["Micromasclismes", "Comentaris sobre el cos"],
      text: [
        "Formes part de l'equip tècnic d'una entitat d'habitatge social. Dilluns s'incorpora l'Aina, una educadora nova.",
        "A la pausa del cafè, en Marc, que fa anys que treballa a l'entitat, li diu davant de tothom:",
        { quote: "«Amb tu l'equip guanya en bellesa, eh? A veure si així venim més contents a treballar.»" },
        "Algunes persones riuen. L'Aina somriu i mira el seu cafè."
      ],
      question: "Què fas en aquest moment?",
      options: [
        { key: "A", aina: 0, next: "xat", label: "Somric. És un comentari amable i no vull que l'Aina se senti encara més observada.",
          conseq: "La conversa continua. Ningú hi torna a pensar… llevat, potser, de l'Aina.",
          learn: "Els «cumplidos» sobre el físic en un context laboral situen una dona nova pel seu aspecte i no per la seva feina. Que semblin amables és justament el que fa que costi tant identificar-los." },
        { key: "B", aina: 1, next: "xat", label: "Canvio de tema i pregunto a l'Aina per la seva experiència en altres serveis.",
          conseq: "L'Aina s'anima a parlar del seu últim projecte. El focus passa a la seva feina.",
          learn: "Redirigir la conversa és una manera discreta de no seguir el joc i de tornar el reconeixement a la professionalitat. No posa nom al problema, però trenca la dinàmica." },
        { key: "C", aina: 1, next: "xat", label: "Més tard, li pregunto en privat com ha viscut el primer dia.",
          conseq: "L'Aina et diu que ha estat una mica incòmode, «però bé, ja hi estic acostumada». Us intercanvieu el telèfon.",
          learn: "«Ja hi estic acostumada» resumeix la normalització. Obrir un espai de confiança, sense pressionar, pot ser clau més endavant." }
      ]
    },
    xat: {
      title: "El xat de l'equip", scene: "xat",
      tags: ["Violència digital", "Assetjament sexual en l'àmbit laboral"],
      text: [
        "Dijous al vespre, al grup de WhatsApp informal de l'equip (on l'Aina encara no és), en Marc comparteix una captura d'una foto de l'Aina a la platja, treta del seu Instagram, amb aquest text:",
        { quote: "«Ara entenc per què la van contractar 🔥»" },
        "Dues persones hi reaccionen amb rialles. La resta, silenci.",
        { if: "benvinguda:C", aside: "Recordes el que et va dir l'Aina el primer dia: «ja hi estic acostumada»." }
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: -1, next: "nuria", label: "No dic res. És un grup informal i no vull crear mal ambient.",
          conseq: "El missatge queda al grup. L'endemà la conversa continua com si res. Però algú ha reenviat la captura a un altre grup.",
          learn: "El silenci de qui observa també és un missatge: valida la conducta. Compartir imatges d'una companya amb comentaris sexuals, sense el seu consentiment, és violència digital i assetjament sexual en l'àmbit laboral (Llei 5/2008, modificada per la Llei 17/2020)." },
        { key: "B", aina: 1, next: "nuria", label: "Responc al grup: «Això no fa gràcia. Esborra-ho, si us plau.»",
          conseq: "En Marc esborra la captura, però contesta: «Ja hi som, la policia de la moral. Era una broma, eh». Ningú més diu res al grup.",
          learn: "Posar un límit en públic trenca la normalització i mostra a la resta que no tothom hi està d'acord, encara que tingui un cost." },
        { key: "C", aina: 0, next: "nuria", label: "Escric en privat a en Marc perquè ho esborri.",
          conseq: "En Marc respon: «Tranqui, ja ho trec. Quin drama». Esborra la captura, però abans algú ja l'havia desada i ara corre per un altre grup.",
          learn: "Parlar-ne en privat pot ser una bona primera passa, però el grup no veu que algú hi posa límits. I la difusió d'imatges no s'atura només esborrant l'original." }
      ]
    },
    nuria: {
      title: "Un missatge en privat", scene: "nuria",
      tags: ["Complicitat de l'entorn"],
      text: [
        "L'endemà, la Núria, una companya de l'equip, t'escriu en privat:",
        { if: "xat:B", quote: "«Molt bé el que vas dir, eh. Però potser no calia fer-ho al grup… Ara hi ha un mal rotllo que es talla.»" },
        { if: "!xat:B", quote: "«Has vist el que va penjar en Marc? Quin mal gust… Però bé, ja el coneixem. No ho fa amb mala intenció.»" }
      ],
      question: "Què li contestes?",
      options: [
        { key: "A", aina: -1, next: "cuina", label: "«Sí, ja el coneixem…» i canvio de tema.",
          conseq: "La Núria t'envia un emoji de riure. La conversa s'acaba aquí.",
          learn: "«No ho fa amb mala intenció» desplaça el debat de l'efecte a la intenció. La violència masclista es defineix pel dany i per la relació de poder, no per com se la imagina qui l'exerceix." },
        { key: "B", aina: 1, next: "cuina", label: "Li dic que a mi també em va incomodar i li proposo que en parlem amb coordinació.",
          conseq: "La Núria dubta: «No sé… no vull problemes amb en Marc». Però et diu que, si cal, et donarà suport.",
          learn: "Una sola veu és fàcil de silenciar; dues ja dibuixen un patró. Teixir aliances és una de les eines més potents davant de la violència en un grup." },
        { key: "C", aina: 0, next: "cuina", label: "Li pregunto si creu que l'Aina n'hauria d'estar assabentada.",
          conseq: "La Núria respon: «Uf, no. Si ho sap, ho passarà malament. Millor que no se n'assabenti». Tu no ho tens tan clar.",
          learn: "Decidir «per protegir-la» què pot saber una persona també li treu el control. Ara bé, com i quan informar-la requereix cura." }
      ]
    },
    cuina: {
      title: "Una pregunta a la cuina", scene: "cuina",
      tags: ["Dret a la informació"],
      text: [
        "Una setmana després, l'Aina et troba a la cuina. Està nerviosa:",
        { quote: "«Fa dies que noto rialletes quan passo, i ahir algú em va dir \"ja t'hem vist a l'Instagram\". Tu en saps alguna cosa?»" },
        { if: "benvinguda:C", aside: "T'ho pregunta a tu perquè el primer dia ja vau parlar." }
      ],
      question: "Què li respons?",
      options: [
        { key: "A", aina: 0, next: "aina", label: "Li ensenyo la captura al mòbil perquè ho vegi amb els seus propis ulls.",
          conseq: "L'Aina mira la pantalla en silenci. «Ho ha vist tothom?», pregunta. Ara ho sap tot, però ha estat un cop dur.",
          learn: "Informar no vol dir exposar. Tornar a mostrar la imatge pot fer reviure el dany. Abans de compartir proves, és millor preguntar què vol saber i com." },
        { key: "B", aina: 2, next: "aina", label: "Li explico què ha passat, sense ensenyar-li la imatge, i li pregunto què necessita.",
          conseq: "L'Aina escolta i respira fondo. «Gràcies per dir-m'ho. Necessito pensar», diu. Abans de marxar, et demana si en podeu parlar demà.",
          learn: "Donar informació veraç amb cura i preguntar què necessita retorna el control a la persona. Escoltar sense jutjar és el primer pas de tot acompanyament." },
        { key: "C", aina: -2, next: "F_silenci", label: "Li dic que no en sé res. No vull fer-ho més gran.",
          conseq: "L'Aina assenteix i marxa. Durant les setmanes següents parla menys a les reunions i evita la cuina a l'hora de dinar.",
          learn: "Callar per «no fer-ho més gran» deixa la persona sola davant d'una situació que no entén. La violència que no es nomena continua." }
      ]
    },
    aina: {
      title: "L'Aina vol saber què pot fer", scene: "aina",
      tags: ["Autonomia de la persona"],
      text: [
        "L'endemà, l'Aina et diu:",
        { quote: "«Em sento fatal. Tinc por que pensin que exagero o que soc jo qui busca problemes. No vull muntar un drama, però tampoc vull que això continuï. Tu què faries?»" }
      ],
      question: "Què li proposes?",
      options: [
        { key: "A", aina: -1, next: "coord", label: "Li dic que no pateixi: ho explicaré jo avui mateix a la coordinadora.",
          conseq: "Parles amb la coordinadora aquella mateixa tarda. L'Aina se n'assabenta després i se sent desplaçada, però accepta anar a la reunió.",
          learn: "Actuar per protegir és important, però decidir per la persona afectada li treu el control. Llevat de situacions de risc greu, l'acompanyament ha de respectar els seus temps i la seva voluntat." },
        { key: "B", aina: 2, next: "coord", label: "L'escolto, li explico quines opcions té, li recomano guardar les proves i m'ofereixo a acompanyar-la quan decideixi.",
          conseq: "L'Aina s'ho pensa uns dies. Guarda les captures que li han arribat i decideix explicar-ho a la coordinadora. Et demana que l'acompanyis.",
          learn: "Escoltar, informar i acompanyar sense pressionar ajuda la persona a recuperar el control de la situació." },
        { key: "C", aina: -1, next: "coord", label: "Li suggereixo que en parli directament amb en Marc per aclarir-ho entre ells.",
          conseq: "L'Aina ho intenta. En Marc li diu que «s'ho pren tot a la valenta» i que «era un compliment». Ella en surt pitjor i decideix explicar-ho a la coordinadora. Et demana que l'acompanyis.",
          learn: "La mediació entre la persona agredida i la que agredeix no és recomanable en situacions de violència masclista: parteix d'una relació de poder desigual i pot exposar-la a més dany." }
      ]
    },
    coord: {
      title: "El despatx de coordinació", scene: "coord",
      tags: ["Minimització institucional"],
      text: [
        "La Xènia, la coordinadora, escolta l'Aina amb atenció. Quan acaba, diu:",
        { quote: "«Ho sento molt, de debò. Mira, en Marc és així, però és un gran professional i porta molts anys aquí. Si et sembla, hi parlo jo, discretament, i ho deixem aquí. No cal posar en marxa tota la maquinària, oi?»" },
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
        { quote: "«Ja m'han dit que vas anar a plorar a la Xènia. Tranquil·la, que ja no et diré res més. Mai més.»" },
        "Des d'aleshores, en Marc no li dirigeix la paraula, ni tan sols a les reunions. L'Aina t'ho explica, trasbalsada."
      ],
      question: "Què li dius?",
      options: [
        { key: "A", aina: 1, next: "represalies", label: "Li proposo activar ara el protocol, i l'acompanyo.",
          conseq: "Aquesta vegada l'Aina ho té clar. Activa el protocol i hi afegeix el que ha passat al passadís.",
          learn: "Quan una solució informal fracassa, el protocol continua sent una opció. Les represàlies contra qui denuncia també són violència i cal recollir-les." },
        { key: "B", aina: -2, next: "F_tancat", label: "Li dic que, almenys, ja no li fa comentaris. Potser és millor així.",
          conseq: "L'Aina no hi insisteix. Però a partir d'aleshores se sent invisible dins l'equip.",
          learn: "L'aïllament i el buit són formes de violència difícils de veure perquè no fan soroll. Que s'hagin acabat els comentaris no vol dir que s'hagi acabat la violència." },
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
        { quote: "«Compte, que ara hem d'anar amb peus de plom amb el que diem. Hi ha qui s'ho mira tot amb lupa.»" },
        "Algunes persones riuen. L'endemà, et deixa fora d'un correu de coordinació.",
        { if: "nuria:B", aside: "La Núria et mira des de l'altra banda de la taula." }
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: -1, next: "entrevista", label: "Decideixo no tornar a intervenir a les reunions fins que tot s'acabi.",
          conseq: "Deixes de proposar coses. En Marc continua fent comentaris i ningú més s'atreveix a dir res.",
          learn: "El que vius té nom: violència de segon ordre, la que pateixen les persones que donen suport a les víctimes. La Llei 17/2020 la reconeix." },
        { key: "B", aina: 1, next: "entrevista", label: "Ho documento i ho comunico a la comissió del protocol com a possible represàlia.",
          conseq: "La comissió ho recull i recorda a tot l'equip, sense donar noms, que les represàlies estan prohibides. Els comentaris s'aturen.",
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
        { quote: "«I per què tens aquestes fotos en obert a l'Instagram? Ja saps com és la gent…»" },
        "L'Aina abaixa la mirada."
      ],
      question: "Què fas?",
      options: [
        { key: "A", aina: 2, next: "tornada", label: "Intervinc amb respecte: recordo que la pregunta posa el focus en ella i proposo tornar als fets.",
          conseq: "Hi ha un silenci incòmode. La persona es disculpa i l'entrevista continua centrada en el que va fer en Marc. L'Aina et mira i respira.",
          learn: "Preguntar «per què» a la víctima (per què tenia fotos, per què no ho va dir abans) és revictimització. Qui acompanya pot ajudar a tornar el focus a la conducta de qui agredeix." },
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
        { quote: "«Doncs ara ja no es podrà fer cap broma. Haurem d'anar tots amb el manual sota el braç.»" },
        "Hi ha un silenci llarg. L'Aina és a la sala."
      ],
      question: "Què proposes?",
      options: [
        { key: "A", aina: 1, next: "END", label: "Proposo una formació per a tot l'equip i un acord sobre com fem servir els grups de xat.",
          conseq: "Algunes persones bufen, però la proposta tira endavant. L'acord del xat el redacta el mateix equip.",
          learn: "La reparació no és només individual: també és col·lectiva. Revisar els espais compartits evita que la situació es repeteixi." },
        { key: "B", aina: -1, next: "END", label: "Proposo passar pàgina i no tornar-ne a parlar, per no fer-ho més gran.",
          conseq: "Tothom hi està d'acord, alleujat. L'Aina també assenteix, però el comentari de la broma queda a l'aire, sense resposta.",
          learn: "Tancar en fals deixa intactes les idees que van fer possible la violència. «Ja no es pot fer cap broma» és un missatge que cal desmuntar, no ignorar." },
        { key: "C", aina: -2, next: "END", label: "Proposo que l'Aina expliqui a l'equip com s'ha sentit, perquè tothom ho entengui.",
          conseq: "L'Aina s'encén de vermell. Diu que no, que prefereix no parlar-ne. Tothom la mira.",
          learn: "Demanar a la víctima que faci pedagogia davant del grup l'exposa de nou. La responsabilitat de canviar és de l'equip i de l'entitat, no seva." }
      ]
    }
  },
  endings: {
    F_bo: { title: "Un espai que protegeix", tone: "Final de reparació", scene: "fi_bo",
      text: "El protocol segueix el seu curs. L'Aina continua a l'equip i se sent part d'aquest equip. L'entitat organitza una formació sobre violència digital i violència de segon ordre, i l'equip redacta el seu propi acord per al xat. Ara, quan algú comparteix alguna cosa fora de lloc, hi ha qui diu: «Això no»." },
    F_mig: { title: "El procés acaba, però a quin preu?", tone: "Final agredolç", scene: "fi_mig",
      text: "El cas es resol formalment. Però l'Aina explica a una amiga que la part més dura no va ser el que va passar al xat, sinó tot el que va venir després: haver de justificar-se, sentir-se observada, dubtar de si exagerava." },
    F_baix: { title: "Resolt sobre el paper", tone: "Final de tancament en fals", scene: "fi_sola",
      text: "El protocol es tanca amb una sanció. Però l'Aina, esgotada, demana un canvi de servei sis mesos després. A l'equip, la frase «ara ja no es pot fer cap broma» encara circula." },
    F_silenci: { title: "El que no es nomena", tone: "Final de silenci", scene: "fi_sola",
      text: "L'Aina no arriba a saber mai del cert què va passar. Tres mesos després demana un canvi de servei. Al grup de WhatsApp, la captura encara hi és." },
    F_tancat: { title: "El silenci com a norma", tone: "Final d'aïllament", scene: "fi_sola",
      text: "En Marc no torna a fer cap comentari. Ni res més: per a ell, l'Aina ha deixat d'existir. A l'avaluació anual, algú escriu que a l'Aina «li costa integrar-se a l'equip». Ningú no relaciona una cosa amb l'altra." }
  },
  types: ["Micromasclismes", "Violència digital", "Assetjament sexual en l'àmbit laboral", "Minimització institucional", "Represàlies i aïllament", "Violència de segon ordre", "Revictimització"]
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
