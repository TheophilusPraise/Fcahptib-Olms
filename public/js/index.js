
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section-content");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);
  sections.forEach((section) => {
    observer.observe(section);
  });
  const floatingElements = document.querySelectorAll(".floating");
  floatingElements.forEach((element) => {
    const randomX = Math.random() * 10 - 5;
    const randomY = Math.random() * 10 - 5;
    element.style.transform = `translate(${randomX}px, ${randomY}px)`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll("#feature-tabs button");
  const panels = document.querySelectorAll(".feature-panel");
  function animateMonitoringStats() {
    const progressCard = document.getElementById("progress-card");
    const progressBar = document.getElementById("progress-bar");
    const assignmentsCard = document.getElementById("assignments-card");
    const assignmentsCounter = document.getElementById("assignments-counter");
    const scoreCard = document.getElementById("score-card");
    const scoreCounter = document.getElementById("score-counter");
    const assessmentCard = document.getElementById("assessment-card");
    if (progressCard) {
      setTimeout(() => {
        progressCard.classList.remove("opacity-0", "translate-y-4");
        progressBar.style.width = "75%";
      }, 100);
      setTimeout(() => {
        assignmentsCard.classList.remove("opacity-0", "translate-y-4");
        let count = 0;
        const assignmentInterval = setInterval(() => {
          count++;
          assignmentsCounter.textContent = `${count}/15`;
          if (count >= 12) clearInterval(assignmentInterval);
        }, 100);
      }, 400);
      setTimeout(() => {
        scoreCard.classList.remove("opacity-0", "translate-y-4");
        let score = 0;
        const scoreInterval = setInterval(() => {
          score += 2;
          scoreCounter.textContent = `${score}%`;
          if (score >= 92) clearInterval(scoreInterval);
        }, 40);
      }, 600);
      setTimeout(() => {
        assessmentCard.classList.remove("opacity-0", "translate-y-4");
      }, 800);
    }
  }
  function animateScholarshipStats() {
    const meritCard = document.getElementById("merit-card");
    const meritProgress = document.getElementById("merit-progress");
    const researchCard = document.getElementById("research-card");
    const researchProgress = document.getElementById("research-progress");
    const diversityCard = document.getElementById("diversity-card");
    const diversityProgress = document.getElementById("diversity-progress");

    if (meritCard) {
      setTimeout(() => {
        meritCard.classList.remove("opacity-0", "translate-y-4");
        meritProgress.style.width = "85%";
      }, 100);

      setTimeout(() => {
        researchCard.classList.remove("opacity-0", "translate-y-4");
        researchProgress.style.width = "92%";
      }, 300);

      setTimeout(() => {
        diversityCard.classList.remove("opacity-0", "translate-y-4");
        diversityProgress.style.width = "78%";
      }, 500);
    }
  }

  function switchTab(oldTab, newTab) {
    newTab.focus();
    newTab.classList.add("active");
    oldTab.classList.remove("active");
    oldTab.classList.add("opacity-50");
    newTab.classList.remove("opacity-50");
    const newPanelId = newTab.getAttribute("data-tab") + "-panel";
    const newPanel = document.getElementById(newPanelId);
    const oldPanelId = oldTab.getAttribute("data-tab") + "-panel";
    const oldPanel = document.getElementById(oldPanelId);
    oldPanel.classList.add("hidden");
    newPanel.classList.remove("hidden");
    oldTab.style.transform = "";
    newTab.style.transform = "translateY(-4px)";
    setTimeout(() => {
      oldTab.style.transform = "";
    }, 300);
    if (newTab.getAttribute("data-tab") === "monitoring") {
      animateMonitoringStats();
    } else if (newTab.getAttribute("data-tab") === "scholarship") {
      animateScholarshipStats();
    }
  }
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const currentTab = document.querySelector("#feature-tabs button.active");
      if (e.currentTarget !== currentTab) {
        switchTab(currentTab, e.currentTarget);
      }
    });
    tab.addEventListener("mouseover", () => {
      tab.style.transform = "translateY(-4px)";
    });
    tab.addEventListener("mouseout", () => {
      if (!tab.classList.contains("active")) {
        tab.style.transform = "";
      }
    });
  });
});