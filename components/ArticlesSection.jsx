"use client";

export default function ArticlesSection() {
  return (
    <div className="space-y-16  pt-17 pb-35 max-w-[1440px] mx-auto">
      <div className=" flex-col xl:flex-row flex gap-10">
        <div className=" w-full xl:w-1/2 h-[280px] sm:h-[380px] bg-g-500 rounded-lg" />

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-g-100 text-4xl font-medium leading-[44px] tracking-[-0.01em]">
            Cloud Threats Doubled In 5 Years: How Do Europe’s Digital Defences
            Measure Up?
          </h1>

          <p className="mt-6 text-g-200 text-base leading-6 max-w-[625px]">
            With cloud breach risks doubling in less than five years and 2024
            seeing the highest volume of ransomware attacks, the pressure is
            mounting on businesses, governments, and regulators to respond.
          </p>

          <span className="mt-8 text-g-300 text-xs">May 01, 2025</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <article key={i} className="flex flex-col gap-5">
            <div className="w-full h-[220px] bg-g-500 rounded-lg" />
            <div className="flex flex-col gap-4">
              <h3 className="text-g-100 text-xl font-medium leading-6">
                Cyberr: How Anonymous Registration Puts Job Seekers in Control
              </h3>

              <p className="text-g-200 text-base leading-6 line-clamp-3">
                With cloud breach risks doubling in less than five years and
                2024 seeing the highest volume of ransomware attacks, the
                pressure...
              </p>

              <span className="text-g-100 text-xs">May 01, 2025</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
