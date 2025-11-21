import { userSchema } from "@/types/declarations/selectInp";
import { DocumentTextIcon } from "@/components/atoms/Icons";

interface SummarySectionProps {
  user: userSchema;
}

const SummarySection = ({ user }: SummarySectionProps) => {
  return (
    <div className="col-span-full">
      <div className="group bg-gray-700/30 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-600 rounded-lg text-pink-400">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-400">خلاصه</label>
        </div>
        <p className="text-gray-300 font-medium pr-11 whitespace-pre-wrap">
          {user.summary || "خلاصه‌ای ثبت نشده است"}
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
