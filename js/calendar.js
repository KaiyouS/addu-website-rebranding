function formatDate(isoDateString) {
    const date = new Date(isoDateString + 'T00:00:00Z');
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
}

function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.calendar-accordion-item');

    accordionItems.forEach(item => {
        const trigger = item.querySelector('.calendar-accordion-trigger');
        const content = item.querySelector('.calendar-accordion-content');

        if (trigger && content) {
            const contentInner = content.querySelector('.calendar-accordion-content-inner');
            
            content.style.overflow = 'hidden';
            content.style.transition = 'height 0.3s ease';

            trigger.addEventListener('click', () => {
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    trigger.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    content.style.height = '0px';
                    item.classList.remove('is-open');
                } else {
                    trigger.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                    content.style.height = `${contentInner.scrollHeight + 100}px`;
                    item.classList.add('is-open');
                }
            });
        }
    });
}

fetch("calendar-data.json")
    .then((res) => res.json())
    .then((data) => {
        const mainContainer = document.getElementById("calendar");
        if (!mainContainer) {
            console.error("Error: calendar-container element not found!");
            return;
        }

        if (data.academicYears && data.academicYears.length > 0) {
            data.academicYears.forEach(academicYear => {
                const mainContainer = document.getElementById("calendar");
                
                academicYear.terms.forEach(term => {
                    const container = document.createElement("div");
                    container.className = "calendar-container";
                    
                    const calendarTitleHTML = `
                        <div class="calendar-header">
                            <h2 class="calendar-title">
                                ${term.name}
                            </h2>
                        </div>
                    `;
                    
                    container.insertAdjacentHTML('beforeend', calendarTitleHTML);
                    
                    term.events.forEach(event => {
                        let accordionDate = '';
                        if (event.date) {
                            accordionDate = `
                                <time datetime="${event.date}">${formatDate(event.date)}</time>
                            `;
                        } else if (event.dateRange) {
                            accordionDate = `
                                <time datetime="${event.dateRange.start}">${formatDate(event.dateRange.start)}</time>
                                -
                                <br>
                                <time datetime="${event.dateRange.end}">${formatDate(event.dateRange.end)}</time>
                            `;
                        }
                        
                        let descriptionHTML = '';
                        let buttonHTML = '';
                        
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
                        
                        container.insertAdjacentHTML('beforeend', eventItemHTML);
                        
                    });
                    
                    mainContainer.appendChild(container);
                });
            });
            
            initializeAccordions();
        }
    })
    .catch((error) => console.error("Error loading JSON:", error));