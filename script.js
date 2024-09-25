/* // document.addEventListener("DOMContentLoaded", function () {
    // Load projects from the server
   // fetch('projects.php')
        .then(response => response.json())
        .then(data => {
            let projectsList = document.getElementById('projects-list');
            data.forEach(project => {
                let projectCard = document.createElement('div');
                projectCard.className = 'col-md-4';
                projectCard.innerHTML = `
                    <div class="card">
                        <img src="${project.image}" class="card-img-top" alt="${project.title}">
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text">${project.description}</p>
                            <a href="${project.link}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                `;
                projectsList.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error fetching projects:', error));
});
 */