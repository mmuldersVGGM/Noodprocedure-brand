const sections = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('.nav-item')];
const totalSections = navItems.length;
const completed = new Set(JSON.parse(localStorage.getItem('npb-completed-v3') || '[]'));

function showSection(id){
  sections.forEach(s => s.classList.toggle('active', s.id === id));
  navItems.forEach(n => n.classList.toggle('active', n.dataset.section === id));
  window.scrollTo({top:0, behavior:'smooth'});
}
function saveProgress(){
  localStorage.setItem('npb-completed-v3', JSON.stringify([...completed]));
  updateProgress();
}
function updateProgress(){
  navItems.forEach(n => n.classList.toggle('done', completed.has(n.dataset.section)));
  const count = completed.size;
  document.getElementById('progressBar').style.width = `${(count/totalSections)*100}%`;
  document.getElementById('progressText').textContent = `${count} van ${totalSections} onderdelen afgerond`;
}
navItems.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));
document.querySelectorAll('.next-btn').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.next)));
document.querySelectorAll('.prev-btn').forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.prev)));
document.querySelectorAll('.complete').forEach(btn => btn.addEventListener('click', () => {
  const id = btn.dataset.complete;
  if(id){ completed.add(id); saveProgress(); }
  if(btn.dataset.next) showSection(btn.dataset.next);
}));
document.getElementById('resetProgress').addEventListener('click', () => {
  completed.clear(); localStorage.removeItem('npb-completed-v3'); updateProgress(); showSection('start');
});
document.querySelectorAll('.role-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.role-panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(`role-${tab.dataset.role}`).classList.add('active');
}));
document.getElementById('checkQuiz').addEventListener('click', () => {
  const questions = [...document.querySelectorAll('.question')];
  let score = 0, answered = 0;
  questions.forEach((q, i) => {
    const chosen = document.querySelector(`input[name="q${i+1}"]:checked`);
    if(chosen){ answered++; if(chosen.value === q.dataset.answer) score++; }
  });
  const out = document.getElementById('quizResult');
  out.className = 'quiz-result';
  if(answered < questions.length){
    out.textContent = 'Beantwoord eerst alle vragen.';
    out.classList.add('bad');
    return;
  }
  if(score === questions.length){
    out.textContent = `Alles goed: ${score}/${questions.length}. De kern van de nieuwe werkwijze is duidelijk.`;
    out.classList.add('good');
    completed.add('check'); saveProgress();
  } else {
    out.textContent = `${score}/${questions.length} goed. Bekijk vooral het onderdeel ‘Wat verandert voor ons?’ en de onderdelen over MAYDAY en reddingsactie nogmaals.`;
    out.classList.add('bad');
  }
});
updateProgress();
