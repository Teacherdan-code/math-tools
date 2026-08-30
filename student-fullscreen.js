(() => {
  const configs = [
    { tool: '#quickTool', wrap: '#quickTool .stage-wrap', controls: '#quickTool .controls' },
    { tool: '#addsubTool', wrap: '#addsubTool .stage-wrap', controls: '#addsubTool .controls' },
    { tool: '#multdivTool', wrap: '#multdivTool .stage-wrap', controls: '#multdivTool .controls' }
  ];

  configs.forEach(({ wrap, controls }) => {
    const stageWrap = document.querySelector(wrap);
    const controlRow = document.querySelector(controls);
    if (!stageWrap || !controlRow) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary student-fullscreen-btn';
    button.textContent = 'Full Screen';
    controlRow.appendChild(button);

    button.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement === stageWrap) {
          await document.exitFullscreen();
        } else {
          if (document.fullscreenElement) await document.exitFullscreen();
          await stageWrap.requestFullscreen();
        }
      } catch (e) {}
    });
  });

  document.addEventListener('fullscreenchange', () => {
    document.querySelectorAll('.student-fullscreen-btn').forEach(button => {
      const wrap = button.closest('.stage-wrap');
      button.textContent = document.fullscreenElement === wrap ? 'Exit Full Screen' : 'Full Screen';
    });
  });
})();
