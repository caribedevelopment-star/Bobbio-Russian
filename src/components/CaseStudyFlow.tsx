import styles from "./CaseStudyFlow.module.css";

const steps = [
  ["01", "FILM", "Atmosphere"],
  ["02", "IDEA", "System logic"],
  ["03", "VISUAL", "Project world"],
  ["04", "3D", "Catalogue objects"],
] as const;

export default function CaseStudyFlow() {
  return (
    <nav className={styles.flow} aria-label="Urban Ponics case study structure">
      <div className={styles.label}><span>CASE STUDY INDEX</span><b>URBAN PONICS</b></div>
      {steps.map(([no, title, meta], index) => (
        <div className={styles.step} key={no}>
          <span>{no}</span>
          <div><b>{title}</b><small>{meta}</small></div>
          {index < steps.length - 1 && <i />}
        </div>
      ))}
    </nav>
  );
}
