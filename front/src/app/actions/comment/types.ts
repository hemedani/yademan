export interface Comment {
  _id: string;
  text: string;
  rating?: number;
  status: "pending" | "approved" | "rejected";
  is_anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    level?: string;
    is_verified?: boolean;
    avatar?: {
      _id: string;
      name: string;
      mimType: string;
      size: number;
      alt_text?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  place: {
    _id: string;
    name: string;
    description?: string;
    center: {
      type: "Point";
      coordinates: number[];
    };
    area: {
      type: "MultiPolygon";
      coordinates: number[][];
    };
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CommentFormData {
  text: string;
  rating?: number;
  is_anonymous?: boolean;
  placeId: string; // This is the name used in the frontend, but sent as 'place' to backend
}

export interface CommentUpdateData extends CommentFormData {
  _id: string;
}

export interface GetCommentsParams {
  page?: number;
  limit?: number;
  placeId?: string;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}

// Helper function to transform backend comment to frontend format
export const transformComment = (backendComment: any): Comment => {
  return {
    _id: backendComment._id || "",
    text: backendComment.text || "",
    rating: backendComment.rating,
    status: backendComment.status || "pending",
    is_anonymous: backendComment.is_anonymous || false,
    createdAt: backendComment.createdAt || new Date().toISOString(),
    updatedAt: backendComment.updatedAt || new Date().toISOString(),
    user: backendComment.user || {
      _id: "",
      first_name: "",
      last_name: "",
      email: "",
    },
    place: backendComment.place || {
      _id: "",
      name: "",
      description: "",
      center: { type: "Point", coordinates: [0, 0] },
      area: { type: "MultiPolygon", coordinates: [[]] },
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

// Helper function to get default comment values
export const getDefaultCommentFormData = (): CommentFormData => {
  return {
    text: "",
    rating: undefined,
    is_anonymous: false,
    placeId: "",
  };
};
