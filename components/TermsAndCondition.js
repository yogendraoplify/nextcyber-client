const TermsOfUse = () => {
  const termsData = [
    {
      title: "1. Parties & Acceptance",
      content: [
        "These Terms are a binding agreement between you (“User”) and NextCybr (registered in New Zealand). Use of our Services constitutes acceptance of these Terms. If you do not agree, you may not use NextCybr.",
      ],
    },
    {
      title: "2. Eligibility",
      list: [
        "You must be at least 13 years old to use our Services.",
        "Users under 18 must use the platform under parental or guardian supervision.",
      ],
    },
    {
      title: "3. Account Registration & Responsibilities",
      list: [
        "You agree to provide accurate, complete, and current information when registering.",
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
        "You must notify us immediately of unauthorized use of your account.",
      ],
    },
    {
      title: "4. User Roles & Permissions",
      list: [
        "Students / Job Seekers: May use free or paid (Pro) plans.",
        "Mentors: May register and set their own fees for mentorship sessions.",
        "Organizations: Enter contract or subscription-based agreements to post jobs and access talent features.",
      ],
    },
    {
      title: "5. Payments, Subscriptions & Fees",
      list: [
        "Payments are processed through third-party payment gateways.",
        "Free Plan: no charge for basic features.",
        "Pro Plan for Students / Job Seekers: subscription-based; charges apply only if you upgrade.",
        "Mentors may charge for sessions; NextCybr may take a commission as defined.",
        "Organizations are charged per contract or subscription.",
      ],
    },
    {
      title: "6. Cancellations & Refunds",
      list: [
        "You may cancel your subscription at least 48 hours before renewal to avoid being charged again.",
        "Refunds may be issued at our discretion in exceptional circumstances (e.g., technical failure, duplicate charge).",
      ],
    },
    {
      title: "7. User Conduct",
      content: ["You agree not to:"],
      list: [
        "Provide false, misleading, or fraudulent information.",
        "Misuse the platform (spam, harassment, unauthorized access).",
        "Copy or reuse any content except as permitted under license.",
        "Reverse engineer or tamper with the Services.",
        "Violate any applicable law or regulation.",
      ],
    },
    {
      title: "8. Limitation of Liability",
      list: [
        "To the maximum extent permitted by law, NextCybr is not liable for indirect, incidental, special, or consequential damages arising from your use of the Services.",
        "We do not guarantee job offers, mentorship success, or training outcomes.",
        "You are responsible for validating decisions; we provide tools and recommendations, not guarantees.",
      ],
    },
    {
      title: "9. Intellectual Property",
      list: [
        "All content, software, designs, and trademarks used by NextCybr are the property of NextCybr or our licensors.",
        "You may use content only as permitted; all rights reserved.",
      ],
    },
    {
      title: "10. AI & Recommendation Disclaimer",
      list: [
        "Our AI features (recommendations for jobs, certifications, mentors) are suggestions only and not guarantees. You should independently verify and assess any recommendation provided by the system.",
      ],
    },
    {
      title: "11. Governing Law & Dispute Resolution",
      list: [
        "These Terms are governed by the laws of New Zealand.",
        "You submit to the non-exclusive jurisdiction of New Zealand courts.",
      ],
    },
    {
      title: "12. Modifications",
      list: [
        "We may amend these Terms and will post updates on our site with an effective date. Continued use indicates acceptance of revised terms.",
      ],
    },
    {
      title: "AI Transparency (Additional Clause)",
      list: [
        "NextCybr uses AI to provide recommendations (e.g., certifications, learning pathways, job matches, and mentorship suggestions).",
        "These recommendations are based on the information you provide, public data, and patterns recognized by our algorithms.",
        "AI suggestions are for informational purposes only and should not be considered guaranteed outcomes or professional advice.",
        "Users are encouraged to validate recommendations and make their own career, hiring, or training decisions.",
      ],
    },
  ];

  return (
    <section className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 flex flex-col gap-5 py-15">
        <h1 className="text-[32px] leading-[40px] sm:text-[48px] sm:leading-[60px] text-g-100">
          NextCybr Terms of Use
        </h1>
        <p className=" text-g-200 mb-5">
          These Terms of Use (“Terms”) govern your access to and use of
          NextCybr’s website, platform, and services (collectively, “Services”).
          By using or accessing NextCybr, you agree to these Terms.
        </p>
        <div className="space-y-10 text-base leading-relaxed text-text">
          {termsData.map((item, index) => (
            <div key={index}>
              <h4 className="font-semibold text-xl text-heading text-g-100">
                {item.title}
              </h4>

              {item.list ? (
                <ul className="list-disc pl-5 mt-5 space-y-1 text-g-200">
                  {item.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              ) : (
                item.content?.map((p, i) => (
                  <p key={i} className="mt-5 text-g-200">
                    {p}
                  </p>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsOfUse;
