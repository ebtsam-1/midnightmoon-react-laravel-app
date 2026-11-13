import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function ProjectDetails({
  projects = [],
  onViewActivities = (project) => console.log("View activities:", project.id),
  onViewReports = (project) => console.log("View reports:", project.id),
  onAssign = (project) => console.log("Get assigned:", project.id),
}) {
  const { id } = useParams();
  const location = useLocation();
  const [isAssigned, setIsAssigned] = useState(false);

  // Return to the same list page the visitor came from
  const fromPage = location.state?.fromPage ?? 1;
  const backTo = `/projects?page=${fromPage}`;

  const project = projects.find((item) => String(item.id) === id);

  // Start at the top and reset the assigned state when the project changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAssigned(false);
  }, [id]);

  if (!project) {
    return (
      <main className="projects-page">
        <div className="projects-empty">
          <h1 className="projects-empty__title">Project not found</h1>
          <p className="projects-empty__text">
            This project may have been removed or the link is incorrect.
          </p>
          <Link to="/projects" className="projects-btn projects-btn--primary">
            Browse all projects
          </Link>
        </div>
      </main>
    );
  }

  const handleAssign = () => {
    onAssign(project);
    setIsAssigned(true);
  };

  return (
    <main className="projects-page">
      <div className="project-detail-page">
        <Link to={backTo} className="projects-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to projects
        </Link>

        <article className="project-detail">
          <div className="project-detail__media">
            <img
              className="project-detail__image"
              src={project.image}
              alt={`${project.title} cover`}
            />
          </div>

          <div className="project-detail__body">
            <h1 className="project-detail__title">{project.title}</h1>
            <p className="project-detail__description">{project.description}</p>

            <div className="project-detail__actions">
              <button
                type="button"
                className="projects-btn projects-btn--outline"
                onClick={() => onViewActivities(project)}
              >
                View activities
              </button>
              <button
                type="button"
                className="projects-btn projects-btn--outline"
                onClick={() => onViewReports(project)}
              >
                View reports
              </button>
              <button
                type="button"
                className="projects-btn projects-btn--primary"
                onClick={handleAssign}
                disabled={isAssigned}
              >
                {isAssigned ? "Assigned" : "Get assigned"}
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
