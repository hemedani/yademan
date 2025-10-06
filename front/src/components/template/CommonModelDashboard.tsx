"use client";

import { useState } from "react";
import EntityCard from "../organisms/EntityCard";
import { DeleteModal } from "./DeleteModal";
import { useRouter } from "next/navigation";
import {
  ModelName,
  ToastNotify,
  translateModelNameToPersian,
} from "@/utils/helper";

interface TData {
  _id: string;
  name: string;
}

interface CommonDashboardProps {
  data: TData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  token?: string;
  lesanUrl?: string;
  updateModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    token?: string;
    lesanUrl?: string;
    onSuccessAction: () => void;
  }>;
  seedZonesModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    cityId: string;
    cityName: string;
    token?: string;
  }>;
}

const CommonModelDashboard: React.FC<CommonDashboardProps> = ({
  data,
  model,
  remove,
  token,
  lesanUrl,
  updateModal: UpdateModal,
  seedZonesModal: SeedZonesModal,
}) => {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<
    "edit" | "delete" | "seedZones" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<TData | null>(null);
  const [hardCascade, setHardCascade] = useState<boolean>(false);

  const openModal = (
    type: "edit" | "delete" | "seedZones",
    item: TData | null = null,
  ) => {
    setSelectedItem(item);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setHardCascade(false);
  };

  const confirmDelete = async () => {
    if (selectedItem?._id) {
      const removedItem = await remove(selectedItem._id, hardCascade);

      if (removedItem.success) {
        ToastNotify(
          "success",
          `${translateModelNameToPersian(model)} با موفقیت حذف شد`,
        );
      } else {
        ToastNotify(
          "error",
          `مشکلی در حذف ${translateModelNameToPersian(model)} وجود دارد - ${removedItem.body.message}}`,
        );
      }

      router.refresh();
    }
    closeModal();
  };

  const handleUpdateSuccess = () => {
    router.refresh();
    closeModal();
  };

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {data?.map((item, index) => (
          <div
            key={item._id}
            className="transform transition-all duration-500 ease-in-out"
            style={{
              animationDelay: `${index * 0.05}s`,
              animation: "fadeInUp 0.5s ease-out forwards",
            }}
          >
            <EntityCard
              title={item.name}
              onDelete={() => openModal("delete", item)}
              onEdit={() => openModal("edit", item)}
              onSeedZones={
                SeedZonesModal ? () => openModal("seedZones", item) : undefined
              }
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {activeModal === "edit" && selectedItem && UpdateModal && (
        <UpdateModal
          isOpen
          onClose={closeModal}
          itemId={selectedItem._id}
          token={token}
          lesanUrl={lesanUrl}
          onSuccessAction={handleUpdateSuccess}
        />
      )}

      {activeModal === "delete" && (
        <DeleteModal
          isVisible
          onConfirm={confirmDelete}
          onCancel={closeModal}
          message={`آیا مطمئن هستید که می‌خواهید این ${translateModelNameToPersian(model)} را حذف کنید؟ این عمل قابل بازگشت نیست.`}
          isHardCascade={hardCascade}
          onHardCascadeChange={setHardCascade}
        />
      )}

      {activeModal === "seedZones" && selectedItem && SeedZonesModal && (
        <SeedZonesModal
          isOpen
          onClose={closeModal}
          cityId={selectedItem._id}
          cityName={selectedItem.name}
          token={token}
        />
      )}
    </div>
  );
};

export default CommonModelDashboard;
