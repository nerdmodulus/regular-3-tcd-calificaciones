/* ============================================================
   Calificaciones Regular 3 — datos, render y lógica
   ============================================================ */

// ⚠️ PEGA AQUÍ la URL de tu Web App de Apps Script (termina en /exec)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiueGoTuPHiztu1DsFlSXLcy2r2tH-ikulbpKl67HPpEKdAjPaZXK0pOq6cCzT1AoV/exec';

// Cierre del formulario de décimas: domingo 5 de julio de 2026, 18:00 (Chile, UTC-4)
const DEADLINE = new Date('2026-07-05T18:00:00-04:00');

const WARNING_TEXT = 'Tengo anotados a quienes tienen décimas. Es solo un ejercicio de transparencia. Si detecto a alguien que dice tener décimas, pero no las tiene según mis registros, se le restarán 3 puntos de la nota final. Debe ser un número escrito de la siguiente forma: Escriba así las décimas: 0,5 para 5 décimas. Si tiene 1 punto o más, puede escribir 1,5 si tiene 1,5 puntos.';

/* ---------- Datos de los 8 grupos ---------- */
const GROUPS = [
  {
    id: 'G1', name: 'AcompañaMente',
    members: ['Poblete', 'Segovia', 'Marín', 'Salazar', 'Alarcón'],
    site: 'https://neephilimm.github.io/AcompanaMente/',
    grade: 3.0, preGrade: 4.0,
    penalty: 'Descuento de −1,0 punto aplicado a la nota final por falta de ortografía en la transmisión en vivo ("e mocionalmente", segundo bloque de texto en rojo), según el reglamento del curso.',
    criteria: [
      ['Solución de IA', 10, 'Solución sobresaliente: buscador de centros de salud mental + chatbot que genera texto e imágenes, con llamada directa y Google Maps.'],
      ['Transmisión en Vivo', 5, 'Cumple el tiempo, pero el fondo es un bloque negro sin identidad visual y transmitió una sola persona (se exigían al menos 2).'],
      ['Contenido y Escaleta', 5, 'Cuenta atrás e intro muy bien logradas y excelente HeyGen; pero ritmo muy lento en el video 2, con relleno y cuñas sin cortes ni GC.'],
      ['Calidad de Videos', 3, 'Audio saturado en el primer testimonio, GC ausente o demasiado rápido, y audio descalzado en el cierre (labios no coinciden con el sonido).'],
      ['Sitio Web', 10, 'Cumple todas las secciones, buena navegabilidad y sin faltas de ortografía en el sitio.'],
      ['Exigencia Adicional', 3, 'Con 5 integrantes correspondía material extra sin relleno; se identifican silencios y tramos de relleno en el video 2.']
    ]
  },
  {
    id: 'G2', name: 'Cineteca Digital',
    members: ['Beiza', 'Gallardo', 'López'],
    site: 'https://sites.google.com/view/cinetecadigital/inicio',
    grade: 2.6, preGrade: null, penalty: null,
    criteria: [
      ['Solución de IA', 0, 'Buscador que solo entrega texto y un botón "copiar", sin enlaces a plataformas ni integración alguna. En clases se revisaron ejemplos mucho más completos; no cumple lo solicitado.'],
      ['Transmisión en Vivo', 2, 'Despliegue técnico muy pobre tras faltar a la clase de OBS: el video se va a negro, corte final abrupto, una sola persona en cámara (se exigían 2) y sin GC.'],
      ['Contenido y Escaleta', 3, 'Cuenta regresiva sin sonido, intro extremadamente simple, HeyGen inaudible y "bienvenidos" repetido en inicio y cierre pese a lo indicado en clases.'],
      ['Calidad de Videos', 2, 'Audio muy bajo y transversalmente deficiente, sin música perceptible. Se rescatan los GC. Tomas de Metro repetidas sin relación con el relato de cine.'],
      ['Sitio Web', 2, 'Sin faltas de ortografía, pero el contenido es genérico y de relleno, sin conexión clara con el tema del reportaje ni trabajo editorial propio.'],
      ['Exigencia Adicional', 10, 'Grupo de 3 integrantes: puntaje automático según reglamento.']
    ]
  },
  {
    id: 'G3', name: 'Miluca',
    members: ['Aravena', 'Zúñiga', 'P. Vásquez'],
    site: 'https://sites.google.com/view/miluca/p%C3%A1gina-principal',
    grade: 7.0, preGrade: null, penalty: null,
    criteria: [
      ['Solución de IA', 10, 'App de ahorro integrando Google Sheets con Gemini, demostrada en vivo. Funcional y coherente con el reportaje.'],
      ['Transmisión en Vivo', 10, 'Dos personas en vivo, excelente audio, composición y una entrevista bien desarrollada.'],
      ['Contenido y Escaleta', 10, 'Todos los elementos, HeyGen muy bien elaborado, cortina de cierre lograda y transiciones limpias.'],
      ['Calidad de Videos', 10, 'Excelente producción: audio, duración, composición y tema de interés.'],
      ['Sitio Web', 10, 'Animaciones de entrada por nota, diseño cuidado, sin errores de ortografía.'],
      ['Exigencia Adicional', 10, 'Grupo de 3 integrantes: puntaje automático según reglamento.']
    ]
  },
  {
    id: 'G4', name: 'KiwiFitness',
    members: ['Boza', 'Szikriszt', 'Vergara', 'Mardones'],
    site: 'https://sites.google.com/view/kiwifitness/p%C3%A1gina-principal',
    grade: 5.6, preGrade: null, penalty: null,
    criteria: [
      ['Solución de IA', 10, 'La app cuenta calorías a partir de una foto de la comida. Funciona excelente dentro del sitio.'],
      ['Transmisión en Vivo', 8, 'Dos personas en vivo, diálogos fluidos, excelente audio y video; se nota ensayo previo. Faltó el GC de quienes hablan.'],
      ['Contenido y Escaleta', 6, 'Intro del tiempo funciona y el contenido es entretenido, pero faltó un minuto completo de contenido y no hay video de cierre: la transmisión simplemente finalizó.'],
      ['Calidad de Videos', 7, 'Efectos bien logrados y video del Mundial 2026 con buen audio, pero sin GC que identifique a quienes hablan.'],
      ['Sitio Web', 8, 'Gran trabajo de diseño y producción; el botón "Ir a panel de control" de la portada no funciona.'],
      ['Exigencia Adicional', 10, 'Grupo de 4 integrantes: puntaje automático según reglamento.']
    ]
  },
  {
    id: 'G5', name: 'Roadtrips',
    members: ['Matamala', 'Quintanilla', 'Huentequeo', 'Ellis'],
    site: 'https://andreabhg.github.io/roadtrips/',
    grade: 5.3, preGrade: null, penalty: null,
    criteria: [
      ['Solución de IA', 10, 'IA bien lograda y contador de bencina con mapa funcionando perfecto.'],
      ['Transmisión en Vivo', 6, 'El vivo no se escuchaba en un principio, hay cortes abruptos, se nota un manejo deficiente de OBS, demoras entre escenas, y una duración de 7:45 (bajo los 8 min).'],
      ['Contenido y Escaleta', 4, 'Contador de tiempo demasiado sencillo (números sobre fondo gris), intro sin sustancia ni música, y sin video de cierre: apareció un segmento repetido del video 2.'],
      ['Calidad de Videos', 6, 'Buen contenido en el video de la bencina y en el HeyGen, pero ningún video tiene GC: no se sabe quién habla.'],
      ['Sitio Web', 10, 'Muy buen sitio: ordenado, navegable y publicado en GitHub, lo que suma una dificultad adicional.'],
      ['Exigencia Adicional', 10, 'Grupo de 4 integrantes: puntaje automático según reglamento.']
    ]
  },
  {
    id: 'G6', name: 'BeatArtificial',
    members: ['Astorga', 'Badilla', 'Cifuentes', 'Domínguez', 'Irarrázaval'],
    site: 'https://script.google.com/macros/s/AKfycby9wnH1w7owN6SEd3KFAM85DHlCIcWWqk29ZihSBGSBN4ywP6qvQ0UkN0BUS565Au9aaQ/exec',
    grade: 5.0, preGrade: 6.0,
    penalty: 'Descuento de −1,0 punto aplicado a la nota final por falta gramatical en el video 2: se dice "hubieron", palabra que no existe; lo correcto es "hubo".',
    criteria: [
      ['Solución de IA', 10, 'Excelente configuración de la IA solicitada.'],
      ['Transmisión en Vivo', 7, 'GC en el vivo mostrando quién es quién, pero tardanza de 4-5 segundos antes de empezar a hablar y cortes abruptos al cierre de los videos 1 y 2.'],
      ['Contenido y Escaleta', 7, 'Contador e intro funcionan, pero no se sabe el nombre del programa; el HeyGen (subtitulado y muy bien logrado) no tiene GC y se corta segundos antes de terminar.'],
      ['Calidad de Videos', 8, 'Video 1 con GC, música y buen uso de material de stock. Los cierres de ambos videos quedaron cortados en la transmisión.'],
      ['Sitio Web', 10, 'Excelente sitio: dinámico, agradable de explorar en celular y computador.'],
      ['Exigencia Adicional', 10, 'Cumple la duración de los videos considerando los 5 integrantes, y la transmisión supera los 8 minutos.']
    ]
  },
  {
    id: 'G7', name: 'LamaGames',
    members: ['Quinteros', 'Márquez', 'Álvarez', 'Troncoso'],
    site: 'https://sites.google.com/view/lamagames12/nuestra-app',
    grade: 3.5, preGrade: null,
    penalty: 'Quinteros: descuento individual de −1,0 punto por inasistencia. Su nota final es 2,5.',
    evidence: { img: 'https://i.imgur.com/Gxxf4Ij.png', caption: 'EVIDENCIA · El sitio no estaba publicado al momento de la revisión.' },
    individual: [['Quinteros', 2.5]],
    criteria: [
      ['Solución de IA', 0, 'No se pudo probar in situ: el sitio no estaba publicado. Además, la app solo muestra texto; al hacer clic en un juego no lleva a dónde comprarlo (PC o plataformas), por lo que la solución es muy plana.'],
      ['Transmisión en Vivo', 7, 'Inicio del vivo muy pulcro y duración total de 10 minutos, pero sin GC: se presentan en audio y no se ve quiénes son.'],
      ['Contenido y Escaleta', 7, 'Intro de Mario Bros y Sonic muy creativa y animada; HeyGen con GC y resumen del State of Play. Cortes muy abruptos antes de terminar el HeyGen y al cierre del video de la IA.'],
      ['Calidad de Videos', 6, 'Video 1 sin sonido ni música al principio; el video de la IA no tiene cierre. El mensaje del patrocinador está muy bien editado, con mucha producción detrás.'],
      ['Sitio Web', 0, 'El sitio NO estaba publicado y no se pudo revisar (ver evidencia). Siempre se debe probar todo antes de entregar.'],
      ['Exigencia Adicional', 10, 'Grupo de 4 integrantes: puntaje automático según reglamento.']
    ]
  },
  {
    id: 'G8', name: 'CreatorContentIA',
    members: ['Huilcal', 'Molina', 'Miranda', 'Cabrera', 'Cáceres'],
    site: 'https://martincabrerahsk-lang.github.io/creatorcontentia/',
    grade: 3.6, preGrade: null, penalty: null,
    evidence: { img: 'https://i.imgur.com/kqOJa1x.png', caption: 'EVIDENCIA · Máscaras de video que llevan a notas escritas, no a videos.' },
    criteria: [
      ['Solución de IA', 10, 'El programa de IA cumple lo prometido.'],
      ['Transmisión en Vivo', 6, 'Buen vivo y traspaso limpio desde el video 1, pero sin GC en ningún momento.'],
      ['Contenido y Escaleta', 4, 'No hay intro (el video comenzó de inmediato) ni cierre, y ningún bloque tiene GC. Grupos más pequeños sí tenían todos los elementos solicitados.'],
      ['Calidad de Videos', 4, 'Contenido entretenido y bien narrado (CTR, algoritmo, tiempo de visualización, publicidad en YouTube), pero sin GC, con un tramo del video 2 completamente sin audio ni música, y duraciones bajo el mínimo (4:00 y 4:30).'],
      ['Sitio Web', 7, 'Cumple lo solicitado, pero en términos de UX las máscaras de video en las notas confunden: al cliquear llevan a una nota escrita, no a un video (ver evidencia).'],
      ['Exigencia Adicional', 0, 'Con 5 integrantes, los videos ni siquiera cumplen el mínimo base solicitado, por lo que no se agregó el tiempo extra exigido.']
    ]
  }
];

