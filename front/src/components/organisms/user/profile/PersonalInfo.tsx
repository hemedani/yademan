import { format } from "date-fns-jalali";
import { translateGender } from "@/utils/helper";
import { userSchema } from "@/types/declarations/selectInp";
import { UserIcon, CalendarIcon } from "@/components/atoms/Icons";

interface PersonalInfoProps {
  user: userSchema;
}

const PersonalInfo = ({ user }: PersonalInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="group bg-gray-700/30 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-600 rounded-lg text-pink-400">
            <UserIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-400">نام پدر</label>
        </div>
        <p className="text-gray-300 font-medium pr-11">{user.father_name}</p>
      </div>

      <div className="group bg-gray-700/30 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-600 rounded-lg text-pink-400">
            <UserIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-400">جنسیت</label>
        </div>
        <p className="text-gray-300 font-medium pr-11">
          {translateGender(user.gender)}
        </p>
      </div>

      <div className="group bg-gray-700/30 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-600 rounded-lg text-pink-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-400">
            تاریخ تولد
          </label>
        </div>
        <p className="text-gray-300 font-medium pr-11">
          {user.birth_date
            ? format(new Date(user.birth_date), "yyyy/MM/dd")
            : "نامشخص"}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;
