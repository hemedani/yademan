// Purpose: Popup component that renders location details when a marker is clicked on the map

"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Location } from "@/types/location";
import Button from "@/components/ui/Button";

interface LocationPopupProps {
  location: Location;
  containerId: string;
}

const LocationPopup = ({ location, containerId }: LocationPopupProps) => {
  const container = document.getElementById(containerId);

  if (!container) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case "hotel":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0" />
          </svg>
        );
      case "attraction":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case "shopping":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "restaurant": return "bg-red-100 text-red-700";
      case "hotel": return "bg-blue-100 text-blue-700";
      case "attraction": return "bg-green-100 text-green-700";
      case "shopping": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Fill remaining stars with empty ones
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <svg key={i} className="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return createPortal(
    <div className="min-w-[280px] max-w-[320px]">
      {/* Image */}
      {location.images && location.images.length > 0 && (
        <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
          <Image
            src={location.images[0]}
            alt={location.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
            {location.name}
          </h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(location.category)}`}>
            {getCategoryIcon(location.category)}
            <span className="ml-1 capitalize">{location.category}</span>
          </div>
        </div>

        {/* Rating */}
        {location.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-0.5">
              {renderStars(location.rating)}
            </div>
            <span className="text-xs text-gray-600">
              {formatRating(location.rating)}
            </span>
            {location.reviewCount && (
              <span className="text-xs text-gray-500">
                ({location.reviewCount} reviews)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {location.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {location.description}
        </p>
      )}

      {/* Address */}
      {location.address && (
        <div className="flex items-start space-x-2 mb-3">
          <svg className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-xs text-gray-600 leading-tight">
            {location.address}
          </span>
        </div>
      )}

      {/* Quick info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        {location.distance && (
          <span>{location.distance.toFixed(1)} km away</span>
        )}
        {location.isOpen !== undefined && (
          <span className={location.isOpen ? "text-green-600" : "text-red-600"}>
            {location.isOpen ? "Open" : "Closed"}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Link href={`/location/${location.id}`} className="flex-1">
          <Button size="sm" className="w-full text-xs">
            View Details
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            // Handle directions
            const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
            window.open(url, '_blank');
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z" />
          </svg>
        </Button>
      </div>
    </div>,
    container
  );
};

export default LocationPopup;
