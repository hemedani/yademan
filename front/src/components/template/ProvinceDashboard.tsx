"use client";

import CommonModelDashboard from "./CommonModelDashboard";
import ProvinceUpdateModal from "./ProvinceUpdateModal";
import { ModelName } from "@/utils/helper";

interface TData {
  _id: string;
  name: string;
}

interface ProvinceDashboardProps {
  data: TData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  token?: string;
  lesanUrl: string;
}

const ProvinceDashboard: React.FC<ProvinceDashboardProps> = ({
  data,
  model,
  remove,
  token,
  lesanUrl,
}) => {
  const ProvinceUpdateModalWrapper = ({
    isOpen,
    onClose,
    itemId,
    token,
    lesanUrl,
    onSuccessAction,
  }: {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    token?: string;
    lesanUrl?: string;
    onSuccessAction: () => void;
  }) => (
    <ProvinceUpdateModal
      isOpen={isOpen}
      onClose={onClose}
      provinceId={itemId}
      token={token}
      lesanUrl={lesanUrl || ""}
      onSuccessAction={onSuccessAction}
    />
  );

  return (
    <CommonModelDashboard
      data={data}
      model={model}
      remove={remove}
      token={token}
      lesanUrl={lesanUrl}
      updateModal={ProvinceUpdateModalWrapper}
    />
  );
};

export default ProvinceDashboard;
