import { FormCreateProvince } from "@/components/template/FormCreateProvince";
import { cookies } from "next/headers";
import Link from "next/link";

const Page = async () => {
  const token = (await cookies()).get("token");
  const lesanUrl = process.env.LESAN_URL
    ? process.env.LESAN_URL
    : "http://localhost:1382";
  return (
    <div className="p-6 min-h-full text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">ایجاد استان جدید</h1>
        <Link
          href="/admin/province"
          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 border border-gray-600"
        >
          بازگشت به لیست
        </Link>
      </div>
      <FormCreateProvince token={token?.value} lesanUrl={lesanUrl} />
    </div>
  );
};

export default Page;
