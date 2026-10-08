/**
 * NEHA SONAWANE - PORTFOLIO INTERACTIVE ENGINE
 * Features: Typewriter, Canvas Particles, Persona Filters, Modals, Toasts, Theme Persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initThemeToggle();
  initTypewriter();
  initCanvasParticles();
  initNavbarScroll();
  initPersonaFilter();
  initProjectFilter();
  initProjectModals();
  initResumeModal();
  initCopyEmail();
  initRecruiterPrompts();
  initContactForm();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle & LocalStorage Persistence
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  
  // Load saved theme or system preference
  const savedTheme = localStorage.getItem('neha-portfolio-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('neha-portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   2. Dynamic Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedRoleElement = document.getElementById('typed-role');
  if (!typedRoleElement) return;

  const roles = [
    'Enterprise Java & Spring Boot Systems',
    'Actionable Data Analytics & BI Dashboards',
    'Scalable RESTful APIs & SQL Databases',
    'Machine Learning & Predictive Models',
    'Modern, High-Performance Web Applications'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseEnd = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedRoleElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedRoleElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, pauseEnd);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Ambient Background Canvas Particles
   -------------------------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(56, 189, 248, 0.4)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   4. Navbar Scroll & Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }

    // Scrollspy active state
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. Persona Switcher (Dynamic Hero & Recruiter Focus)
   -------------------------------------------------------------------------- */
