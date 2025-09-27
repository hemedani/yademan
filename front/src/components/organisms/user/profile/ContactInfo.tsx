import { userSchema } from "@/types/declarations/selectInp";
import { MapPinIcon, CalendarIcon } from "@/components/atoms/Icons";

// Email icon component
const EmailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ContactInfoProps {
  user: userSchema;
}

const ContactInfo = ({ user }: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="group bg-gray-50/50 hover:bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <EmailIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-600">ایمیل</label>
        </div>
        <p className="text-gray-800 font-medium pr-11">{user.email}</p>
      </div>

      <div className="group bg-gray-50/50 hover:bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-600">
            تاریخ تولد
          </label>
        </div>
        <p className="text-gray-800 font-medium pr-11">
          {user.birth_date
            ? new Date(user.birth_date).toLocaleDateString("fa-IR")
            : "نامشخص"}
        </p>
      </div>

      <div className="group bg-gray-50/50 hover:bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <MapPinIcon className="w-5 h-5" />
          </div>
          <label className="text-sm font-medium text-gray-600">آدرس</label>
        </div>
        <p className="text-gray-800 font-medium pr-11">
          {user.address || "نامشخص"}
        </p>
      </div>
    </div>
  );
};

export default ContactInfo;
