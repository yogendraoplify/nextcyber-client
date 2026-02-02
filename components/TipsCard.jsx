export default function TipsCard({ tips }) {
  return (
    <div className="w-[250px] absolute -top-1/2 -translate-y-1/2 rounded-lg border-[0.2px] border-g-400 bg-[rgba(7,8,10,0.05)] backdrop-blur-[10px] shadow-[0_0_16px_4px_rgba(0,0,0,0.2)] p-3 flex flex-col gap-1">
      <h4 className="text-xs font-semibold text-g-200">Tips</h4>

      <ul className="list-disc list-inside space-y-1 text-xs font-medium text-g-100">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
