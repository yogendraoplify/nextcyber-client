import { ArrowRight } from "lucide-react";
import Image from "next/image";

const SettingsPage = () => {

  const SettingSection = ({ title, items, className = "" }) => (
    <div className={`flex flex-col rounded-[10px] overflow-hidden ${className}`}>
      <div className="bg-g-600 px-5 py-5 border-b border-g-600">
        <h2 className="text-g-100 text-xl font-medium leading-6">{title}</h2>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className={`bg-g-700 px-5 py-4 flex justify-between items-center ${
            index < items.length - 1 ? 'border-b border-g-600' : ''
          }`}
        >
          <span className="text-g-200 text-sm leading-5">{item}</span>
          <div className="flex items-center">
            <ArrowRight className="text-g-200" size={20} />
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-g-900">
      <div className="max-w-[748px] mx-auto flex flex-col gap-5">
        {/* Profile Settings */}
        <SettingSection
          title="Profile Settings"
          items={[
            "Edit personal details",
            "Change profile photo",
            "Manage social links"
          ]}
        />

        {/* Account Settings */}
        <SettingSection
          title="Account Settings"
          items={[
            "Manage password",
            "Login activity",
            "Account verification",
            "Delete/Deactivate account"
          ]}
        />

        {/* Subscription & Billing */}
        <SettingSection
          title="Subscription & Billing"
          items={[
            "Manage subscription plan",
            "Payment history & invoices"
          ]}
        />

        {/* Notifications */}
        <SettingSection
          title="Notifications"
          items={["Email & SMS preference"]}
        />

        {/* Privacy Settings */}
        <SettingSection
          title="Privacy Settings"
          items={[
            "Manage profile visibility",
            "Manage contact details",
            "Hide resume/CV from search"
          ]}
        />

        {/* Communication Settings */}
        <SettingSection
          title="Communication Settings"
          items={["Message preference"]}
        />

        {/* Security Settings */}
        <SettingSection
          title="Security Settings"
          items={[
            "Session management",
            "Password strength meter"
          ]}
        />

        {/* Help & Support */}
        <SettingSection
          title="Help & Support"
          items={[
            "Contact support",
            "Terms of Service / Privacy Policy",
            "Report a bug or issue"
          ]}
        />
      </div>
    </div>
  );
};

export default SettingsPage;