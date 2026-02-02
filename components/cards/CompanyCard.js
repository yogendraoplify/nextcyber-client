import { MapPin, Users, ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QuillContentViewer from "../QuillContentViewer";

const CompanyCard = ({ company }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  return (
    <div className="w-full bg-g-700 rounded-[10px] overflow-hidden shadow-2xl p-4 border border-g-500 min-h-full">
      <div className="flex flex-col h-full justify-between">
      <div>
      <div
        className="h-28 rounded-[10px]"
        style={{
          background: "linear-gradient(95.18deg, #FFFAD2 0%, #CFFFC8 100%)",
        }}
      ></div>

      <div className="flex items-end gap-2 px-5 -mt-6">
        {company?.profilePicture?.url ? (
          <div className="bg-g-700 rounded-[10px]">
            <Image
              src={company?.profilePicture?.url}
              alt={`${company?.companyName} logo`}
              width={64}
              height={64}
              className="rounded-[10px] border-2 border-dark-yellow"
              onLoad={(event) => {
                event.target.style.opacity = 1;
              }}
              style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-g-900 rounded-[10px] border-2 border-dark-yellow flex items-center justify-center">
            <span className="text-white font-bold text-lg">dyson</span>
          </div>
        )}

        <h2 className="text-white text-md font-semibold mb-2 truncate">
          {company?.companyName}
        </h2>
      </div>
      </div>

      <div className="flex flex-col justify-between h-[250px] ">

      <div className="pt-3 ">
        <p className="text-g-100 text-md mb-3">
          {company?.companyTagline ||
            "Innovating the future, one step at a time."}
        </p>
        <span className="text-g-100  leading-relaxed mb-4 line-clamp-3">
          {company?.about && company?.about.length > 0 ? (
            <QuillContentViewer html={truncateText(company.about, 100)} />
          ) : (
            "Google LLC is an American multinational technology corporation focused on information technology, online advertising..."
          )}
        </span>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{company?.headquarter}</span>
          </div>
          <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-sm">
            <Users className="w-4 h-4" />
            <span>{company?.companySize || 1}+</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/companies/${company?.id}`}
          className="flex-1 bg-primary text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span className="truncate">124 Open Jobs</span>
          <ArrowUpRight className="w-5 h-5" />
        </Link>
        <button className="bg-primary text-white p-3.5 rounded-lg transition-colors cursor-pointer">
          <Globe className="w-5 h-5" />
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default CompanyCard;
