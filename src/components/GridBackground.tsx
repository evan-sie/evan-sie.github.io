export default function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(78, 79, 80, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(78, 79, 80, 0.47) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

