fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    let index = 0;
    const container = document.getElementById("clusters-container");

    data.schools.forEach((school) => {
      let schoolWrapper = `
        <div class="school-wrapper">
            <div class="school-header-container">
                <div class="divider-line"></div>
                <p class="school-prefix">School of</p>
                <h1 class="school-title">${school.name}</h1>
                <p class="school-description">${school.description}</p>
            </div>
            <div class="clusters-container">
        `;
      if (index === 0) {
        schoolWrapper = schoolWrapper.replace(
          '<div class="divider-line"></div>',
          '<div class="divider-line" style="display: none;"></div>'
        );
      }
      school.clusters.forEach((cluster) => {
        const clusterCard = `
                <div class="cluster-card-wrapper">
                    <div class="cluster-card" onclick="togglePrograms(${index})" style="background: ${cluster.gradient}">
                        <div class="logo" style="background-image: url('${
                          cluster.logo
                        }');"></div>
                        <div class="content">
                            <h2>${cluster.name}</h2>
                            <p>${cluster.description}</p>
                        </div>
                    </div>
                    <div class="programs" id="programs-${index}">
                        <ul>
                            ${cluster.programs
                              .map(
                                (p) =>
                                  `<li><a href="${p.url}" target="_blank">${p.name} <i class="fas fa-external-link-alt"></i></a></li>`
                              )
                              .join("")}
                        </ul>
                    </div>
                </div>
            `;
        schoolWrapper += clusterCard;
        index++;
      });

      schoolWrapper += `
            </div>
        </div>
        `;

      container.innerHTML += schoolWrapper;
    });
  })
  .catch((error) => console.error("Error loading JSON:", error));

function togglePrograms(index) {
  const programDiv = document.getElementById(`programs-${index}`);
  const icon = programDiv.previousElementSibling.querySelector(".fa");

  if (programDiv) {
    programDiv.classList.toggle("show");

    if (programDiv.classList.contains("show")) {
      icon.classList.remove("fa-angle-double-down");
      icon.classList.add("fa-angle-double-up");
    } else {
      icon.classList.remove("fa-angle-double-up");
      icon.classList.add("fa-angle-double-down");
    }
  }
}
