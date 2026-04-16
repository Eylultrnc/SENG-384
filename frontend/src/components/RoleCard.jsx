export default function RoleCard({ icon: Icon, title, description, onClick }) {
  return (
    <button className="role-card" onClick={onClick}>
      <div className="role-card__icon-wrap">
        <Icon size={44} strokeWidth={2.2} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}
