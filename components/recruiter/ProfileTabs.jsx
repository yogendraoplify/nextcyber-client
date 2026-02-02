"use client";

export default function ProfileTabs({ active, onChange }) {
  const tabs = [
    { key: "company", label: "Company Details" },
    { key: "profile", label: "Profile" },
    { key: "nextcybr", label: "NextCybr Profile" },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-g-700 border border-g-500 rounded-full mx-auto w-fit whitespace-nowrap">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer
              ${
                isActive
                  ? "bg-primary text-g-50"
                  : "text-g-200 hover:text-[#CDCECE]"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
