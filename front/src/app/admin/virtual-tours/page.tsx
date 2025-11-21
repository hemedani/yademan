import VirtualToursDashboard from "@/components/template/VirtualToursDashboard";
import SearchBox from "@/components/molecules/SearchBox";
import Pagination from "@/components/molecules/Pagination";
import { ReqType } from "@/types/declarations/selectInp";
import { gets } from "@/app/actions/virtual_tour/gets";
import { count } from "@/app/actions/virtual_tour/count";
import { remove } from "@/app/actions/virtual_tour/remove";

import { cookies } from "next/headers";
import { translateModelNameToPersian } from "@/utils/helper";
import Link from "next/link";

export default async function VirtualToursManagement({
  searchParams,
}: {
  searchParams: Promise<ReqType["main"]["virtual_tour"]["gets"]["set"]>;
}) {
  const { limit = "20", page = "1", name, placeId } = await searchParams;

  const set: ReqType["main"]["virtual_tour"]["gets"]["set"] = {
    limit: +limit || 20,
    page: +page,
    name,
    placeId,
  };
  const get: ReqType["main"]["virtual_tour"]["gets"]["get"] = {
    _id: 1,
    name: 1,
    description: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
    place: {
      _id: 1,
      name: 1,
    },
    panorama: {
      _id: 1,
      name: 1,
    },
  };

  const data = await gets({ set, get });
  const counted = await count({
    set: {
      name: set.name,
      placeId: set.placeId,
    },
    get: { qty: 1 },
  });

  const token = (await cookies()).get("token");
  const lesanUrl = process.env.LESAN_URL
    ? process.env.LESAN_URL
    : "http://localhost:1382";

  return (
    <div className="relative min-h-full text-white">
      <div className="flex items-start">
        <div className="bg-pink-600 w-1 h-8 ml-3 rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-3xl text-white font-bold">
            {translateModelNameToPersian("virtual_tour")}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            مدیریت {translateModelNameToPersian("virtual_tour")}
          </p>
        </div>
      </div>

      {/* Custom Add Button */}
      <div className="absolute top-1 left-5 mt-4">
        <Link
          href="/admin/virtual-tours/create"
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-pink-500/30"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          ایجاد تور مجازی جدید
        </Link>
      </div>

      <SearchBox title="name" defaultValue={name} />
      <VirtualToursDashboard
        data={data.success ? data.body : []}
        model="virtual_tour"
        remove={remove}
      />
      <Pagination countPage={counted?.body.qty} initialPage={+page} />
    </div>
  );
}
