// Test for Comment Section Components

// This file contains tests for our comment section components
// It verifies that components render properly and behave as expected

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommentSection from "@/components/organisms/CommentSection";
import CommentList from "@/components/organisms/CommentList";
import CommentCard from "@/components/molecules/CommentCard";
import CommentForm from "@/components/molecules/CommentForm";
import NeonButton from "@/components/atoms/NeonButton";
import CommentAvatar from "@/components/atoms/CommentAvatar";

// Mock server actions
jest.mock("@/app/actions/comment/create", () => ({
  createComment: jest.fn(),
  likeComment: jest.fn(),
  replyToComment: jest.fn(),
}));

jest.mock("@/app/actions/comment/gets", () => ({
  getCommentsForPlace: jest.fn(),
}));

// Test data
const mockComments = [
  {
    _id: "comment1",
    text: "This is a test comment",
    status: "approved" as const,
    is_anonymous: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    user: {
      _id: "user1",
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      level: "Ordinary" as const,
      is_verified: true,
      gender: "Male" as const,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    place: {
      _id: "place1",
      name: "Test Place",
      description: "A test place",
      center: { type: "Point", coordinates: [0, 0] },
      area: { type: "MultiPolygon", coordinates: [] },
      status: "active" as const,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  },
];

describe("Comment Section Components", () => {
  describe("CommentSection", () => {
    it("renders correctly with initial comments", async () => {
      render(
        <CommentSection placeId="test-place" initialComments={mockComments} />,
      );

      // Check that comments are displayed
      expect(screen.getByText(/Comments \(1\)/i)).toBeInTheDocument();
      expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    });

    it("allows adding a new comment", async () => {
      const { createComment } = require("@/app/actions/comment/create");
      render(
        <CommentSection placeId="test-place" initialComments={mockComments} />,
      );

      // Find the comment form
      const commentInput = screen.getByPlaceholderText(/Share your thoughts/i);

      // Type a new comment
      fireEvent.change(commentInput, { target: { value: "New test comment" } });

      // Click the submit button
      const submitButton = screen.getByRole("button", {
        name: /Post Comment/i,
      });
      fireEvent.click(submitButton);

      // Wait for the action to be called
      await waitFor(() => {
        expect(createComment).toHaveBeenCalledWith({
          text: "New test comment",
          userId: "user123",
          placeId: "test-place",
          rating: undefined,
        });
      });
    });
  });

  describe("CommentList", () => {
    it("renders a list of comments", () => {
      render(
        <CommentList comments={mockComments} currentUserName="Test User" />,
      );

      expect(screen.getByText("This is a test comment")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("shows empty state when no comments", () => {
      render(<CommentList comments={[]} currentUserName="Test User" />);

      expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
    });
  });

  describe("CommentCard", () => {
    it("renders correctly with all information", () => {
      render(
        <CommentCard
          id="comment1"
          userName="Test User"
          content="This is a test comment"
          timestamp="2024-01-01"
        />,
      );

      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    });

    it("shows reply form when reply button is clicked", () => {
      render(
        <CommentCard
          id="comment1"
          userName="Test User"
          content="This is a test comment"
          timestamp="2024-01-01"
        />,
      );

      // Click reply button
      const replyButton = screen.getByRole("button", { name: /Reply/i });
      fireEvent.click(replyButton);

      // Check that reply form appears
      expect(
        screen.getByPlaceholderText(/Reply to Test User/i),
      ).toBeInTheDocument();
    });
  });

  describe("CommentForm", () => {
    it("submits a comment when form is submitted", async () => {
      const mockSubmit = jest.fn();
      render(<CommentForm onSubmit={mockSubmit} userName="Test User" />);

      // Find the input
      const input = screen.getByPlaceholderText(/Write a comment/i);

      // Type a comment
      fireEvent.change(input, { target: { value: "Test comment content" } });

      // Submit the form
      const submitButton = screen.getByRole("button", {
        name: /Post Comment/i,
      });
      fireEvent.click(submitButton);

      // Wait for the callback to be called
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith("Test comment content", null);
      });
    });

    it("includes rating when submitted", async () => {
      const mockSubmit = jest.fn();
      render(<CommentForm onSubmit={mockSubmit} userName="Test User" />);

      // Find the rating button (star) and click to rate
      const star = screen.getAllByLabelText(/Rate \d out of \d/)[0]; // First star
      fireEvent.click(star);

      // Find the input and type content
      const input = screen.getByPlaceholderText(/Write a comment/i);
      fireEvent.change(input, { target: { value: "Test comment content" } });

      // Submit the form
      const submitButton = screen.getByRole("button", {
        name: /Post Comment/i,
      });
      fireEvent.click(submitButton);

      // Wait for the callback to be called with rating
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith("Test comment content", 1);
      });
    });
  });

  describe("NeonButton", () => {
    it("renders with correct styling", () => {
      render(<NeonButton variant="primary">Test Button</NeonButton>);

      const button = screen.getByRole("button", { name: /Test Button/i });
      expect(button).toHaveClass("bg-[#FF007A]");
    });
  });

  describe("CommentAvatar", () => {
    it("renders user avatar when provided", () => {
      render(<CommentAvatar src="/test-avatar.jpg" alt="Test User" />);

      expect(screen.getByAltText("Test User")).toBeInTheDocument();
    });

    it("renders initial when avatar is not provided", () => {
      render(<CommentAvatar alt="Test User" />);

      expect(screen.getByText("T")).toBeInTheDocument();
    });
  });
});
