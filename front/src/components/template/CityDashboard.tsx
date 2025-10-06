"use client";

import CommonModelDashboard from "./CommonModelDashboard";
import CityUpdateModal from "./CityUpdateModal";
import SeedCityZonesModal from "./SeedCityZonesModal";
import { ModelName } from "@/utils/helper";

interface TData {
  _id: string;
  name: string;
}

interface CityDashboardProps {
  data: TData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  token?: string;
  lesanUrl: string;
}

const CityDashboard: React.FC<CityDashboardProps> = ({
  data,
  model,
  remove,
  token,
  lesanUrl,
}) => {
  const CityUpdateModalWrapper = ({
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
    <CityUpdateModal
      isOpen={isOpen}
      onClose={onClose}
      cityId={itemId}
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
      updateModal={CityUpdateModalWrapper}
      seedZonesModal={SeedCityZonesModal}
    />
  );
};

export default CityDashboard;
