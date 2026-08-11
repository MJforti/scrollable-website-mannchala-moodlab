export function NeumorphicCircuit() {
  return (
    <div className="w-full py-8 flex justify-center items-center pointer-events-none opacity-40">
      <svg
        width="320"
        height="40"
        viewBox="0 0 320 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-zinc-500"
      >
        <path
          d="M0 20H100L120 5H200L220 20H320"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="160" cy="5" r="3" fill="currentColor" />
        <circle cx="60" cy="20" r="2" fill="currentColor" />
        <circle cx="260" cy="20" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