function initPersonaFilter() {
  const personaBtns = document.querySelectorAll('.persona-btn');
  const projectFilterBtns = document.querySelectorAll('.filter-btn');

  personaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      personaBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const persona = btn.getAttribute('data-persona');

      // Sync project filter
      if (persona === 'java') {
        triggerProjectFilter('java');
        showToast('Viewing Java Backend Developer focus profile', 'info');
      } else if (persona === 'data') {
        triggerProjectFilter('data');
        showToast('Viewing Data Analyst & Python focus profile', 'info');
      } else {
        triggerProjectFilter('all');
        showToast('Viewing All-Rounder Software Engineer profile', 'info');
      }
    });
  });

  function triggerProjectFilter(category) {
    projectFilterBtns.forEach((btn) => {
      if (btn.getAttribute('data-filter') === category) {
        btn.click();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Project Category Filter
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Project Details Modal Data & Controller
   -------------------------------------------------------------------------- */
const projectDetailsData = {
  'task-management': {
    title: 'Task Management System',
    category: 'Full-Stack Enterprise Application',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'RESTful APIs', 'MVC Architecture', 'Postman'],
    overview: 'A robust enterprise workflow management platform developed during internship at Amdox to streamline team productivity, role assignments, and project deadline tracking.',
    highlights: [
      'Engineered scalable backend architecture with Spring Boot handling 100+ daily task lifecycle operations.',
      'Designed a normalized MySQL database schema with indexed relationships, improving query execution efficiency by 20%.',
      'Implemented Role-Based Access Control (RBAC) supporting 40+ concurrent users with distinct Admin, Manager, and Contributor permissions.',
      'Applied MVC design pattern to ensure high code maintainability, clean unit testability, and future extensibility.'
    ],
    architecture: 'Spring Boot REST Controller ➔ Service Layer ➔ Spring Data JPA / Hibernate ➔ MySQL Database with optimized relational schema.',
    github: 'https://github.com/Nehasonawane31'
  },
  'sales-dashboard': {
    title: 'Sales Data Analysis Dashboard',
    category: 'Business Intelligence & Exploratory Data Analysis',
    techStack: ['Power BI', 'SQL', 'Microsoft Excel', 'Data Cleaning', 'DAX Expressions'],
    overview: 'An end-to-end data analytics dashboard engineered to ingest, clean, and visualize over 10,000+ sales records to reveal regional performance trends and revenue drivers.',
    highlights: [
      'Processed and transformed 10,000+ transaction rows using SQL queries and Excel Power Query, removing anomalies and duplicates.',
      'Built 5+ dynamic interactive visualization components including revenue KPI cards, quarterly growth trends, and regional sales distribution.',
      'Implemented custom DAX measures for Year-over-Year (YoY) growth, customer acquisition cost, and average order value.',
      'Designed interactive slicers and drill-down filters enabling executives to perform self-service exploratory analysis.'
    ],
    architecture: 'Raw CSV/SQL Data Ingestion ➔ Data Cleaning & ETL (SQL/Excel) ➔ Dimensional Data Modeling ➔ Power BI Interactive Visuals & DAX.',
    github: 'https://github.com/Nehasonawane31'
  },
  'diabetes-prediction': {
    title: 'Diabetes Prediction ML System',
    category: 'Machine Learning & Predictive Healthcare',
    techStack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Logistic Regression', 'EDA'],
    overview: 'A predictive healthcare machine learning model designed to accurately predict diabetes onset using diagnostic metrics such as glucose levels, insulin, BMI, and age.',
    highlights: [
      'Conducted comprehensive Exploratory Data Analysis (EDA) on patient clinical records with distribution plots and correlation heatmaps.',
      'Handled zero-value medical anomalies, imputed missing values with median statistics, and applied Min-Max feature scaling using Pandas and NumPy.',
      'Trained and fine-tuned a Logistic Regression binary classification model achieving approximately 75–80% prediction accuracy.',
      'Evaluated model performance using Confusion Matrix, Precision, Recall, and ROC-AUC curves for reliable clinical diagnostics.'
    ],
    architecture: 'Dataset Preprocessing (Pandas/NumPy) ➔ Feature Engineering & Scaling ➔ Scikit-learn Logistic Regression Model ➔ Accuracy & Matrix Evaluation.',
    github: 'https://github.com/Nehasonawane31'
  },
  'ebanking-system': {
    title: 'E-Banking & ATM Simulation System',
    category: 'Transactional Banking Application',
    techStack: ['Core Java', 'JSP', 'Servlets', 'PostgreSQL', 'JDBC', 'HTML/CSS'],
    overview: 'A secure web-based transactional banking simulator engineered during internship at TechOctanet Services to simulate real-world ATM and banking workflows.',
    highlights: [
      'Developed core transactional operations including cash deposits, instant withdrawals, PIN authentication, and mini-statement generation.',
      'Integrated PostgreSQL database with robust JDBC connectivity and atomic SQL transaction management to prevent race conditions.',
      'Built modular backend controllers using Java Servlets, managing secure HTTP session states for active bank customers.',
      'Ensured high data integrity and implemented defensive validation routines for all financial input parameters.'
    ],
    architecture: 'JSP Frontend ➔ Java Servlet Controllers ➔ Business Logic Layer ➔ JDBC Driver ➔ PostgreSQL Database.',
    github: 'https://github.com/Nehasonawane31'
  },
  'book-recommendation': {
    title: 'Book Recommendation System',
    category: 'Intelligent Content Recommendation',
    techStack: ['Python', 'Flask', 'MySQL', 'Data Processing', 'Collaborative Filtering'],
    overview: 'A personalized content recommendation engine that analyzes user reading habits, genres, and ratings to deliver tailored book suggestions.',
    highlights: [
      'Applied content-based and collaborative filtering techniques to match user reading preferences with high-affinity catalog items.',
      'Engineered a lightweight, high-performance REST API backend using Python Flask connected to a MySQL database.',
      'Optimized query retrieval for popular books, top-rated titles, and personalized suggestion feeds.',
      'Designed clean JSON response structures enabling easy integration with modern web frontends.'
    ],
    architecture: 'User Profile & Rating Dataset ➔ Python Filtering Algorithm ➔ Flask REST API Endpoints ➔ MySQL Database.',
    github: 'https://github.com/Nehasonawane31'
  },
  'organ-donation': {
    title: 'Online Organ Donation Matching Platform',
    category: 'Healthcare & Public Welfare Web Application',
    techStack: ['PHP', 'PostgreSQL', 'HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    overview: 'A specialized medical platform connecting organ donors with recipient patients and hospitals, optimizing organ matching during critical emergencies.',
    highlights: [
      'Implemented secure donor and recipient onboarding with authentication and verified profile registration.',
      'Created fast search algorithms filtering by organ type, blood compatibility, and geographical region.',
      'Designed responsive medical portal UI with Bootstrap ensuring accessible navigation across all device screens.',
      'Integrated PostgreSQL relational tables ensuring strict patient confidentiality and audit-ready data tracking.'
    ],
    architecture: 'Responsive Bootstrap UI ➔ PHP Backend Controllers ➔ PostgreSQL Medical Database.',
    github: 'https://github.com/Nehasonawane31'
  }
};

function initProjectModals() {
  const projectModal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('project-modal-overlay');
  const closeBtn = document.getElementById('close-project-btn');
  const viewBtns = document.querySelectorAll('.view-project-btn');

  const modalTitle = document.getElementById('modal-project-title');
  const modalContent = document.getElementById('modal-project-content');

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetailsData[projectId];

      if (!data) return;

      modalTitle.textContent = data.title;
      modalContent.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <span style="display:inline-block; font-size:0.8rem; font-weight:700; color:#38bdf8; text-transform:uppercase; margin-bottom:0.4rem;">
            ${data.category}
          </span>
          <p style="color: var(--text-secondary); font-size:0.95rem; margin-bottom:1rem;">
            ${data.overview}
          </p>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size:1rem; margin-bottom:0.5rem; color:var(--text-primary);">
            <i class="fa-solid fa-star text-yellow"></i> Key Technical Achievements:
          </h4>
          <ul style="padding-left:1.25rem; color:var(--text-secondary); font-size:0.9rem; line-height:1.6;">
            ${data.highlights.map((h) => `<li style="margin-bottom:0.4rem;">${h}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 1.25rem; padding:0.85rem 1rem; background:var(--bg-glass-strong); border-radius:8px; border:1px solid var(--border-subtle);">
          <h5 style="font-size:0.85rem; text-transform:uppercase; color:#a78bfa; margin-bottom:0.3rem;">System Architecture:</h5>
          <p style="font-family:var(--font-mono); font-size:0.82rem; color:#cbd5e1;">${data.architecture}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h5 style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem; text-transform:uppercase;">Tech Stack:</h5>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${data.techStack.map((t) => `<span class="tech-pill">${t}</span>`).join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; padding-top:1rem; border-top:1px solid var(--border-subtle);">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
        </div>
      `;

      projectModal.classList.add('active');
    });
  });

  function closeModal() {
    projectModal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
}

/* --------------------------------------------------------------------------
   8. Resume Modal Controller & Print Trigger
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = [document.getElementById('open-resume-btn'), document.getElementById('hero-resume-btn')];
  const closeBtn = document.getElementById('close-resume-btn');
  const overlay = document.getElementById('resume-modal-overlay');
  const printBtn = document.getElementById('print-resume-btn');

  openBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        resumeModal.classList.add('active');
      });
    }
  });

  function closeResume() {
    resumeModal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  if (overlay) overlay.addEventListener('click', closeResume);

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   9. Copy Email to Clipboard with Instant Feedback
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-email-text');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email');
      navigator.clipboard.writeText(email).then(() => {
        copyText.textContent = 'Copied to Clipboard!';
        showToast('Email address copied: ' + email, 'success');
        setTimeout(() => {
          copyText.textContent = 'Copy Email';
        }, 3000);
      }).catch(() => {
        showToast('Direct email: ' + email, 'info');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   10. Quick Prompts for Recruiters
   -------------------------------------------------------------------------- */
function initRecruiterPrompts() {
  const promptButtons = document.querySelectorAll('.btn-prompt');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  promptButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-subject');
      if (subjectInput) subjectInput.value = subject;
      if (messageInput) {
        messageInput.value = `Hi Neha,\n\nI came across your portfolio and I am impressed with your projects in Java and Data Analytics. We would like to connect with you regarding: ${subject}.\n\nBest regards,`;
      }
      subjectInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      subjectInput.focus();
      showToast('Quick message template applied!', 'info');
    });
  });
}

/* --------------------------------------------------------------------------
   11. Interactive Contact Form Submission Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const sendBtn = document.getElementById('send-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'info');
        return;
      }

      sendBtn.disabled = true;
      sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      // Simulate instantaneous submission & mailto option
      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Send Message';

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `✓ Thank you ${name}! Your message has been prepared. Opening your email client to send directly to Neha...`;

        showToast('Message sent! Thank you for getting in touch.', 'success');

        // Trigger mailto link for reliable direct delivery
        const mailtoUrl = `mailto:sonawanen082@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoUrl;

        form.reset();
      }, 1000);
    });
  }
}

/* --------------------------------------------------------------------------
   12. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconClass = type === 'success' ? 'fa-circle-check text-emerald' : 'fa-circle-info text-cyan';
  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   13. Footer Year
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
