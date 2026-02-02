import Link from "next/link";

const PrivacyPolicy = () => {
  const privacyData = [
    {
      title: "1. Definitions",
      list: [
        <>
          <span className="font-semibold">Personal Data:</span> any information
          relating to an identified or identifiable natural person, including
          name, email, phone, CV contents, skills, certifications, and usage
          data.
        </>,
        <>
          <span className="font-semibold">Processing:</span> any operation
          performed on Personal Data (collection, use, storage, alteration,
          transfer, deletion).
        </>,
        <>
          <span className="font-semibold">Third Party:</span> any entity other
          than you or NextCybr.
        </>,
        <>
          <span className="font-semibold">User:</span> any individual using the
          NextCybr platform (students, mentors, organizations, and training
          providers).
        </>,
      ],
    },
    {
      title: "2. Data Collection & Use",
      content: [
        "We collect and process your Personal Data for the following purposes:",
      ],
      list: [
        <>
          <span className="font-semibold">
            Account registration and verification:
          </span>{" "}
          Name, email, password, role, profile data —{" "}
          <i>Performance of contract / consent</i>.
        </>,
        <>
          <span className="font-semibold">
            Building and maintaining NextGen CV:
          </span>{" "}
          Education, work experience, skills, certifications, goals —{" "}
          <i>Performance of contract</i>.
        </>,
        <>
          <span className="font-semibold">AI-driven recommendations:</span>{" "}
          Profile data, activity, CV content —{" "}
          <i>Legitimate interest / performance of contract</i>.
        </>,
        <>
          <span className="font-semibold">Job matching & recruitment:</span>{" "}
          Profile visibility, skills & certifications shared with organizations
          — <i>Your consent / contract</i>.
        </>,
        <>
          <span className="font-semibold">Payment processing:</span> Payment
          card or bank data (via third-party gateway) —{" "}
          <i>Performance of contract</i>.
        </>,
        <>
          <span className="font-semibold">
            Analytics, cookies, site improvement:
          </span>{" "}
          Usage data, IP, device info, cookie preferences —{" "}
          <i>Legitimate interest / consent</i>.
        </>,
        <>
          <span className="font-semibold">Support and communications:</span>{" "}
          Contact details, support logs —{" "}
          <i>Legitimate interest / performance of contract</i>.
        </>,
      ],
    },
    {
      title: "3. Cookies & Tracking",
      content: [
        "We use cookies and similar technologies for site functionality, analytics, and personalized user experience. You will be presented with options to accept, decline, or configure cookie preferences. Please note that disabling or declining certain cookies may impair functionality (e.g., AI suggestions, session persistence).",
      ],
    },
    {
      title: "4. Data Sharing & Disclosure",
      list: [
        "With organizations / recruiters when you apply or make your profile visible.",
        "With training providers you engage with (for certification delivery).",
        "With third-party service providers (e.g., hosting, analytics, payment processors) bound by confidentiality.",
        "When required by law, regulation, court order, or government request.",
        "In connection with a merger, acquisition, or sale of all or part of NextCybr’s business (with notice).",
        "We will not sell your Personal Data to third parties.",
      ],
    },
    {
      title: "5. Data Storage & Security",
      list: [
        "Personal Data is stored on secure, industry-standard infrastructure.",
        "We employ encryption, access controls, firewalls, and other safeguards.",
        "While we strive to use commercially appropriate means to protect your data, no method of transmission or storage is 100% secure.",
      ],
    },
    {
      title: "6. Retention & Deletion",
      list: [
        "We retain Personal Data as long as necessary to fulfill the purposes in this Policy, comply with legal obligations, and enforce our agreements.",
        "You may request deletion of your data (subject to legal/contractual obligations).",
      ],
    },
    {
      title: "7. Your Rights",
      content: [
        "Depending on your jurisdiction and local law, you may have the following rights:",
      ],
      list: [
        "Access and correction of your Personal Data.",
        "Deletion or erasure (the “right to be forgotten”) where legally applicable.",
        "Restrict or object to certain processing (e.g. profiling).",
        "Withdraw consent (where processing is based on consent).",
        "Data portability (requesting your data in machine-readable form).",
        <>
          To exercise your rights, contact us at:{" "}
          <Link href="mailto:[your legal / data email address]">
            [your legal / data email address]
          </Link>
        </>,
      ],
    },
    {
      title: "8. AI Transparency",
      list: [
        "We use AI to generate recommendations (certifications, training paths, job matches, mentor suggestions) based on your data. These outputs are advisory and not guarantees. You should not rely solely on AI for career, hiring, or training decisions; human discretion and validation remain paramount.",
      ],
    },
    {
      title: "9. Children & Minors",
      list: [
        "You must be at least 13 years old to use NextCybr. If you are under 18, you may only use the platform under parental or guardian supervision.",
      ],
    },
    {
      title: "10. Changes to This Policy",
      list: [
        "We may update this Privacy Policy periodically. We will post changes on our site with a revised “Effective Date.” Your continued use of NextCybr constitutes acceptance of those changes.",
      ],
    },
    {
      title: "Use of AI (additional note)",
      list: [
        "We process user data to provide AI-powered recommendations.",
        "AI outputs are generated dynamically and may evolve as your data and activity on the platform change.",
        "We do not sell or share individual AI-generated insights with third parties, except when you choose to apply for jobs or share your profile with organizations.",
      ],
    },
  ];

  return (
    <section className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 flex flex-col gap-5 py-15">
        <h1 className="text-[32px] leading-[40px] sm:text-[48px] sm:leading-[60px] text-g-100">
          NextCybr Privacy Policy
        </h1>
        <p className="text-g-200 mb-5">
          NextCybr (“we,” “us,” “our”) is committed to protecting your privacy
          and ensuring transparency in how we collect, use, share, and store
          personal data. This Privacy Policy describes these practices and your
          rights.
        </p>
        <div className="space-y-10 text-base leading-relaxed text-text">
          {privacyData.map((item, index) => (
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

export default PrivacyPolicy;
