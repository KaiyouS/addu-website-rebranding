function formatDate(isoDateString, format) {
  const date = new Date(isoDateString + "T00:00:00Z");
  if (format === "month") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
  } else if (format === "day") {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

fetch("calendar-data.json")
  .then((res) => res.json())
  .then((data) => {
    if (data.academicYears && data.academicYears.length > 0) {
      currentDate = new Date();
      currentDate.setYear(2024);
      const upcomingEvents = [];

      data.academicYears.forEach((academicYear) => {
        academicYear.terms.forEach((term) => {
          term.events.forEach((event) => {
            if (event.date) {
              const eventDate = new Date(event.date + "T00:00:00Z");
              if (eventDate >= currentDate) {
                upcomingEvents.push(event);
              }
            } else if (event.dateRange) {
              const eventStartDate = new Date(
                event.dateRange.start + "T00:00:00Z"
              );
              if (eventStartDate >= currentDate) {
                upcomingEvents.push(event);
              }
            }
          });
        });
      });

      upcomingEvents.sort((a, b) => {
        const dateA = new Date(a.date || a.dateRange.start);
        const dateB = new Date(b.date || b.dateRange.start);
        return dateA - dateB;
      });

      const limitedEvents = upcomingEvents.slice(0, 7);

      const mainContainer = document.getElementById("calendar");
      limitedEvents.forEach((event) => {
        let accordionDate = "";
        if (event.date) {
          accordionDate = `
                        <time datetime="${event.date}">
                            <div class="month">${formatDate(
                              event.date,
                              "month"
                            )}</div>
                            <div class="day">${formatDate(
                              event.date,
                              "day"
                            )}</div>
                        </time>
                    `;
        } else if (event.dateRange) {
          accordionDate = `
                        <time datetime="${event.dateRange.start}">
                            <div class="month">${formatDate(
                              event.dateRange.start,
                              "month"
                            )}</div>
                            <div class="day">${formatDate(
                              event.dateRange.start,
                              "day"
                            )}-${formatDate(event.dateRange.end, "day")}</div>
                        </time>
                    `;
        }

        let descriptionHTML = "";
        let buttonHTML = "";

        if (event.description) {
          descriptionHTML = `
                      <div class="calendar-accordion-content" aria-label="Family Weekend" aria-hidden="true" style="height: 0px;">
                        <div class="calendar-accordion-content-inner">
                        <p>
                            <span>
                                ${event.description}
                            </span>
                        </p>
                        </div>
                    </div>  
                    `;

          buttonHTML = `
                        <button class="calendar-accordion-trigger" aria-expanded="false">
                            <span class="slide-underline calendar-accordion-trigger-label trigger-label-more">More</span>
                            <span class="slide-underline calendar-accordion-trigger-label trigger-label-less">Less</span>
                            <span class="calendar-accordion-trigger-icon">
                                <i class="fa fa-chevron-down"></i>
                            </span>
                        </button>
                    `;
        }

        const eventItemHTML = `
                    <div class="calendar-accordion-item">
                      <div class="calendar-accordion-header">
                        <div class="calendar-accordion-labels">
                          <span class="calendar-accordion-date">
                            ${accordionDate}
                          </span>
                          <span class="calendar-accordion-label">
                            <span>${event.label}</span>
                          </span>
                        </div>
                        ${buttonHTML}
                      </div>
                      ${descriptionHTML}
                    </div>
                `;

        // const container = document.createElement("div");
        // container.className = "calendar-container";
        // container.insertAdjacentHTML('beforeend', eventItemHTML);
        mainContainer.insertAdjacentHTML("beforeend", eventItemHTML);
      });

      initializeAccordions();
    }
  })
  .catch((error) => console.error("Error loading JSON:", error));