/* ---------- Portada: selector de grupos ---------- */
const picker = document.getElementById('group-picker');
if (picker) {
  picker.innerHTML = GROUPS.map(g => `
    <a class="picker-card" href="#${g.id}">
      <div class="picker-id">Regular 3 · ${g.id}</div>
      <div class="picker-name">${g.name}</div>
      <div class="picker-members">${g.members.join(' · ')}</div>
      <div class="picker-cta">Ver evaluación →</div>
    </a>`).join('');
}

/* ---------- Render de secciones ---------- */
const main = document.getElementById('groups');

function ptsClass(p) { return p <= 3 ? 'low' : p <= 6 ? 'mid' : 'high'; }

GROUPS.forEach(g => {
  const section = document.createElement('section');
  section.className = 'group';
  section.id = g.id;

  const critRows = g.criteria.map(([name, pts, fb]) =>
    `<tr>
      <td class="crit-name">${name}</td>
      <td class="crit-fb">${fb}</td>
      <td class="crit-pts ${ptsClass(pts)}">${pts} / 10</td>
    </tr>`).join('');

  const evidenceHTML = g.evidence
    ? `<div class="evidence"><p>${g.evidence.caption}</p><img src="${g.evidence.img}" alt="Evidencia de revisión — ${g.name}" loading="lazy"></div>`
    : '';

  const penaltyHTML = g.penalty
    ? `<div class="penalty"><strong>⚠ Descuento aplicado:</strong> ${g.penalty}</div>`
    : '';

  section.innerHTML = `
    <div class="group-card">
      <div class="gc">
        <div class="gc-label">Regular 3 · ${g.id}</div>
        <div class="gc-name">${g.name}</div>
        <div class="gc-members">${g.members.join(' · ')}</div>
        <div class="gc-site">Sitio evaluado: <a href="${g.site}" target="_blank" rel="noopener">${g.site}</a></div>
      </div>
      <div class="group-body">
        <table class="crit-table">
          <thead><tr><th>Criterio</th><th>Retroalimentación</th><th>Puntaje</th></tr></thead>
          <tbody>${critRows}</tbody>
        </table>
        ${evidenceHTML}
        ${penaltyHTML}
        <div class="reveal-zone">
          <button class="reveal-btn" type="button">Ver calificación</button>
          <div class="grade-display" aria-live="polite"></div>
        </div>
        <div class="decimas">
          <h3>Declaración de décimas</h3>
          <div class="decimas-warning">${WARNING_TEXT}</div>
          <p class="decimas-limit">Este formulario admite un máximo de ${g.members.length} envíos para este grupo (uno por integrante). Revisa bien tus datos antes de enviar: no podrás corregirlos.</p>
          <form novalidate>
            <div><label>Nombre</label><input name="nombre" type="text" required autocomplete="given-name"></div>
            <div><label>Apellido</label><input name="apellido" type="text" required autocomplete="family-name"></div>
            <div><label>Décimas (ej: 0,5 o 1,5)</label><input name="decimas" type="text" required inputmode="decimal" placeholder="0,5"></div>
            <div><label>Regular en la que usarás las décimas</label>
              <select name="regular" required>
                <option value="">Selecciona…</option>
                <option value="R1">R1</option>
                <option value="R2">R2</option>
                <option value="R3">R3</option>
              </select>
            </div>
            <button type="submit">Enviar décimas</button>
            <p class="form-msg" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>`;

  main.appendChild(section);

  /* --- Revelación de nota --- */
  const btn = section.querySelector('.reveal-btn');
  const display = section.querySelector('.grade-display');
  const zone = section.querySelector('.reveal-zone');
  const pass = g.grade >= 4.0;

  btn.addEventListener('click', () => {
    btn.style.display = 'none';

    let inner = '';
    if (g.preGrade !== null && g.preGrade !== undefined) {
      inner += `<p class="grade-extra">Nota antes de descuentos: <strong>${g.preGrade.toFixed(1).replace('.', ',')}</strong></p>`;
    }
    inner += `<div class="grade-number ${pass ? 'pass' : 'fail'}">${g.grade.toFixed(1).replace('.', ',')}</div>
              <p class="grade-caption">Escala 1,0 – 7,0 · Exigencia 60%</p>`;
    if (g.individual) {
      g.individual.forEach(([who, note]) => {
        inner += `<p class="grade-extra"><strong>${who}:</strong> ${note.toFixed(1).replace('.', ',')} (con descuento individual)</p>`;
      });
    }
    display.innerHTML = inner;
    display.classList.add('open');

    spawnParticles(zone, pass);
    if (!pass) display.classList.add('shake');
  });

  /* --- Formulario de décimas --- */
  setupForm(section.querySelector('.decimas form'), g);
});

