(() => {
  const configs = [
    { wrap: '#quickTool .stage-wrap', controls: '#quickTool .controls' },
    { wrap: '#addsubTool .stage-wrap', controls: '#addsubTool .controls' },
    { wrap: '#multdivTool .stage-wrap', controls: '#multdivTool .controls' }
  ];

  let activeWrap = null;

  function exitPresentation() {
    if (!activeWrap) return;
    activeWrap.classList.remove('student-presenting');
    document.body.classList.remove('presentation-open');
    const btn = activeWrap.querySelector('.student-fullscreen-btn');
    if (btn) btn.textContent = 'Full Screen';
    activeWrap = null;
  }

  configs.forEach(({ wrap, controls }) => {
    const stageWrap = document.querySelector(wrap);
    const controlRow = document.querySelector(controls);
    if (!stageWrap || !controlRow) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary student-fullscreen-btn';
    button.textContent = 'Full Screen';
    controlRow.appendChild(button);

    button.addEventListener('click', () => {
      if (activeWrap === stageWrap) {
        exitPresentation();
        return;
      }
      exitPresentation();
      activeWrap = stageWrap;
      stageWrap.classList.add('student-presenting');
      document.body.classList.add('presentation-open');
      button.textContent = 'Exit Full Screen';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeWrap) {
      e.preventDefault();
      exitPresentation();
    }
  });
})();