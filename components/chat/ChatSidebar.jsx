import { Search } from "lucide-react";

export function ChatSidebar() {
  return (
    <div className="w-[288px] bg-g-700 border border-g-600 rounded-lg flex flex-col">
      <div className="px-5 pt-5 text-[#9C9C9D] text-base font-semibold">
        Chats
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 px-5 py-4 bg-[#111214] border border-[#2F3031] rounded-lg">
          <Search className=" text-g-200" size={20} />

          <input
            placeholder="Search"
            className="bg-transparent outline-none text-sm text-[#CDCECE] placeholder-[#6A6B6C] w-full"
          />
        </div>
      </div>

      <div className="border-t border-[#1B1C1E] overflow-y-auto">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-3 py-3 border-b border-[#1B1C1E] cursor-pointer hover:bg-[#1B1C1E]`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gray-500" />
              <span
                className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#111214]
                  ${i % 2 === 0 ? "bg-[#16A600]" : "bg-[#DB0000]"}`}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#CDCECE]">
                Pradeep Gusain
              </p>
              <p className="text-xs text-[#9C9C9D] truncate">
                You: Yes it is opening for...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
