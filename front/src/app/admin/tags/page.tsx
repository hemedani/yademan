import ClientCommonModelDashboard from "@/components/template/clientCommonModelDashboard";
import SearchBox from "@/components/molecules/SearchBox";
import Pagination from "@/components/molecules/Pagination";
import { ReqType } from "@/types/declarations/selectInp";
import { gets } from "@/app/actions/tag/gets";
import { count } from "@/app/actions/tag/count";
import { remove } from "@/app/actions/tag/remove";
import { add } from "@/app/actions/tag/add";
import { update } from "@/app/actions/tag/update";
import { translateModelNameToPersian } from "@/utils/helper";

export default async function TagsDashboard({
  searchParams,
}: {
  searchParams: Promise<ReqType["main"]["tag"]["gets"]["set"]>;
}) {
  const { limit = "20", page = "1", name } = await searchParams;

  const set: ReqType["main"]["tag"]["gets"]["set"] = {
    limit: +limit || 20,
    page: +page,
    name,
  };
  const get: ReqType["main"]["tag"]["gets"]["get"] = {
    _id: 1,
    name: 1,
    icon: 1,
    description: 1,
    color: 1,
  };

  const data = await gets({ set, get });
  const counted = await count({
    set: set.name ? { name: set.name } : {},
    get: { qty: 1 },
  });

  return (
    <div className="relative min-h-full">
      <div className="flex items-start">
        <div className="bg-blue-500 w-1 h-8 ml-3 rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
            {translateModelNameToPersian("tag")}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            مدیریت {translateModelNameToPersian("tag")}
          </p>
        </div>
      </div>
      <SearchBox title="name" defaultValue={name} />
      <ClientCommonModelDashboard
        data={data.success ? data.body : []}
        model="tag"
        remove={remove}
        add={add}
        update={update}
      />
      <Pagination countPage={counted?.body.qty} initialPage={+page} />
    </div>
  );
}
