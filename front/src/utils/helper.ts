import toast from "react-hot-toast";

const translateArticleType = (articleType: string): string => {
  switch (articleType) {
    case "journalArticle":
      return "مقاله ژورنالی";
    case "book":
      return "کتاب";
    default:
      return "نامشخص";
  }
};

const translateGender = (gender: string): string => {
  switch (gender) {
    case "Male":
      return "مرد";
    case "Female":
      return "زن";
    default:
      return "نامشخص";
  }
};

const translateLevel = (level: string): string => {
  switch (level) {
    case "Ghost":
      return "ادمین";
    case "Manager":
      return "مدیر";
    case "Editor":
      return "ویرایشگر";
    case "Normal":
      return "عادی";
    default:
      return "نامشخص";
  }
};

const converDate = (formatDate: string) => {
  return new Date(formatDate).toLocaleDateString("fa-IR");
};

const CalculateDivision = (countPage: number, limit: number = 21): string => {
  const countPageData = countPage / limit;
  return countPageData.toFixed(0);
};

const ToastNotify = (type: "success" | "error", message: string) => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(`خطا - ${message}`);
  }
};

const ArrayToSelectOptions = <T>(
  data: T[],
  valueKey: keyof T,
  labelKey: keyof T,
  secondaryLabelKey?: keyof T,
) => {
  return data.map((item) => ({
    value: String(item[valueKey]),
    label: `${item[labelKey]} ${secondaryLabelKey ? item[secondaryLabelKey] : ""}`,
  }));
};

export type ModelName = "user" | "city" | "province" | "category" | "place" | "tag" | "virtual_tour";

function translateModelNameToPersian(modelName: ModelName): string {
  switch (modelName) {
    case "user":
      return "کاربر";
    case "city":
      return "شهر";
    case "province":
      return "استان";
    case "category":
      return "دسته  بندی";
    case "tag":
      return "برچسب";
    case "place":
      return "مکان";
    case "virtual_tour":
      return "تور مجازی";
    default:
      return "نامشخص";
  }
}

function snakeToKebabCase(input: string): string {
  return input.replace(/_/g, "-");
}

export {
  translateArticleType,
  CalculateDivision,
  ToastNotify,
  ArrayToSelectOptions,
  converDate,
  translateGender,
  translateLevel,
  translateModelNameToPersian,
  snakeToKebabCase,
};
