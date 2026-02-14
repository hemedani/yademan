import {
  isValidImageExtension,
  isValidPdfExtension,
  isValidGeoJsonExtension,
} from "@/utils/checkFileExtension";
import { AppApi, getLesanBaseUrl } from "@/services/api";
import { getImageUploadUrl } from "@/utils/imageUrl";
import React, { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

export const dynamic = "force-dynamic";

interface IUploadImage {
  setUploadedImage: (pic: string) => void;
  token?: string;
  inputName: string;
  type?: "video" | "image" | "doc" | "geo" | "json";
  filePath?: string;
  label?: string;
  isRequired?: boolean;
}

export const UploadImage = ({
  token,
  inputName,
  setUploadedImage,
  type,
  filePath,
  label,
  isRequired,
}: IUploadImage) => {
  const [isUploaded, setIsUploaded] = useState<"uploading" | boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setIsUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploaded("uploading");

    try {
      // Get the API instance
      const api = AppApi(undefined, token || Cookies.get("token") || undefined);

      // For file uploads, we need to make a direct request to the proxy
      // since we're dealing with FormData which is different from regular API calls
      const lesanBody = {
        service: "main",
        model: "file",
        act: "uploadFile",
        details: {
          get: { mimType: 1, _id: 1 },
          set: type ? { type } : {},
        },
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("lesan-body", JSON.stringify(lesanBody));

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout

      try {
        // Make the request to the proxy endpoint
        const response = await fetch("/api/proxy", {
          method: "POST",
          body: formData,
          headers: {
            // Only include token header if a token is available
            ...(token || Cookies.get("token") ? { token: token || Cookies.get("token") || "" } : {}),
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.success) {
          setUploadedImage(data.body._id); // اینجا باید _id برگشتی رو ست کنیم
          setIsUploaded(true);
        } else {
          console.error("Upload failed", data);
          alert(`خطا در بارگذاری: ${data.body?.message || "خطای ناشناخته"}`);
          setIsUploaded(false);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          console.error("Upload timeout", fetchError);
          alert("زمان بارگذاری به پایان رسید. لطفا فایل کوچکتری انتخاب کنید یا دوباره تلاش کنید.");
          setIsUploaded(false);
        } else {
          throw fetchError;
        }
      }
    } catch (error: any) {
      console.error("Error uploading file", error);
      alert(`خطا در بارگذاری فایل: ${error.message || "خطای شبکه"}`);
      setIsUploaded(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label htmlFor={inputName} className="text-sm font-medium text-gray-300 text-right">
          {label}
          {isRequired && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="p-4 bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-xl shadow-lg flex flex-col items-center">
        <label
          htmlFor={inputName}
          className="w-full py-3 bg-gray-700 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
        >
          <input
            type="file"
            id={inputName}
            hidden
            onChange={handleFileChange}
            accept={
              type === "image"
                ? "image/jpeg,image/png,image/webp,image/jpg"
                : type === "doc"
                  ? "application/pdf"
                  : type === "geo"
                    ? ".geojson,.json,.geo,application/json,application/geo+json"
                    : type === "video"
                      ? "video/*"
                      : "*"
            }
          />
          انتخاب فایل
        </label>

        {file && file.type === "image/jpeg" ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600">
            <Image
              className="w-full h-full object-cover"
              src={URL.createObjectURL(file)}
              alt="Uploaded image preview"
              width={400}
              height={160}
            />
          </div>
        ) : file && file.type === "application/pdf" ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600">
            <embed className="w-full h-full object-cover" src={URL.createObjectURL(file)} />
          </div>
        ) : file &&
          (file.type === "application/json" ||
            file.type === "application/geo+json" ||
            file.name.toLowerCase().endsWith(".geojson")) ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600 flex items-center justify-center bg-gray-700">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm text-gray-300">فایل GeoJSON</p>
              <p className="text-xs text-gray-400">{file.name}</p>
            </div>
          </div>
        ) : filePath && isValidImageExtension(filePath) ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600">
            <Image
              className="w-full h-full object-cover"
              src={getImageUploadUrl(filePath, "images")}
              alt="Uploaded image preview"
              width={400}
              height={160}
            />
          </div>
        ) : filePath && isValidPdfExtension(filePath) ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600">
            <embed className="w-full h-full object-cover" src={getImageUploadUrl(filePath, "docs")} />
          </div>
        ) : filePath && isValidGeoJsonExtension(filePath) ? (
          <div className="w-full h-40 mt-4 rounded-lg overflow-hidden border border-gray-600 flex items-center justify-center bg-gray-700">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm text-gray-300">فایل GeoJSON</p>
              <p className="text-xs text-gray-400">{filePath}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {file && (
          <button
            onClick={handleUpload}
            className={`mt-4 w-full h-10 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-pink-500/30 disabled:bg-gray-600`}
            disabled={isUploaded === "uploading" || isUploaded === true}
          >
            {isUploaded === "uploading"
              ? "در حال بارگذاری..."
              : isUploaded
                ? "بارگذاری موفق"
                : "بارگذاری"}
          </button>
        )}
      </div>
    </div>
  );
};
