import { getUser } from "@/app/actions/user/getUser";
import UserProfileCard from "@/components/organisms/user/UserProfileCard";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const _id = (await params).id;
  const { body, success } = await getUser(_id);

  return (
    <>
      {success ? (
        <UserProfileCard user={body} isAdminContext={true} />
      ) : (
        <div className="bg-red-900/30 text-red-400 p-4 rounded-lg border border-red-700">
          مشکلی در دریافت اطلاعات کاربر وجود دارد - {body.message}
        </div>
      )}
    </>
  );
};

export default Page;
