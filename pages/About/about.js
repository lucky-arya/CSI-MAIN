document.addEventListener('DOMContentLoaded', () => {
  loadTeamData();
});

async function loadTeamData() {
  try {
    // Load core team data
    const coreTeamRes = await fetch('core-team.json');
    if (!coreTeamRes.ok) throw new Error('Could not fetch core-team.json');
    const coreTeamData = await coreTeamRes.json();
    
    // Load speakers data
    const speakersRes = await fetch('speakers.json');
    if (!speakersRes.ok) throw new Error('Could not fetch speakers.json');
    const speakersData = await speakersRes.json();
    
    // Render Core Team (founder + core team members)
    const coreTeamMembers = [];
    if (coreTeamData.founder) {
      coreTeamMembers.push({
        id: coreTeamData.founder.id,
        name: coreTeamData.founder.name,
        role: coreTeamData.founder.role,
        image: coreTeamData.founder.image,
        social: coreTeamData.founder.social || {}
      });
    }
    if (Array.isArray(coreTeamData.coreTeam)) {
      coreTeamMembers.push(...coreTeamData.coreTeam);
    }
    renderGrid('core-team-grid', coreTeamMembers, true); // Pass true for rectangular
    
    // Render Advisors
    if (Array.isArray(coreTeamData.advisors)) {
      renderGrid('advisors-grid', coreTeamData.advisors, false); // Pass false for circular
    }
    
    // Render Speakers
    if (Array.isArray(speakersData.speakers)) {
      renderGrid('speakers-grid', speakersData.speakers, false); // Pass false for circular
    }
    
  } catch (err) {
    console.error('Error loading team data:', err);
    showError('core-team-grid');
    showError('advisors-grid');
    showError('speakers-grid');
  }
}

function renderGrid(gridId, members, isRectangular = false) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const avatarClass = isRectangular ? 'avatar-rect' : 'avatar';

  const cards = members.map(member => {
    const linkedin = member.social && member.social.linkedin ? member.social.linkedin : '';
    const src = member.image || 'https://via.placeholder.com/320x320?text=CSI';
    const safeName = escapeHtml(member.name || '');
    const safeRole = escapeHtml(member.role || '');

    return `
      <div class="team-card" role="article">
        <img class="${avatarClass}" src="${src}" alt="${safeName}" loading="lazy" />
        <div class="member-name">${safeName}</div>
        <div class="member-role">${safeRole}</div>
        <div>
          ${linkedin ? `<a class="social-link" href="${linkedin}" target="_blank" rel="noopener" aria-label="${safeName} LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cards;
}

function showError(gridId) {
  const grid = document.getElementById(gridId);
  if (grid && !grid.innerHTML) {
    grid.innerHTML = '<p style="color:#6c757d">Failed to load team members.</p>';
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}