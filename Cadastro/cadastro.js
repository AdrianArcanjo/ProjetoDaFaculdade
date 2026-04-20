// Simple password strength indicator
    const input = document.getElementById('senhaInput');
    const segs = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3'), document.getElementById('s4')];
    const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
 
    input.addEventListener('input', () => {
      const v = input.value;
      let score = 0;
      if (v.length >= 6) score++;
      if (v.length >= 10) score++;
      if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      segs.forEach((s, i) => {
        s.style.background = i < score ? colors[score - 1] : 'var(--surface2)';
      });
    });