/* ---------- Partículas: destello (azul) o explosión (roja) ---------- */
function spawnParticles(zone, pass) {
  const count = pass ? 26 : 34;
  const colors = pass
    ? ['#2E7BFF', '#7FB0FF', '#BBD6FF', '#0A52C6']
    : ['#E11D48', '#F97316', '#FACC15', '#7F1D1D'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle ' + (pass ? 'spark' : 'boom');
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = (pass ? 90 : 140) + Math.random() * (pass ? 70 : 110);
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    p.style.background = colors[i % colors.length];
    if (!pass) {
      p.style.width = p.style.height = `${6 + Math.random() * 10}px`;
      p.style.boxShadow = `0 0 12px ${colors[i % colors.length]}`;
    }
    p.style.animationDelay = `${Math.random() * 0.12}s`;
    zone.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
}

/* ---------- Formulario: validación + envío a Apps Script ---------- */
function setupForm(form, group) {
  const msg = form.querySelector('.form-msg');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (Date.now() > DEADLINE.getTime()) {
    disableForm('El plazo para declarar décimas venció el domingo 5 de julio a las 18:00 hrs.');
    return;
  }

  function disableForm(text) {
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    msg.textContent = text;
    msg.className = 'form-msg err';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form-msg';

    if (Date.now() > DEADLINE.getTime()) {
      disableForm('El plazo para declarar décimas venció el domingo 5 de julio a las 18:00 hrs.');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data.nombre = (data.nombre || '').trim();
    data.apellido = (data.apellido || '').trim();
    data.decimas = (data.decimas || '').trim();

    if (!data.nombre || !data.apellido) {
      msg.textContent = 'Debes completar nombre y apellido.';
      msg.className = 'form-msg err';
      return;
    }
    if (!/^\d+,\d$/.test(data.decimas)) {
      msg.textContent = 'Formato incorrecto. Escribe las décimas con coma, por ejemplo: 0,5 o 1,5.';
      msg.className = 'form-msg err';
      return;
    }
    if (!['R1', 'R2', 'R3'].includes(data.regular)) {
      msg.textContent = 'Debes seleccionar la regular en la que usarás las décimas (R1, R2 o R3).';
      msg.className = 'form-msg err';
      return;
    }

    data.grupo = group.id;
    submitBtn.disabled = true;
    msg.textContent = 'Enviando…';

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data) // sin headers → text/plain, evita preflight CORS
      });
      const json = await res.json();

      if (json.ok) {
        form.querySelectorAll('input, select').forEach(el => el.disabled = true);
        msg.textContent = 'Décimas registradas correctamente. Quedaron en los registros del docente.';
        msg.className = 'form-msg ok';
      } else {
        msg.textContent = json.error || 'No se pudo registrar. Intenta nuevamente.';
        msg.className = 'form-msg err';
        submitBtn.disabled = json.final === true; // límite alcanzado o plazo vencido: no reintentar
      }
    } catch (err) {
      msg.textContent = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      msg.className = 'form-msg err';
      submitBtn.disabled = false;
    }
  });
}

/* ---------- Fondo blanco → azul suave con el scroll ---------- */
const START = [255, 255, 255];   // blanco
const END = [206, 226, 255];     // azul suave

function lerpColor(t) {
  const c = START.map((s, i) => Math.round(s + (END[i] - s) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    document.body.style.backgroundColor = lerpColor(t);
    ticking = false;
  });
}, { passive: true });
