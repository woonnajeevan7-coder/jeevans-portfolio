document.addEventListener("DOMContentLoaded", () => {
  // ================= THEME TOGGLE =================
  const themeToggle = document.getElementById("themeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  if (themeToggle && sunIcon && moonIcon) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }

    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        localStorage.setItem("theme", "dark");
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      } else {
        localStorage.setItem("theme", "light");
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      }
    });
  }

  // ================= MOBILE MENU =================
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ================= CONTACT FORM (simple alert version, if present) =================
  const contactForm = document.getElementById("contactForm");
  if (contactForm && !document.getElementById("toast")) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value || "there";
      const email = document.getElementById("email")?.value || "";
      alert(`Thank you ${name}! We'll contact you at ${email}.`);
      contactForm.reset();
    });
  }
});

// ================= SKILLS SECTION ANIMATIONS =================
document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.getElementById("skills-section");
  if (!skillsSection) return;

  const circles = skillsSection.querySelectorAll(".progress-ring-circle");
  const skillItems = skillsSection.querySelectorAll(".skill-item");

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  circles.forEach((circle) => {
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
  });

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;

          skillItems.forEach((item, index) => {
            setTimeout(() => item.classList.add("in-view"), index * 120);
          });

          circles.forEach((circle, index) => {
            const percent = parseFloat(circle.dataset.percent || "0");
            const offset = circumference - (percent / 100) * circumference;

            setTimeout(() => {
              circle.style.strokeDashoffset = offset;
            }, index * 150);
          });

          observer.unobserve(skillsSection);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(skillsSection);
});

// ================= ABOUT PAGE READ MORE (2 variants supported) =================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("readMoreAbout");
  const objective = document.getElementById("careerObjective");
  if (!btn || !objective) return;

  let open = false;

  btn.addEventListener("click", () => {
    open = !open;
    if (open) {
      objective.classList.remove("hidden");
      btn.textContent = "Read Less";
    } else {
      objective.classList.add("hidden");
      btn.textContent = "Read More";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("readMoreAbout");
  const more = document.getElementById("aboutMore");
  if (!btn || !more) return;

  let open = false;

  btn.addEventListener("click", () => {
    open = !open;
    if (open) {
      more.style.maxHeight = more.scrollHeight + "px";
      btn.textContent = "Read Less";
    } else {
      more.style.maxHeight = "0px";
      btn.textContent = "Read More";
    }
  });
});

// ================= CERTIFICATIONS FILTER + STAGGER =================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".cert-filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  if (filterButtons.length && certCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        certCards.forEach((card) => {
          const categories = (card.getAttribute("data-category") || "").split(" ");
          const match = filter === "all" || categories.includes(filter);
          card.style.display = match ? "block" : "none";
        });
      });
    });
  }

  if ("IntersectionObserver" in window && certCards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = [...certCards].indexOf(card);
            card.style.transitionDelay = `${index * 100}ms`;
            card.classList.add("visible");
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.2 }
    );

    certCards.forEach((card) => observer.observe(card));
  } else {
    certCards.forEach((card) => card.classList.add("visible"));
  }
});

// ================= CONTACT FORM + TOAST (advanced, if present) =================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const toastClose = document.getElementById("toastClose");
  const sendButton = document.getElementById("sendButton");
  const sendText = document.getElementById("sendText");
  const sendIcon = document.getElementById("sendIcon");

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    const timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
    toast.dataset.timeoutId = String(timeout);
  }

  if (toastClose && toast) {
    toastClose.addEventListener("click", () => {
      toast.classList.remove("show");
      const id = toast.dataset.timeoutId;
      if (id) {
        clearTimeout(Number(id));
      }
    });
  }

  if (contactForm && sendButton && sendText && sendIcon) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      sendButton.disabled = true;
      sendText.textContent = "Sending...";
      sendIcon.textContent = "⏳";

      setTimeout(() => {
        sendText.textContent = "Sent!";
        sendIcon.textContent = "✅";
        showToast();
        contactForm.reset();

        setTimeout(() => {
          sendButton.disabled = false;
          sendText.textContent = "Send Message";
          sendIcon.textContent = "📨";
        }, 1200);
      }, 1200);
    });
  }

  const subjectSelect = document.getElementById("subject");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", () => {
      // CSS floating-label reacts automatically
    });
  }
});

// ================= HERO TYPEWRITER (full sentence rotating roles) =================
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const roles = ["Full Stack Developer", "Frontend Developer", "Problem Solver"];
  let roleIndex = 0;

  function typeSentence(text, cb) {
    el.textContent = "";
    let i = 0;

    function typeNext() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, 90);
      } else if (cb) {
        setTimeout(cb, 1200); // wait before next role
      }
    }

    typeNext();
  }

  function loopRoles() {
    const sentence = "I’m a " + roles[roleIndex];
    typeSentence(sentence, () => {
      roleIndex = (roleIndex + 1) % roles.length;
      loopRoles();
    });
  }

  setTimeout(loopRoles, 500);
});

// Scroll reveal using IntersectionObserver
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("show"));
}

// Project filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    projectCards.forEach((card) => {
      const type = card.dataset.type;
      if (filter === "all" || type === filter) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Back to top
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("hidden");
    } else {
      backToTopBtn.classList.add("hidden");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =============== 3D TILT FOR PROJECT CARDS ===============
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const maxRotate = 10; // max degrees

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * maxRotate;
      const rotateX = -((y - midY) / midY) * maxRotate;

      card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX.toFixed(2)}deg)
        rotateY(${rotateY.toFixed(2)}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(-6px)";
    });
  });
});


// ================= BUTTON MAGNETIC EFFECT =================
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".buttons a");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const offsetX = (e.clientX - r.left - r.width / 2) / 8;
      const offsetY = (e.clientY - r.top - r.height / 2) / 8;
      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
});

// ================= SKILLS SECTION ANIMATIONS (single clean version) =================
document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.getElementById("skills-section");
  if (!skillsSection) return;

  const circles = skillsSection.querySelectorAll(".progress-ring-circle");
  const skillItems = skillsSection.querySelectorAll(".skill-item");

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  // Initial state: stroke hidden
  circles.forEach((circle) => {
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    circle.style.transition = "stroke-dashoffset 1s ease-out";
  });

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;

          // Optional card reveal
          skillItems.forEach((item, index) => {
            item.style.transition = "transform 0.4s ease, opacity 0.4s ease";
            item.style.opacity = "0";
            item.style.transform = "translateY(16px)";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, index * 100);
          });

          // Animate rings to their percentages
          circles.forEach((circle, index) => {
            const percent = parseFloat(circle.dataset.percent || "0");
            const offset = circumference - (percent / 100) * circumference;
            setTimeout(() => {
              circle.style.strokeDashoffset = offset;
            }, index * 150);
          });

          observer.unobserve(skillsSection);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);
});
