export function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-g-800 border border-[#1B1C1E] rounded-lg">
      <div className="flex items-center gap-3 p-5 border-b bg-g-700 border-[#1B1C1E]">
        <div className="w-12 h-12 rounded-full bg-gray-500" />
        <div>
          <p className="text-sm font-medium text-[#CDCECE]">Pradeep Gusain</p>
          <p className="text-xs text-[#9C9C9D]">Online</p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-500" />
          <div>
            <div className="bg-g-700 text-[#9C9C9D] px-3 py-2 rounded-lg max-w-[450px] text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <p className="text-xs text-[#6A6B6C] mt-1">22:48</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <div>
            <div className="bg-primary text-[#CDCECE] px-3 py-2 rounded-lg max-w-[450px] text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
            <p className="text-xs text-[#6A6B6C] mt-1 text-right">22:48</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-500" />
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-500" />
          <div>
            <div className="bg-g-700 text-[#9C9C9D] px-3 py-2 rounded-lg max-w-[450px] text-sm">
              Aliquam tincidunt nisl diam, a consequat tellus venenatis semper.
            </div>
            <p className="text-xs text-[#6A6B6C] mt-1">22:48</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#1B1C1E]">
        <div className="flex items-center gap-3 px-5 py-3 bg-[#1B1C1E] rounded-lg">
          <input
            placeholder="Type your message"
            className="bg-transparent outline-none text-sm text-[#CDCECE] placeholder-[#6A6B6C] flex-1"
          />
          <button className="cursor-pointer">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5705 0.0724892C13.4197 -0.254121 14.2541 0.580255 13.9275 1.42945L9.35155 13.3269C8.98573 14.2781 7.61546 14.2028 7.35611 13.2171L6.06459 8.30949C6.01643 8.1265 5.87356 7.98356 5.69051 7.9354L0.782861 6.64388C-0.202793 6.38453 -0.278128 5.01429 0.673149 4.64842L12.5705 0.0724892ZM12.9475 1.05252L1.05008 5.62845L5.95777 6.91997C6.50679 7.06445 6.93561 7.4932 7.08009 8.04229L8.37154 12.9499L12.9475 1.05252Z"
                fill="#9C9C9D"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
